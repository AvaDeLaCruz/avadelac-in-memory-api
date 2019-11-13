const express = require("express");
const cors = require("cors");
const app = express();

const { ENVIRONMENT, PORT } = process.env;
const IS_DEVELOPMENT = ENVIRONMENT === "development";

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "*"
  })
);

const db = {
  posts: [
    {
      id: 1,
      title: "Post 1",
      body: "something here..."
    },
    {
      id: 2,
      title: "Post 2",
      body: "something else here..."
    },
    {
      id: 3,
      title: "Post 3",
      body: "something else here..."
    }
  ],
  comments: [
    {
      id: 1,
      post: 3,
      body: "comment for post 3"
    },
    {
      id: 2,
      post: 1,
      body: "comment for post 2"
    }
  ]
};

app.get("/api/posts", (request, response) => {
  response.json(db.posts);
});

app.get("/api/comments", (request, response) => {
  response.json(db.comments);
});

app.post("/api/posts", (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

const error = {
  errors: {
    post: "post is required"
  }
};

app.post("/api/comments", (request, response) => {
  const comment = request.body;
  // if payload does not contain 'post' attribute, return error msg
  if (!comment.hasOwnProperty("post")) {
    response.status(400).json(error);
  }
  // if db does not contain post with id in payload, return
  if (db.posts.filter(post => post.id === comment.post).length < 1) {
    response.status(404).send();
  }
  // else, add the comment to the db
  comment.id = db.comments.length + 1;
  db.comments.push(comment);
  response.json(comment);
});

app.get("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.get("/api/posts/:id/comments", (request, response) => {
  const id = Number(request.params.id);
  response.json(db.comments.filter(comment => comment.post === id));
});

app.delete("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter(post => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.delete("/api/comments/:id", (request, response) => {
  const id = Number(request.params.id);
  // if comment doesn't exist in db, return error code
  const originalLength = db.comments.length;
  db.comments = db.comments.filter(comment => comment.id !== id);
  db.comments.length === originalLength
    ? response.status(404).send()
    : response.status(204).send();
});

app.put("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body);
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.listen(PORT || 8000);
