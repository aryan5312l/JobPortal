import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setUser } from "../../redux/authSlice";
import { useToast } from "@/hooks/use-toast"

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { toast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            try {

                const params = new URLSearchParams(location.search);
                const token = params.get("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                localStorage.setItem("token", token);
                console.log("Stored token:", localStorage.getItem("token"));
                const res = await axios.get(`${import.meta.env.VITE_USER_API_END_POINT}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (res.data.success) {
                    dispatch(setUser(res.data.user)); // Store user in Redux

                    toast({
                        title: "Login Successful",
                        description: `Welcome, ${res.data.user.fullname || "User"}!`,
                        className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                    });

                    navigate("/"); // Redirect after successful login
                } else {
                    throw new Error("Failed to fetch user details");
                }
                
            } catch (error) {
                toast({
                    title: "Login Failed",
                    description: error.response?.data?.message || "Something went wrong. Please try again.",
                    variant: "destructive"
                });
                navigate("/login");
            }
        }
        

        fetchUser();
    }, [location, navigate, dispatch, toast]);

    return <div>Loading...</div>;
};

export default GoogleCallback;
