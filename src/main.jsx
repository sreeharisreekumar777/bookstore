import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { Helmet } from "react-helmet";

const Main = () => {
  const [SchemaBooks, setSchemaBooks] = useState([]);
  const [SchemaSeries, setSchemaSeries] = useState([]);

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
    fetchBooksByCategory("SchemaBooks", setSchemaBooks);
    fetchBooksByCategory("SchemaSeries", setSchemaSeries);
  }, []);

  const pageTitle =
    "BookStore - Your Ultimate Free Source for Books";
  const pageDescription =
    "Explore a variety of books on BookStore.";
  const pageKeywords = "books, reviews";
  const canonicalUrl = "https://www.example.com/";
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

  useEffect(() => {
    // Dynamically update Open Graph meta tags when Schemabooks or Schemaseries change
    const updateOpenGraphTags = () => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify([
        ...generateMediaSchemaArray(SchemaBooks),
        ...generateMediaSchemaArray(SchemaSeries),
      ]);
      document.getElementById("json-ld-script")?.replaceWith(script);
    };

    updateOpenGraphTags();
  }, [SchemaBooks, SchemaSeries]);

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
        {/* Placeholder for JSON-LD script */}
        <script
          id="json-ld-script"
          type="application/ld+json"
        >{`[]`}</script>
      </Helmet>
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
      </PersistGate>
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
