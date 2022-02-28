import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { stripIndents } from "common-tags";
import Document from "./models/Document.js";

const app = express(); 
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_STRING)
    .then(console.log("[INFO]: Database connection established"));

app.get("/", (req, res) => {
    const code = stripIndents`
    ☄️🛰️🌌 Welcome to Spacebin

    Use the buttons in the top right corner to create a new
    file that you can share with others.

    -------------------------------------------------------------
    
    ➕ New: opens a new editor for you to paste your code into.

    💾 Save: saves your pasted code to a unique URL.
    \u200b`;

    res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.post("/save", async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value });
        res.redirect(`/${document.id}`);
    } catch (err) {
        res.render("new", { value });
        console.log(err);
    }
});

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        res.render("new", { value: document.value });
    } catch (err) {
        res.redirect(`/${id}`);
        console.log(err);
    }
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        res.render("code-display", { code: document.value, id });
    } catch (err) {
        res.redirect("/");
        console.log(err);
    }
});

app.listen(process.env.PORT);
console.log(`[INFO]: Server started on port ${process.env.PORT}`);
