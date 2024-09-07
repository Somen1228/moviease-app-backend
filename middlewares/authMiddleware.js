const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const verifyToken  =  (req,res,next)=>{
    
    const tokenString = req.headers['x-access-token'];

    if(!tokenString){
        return res.status(403).send({
            success: false,
            message:"No Token is provided"});
    }

    const token  = tokenString.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err,payload)=>{
        if(err){
            return res.status(403).send({
                success: false,
                message:"Invalid JWT token"});
        }
        
        const userId  = payload.userId;
        try{
            const user = await User.findById(userId);
            req.userDetails = user;
            next();
        }
        catch(err){
            console.error("Error fetching user:", err);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    })
}

const verifyAdmin = (req,res,next) => {

    const userDetails  = req.userDetails;
    if(!userDetails.isAdmin){
        return res.status(403).send({message:"Authorization denied"})
    }

    next();
}


module.exports = {
    verifyToken,
    verifyAdmin
}