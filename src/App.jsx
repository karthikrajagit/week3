// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    summary: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch books from the backend API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/books");
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search term and category selection
  useEffect(() => {
    let tempBooks = books;
    if (selectedCategory !== "All") {
      tempBooks = tempBooks.filter(
        (book) => book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTerm) {
      tempBooks = tempBooks.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBooks(tempBooks);
  }, [searchTerm, selectedCategory, books]);

  // Handle input change for new book
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  // Submit new book
  const addBook = async () => {
    // Basic validation
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.category ||
      !newBook.summary ||
      newBook.rating === ""
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/books", {
        ...newBook,
        rating: parseFloat(newBook.rating),
      });
      // Refresh the book list
      fetchBooks();
      // Clear form
      setNewBook({
        title: "",
        author: "",
        category: "",
        summary: "",
        rating: "",
      });
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <h1 className="text-5xl font-extrabold text-center text-white mb-10 drop-shadow-lg animate-pulse">
        Book Summaries
      </h1>
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-2xl">
        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-1/3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="All">All Categories</option>
            {[...new Set(books.map((book) => book.category))].map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Display Books */}
        {loading ? (
          <p className="text-center text-gray-700 text-xl">Loading books...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <h2 className="text-2xl font-bold text-white">{book.title}</h2>
                <p className="text-sm text-white">
                  By {book.author} - {book.category}
                </p>
                <p className="mt-2 text-white">{book.summary}</p>
                <p className="mt-2 font-bold text-white">Rating: {book.rating} ⭐</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Book Form */}
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Add a Book
        </h2>
        <div className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            name="author"
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            value={newBook.category}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <textarea
            name="summary"
            placeholder="Summary"
            value={newBook.summary}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          ></textarea>
          <input
            name="rating"
            type="number"
            step="0.1"
            placeholder="Rating"
            value={newBook.rating}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={addBook}
            className="w-full bg-purple-700 text-white p-3 rounded hover:bg-purple-800 transition-all"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
