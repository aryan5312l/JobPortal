import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReusableTable from "../shared/ReusableTable";

const Companies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); 

    // Function to handle edit action
    const handleEdit = (companyId) => {
        navigate(`/recruiter/company/${companyId}`);
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                });

                if (res?.data?.success) {
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies();
    }, []);

    // Custom filtering logic
    const filterCompanies = (companies, query) => {
        if (!query) return companies; // If no query, show all

        const lowerCaseQuery = query.toLowerCase();

        // Companies that start with the query
        const startsWithMatch = companies.filter(company =>
            company.name.toLowerCase().startsWith(lowerCaseQuery)
        );

        // Companies that contain the query but don’t start with it
        const containsMatch = companies.filter(company =>
            company.name.toLowerCase().includes(lowerCaseQuery) && 
            !company.name.toLowerCase().startsWith(lowerCaseQuery)
        );

        return [...startsWithMatch, ...containsMatch]; // Prioritize startsWithMatch
    };

    const filteredCompanies = filterCompanies(companies, searchQuery);

    // Column configuration
    const companyColumns = [
        { key: "logo", label: "Logo", render: (company) => (
            <Avatar>
                <AvatarImage src={company.logo} />
                <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
            </Avatar>
        )},
        { key: "name", label: "Company Name" },
        { key: "createdAt", label: "Date Registered", render: (company) => new Date(company.createdAt).toLocaleDateString() }
    ];

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <Input
                        className="w-fit"
                        placeholder="Filter Companies"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Button onClick={() => navigate("/recruiter/createcompany")}>New Company</Button>
                </div>

                {/* Pass filtered companies to ReusableTable */}
                <ReusableTable data={filteredCompanies} caption="A list of your registered companies" columns={companyColumns} onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default Companies;
