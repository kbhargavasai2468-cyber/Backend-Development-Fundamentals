const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Welcome to my Node.js and Express server!");
});

app.get("/about", (req, res) => {
    res.status(200).json({
        name: "K.Bhargava Sai",
        section: "CSE-GEN-AI-2A-304"
    });
});

app.get("/time", (req, res) => {
    res.json({
        date: new Date().toLocaleDateString("en-IN"),
        time: new Date().toLocaleTimeString("en-IN", { hour12: true })
    });
});

app.use((req, res) => {
    res.status(404).send("404 - Page not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});