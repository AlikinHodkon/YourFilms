const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/api", router);

const start = async () => {
    app.listen(5000, () => console.log("Server started"));
}

start();