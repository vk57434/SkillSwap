const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({

  from:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  rating:Number,
  comment:String

},{timestamps:true});

module.exports = mongoose.model("Feedback",feedbackSchema);
