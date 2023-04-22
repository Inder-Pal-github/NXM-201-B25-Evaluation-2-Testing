const { Blog } = require("../models/blog.model");

const createABlog = async (req, res) => {
  try {
    const data = req.body;
    const newBlog = new Blog({ ...data,userId:req.userId });
    await newBlog.save();
    res.status(201).send({ msg: "Blog created", blog: newBlog });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const myBlogs = async (req,res)=>{
  try {
    const {userId} = req;
    const myblogs = await Blog.find({userId});
    res.send({myblogs})
  } catch (error) {
    res.status(500).send({msg:error.message})
  }
}
const getBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.send({ blogs });
  try {
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const getOneBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.send({ blog });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Blog.findByIdAndUpdate(id, updates);
    res.send({ msg: "Blog updated", updated });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    res.send({ msg: "Blog deleted", deleted });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = { createABlog, getBlogs, getOneBlog, updateBlog, deleteBlog,myBlogs };
