const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 4003;

app.post("/events", (req, res) => {
    const { type, data } = req.body;
    console.log("Event Received", req.body.type);

    // if (type === "CommentCreated") {
    //     const { id, comment, postId } = data;

    // }
    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
