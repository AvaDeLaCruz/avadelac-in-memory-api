const express = require("express"); //CommonJS import

const app = express();

app.use(express.json()); //middleware yay

const db = {
  posts: [
    {
      id: 1,
      title: "Post 1",
      body: "Something here..."
    },
    {
      id: 2,
      title: "Post 2",
      body: "Something else here..."
    }
  ]
};

// get all posts
app.get("/api/v1/posts", (request, response) => {
  response.json(db.posts);
});

// get single post
app.get("/api/v1/posts/:id", (request, response) => {
  const id = parseInt(request.params.id);
  //   get post w/ given id
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.post("/api/v1/posts", (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.delete("/api/v1/posts/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });
  if (post) {
    //   delete
    db.posts = db.posts.filter(post => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put("/api/v1/posts/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });
  if (post) {
    //   edit and update post
    // Object.assign(target, new-data);
    Object.assign(post, request.body);
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.listen(8000);
