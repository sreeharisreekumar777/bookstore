import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { Helmet } from "react-helmet";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
    genre: "",
  });

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [Schemabooks, setSchemaBooks] = useState([]);
  const [Schemaseries, setSchemaSeries] = useState([]);

  useEffect(() => {
    // Fetch books and series
    const fetchBooksByCategory = async (category, setBooks) => {
      try {
        const res = await fetch(
          `/api/book/getbooks?category=${category}&limit=3`
        );
        const data = await res.json();
        setBooks(data.books);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch books and series when the component mounts
    fetchBooksByCategory("Schemabooks", setSchemaBooks);
    fetchBooksByCategory("Schemaseries", setSchemaSeries);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    const genreFromUrl = urlParams.get("genre");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl || genreFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
        genre: genreFromUrl,
      });
    }

    const fetchBooks = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/book/getbooks?${searchQuery}`);

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setBooks(data.books);
      setLoading(false);

      setShowMore(data.books.length === 12);
    };

    fetchBooks();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value;
      setSidebarData({ ...sidebarData, category: category });
    }
    if (e.target.id === "genre") {
      const genre = e.target.value;
      setSidebarData({ ...sidebarData, genre: genre });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    urlParams.set("genre", sidebarData.genre);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfBooks = books.length;
    const startIndex = numberOfBooks;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/post/getbooks?${searchQuery}`);

    if (!res.ok) {
      console.error("Error fetching more books:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    setBooks([...books, ...data.books]);
    setShowMore(data.books.length === 12);
  };

  useEffect(() => {
    const defaultImageUrl = "https://www.example.com/book-96.svg";
    const ogImageUrl =
      books.length > 0 ? books[0].image || defaultImageUrl : defaultImageUrl;
    document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", ogImageUrl);
  }, [books]);

  const pageTitle =
    "BookStore - Your Ultimate Source for Books";
  const pageDescription =
    "Explore a variety of books.";
  const pageKeywords = "books, series";
  const canonicalUrl = "https://www.example.com/search";
  const ogImageUrl = "https://www.example.com/book-96.svg";
  const generateMediaSchemaArray = (books) => {
    return books.map((book) => {
      return {
        "@context": "http://schema.org",
        "@type": "Book",
        name: book.title,
        description: book.content,
        image: book.image,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.5",
          reviewCount: "100",
        },
      };
    });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify([
            ...generateMediaSchemaArray(Schemabooks),
            ...generateMediaSchemaArray(Schemaseries),
          ])}
        </script>
      </Helmet>
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap font-semibold">
                Search Term:
              </label>
              <TextInput
                placeholder="Search..."
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <Select
                onChange={handleChange}
                value={sidebarData.sort}
                id="sort">
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Category:</label>
              <Select
                onChange={handleChange}
                value={sidebarData.category}
                id="category">
                <option value=""></option>
                <option value="books">Books</option>
                <option value="series">Series</option>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Genre:</label>
              <Select
                onChange={handleChange}
                value={sidebarData.genre}
                id="genre">
                <option value=""></option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="romance">Romance</option>
                <option value="horror">Horror</option>
                <option value="thriller">Thriller</option>
                <option value="sci-fi">Science Fiction</option>
                <option value="fantasy">Fantasy</option>
                <option value="adventure">Adventure</option>
                <option value="mystery">Mystery</option>
                <option value="crime">Crime</option>
                <option value="documentary">Documentary</option>
                <option value="family">Family</option>
                <option value="musical">Musical</option>
                <option value="biography">Biography</option>
                <option value="history">History</option>
                <option value="war">War</option>             
              </Select>
            </div>
            <Button type="submit" >
              Apply Filters
            </Button>
          </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
            Books results:
          </h1>
          <div className="p-7 flex flex-wrap justify-center gap-4">
            {!loading && books && books.length === 0 && (
              <p className="text-xl text-gray-500">No books found.</p>
            )}

            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
              books &&
              books.map((book) => <BookCard key={book._id} book={book} />)}
            {showMore && (
              <Button type="button"  size="sm"
              className=" text-lg w-full"
                onClick={handleShowMore}
              >
                
                Show More
              </Button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
