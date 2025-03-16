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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="flex flex-col">
                            <Label htmlFor="email" className="mb-2">Email Address</Label>
                            <Input type="email" id="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Enter your email" />
                        </div>


                        <div className="flex flex-col relative">
                            <Label htmlFor="password" className="mb-2">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center gap-4">
                            <Label>Role:</Label>
                            <label className="flex items-center gap-2">
                                <Input type="radio" name="role" value="student" checked={input.role === "student"} onChange={changeEventHandler} /> Student
                            </label>
                            <label className="flex items-center gap-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeEventHandler} /> Recruiter
                            </label>
                        </div>

                        <p className="text-right text-sm mt-4">
                            <Link to="/forgot-password" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </p>

                        {loading ? (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                                Login
                            </Button>
                        )}
                    </form>
                    <div className="text-center my-4">
                        <Button onClick={handleGoogleLogin} className="w-full bg-red-500 hover:bg-red-600 text-white">
                            Login with Google
                        </Button>
                    </div>
                    {/* <div className="text-center mt-4">
                        <Button variant="link" onClick={() => setIsOtpLogin(!isOtpLogin)}>
                            {isOtpLogin ? "Use Password Instead" : "Login with OTP"}
                        </Button>
                    </div> */}
                    <p className="text-center text-sm mt-4">
                        Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
