import { useState, useEffect } from 'react';
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

export default function ReusableForm({ endpoint, fields, title, redirectPath }) {
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [formData, setFormData] = useState(fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'file' ? null : '';
        return acc;
    }, {}));

    useEffect(() => {
        if (params.id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}/get/${params.id}`, {
                        withCredentials: true,
                    });

                    //console.log("Fetched Data:", res.data); // Debugging: Log API response
                    if (res?.data?.success) {
                        setFormData(prev => ({
                            ...prev,
                            ...Object.fromEntries(fields.map(field => [
                                field.name, field.type === 'file' ? null : res.data[endpoint][field.name] || ''
                            ]))
                        }));
                    }
                } catch (error) {
                    console.error(`Error fetching ${endpoint} data:`, error);
                }
            };

            fetchData();
        }
    }, [params.id, endpoint, fields]);

    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files?.[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'file' && value) {
                formDataToSend.append(key, value);
            } else if (key !== 'file' && value.trim()) {
                formDataToSend.append(key, value);
            }
        });

        if (Object.values(formDataToSend).some(value => value == null || value.trim() === '')) {
            toast({ title: "All fields are required!", variant: 'destructive' });
            return;
        }

        try {
            dispatch(setLoading(true));
    
            const isUpdate = params.id && endpoint === "company";  // Company uses PUT for updates, Job uses POST for new
            const url = `${import.meta.env.VITE_API_BASE_URL}/${endpoint}/${isUpdate ? `update/${params.id}` : 'post'}`;
            const method = isUpdate ? "put" : "post"; // PUT for updates, POST for new
            const headers = endpoint === "company" ? { 'Content-Type': 'multipart/form-data' } : {'Content-Type': 'application/json'};
            
            console.log("Submitting to URL:", url, "Method:", method); // Debugging URL and method
    
            const res = await axios({
                method,
                url,
                data: formDataToSend,
                headers,
                withCredentials: true,
            });
    
            if (res?.data?.success) {
                toast({ title: res.data.message, className: 'bg-green-500 text-white font-bold' });
                navigate(redirectPath);
            }
    
        } catch (error) {
            toast({ title: error.response?.data?.message || 'Update failed', variant: 'destructive' });
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(field => (
                    <div key={field.name}>
                        <Label htmlFor={field.name}>{field.label}</Label>
                        {field.type === 'textarea' ? (
                            <Textarea id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} required={field.required} />
                        ) : field.type === 'file' ? (
                            <Input type="file" id={field.name} name={field.name} onChange={handleFileChange} />
                        ) : (
                            <Input type={field.type} id={field.name} name={field.name} value={formData[field.name]} onChange={handleChange} required={field.required} />
                        )}
                    </div>
                ))}

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Back</Button>

                    {loading ? (
                        <Button className='w-full my-6'>
                            <Loader2 className='mr-2 h-4 w-full animate-spin' />
                            Please Wait
                        </Button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
