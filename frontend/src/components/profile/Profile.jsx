import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Contact, Mail, Pen, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import AppliedJobTable from "./AppliedJobTable";

import { useState } from "react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

function Profile() {
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);

    const openDialog = () => setOpen(true);

    return (
        <div className="mx-auto max-w-5xl px-4 lg:px-8 py-2">
            <div className="border p-3">
                <div className="flex justify-between">
                    {/* Avatar and Profile Info */}
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={user?.profile?.profilePhoto} />
                            <AvatarFallback>{user?.fullname.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-bold text-lg">{user?.fullname}</h1>
                            <p className="text-sm text-gray-400">{user?.profile?.bio}</p>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <Button onClick={openDialog}>
                        <Pen className="border-black top-0 cursor-pointer right-0" />
                    </Button>
                </div>

                {/* Contact Information */}
                <div className="flex gap-4 mt-4">
                    <Mail />
                    <h2>{user?.email}</h2>
                </div>
                <div className="flex gap-4 mt-2">
                    <Contact />
                    <h2>{user?.phoneNumber}</h2>
                </div>

                {/* Recruiter-Specific: Company Name */}
                {user?.role === "recruiter" && user?.company && (
                    <div className="flex gap-4 mt-2">
                        <Building />
                        <h2>{user.company}</h2>
                    </div>
                )}

                {/* Student-Specific: Skills & Resume */}
                {user?.role === "student" && (
                    <>
                        <div className="mt-2">
                            <h2>Skills</h2>
                            <div className="flex gap-3">
                                {user?.profile?.skills.map((item, index) => (
                                    <Badge key={index}>{item}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="mt-2">
                            <Label className="text-md font-bold">Resume</Label>
                            {user?.profile?.resume ? (
                                <a href={user?.profile?.resume} target="_blank" className="text-blue-500">
                                    <br />
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <h2>NaN</h2>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Job Table (Students: Applied Jobs, Recruiters: Posted Jobs) */}
            {user?.role === "student" ? <AppliedJobTable /> : null}

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;
