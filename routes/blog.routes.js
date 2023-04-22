const {
  createABlog,
  getBlogs,
  getOneBlog,
  updateBlog,
  deleteBlog,
  myBlogs,
} = require("../controllers/blog.controllers");
const { authorize } = require("../middlewares/authorization");

const blogRouter = require("express").Router();

blogRouter.post("/create", createABlog);
blogRouter.get("/myblogs",myBlogs);
blogRouter.get("/all", getBlogs);
blogRouter.get("/:id", getOneBlog);
blogRouter.patch("/:id", authorize, updateBlog);
blogRouter.delete("/:id", authorize, deleteBlog);

module.exports = { blogRouter };
