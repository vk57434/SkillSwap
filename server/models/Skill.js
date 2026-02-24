const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  name:{
    type:String,
    required:true
  },

  type:{
    type:String, // offered or wanted
    enum:["offered","wanted"],
    required:true
  }

},{timestamps:true});

module.exports = mongoose.model("Skill",skillSchema);
