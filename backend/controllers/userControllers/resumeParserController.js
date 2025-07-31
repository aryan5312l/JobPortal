import { User } from "../../models/userModel.js";
import axios from "axios";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { Buffer } from "buffer";
//import pdf from "pdf-parse";
import { PdfReader } from "pdfreader";
import { generateEmbedding } from "../../services/embeddingService.js";


async function parsePdf(buffer) {
    return new Promise((resolve, reject) => {
        const reader = new PdfReader();
        let text = '';

        reader.parseBuffer(buffer, (err, item) => {
            if (err) reject(err);
            else if (!item) resolve(text);
            else if (item.text) text += item.text + ' ';
        });
    });
}


export const parseResumeWithGemini = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user?.profile?.resume) {
            return res.status(404).json({ message: "No resume found for user." });
        }

        const resumeUrl = user.profile.resume;
        const originalName = user.profile.resumeOriginalName || "resume";
        const ext = path.extname(originalName).toLowerCase();

        // Download resume from Cloudinary
        const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);

        let text = "";
        if (ext === ".docx") {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (ext === ".pdf") {
            text = await parsePdf(buffer);
        } else {
            return res.status(400).json({ message: "Unsupported file type. Only PDF and DOCX are supported." });
        }


        if (!text || text.trim().length < 20) {
            return res.status(400).json({ message: "Could not extract meaningful text from resume." });
        }

        // Clean up text - to remove excessive whitespace and non-printable characters
        text = text.replace(/\s+/g, ' ').trim();
        text = text.replace(/[^\x20-\x7E]/g, '');

        // Call Gemini
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" }); // Using a more reliable model

        const prompt = `Extract the following information from this resume text and return ONLY a valid JSON object with no other text or markdown:
{
  "skills": ["array", "of", "skills"],
  "experience": [
    {
      "company": "company name",
      "title": "job title",
      "years": "time period"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "year": "graduation year"
    }
  ],
  "summary": "brief professional summary"
}

Resume text:
${text.substring(0, 50000)}`; // Limiting to first 50k chars to avoid token limits

        let parsed;
        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            let cleanResponse = responseText.trim();

            // Remove markdown code blocks if present
            if (cleanResponse.startsWith('```json')) {
                cleanResponse = cleanResponse.slice(7, -3).trim();
            } else if (cleanResponse.startsWith('```')) {
                cleanResponse = cleanResponse.slice(3, -3).trim();
            }

            parsed = JSON.parse(cleanResponse);

            if (!parsed.skills || !Array.isArray(parsed.skills)) {
                throw new Error("Invalid response structure from Gemini");
            }
        } catch (geminiError) {
            console.error("Gemini processing failed:", geminiError);
            return res.status(500).json({
                success: false,
                message: "Failed to analyze resume content",
                error: geminiError.message
            });
        }

        // Generate and store embedding
        const candidateText = `
            Skills: ${parsed.skills.join(", ")}
            Experience: ${parsed.experience.map((exp) =>
            `${exp.title} at ${exp.company} (${exp.years})`
        ).join(", ")}
            Education: ${parsed.education.map((edu) =>
            `${edu.degree} at ${edu.institution} (${edu.year})`
        ).join(", ")}
        `;

        try {
            const embedding = await generateEmbedding(candidateText);

            await User.findByIdAndUpdate(req.id, {
                $set: {
                    "profile.embedding": embedding,
                    "profile.parsedResume": parsed
                }
            });

            return res.json({
                success: true,
                data: {
                    parsed,
                    embedding: embedding.slice(0, 5) // Return first few dims for preview
                },
                meta: {
                    textLength: text.length,
                    processedChars: Math.min(text.length, 30000),
                    embeddingDimensions: embedding.length
                }
            });

        } catch (embeddingError) {
            console.error("Embedding generation failed:", embeddingError);
            return res.status(500).json({
                success: false,
                message: "Failed to generate profile embedding",
                error: embeddingError.message,
                parsed // Still return parsed data even if embedding failed
            });
        }

    } catch (err) {
        console.error("Resume processing error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};