import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from '../../hooks/use-toast'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '../../redux/companySlice'
import { useToast } from "@/hooks/use-toast"

export const CreateCompany = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const [companyName, setCompanyName] = useState('');

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            // console.log(res);
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast({
                    title: res.data.message,
                    className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                })
                const companyId = res?.data?.company?._id;
                // console.log(companyId);
                navigate(`/recruiter/company/${companyId}`);
            }

        } catch (error) {

            toast({
                title: error.response.data.message,
                variant: "destructive"
            })

            console.log(error);
        }
    }

    return (
        <div>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Company Name</h1>
                    <p className='text-gray-500'>You can change your company name later.</p>
                </div>
                <div>
                    <Label>Company Name</Label>
                    <Input
                        placeholder='Enter company name'
                        className='w-full my-2'
                        type='text'
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className='flex justify-end gap-2'>
                        <Button variant="outline" className='w-32' onClick={() => navigate("/recruiter/companies")}>Cancel</Button>
                        <Button onClick={registerNewCompany} className='w-32'>Continue</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

