import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { useState } from 'react'
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
        otp: "",
        role: "student",
    });
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { loading } = useSelector(store => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const requestOtp = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/otp-login`, { email: input.email, role: input.role });
            if (res.data.success) {
                setOtpSent(true);
                toast({ title: "OTP sent successfully!", className: "bg-green-500 text-white font-bold" });
            }
        } catch (error) {
            toast({ title: "Failed to send OTP.", variant: "destructive" });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            //console.log(import.meta.env.VITE_USER_API_END_POINT);

            const endpoint = isOtpLogin ? "/verify-otp" : "/login";
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}${endpoint}`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            console.log(`res: ${res}`);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                //console.log(res.data.user)
                toast({
                    title: res.data.message,
                    className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                })

                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Wrong Credentials. Please try again.",
                variant: "destructive"
            })
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_USER_API_END_POINT}/auth/google`;
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

                        {!isOtpLogin ? (
                            <div className="flex flex-col">
                                <Label htmlFor="password" className="mb-2">Password</Label>
                                <Input type="password" id="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Enter your password" />
                            </div>
                        ) : otpSent ? (
                            <div className="flex flex-col">
                                <Label htmlFor="otp" className="mb-2">Enter OTP</Label>
                                <Input type="text" id="otp" name="otp" value={input.otp} onChange={changeEventHandler} placeholder="Enter OTP" />
                            </div>
                        ) : (
                            <Button type="button" onClick={requestOtp} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                Request OTP
                            </Button>
                        )}

                        <div className="flex items-center gap-4">
                            <Label>Role:</Label>
                            <label className="flex items-center gap-2">
                                <Input type="radio" name="role" value="student" checked={input.role === "student"} onChange={changeEventHandler} /> Student
                            </label>
                            <label className="flex items-center gap-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === "recruiter"} onChange={changeEventHandler} /> Recruiter
                            </label>
                        </div>

                        {loading ? (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                                {isOtpLogin ? "Verify OTP" : "Login"}
                            </Button>
                        )}
                    </form>
                    <div className="text-center my-4">
                        <Button onClick={handleGoogleLogin} className="w-full bg-red-500 hover:bg-red-600 text-white">
                            Login with Google
                        </Button>
                    </div>
                    <div className="text-center mt-4">
                        <Button variant="link" onClick={() => setIsOtpLogin(!isOtpLogin)}>
                            {isOtpLogin ? "Use Password Instead" : "Login with OTP"}
                        </Button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login