const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  let newBlog = new Blog(helper.initialBlogs[0]);
  await newBlog.save();

  newBlog = Blog(helper.initialBlogs[1]);
  await newBlog.save();
  newBlog = Blog(helper.initialBlogs[2]);
  await newBlog.save();
});

test("Returns correct amount of blog post in JSON", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("Verifies the uid is id not _id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("Blog creates succesfully", async () => {
  const newBlog = new Blog({
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  });

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.allBlogs();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain("Type wars");
});

test("default value of likes equals 0", async () => {
  const newBlog = new Blog({
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
  });

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.allBlogs();
  const likes = blogsAtEnd.map((b) => b.likes);
  expect(likes).toContain(0);
});

test("if title or url are missing return 400", async () => {
  const newBlog = new Blog({
    author: "Robert C. Martin",
    likes: 10,
  });
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("deleted blog deletes successfully and returns 204", async () => {
  const blogsAtStart = await helper.allBlogs();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.allBlogs();

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
});

test("updated blog updates successfully and returns 200", async () => {
  const blogsAtStart = await helper.allBlogs();
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`, {
      likes: 50,
    })
    .expect(200);

  expect(blogToUpdate.likes).not.toEqual(updatedBlog.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
