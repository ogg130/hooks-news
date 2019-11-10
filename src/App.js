import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("null");

  const searchInputRef = useRef();

  useEffect(() => {
    getResults();
  }, []);

  // Create separate async/await function and call the API from useEffect to prevent f12 errors
  const getResults = async () => {
    setLoading(true);
    try {
      // Make the API call
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?query=${query}`
      );

      // Store results in state
      setResults(response.data.hits);
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  // Puts input and button in a form (to allow enter to trigger submit button)
  // makes the api call only handled whent he button is clicked instead of being bound to input state which changes every key enter
  const handleSearch = event => {
    event.preventDefault(); // Prevent page from reloading
    getResults(); // Make the api call
  };

  // Clears search input on button click
  // Since we are using controlled component, search value will be set to empty string when button is clicked
  const handleClearSearch = () => {
    setQuery("");
    // (current)Points to mounted text element, id'd as searchInputRef and gives it focus
    searchInputRef.current.focus();
  };

  return (
    <div className="container max-w-md mx-auto p-4 m-2 bg-purple-lightest shadow-lg rounded">
      <img
        src="https://icon.now.sh/react/c0c"
        alt="React Logo"
        className="float-right h-12"
      ></img>
      <h1 className="text-grey-darkest font-thin">Hooks News</h1>
      <form onSubmit={handleSearch} className="mb-2">
        <input
          className="border p-1 rounded"
          type="text"
          onChange={event => setQuery(event.target.value)}
          ref={searchInputRef}
          value={query}
        />
        <button type="submit" className="bg-orange rounded m-1 p-1">
          Search
        </button>
        <button
          type="button"
          onClick={handleClearSearch}
          className="bg-teal text-white p-1 rounded"
        >
          Clear
        </button>
      </form>

      {/* If the results are loading, display loading text, otherwise display results */}
      {loading ? (
        <div className="font-bold text-orange-dark">Loading results...</div>
      ) : (
        <ul className="list-reset leading-normal">
          {results.map(result => (
            <li key={result.objectID}>
              <a
                href={result.url}
                className="text-indigo-dark hover:text-indigo-darkest"
              >
                {result.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      {/*if we have error, return it */}
      {error && <div className="text-red font-bold">{error.message}</div>}
    </div>
  );
}
