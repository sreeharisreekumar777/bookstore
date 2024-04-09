import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import BookCard from "../components/BookCard";
import { Helmet } from "react-helmet";

export default function BookPage() {
  const { bookSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // Use the correct API route
        const res = await fetch(`/api/book/getbooks?slug=${bookSlug}`);
        const data = await res.json();

        if (!res.ok || data.books.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        if (res.ok) {
          // Assuming you want to set the first book in the array
          setBook(data.books[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.error(error); // Log the error for debugging
        setError(true);
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookSlug]);

  useEffect(() => {
    try {
      const fetchRelatedBooks = async () => {
        if (!book || (!book.category && !book.genre)) {
          // If book data is incomplete, do nothing
          return;
        }

        let apiUrl = "/api/book/getbooks?limit=4";

        if (book.category) {
          apiUrl += `&category=${book.category}`;
        }

        if (book.genre) {
          apiUrl += `&genre=${book.genre}`;
        }

        const res = await fetch(apiUrl);

        const data = await res.json();
        if (res.ok) {
          // Exclude the current book from related books
          const filteredRelatedBooks = data.books.filter(
            (relatedBooks) => relatedBooks._id !== book._id
          );
          setRelatedBooks(filteredRelatedBooks);
        }
      };

      fetchRelatedBooks();
    } catch (error) {
      console.log(error.message);
    }
  }, [book]);

  useEffect(() => {
    try {
      const fetchRecommendedBooks = async () => {
        if (!book || !book.category) {
          // If book data is incomplete or category is missing, do nothing
          return;
        }

        const res = await fetch(
          `/api/book/getbooks?category=${book.category}&limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          // Filter out the current book and books from the same genre
          const filteredRecommendedBooks = data.books.filter(
            (recommendedBook) =>
              recommendedBook._id !== (book && book._id) &&
              recommendedBook.genre !== (book && book.genre)
          );
          setRecommendedBooks(filteredRecommendedBooks);
        }
      };
      fetchRecommendedBooks();
    } catch (error) {
      console.log(error.message);
    }
  }, [book]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error loading book. Please try again later.</p>
      </div>
    );

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:image" content={book && book.image} />
        <meta
          property="og:url"
          content={`https://example.com/book/${bookSlug}`}
        />
        <title>{book && book.title}</title>
        <meta property="og:title" content={book && book.title} />
        <meta
          property="og:description"
          content={book && (book.content.length / 1000).toFixed(0)}
        />
      </Helmet>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {book && book.title}
        </h1>
        <Link
          to={`/search?category=${book && book.category}`}
          className="self-center mt-5">
          <Button color="gray" pill size="xs">
            {book && book.category}
          </Button>
        </Link>
        <Link
          to={`/search?genre=${book && book.genre}`}
          className="self-center mt-5">
          {book && book.genre && (
            <Button color="gray" pill size="xs">
              {book.genre}
            </Button>
          )}
        </Link>
        <img
          src={book && book.image}
          alt={book && book.title}
          className="mt-10 p-3 h-full w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          <span>{book && new Date(book.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {book && (book.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: book && book.content }}></div>

        {/* Related Books Section */}
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5">
            Recommended {book && book.genre} to watch after {book && book.title}
          </h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {relatedBooks &&
              relatedBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
          </div>
        </div>

        {/* Recommended Books Section */}
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5">YOU MIGHT ALSO LIKE</h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recommendedBooks &&
              recommendedBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection bookId={book._id} />
      </main>
    </React.Fragment>
  );
}
