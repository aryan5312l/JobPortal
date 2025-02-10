import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from '../../hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/authSlice';
import { Loader2 } from 'lucide-react';

export default function CompanySetup() {
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        file: null,
    });

    // Fetch Company Data when component mounts
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_COMPANY_API_END_POINT}/get/${params?.id}`, {
                    withCredentials: true,
                });

                if (res?.data?.success) {
                    // Populate form with existing company details
                    setFormData({
                        name: res.data.company.name || '',
                        description: res.data.company.description || '',
                        website: res.data.company.website || '',
                        location: res.data.company.location || '',
                        file: null, // File can't be preloaded
                    });
                }
            } catch (error) {
                console.log('Error fetching company data:', error);
            }
        };

        fetchCompanyData();
    }, [params.id], []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files?.[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // ✅ Append fields correctly
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "file" && value) {
                formDataToSend.append(key, value); // ✅ Append file only if exists
            } else if (key !== "file" && value.trim()) {
                formDataToSend.append(key, value); // ✅ Append other fields
            }
        });

        try {
            dispatch(setLoading(true));

            const res = await axios.put(
                `${import.meta.env.VITE_COMPANY_API_END_POINT}/update/${params.id}`,
                formDataToSend,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }, // ✅ Ensure correct Content-Type
                    withCredentials: true,
                }
            );

            if (res?.data?.success) {
                toast({ title: res.data.message, className: "bg-green-500 text-white font-bold" });
                navigate(`/recruiter/companies`);
            }

        } catch (error) {
            toast({ title: error.response?.data?.message || "Update failed", variant: "destructive" });
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };


    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Company Setup</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input type="url" id="website" name="website" value={formData.website} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="file">Company Logo</Label>
                    <Input type="file" id="file" name="file" onChange={handleFileChange} />
                </div>
                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Back</Button>

                    {loading ? <Button className='w-full my-6'><Loader2 className='mr-2 h-4 w-full animate-spin'>Please Wait</Loader2></Button> :
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Update
                        </button>
                    }
                </div>
            </form>
        </div>
    );
}
