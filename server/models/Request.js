const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({

  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  skillOffered:{
    type:String,
    required:true
  },

  skillWanted:{
    type:String,
    required:true
  },

  message:{
    type:String,
    trim:true,
    default:""
  },

  status:{
    type:String,
    enum:["pending","accepted","rejected","cancelled","completed"],
    default:"pending"
  }

},{timestamps:true});

module.exports = mongoose.model("Request",requestSchema);


