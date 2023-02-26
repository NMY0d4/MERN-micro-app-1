const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 4003;

app.post("/events", async (req, res) => {
    const { type, data } = req.body;
    console.log("Event Received", req.body.type);

    if (type === "CommentCreated") {
        let { comment, status } = data;
        status = comment.includes("orange") ? "rejected" : "approved";
        console.log(status);

        await axios
            .post("http://localhost:4005/events", {
                type: "CommentModerated",
                data: { ...data, status },
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    res.send({});
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
