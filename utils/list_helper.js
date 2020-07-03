const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  const total = blogs.map((blog) => blog.likes).reduce(reducer, 0);
  return blogs.length === 0 ? 0 : total;
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const { _id, url, __v, ...favorite } = blogs[
    likes.indexOf(Math.max(...likes))
  ];
  return favorite;
};

const mostBlogs = (blogs) => {
  const obJ = Object.entries(
    blogs.reduce((acc, curr) => {
      acc[curr.author] = (acc[curr.author] || 0) + 1;
      return acc;
    }, {})
  ).map(([author, blogs]) => ({ author, blogs }));
  return obJ.find((a) => a.blogs === Math.max(...obJ.map((obj) => obj.blogs)));
};

const mostLikes = (blogs) => {
  const obJ = Object.entries(
    blogs.reduce((acc, curr) => {
      acc[curr.author] = (acc[curr.author] || 0) + (curr.likes || 0);
      return acc;
    }, {})
  ).map(([author, likes]) => ({ author, likes }));
  return obJ.find(
    (blog) => blog.likes === Math.max(...obJ.map((blog) => blog.likes))
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
