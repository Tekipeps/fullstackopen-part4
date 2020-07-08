const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const User = require("../models/user");
const user = require("../models/user");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({}).populate("user");
    res.json(allBlogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const randomUser = await User.findOne({});
    const blog = new Blog({ ...req.body, user: randomUser.id });
    const newBlog = await blog.save();
    randomUser.blogs = randomUser.blogs.concat(newBlog.id);
    await randomUser.save();
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Blog.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { likes, title, author, url } = req.body;
    const blog = { likes, title, author, url };
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
      new: true,
      omitUndefined: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
