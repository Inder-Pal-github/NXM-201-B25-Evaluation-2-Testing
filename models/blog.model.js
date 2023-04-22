const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: { type: String, requried: true },
    description: { type: String, requried: true },
    userId: { type: String, requried: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", BlogSchema);

module.exports = { Blog };
