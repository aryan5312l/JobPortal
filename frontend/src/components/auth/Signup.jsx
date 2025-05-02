import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setUser } from "../../redux/authSlice"
import { User } from "../../../../backend/models/userModel"
import { Eye, EyeOff } from 'lucide-react'

function Signup() {
    const navigate = useNavigate();
    const { toast } = useToast()
    const { loading } = useSelector(store => store.auth)
    const dispatch = useDispatch();
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Signup Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                        <h1 className="text-3xl font-bold text-white">Create Account</h1>
                        <p className="text-blue-100 mt-2">Join our community today</p>
                    </div>

                    <div className="p-8">
                        {!otpSent ? (
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <Label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </Label>
                                    <Input
                                        type="text"
                                        id="fullname"
                                        name="fullname"
                                        value={input.fullname}
                                        onChange={changeEventHandler}
                                        placeholder="John Doe"
                                        className="focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={input.email}
                                        onChange={changeEventHandler}
                                        placeholder="your@email.com"
                                        className="focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </Label>
                                    <Input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={input.phoneNumber}
                                        onChange={changeEventHandler}
                                        placeholder="+91 234 567 8900"
                                        className="focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={input.password}
                                            onChange={changeEventHandler}
                                            placeholder="••••••••"
                                            className="focus:ring-2 focus:ring-blue-500 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        I am a:
                                    </Label>
                                    <RadioGroup
                                        defaultValue="student"
                                        className="flex gap-4 text-gray-700 "
                                        onValueChange={(value) => setInput({ ...input, role: value })}
                                    >
                                        <div className="flex items-center space-x-2 ">
                                            <RadioGroupItem value="student" id="student" className="dark:bg-gray-700"/>
                                            <Label htmlFor="student">Student</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="recruiter" id="recruiter" className="dark:bg-gray-700"/>
                                            <Label htmlFor="recruiter">Recruiter</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Profile Picture */}
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Profile Picture (Optional)
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="file"
                                            type="file"
                                            accept="image/*"
                                            onChange={changeFileHandler}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Request OTP Button */}
                                <Button
                                    onClick={requestOtp}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-md"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-5">
                                {/* OTP Verification */}
                                <div>
                                    <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter OTP
                                    </Label>
                                    <Input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        className="focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        We've sent a 6-digit code to {input.email}
                                    </p>
                                </div>

                                {/* Verify OTP Button */}
                                <Button
                                    onClick={verifyOtp}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>

                                {/* Complete Registration Button */}
                                {otpVerified && (
                                    <Button
                                        onClick={submitHandler}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Completing Registration...
                                            </>
                                        ) : (
                                            "Complete Registration"
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Login Link */}
                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} JobPortal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup