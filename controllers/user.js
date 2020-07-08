const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs");
    res.json(users.map((u) => u.toJSON()));
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;

    if (body.username === undefined || body.password === undefined) {
      return res
        .status(400)

        .json({ error: "Username or Password cannot be empty" });
    }
    if (body.username.length < 3 || body.password.length < 3) {
      return res
        .status(400)
        .json({ error: "Username and Password must be at least 3 characters" });
    }

    const existingUser = await User.findOne({ username: body.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `user ${body.username} already exists` });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
