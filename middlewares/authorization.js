const {Blog} = require("../models/blog.model")
const authorize = async (req, res, next) => {
 const userRole = req.role;
 const userId = req.userId;
 const {id} = req.params;
 if(userRole === "Moderator"){
  next();
 }else{
  const blog = await Blog.findById(id);
  if(blog.userId === userId){
    next();
  }else{
    return res.status(401).send({msg:"Unauthorized!"})
  }
 }
};

module.exports = { authorize };
