const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


// REGISTER
exports.registerUser = async (req,res)=>{

  const {name,email,password} = req.body;

  const userExists = await User.findOne({email});

  if(userExists){
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const user = await User.create({
    name,
    email,
    password:hashedPassword
  });

  if(user){
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)
    });
  }

};


// LOGIN
exports.loginUser = async (req,res)=>{

  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(user && (await bcrypt.compare(password,user.password))){

    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)
    });

  }else{

    res.status(401);
    throw new Error("Invalid email or password");

  }

};

// GET PROFILE
exports.getProfile = async (req,res)=>{
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

// GET ALL USERS
exports.getAllUsers = async (req,res)=>{
  const users = await User.find().select("-password");
  res.json(users);
};
