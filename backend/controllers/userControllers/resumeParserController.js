import { User } from "../../models/userModel.js";
import axios from "axios";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { Buffer } from "buffer";
//import pdf from "pdf-parse";
import { PdfReader } from "pdfreader";


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

            const parsed = JSON.parse(cleanResponse);
            return res.json({ parsed });
        } catch (geminiError) {
            console.error("Gemini API error:", geminiError);
            return res.status(500).json({
                message: "Error processing resume with Gemini.",
                error: geminiError.message
            });
        }

    } catch (err) {
        console.error("Resume parsing error:", err);
        return res.status(500).json({
            message: "Error parsing resume.",
            error: err.message
        });
    }
};