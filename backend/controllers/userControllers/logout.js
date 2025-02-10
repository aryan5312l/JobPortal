
export const logout = async(req, res) => {
    try{
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logged out successfully",
            success: true
        })
    }catch(error){
        console.log(error);
    }
}