const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(allBlogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (req, res, next) => {
  try {
    const token = req.token;
    const payload = jwt.verify(token, config.SECRET);
    if (!token || !payload.id) {
      return res.status(401).json({ error: "token missing or invalid token" });
    }
    const user = await User.findOne({ _id: payload.id });
    const blog = new Blog({ ...req.body, user: payload.id });
    const newBlog = await blog.save();

    user.blogs = user.blogs.concat(newBlog.id);

    await user.save();

    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const token = req.token;
    const payload = jwt.verify(token, config.SECRET);
    if (!token || !payload.id) {
      return res.status(401).json({ error: "token missing or invalid token" });
    }
    const id = req.params.id;
    const blogToDelete = await Blog.findOne({ _id: id });

    if (blogToDelete.user.toString() !== payload.id.toString()) {
      res
        .status(401)
        .json({ error: "you are not allowed to delete this blog" });
    }

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
