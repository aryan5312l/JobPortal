import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../../redux/authSlice'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    // const [isOtpLogin, setIsOtpLogin] = useState(false);
    // const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Track password visibility

    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { loading } = useSelector(store => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    // const requestOtp = async () => {
    //     try {
    //         const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/otp-login`, { email: input.email, role: input.role });
    //         if (res.data.success) {
    //             setOtpSent(true);
    //             toast({ title: "OTP sent successfully!", className: "bg-green-500 text-white font-bold" });
    //         }
    //     } catch (error) {
    //         toast({ title: "Failed to send OTP.", variant: "destructive" });
    //     }
    // };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));

            // const endpoint = isOtpLogin ? "/verify-otp" : "/login";
            const endpoint = "/login";
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}${endpoint}`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast({ title: res.data.message, className: "bg-green-500 text-white font-bold rounded-lg shadow-lg" });
                navigate("/");
            }
        } catch (error) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid credentials. Please try again.",
                variant: "destructive"
            });
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_AUTH_API_END_POINT}/google`, "_self");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Animated Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Decorative Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                        <p className="text-blue-100 mt-2">Sign in to access your account</p>
                    </div>

                    <div className="p-8">
                        {/* Social Login */}
                        <div className="mb-6">
                            <Button 
                                onClick={handleGoogleLogin}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                            >
                                <img 
                                    src="https://www.google.com/favicon.ico" 
                                    alt="Google" 
                                    className="w-5 h-5"
                                />
                                <span>Continue with Google</span>
                            </Button>
                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-gray-500">or</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={submitHandler} className="space-y-5">
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
                                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

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
                                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
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
                                <div className="flex justify-end mt-1">
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Login as:
                                </Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="student" 
                                            checked={input.role === "student"} 
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Student</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="recruiter" 
                                            checked={input.role === "recruiter"} 
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Recruiter</span>
                                    </label>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-md transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* App Branding */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} JobPortal. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
