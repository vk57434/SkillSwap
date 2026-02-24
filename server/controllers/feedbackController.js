const Feedback = require("../models/Feedback");


// LEAVE FEEDBACK
exports.leaveFeedback = async (req,res)=>{

  const {to,rating,comment} = req.body;

  const feedback = await Feedback.create({
    from:req.user._id,
    to,
    rating,
    comment
  });

  res.status(201).json(feedback);
};


// GET USER FEEDBACK
exports.getUserFeedback = async (req,res)=>{

  const feedback = await Feedback.find({
    to:req.params.userId
  })
  .populate("from","name");

  res.json(feedback);
};
