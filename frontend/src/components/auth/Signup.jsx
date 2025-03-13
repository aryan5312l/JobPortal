import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setUser } from "../../redux/authSlice"
import { User } from "../../../../backend/models/userModel"


function Signup() {
    const navigate = useNavigate();
    const { toast } = useToast()
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch();
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const requestOtp = async () => {
        try {
            dispatch(setLoading(true));

            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/otp-login`, { email: input.email, role: input.role });
            if (res.data.success) {
                setOtpSent(true);
                toast({ title: "OTP sent successfully!", className: "bg-green-500 text-white font-bold" });
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error);

            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Verify OTP before signup
    const verifyOtp = async () => {
        try {
            console.log(otp);
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/verify-otp`,
                {
                    ...input,
                    otp
                }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            console.log(`res : ${res}`);

            if (res.data.success) {
                setOtpVerified(true);
                dispatch(setUser(res.data.user));
                toast({ title: "OTP verified successfully!", className: "bg-green-500 text-white font-bold" });
                navigate('/');
            } else {
                toast({ title: "Invalid OTP.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "OTP verification failed.", variant: "destructive" });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!otpVerified) {
            toast({ title: "Please verify OTP first.", variant: "destructive" });
            return;
        }

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
            if (res.data.success) {
                toast({
                    title: `Registration Successful`,
                    variant: "success"
                })
                navigate("/login");
            }
            else {
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Sign Up
                </h2>
                <form onSubmit={submitHandler} className="space-y-3">
                    {!otpSent ? (
                        <>
                            {/* Email */}
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
                                />
                            </div>

                            {/* Full Name */}
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
                                />
                            </div>

                            {/* Phone Number */}
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
                                />
                            </div>

                            {/* Password */}
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
                                />
                            </div>

                            {/* Role Selection */}
                            <RadioGroup className="flex">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === "student"}
                                        onChange={changeEventHandler}
                                    />
                                    <Label>Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === "recruiter"}
                                        onChange={changeEventHandler}
                                    />
                                    <Label>Recruiter</Label>
                                </div>
                            </RadioGroup>

                            {/* Profile Upload */}
                            <div>
                                <Label>Profile</Label>
                                <Input accept="image/*" type="file" onChange={changeFileHandler} />
                            </div>

                            {/* Request OTP Button */}
                            {loading ? (
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </Button>
                            ) : (<button
                                type="button"
                                onClick={requestOtp}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Send OTP
                            </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* OTP Verification */}
                            <div className="flex flex-col">
                                <Label htmlFor="otp" className="text-gray-600 mb-2">
                                    Enter OTP
                                </Label>
                                <Input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                />
                            </div>

                            {/* Verify OTP Button */}
                            <button
                                type="button"
                                onClick={verifyOtp}
                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Verify OTP
                            </button>

                            {/* Submit Registration Button (Only visible after OTP is verified)
                            {otpVerified && (
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Sign Up
                                </button>
                            )} */}
                        </>
                    )}

                    <span className="text-sm my-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600">
                            Login
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Signup