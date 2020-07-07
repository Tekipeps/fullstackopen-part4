const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({});
    res.json(allBlogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const newBlog = await blog.save();
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
