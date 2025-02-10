import Navbar from '../shared/navbar'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

import { useToast } from "@/hooks/use-toast"


function Signup() {
    const navigate = useNavigate();
    const { toast } = useToast()

    const [input, setInput] = useState({
        fullname:"",
        email:"",
        phoneNumber:"",
        password: "",
        role: "",
        file: ""
    })

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const changeFileHandler = (e) => {
        setInput({...input, file:e.target.files?.[0]});
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(input).forEach(([key, value]) => {
            if (key === "file" && value) {
                formData.append(key, value); // Append file only if it exists
            } else if (key !== "file") {
                formData.append(key, value); // Append all other fields
            }
        });

        try {
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            console.log(`res : ${res}`);
            if(res.data.success){
                toast({
                    title: `Registration Successful`,
                    variant: "success"
                  })
                navigate("/login");
            }
            else{
                toast({
                    title: `User Already Exist`,
                    variant: "destructive"
                  })
            }
        } catch (error) {
            console.error("Error Response:", error.response?.data);
            toast({
                title: `User Already Exist`,
                variant: "destructive"
              })
            
        }
    }

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="mx-auto max-w-7xl p-4 bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg px-8 py-2 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full max-w-md flex items-center justify-center">Sign Up</h2>
            <form onSubmit={submitHandler} action="" className="space-y-3">
                {/* Input Group 1 */}
                <div className="flex flex-col">
                    <Label htmlFor="email" className="text-gray-600 mb-2">
                        Email Address
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Input Group 2 */}
                <div className="flex flex-col">
                    <Label htmlFor="fullname" className="text-gray-600 mb-2">
                        Full Name
                    </Label>
                    <Input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeEventHandler}
                        placeholder="Enter your name"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Input Group 3 */}
                <div className="flex flex-col">
                    <Label htmlFor="phoneNumber" className="text-gray-600 mb-2">
                        Phone Number
                    </Label>
                    <Input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        placeholder="Phone Number"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Input Group 4 */}
                <div className="flex flex-col">
                    <Label htmlFor="password" className="text-gray-600 mb-2">
                        Password
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                
                
                <RadioGroup defaultValue="option-one" className='flex '>
                    <div className="flex items-center space-x-2 -my-3">
                        <Input
                        type="radio"
                        name="role"
                        value="student"
                        checked={input.role == 'student'}
                        onChange={changeEventHandler}
                        className="cursor-pointer"
                        />
                        <Label htmlFor="option-one">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2 -my-3">
                        <Input
                        type="radio"
                        name="role"
                        value="recruiter"
                        checked={input.role == 'recruiter'}
                        onChange={changeEventHandler}
                        className="cursor-pointer"
                        />
                        <Label htmlFor="option-two">Recruiter</Label>
                    </div>
                </RadioGroup>

                <div>
                    <Label>Profile</Label>
                    <Input
                    accept="image/*"
                    type="file"
                    onChange={changeFileHandler}
                    className="cursor-pointer"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Sign Up
                </button>
                <span className='text-sm my-2'>Already have an account? <Link to="/login" className='text-blue-600 '>Login</Link></span>
            </form>
        </div>
    </div>
</div>

  )
}

export default Signup