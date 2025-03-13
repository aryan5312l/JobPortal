import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ResetPassword() {
    const navigate = useNavigate();

    const { token } = useParams(); // Get the reset token from URL
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_USER_API_END_POINT}/reset-password`, {
                token,
                newPassword,
            });

            if (res.data.success) {
                toast({ title: "Password reset successful!", className: "bg-green-500 text-white font-bold" });
                navigate("/login");
            }
        } catch (error) {
            toast({ title: "Reset failed", description: "Invalid or expired token", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-green-500 text-white" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ResetPassword;
