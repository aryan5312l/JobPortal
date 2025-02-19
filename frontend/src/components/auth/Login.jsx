import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup} from "@/components/ui/radio-group"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser} from '../../redux/authSlice'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

function Login() {
    const [input, setInput] = useState({
            email:"",
            password: "",
            role: "",
        });
    
        const dispatch = useDispatch();

    const { toast } = useToast();
    const navigate = useNavigate();
    
    const {loading} = useSelector(store => store.auth)
    
        const changeEventHandler = (e) => {
            setInput({...input, [e.target.name]: e.target.value});
        }
    
        const submitHandler = async(e) => {
            e.preventDefault();
            try {
                dispatch(setLoading(true));
                console.log(import.meta.env.VITE_USER_API_END_POINT);

                const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/login`, input, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                console.log(`res: ${res}`);
                if(res.data.success){
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
            }finally{
                dispatch(setLoading(false));
            }
        }

    return (
        <div className="min-h-screen bg-gray-100">
        
        <div className="mx-auto max-w-7xl p-6 bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 w-full max-w-md flex items-center justify-center">Login</h2>
                <form onSubmit={submitHandler} action="" className="space-y-4">
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
                        <div className="flex items-center space-x-2">
                            <Input
                            type="radio"
                            name="role"       
                            checked={input.role == 'student'}
                            onChange={changeEventHandler}
                            value="student"
                            className="cursor-pointer"
                            />
                            <Label htmlFor="option-one">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2 ">
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
    
                    {loading ? <Button className='w-full my-6'><Loader2 className='mr-2 h-4 w-full animate-spin'>Please Wait</Loader2></Button>:
                    <button
                        type="submit"
                        className="w-full my-6 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Login
                    </button>
                    } 
    
                    <span className='text-sm my-2'>Don't have an account? <Link to="/signup" className='text-blue-600 '>Signup</Link></span>
                </form>
            </div>
        </div>
    </div>
    
      )
}

export default Login