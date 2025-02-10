import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

import { useDispatch, useSelector } from "react-redux"
import { setLoading, setUser } from "../../redux/authSlice"
import { Loader2 } from 'lucide-react'
import { Button } from "../ui/button";

function UpdateProfileDialog({ open, setOpen }) {
    const { user, loading } = useSelector(store => store.auth);

    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        file: user?.profile?.resume || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || ""
    })

    useEffect(() => {
        if (user) {
            setInput({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                file: user.profile?.resume || "",
                bio: user.profile?.bio || "",
                skills: user.profile?.skills?.join(", ") || "" // Handle skills array
            });
        }
    }, [user]);

    const { toast } = useToast();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
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
            dispatch(setLoading(true));
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast({
                    title: res.data.message,
                    variant: "success",
                    className: "bg-green-500 text-white font-bold rounded-lg shadow-lg"
                })
                setOpen(false);
            }
            else {
                toast({
                    title: res.data.message,
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error Response:", error.response?.data);
            toast({
                title: `Updation api Error`,
                variant: "destructive"
            })

        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
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
                            <div className="flex flex-col">
                                <Label htmlFor="bio" className="text-gray-600 mb-2">
                                    Bio
                                </Label>
                                <Input
                                    type="text"
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    placeholder="Bio"
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label htmlFor="skills" className="text-gray-600 mb-2">
                                    Skills
                                </Label>
                                <Input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="Skills"
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <Label>Resume</Label>
                                <Input

                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                            </div>

                            {/* Submit Button */}
                            {loading ? <Button className='w-full my-6'><Loader2 className='mr-2 h-4 w-full animate-spin'>Please Wait</Loader2></Button> :
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Update
                                </button>
                            }
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog;
