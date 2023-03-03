const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 4002;

const posts = {};

const handleEvent = (type, data) => {
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
};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);

    try {
        const res = await axios.get("http://event-bus-srv:4005/events");

        res.data.forEach((event) => {
            console.log("processing event:", event.type);

            handleEvent(event.type, event.data);
        });
    } catch (error) {
        console.log(error);
    }
});
