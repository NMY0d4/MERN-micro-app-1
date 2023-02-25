const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 4001;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    const commentId = randomBytes(4).toString("hex");
    const { comment } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ commentId, comment, status: "pending" });

    commentsByPostId[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId,
            comment,
            postId: req.params.id,
            status: "pending",
        },
    });

    res.status(201).send(comments);
});

app.post("/events", (req, res) => {
    console.log("Event Received", req.body.type);

    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
