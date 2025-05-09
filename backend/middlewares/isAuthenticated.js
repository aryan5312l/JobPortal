import jwt from "jsonwebtoken"

const isAuthenticated = async(req, res, next) => {
    try{
        const token = req.cookies.token;
        //console.log("All headers:", req.headers);
        //console.log("Received cookies:", req.cookies);
        //console.log("Received token:", token);
        //console.log("isAuthenticated called");
        if(!token){
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
       // console.log("Decoded token:", decode);
        if(!decode){
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        };

        req.id = decode.userId;
        //console.log("User ID from token:", req.id);
        next();

    }catch(error){
        console.log(error);
    }
}

export default isAuthenticated;