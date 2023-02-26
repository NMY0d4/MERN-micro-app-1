const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 4002;

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    if (type === "PostCreated") {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, comment, postId, status } = data;
        const post = posts[postId];

        post.comments.push({ id, comment, status });
    }

    if (type === "CommentUpdated") {
        const { postId, id, comment, status } = data;
        const post = posts[postId];
        const commentToUpdate = post.comments.find(
            (comment) => comment.id === id
        );
        commentToUpdate.status = status;
        commentToUpdate.comment = comment;
    }

    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
