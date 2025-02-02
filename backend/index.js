// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (adjust the connection string as needed)
mongoose
  .connect(process.env.MONGO, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Book schema and model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// GET endpoint to retrieve all book summaries
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ _id: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// POST endpoint to add a new book summary
app.post("/books", async (req, res) => {
  const { title, author, category, summary, rating } = req.body;

  // Basic validation
  if (!title || !author || !category || !summary || rating == null) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newBook = new Book({ title, author, category, summary, rating });
    await newBook.save();
    res.json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Error adding book" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
