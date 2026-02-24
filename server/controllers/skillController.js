const Skill = require("../models/Skill");


// ADD SKILL
exports.addSkill = async (req,res)=>{

  const {name,type} = req.body;

  if(!name || !type){
    res.status(400);
    throw new Error("Name and type are required to add a skill");
  }

  const skill = await Skill.create({
    user:req.user._id,
    name,
    type
  });

  res.status(201).json(skill);
};


// GET MY SKILLS
exports.getMySkills = async (req,res)=>{

  const skills = await Skill.find({
    user:req.user._id
  });

  res.json(skills);
};


// DELETE SKILL
exports.deleteSkill = async (req,res)=>{

  const skill = await Skill.findById(req.params.id);

  if(!skill){
    res.status(404);
    throw new Error("Skill not found");
  }

  if(skill.user.toString() !== req.user._id.toString()){
    res.status(401);
    throw new Error("Not authorized");
  }

  await skill.deleteOne();

  res.json("Skill removed");
};

// GET ALL SKILLS (with user info)
exports.getAllSkills = async (req,res)=>{
  const { q, type } = req.query;
  const filter = {};
  if (type) {
    filter.type = type;
  }
  if (q) {
    const raw = String(q).trim();
    const base = raw.replace(/[^a-z]/gi, "");
    filter.$or = [
      { name: { $regex: raw, $options: "i" } },
      ...(base ? [{ name: { $regex: base, $options: "i" } }] : [])
    ];
  }
  const skills = await Skill.find(filter).populate("user","name email");
  res.json(skills);
};
