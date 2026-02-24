const Request = require("../models/Request");


// SEND REQUEST
exports.sendRequest = async (req,res)=>{

  const {receiver,skillOffered,skillWanted,message} = req.body;

  if(!receiver || !skillOffered || !skillWanted){
    res.status(400);
    throw new Error("receiver, skillOffered and skillWanted are required");
  }

  const request = await Request.create({
    sender:req.user._id,
    receiver,
    skillOffered,
    skillWanted,
    message: message ? message.trim() : ""
  });

  res.status(201).json(request);
};


// GET MY REQUESTS
exports.getRequests = async (req,res)=>{

  const requests = await Request.find({
    $or:[
      {sender:req.user._id},
      {receiver:req.user._id}
    ]
  })
  .sort({ createdAt: -1 })
  .populate("sender","name email")
  .populate("receiver","name email");

  res.json(requests);
};


// ACCEPT / REJECT / COMPLETE
exports.updateRequest = async (req,res)=>{

  const {status} = req.body;

  const request = await Request.findById(req.params.id);

  if(!request){
    res.status(404);
    throw new Error("Request not found");
  }

  const isReceiver = request.receiver.toString() === req.user._id.toString();
  const isSender = request.sender.toString() === req.user._id.toString();

  // Validate status based on current request status and user role
  if(status === "cancelled"){
    // Only sender can cancel pending requests
    if(!isSender){
      res.status(401);
      throw new Error("Only sender can cancel this request");
    }
    if(request.status !== "pending"){
      res.status(400);
      throw new Error("Only pending requests can be cancelled");
    }
  } else if(status === "accepted"){
    // Only receiver can accept pending requests
    if(!isReceiver){
      res.status(401);
      throw new Error("Only receiver can accept requests");
    }
    if(request.status !== "pending"){
      res.status(400);
      throw new Error("Only pending requests can be accepted");
    }
  } else if(status === "rejected"){
    // Only receiver can reject pending requests
    if(!isReceiver){
      res.status(401);
      throw new Error("Only receiver can reject requests");
    }
    if(request.status !== "pending"){
      res.status(400);
      throw new Error("Only pending requests can be rejected");
    }
  } else if(status === "completed"){
    // Both sender and receiver can mark as completed
    if(!isReceiver && !isSender){
      res.status(401);
      throw new Error("Only sender or receiver can complete requests");
    }
    if(request.status !== "accepted"){
      res.status(400);
      throw new Error("Only accepted requests can be marked as completed");
    }
  } else {
    res.status(400);
    throw new Error("Invalid status: " + status);
  }

  request.status = status;

  await request.save();

  const updatedRequest = await Request.findById(request._id)
    .populate("sender", "name email")
    .populate("receiver", "name email");

  res.json(updatedRequest);
};


