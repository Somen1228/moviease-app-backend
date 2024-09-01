const Theatre = require("../models/theatreModel");
const User = require("../models/userModel");

const addTheatre = async (req, res) => {

    try {
        const isOwner = await User.findById(req.body.owner)

        if(!isOwner) {
            return res.status(400).send({success: false, message: "Invalid Owner Id"})
        }

        const theatre = new Theatre(req.body);
        await theatre.save();

        return res.status(201).send({
            success: true,
            message: "Theatre added successfully",
            data: theatre
        })
    } catch(err) {
        // console.log(err)
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}

const getAllTheatres = async (req, res) => {   
    //Who is the person who is making this call
    const userDetails = req.userDetails;
    let condition;

    if(userDetails.isAdmin) {
        condition = {};
    } else {
        condition = {owner: userDetails._id}
    }
    try {
        const theatres = await Theatre.find(condition).populate("owner");
        return res.status(200).send({
            success: true,
            message: "All theatres fetched successfully",
            data: theatres
        })
    }catch(err) {
        return res.status(500).send({
            message: err.message,
            success: false
        })
    }
}


module.exports = {
    addTheatre,
    getAllTheatres
}   