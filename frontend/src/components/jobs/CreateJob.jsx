import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../../hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/authSlice';
import { Loader2 } from 'lucide-react';
import Select from "react-select";

export default function JobForm() {
    const { loading } = useSelector(store => store.auth);
    const [companies, setCompanies] = useState([]); // Store recruiter’s companies
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        salary: '',
        jobType: '',
        position: '',
        companyId: '',
        requirements: '',
        experienceLevel: '',
        location: '',
    });

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_JOB_API_END_POINT}/get/${params?.id}`, {
                    withCredentials: true,
                });

                if (res?.data?.success) {
                    // Populate form with existing company details
                    setJobData({
                        title: res.data.job.title || "",
                        description: res.data.job.description || "",
                        salary: res.data.job.salary || "",
                        jobType: res.data.job.jobType || "",
                        position: res.data.job.position || "",
                        companyId: res.data.job.company || "", // Assuming it's an ID
                        requirements: res.data.job.requirements ? res.data.job.requirements.join(", ") : "",
                        experienceLevel: res.data.job.experienceLevel || "",
                        location: res.data.job.location || ""
                    });
                }
            } catch (error) {
                console.log('Error fetching company data:', error);
            }
        };

        fetchJobData();
    }, [params.id], []);

    // Fetch companies created by recruiter
    // Fetch companies created by recruiter
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_COMPANY_API_END_POINT}/get`, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    const formattedCompanies = res.data.companies.map(company => ({
                        value: company._id,
                        label: company.name
                    }));
                    setCompanies(formattedCompanies); // Store formatted companies
                }
            })
            .catch(err => {
                console.error("Error fetching companies:", err);
                toast({ title: "Failed to fetch companies", variant: "destructive" });
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobData.companyId) {
            toast({ title: 'Company ID is required', variant: 'destructive' });
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(
                `${import.meta.env.VITE_JOB_API_END_POINT}/post`,
                {
                    ...jobData,

                },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast({ title: res.data.message, className: 'bg-green-500 text-white' });
                navigate('/recruiter/jobs');
            }
        } catch (error) {
            toast({ title: 'Job creation failed', variant: 'destructive' });
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCompanyChange = (selectedOption) => {
        setJobData(prev => ({ ...prev, companyId: selectedOption ? selectedOption.value : "" }));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Job Setup</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" name="title" value={jobData.title} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Input id="jobType" name="jobType" value={jobData.jobType} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={jobData.description} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="salary">Salary</Label>
                    <Input id="salary" name="salary" type="number" value={jobData.salary} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="companyId">Select Company</Label>
                    <Select
                        options={companies}
                        onChange={handleCompanyChange}
                        placeholder="Search & Select a Company"
                        isClearable
                        isSearchable
                    />
                </div>
                
                {/* Right Column */}
                <div>
                    <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                    <Input id="requirements" name="requirements" value={jobData.requirements} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Input id="experienceLevel" name="experienceLevel" value={jobData.experienceLevel} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={jobData.location} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" name="position" value={jobData.position} onChange={handleChange} required />
                </div>
    
                {/* Submit Button - Full Width */}
                <div className="md:col-span-2 flex justify-center">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                    </Button>
                    {
                        companies.length === 0 && <p className="text-red-500 text-sm mt-2">Please create a company first</p>
                    }
                </div>
            </form>
        </div>
    );
    
}
