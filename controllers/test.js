const testRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

testRouter.post('/reset', async (req, res, next) => {
  try {
    await User.deleteMany({})
    await Blog.deleteMany({})

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = testRouter
