const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/NotificationUtil");

const signUp = async  (req, res) => {
  try {
    if (req.body.email == undefined || req.body.password == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email and password for registration"
      })
    }
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "The user already exists!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashPwd;

    const newUser = await User(req.body);
    await newUser.save();
    // console.log(newUser);
    return res.status(201).send({
      success: true,
      message: "You've successfully signed up, please login now!",
    });
  } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Internal server error!",
      });
  }
}


const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User does not exist. Please Register",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    return res.status(200).send({
      success: true,
      message: "You've successfully logged in!",
      token: token
    });
  } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Internal server error!",
        data: error
      });
  }
}

const getCurrentUser = async (req, res) => {

  const userDetails = {
    name: req.userDetails.name,
    email: req.userDetails.email,
    isAdmin: req.userDetails.isAdmin
  }

  return res.status(200).send({
    success: true,
    message: "User is successfully authenticated",
    data: userDetails
  })
}

const forgetPassword = async (req, res) => {
    const email = req.body.email;

    if(!email) {
      return res.status(401).send({
        success: false,
        message: "Please enter Email to proceed!"
      })
    }

    try {
      const user = await User.findOne({email: email});

      if(!user) {
        return res.status(404).send({
          success: false,
          message: "Email not found!"
        })
      }
      //OTP Generation
      const otp = otpGenerator();
      user.otp = otp;
      user.otpExpiry = Date.now() + 5*60*1000 

      await user.save();
      sendEmail([user.email], "OTP for verification", 
        `<div> <h1> OTP: ${otp} </h1> </div>`
      , null)

      return res.status(200).send({
        status: "success",
        message: "OTP sent to your email"
      })

    } catch(err) {
      return res.status(500).send({
        success: false,
        message: err.message
      })
    }
}

const resetPassword = async (req, res) => {
    const {otp, password} = req.body;

    if(!otp || !password) {
      return res.status(401).send({
        status: "failure",
        message: "Invalid Request"
      })
    }

    try {
      const user = await User.findOne({otp: otp})

      if(!user) {
        return res.status(403).send({
          status: "failure",
          message: "Incorrect OTP"
        }) 
      }

      if(Date.now() > user.otpExpiry) {
        return res.status(401).send({
          status: "failure",
          message: "OTP is expired. Please try again!"
        })
      }

      const salt = await bcrypt.genSalt(10);
      const hashPwd = bcrypt.hashSync(password, salt);
      user.password = hashPwd;

      user.otp = null;
      user.otpExpiry = null;
      await user.save()

      return res.status(200).send({
        status: "success",
        message: "Password reset successfull"
      })      
    } catch(err) {
      return res.status(500).send({
        success: false,
        message: err.message
      })
    }
}

const getAllUsers = async (req, res) => {

  try {

    const allUsers = await User.find({})
    return res.status(200).send({
      success: true,
      message: "User Details Fetched Successfully",
      data: allUsers
    })
  } catch(err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message
    })
  }
}
module.exports = {
    login,
    signUp,
    getCurrentUser,
    getAllUsers,
    forgetPassword, 
    resetPassword
}

function otpGenerator() {
  return Math.floor(Math.random() * 100000);
}