import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieDetails from "./MovieDetails";
import { IoSearchCircle } from "react-icons/io5";
function MovieDashBoard() {
  const [searchMovie, setSearchMovie] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSearchChange = (e) => {
    setLoading(true);
    e.preventDefault();
    let searchValue = e.target.value;
    setSearchMovie(searchValue);
  };

  const fetchMovies = () => {
    setLoading(true); 

    const callApi = () =>
      axios
        .get("http://localhost:3000/moviesDb/englishMovies.json")
        .then((result) => {
          setMoviesList(result.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    setInterval(() => {
      callApi();
    }, 1000);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const showInPopup = (movieInfo) => {
    setSelectedMovie(movieInfo);
  };

  const closePopup = () => {
    setSelectedMovie(null);
  };

  const filteredMovies = moviesList.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchMovie.toLowerCase()) ||
      movie.genres.some((genre) =>
        genre.toLowerCase().includes(searchMovie.toLowerCase())
      ) ||
      movie.imdbRating.toString().includes(searchMovie.toLowerCase())
  );

  const searchWords = searchMovie.toLowerCase().split(" ");

  const partialMatches = moviesList.filter((movie) => {
    const movieWords = movie.title.toLowerCase().split(" ");
    const genres = movie.genres.map((genre) => genre.toLowerCase());
    const imdbRating = movie.imdbRating.toString();

    return (
      (searchWords.some((word) => movieWords.includes(word)) ||
        genres.some((genre) => genre.includes(searchMovie.toLowerCase())) ||
        imdbRating.includes(searchMovie.toLowerCase())) &&
      movie.title.toLowerCase() !== searchMovie.toLowerCase()
    );
  });

  return (
    <div>
      <div className="top-container">
          <h1 className="productName">
            <span className="color1">Simpl</span>
            <span className="color2 lower-text">i</span>
            <span className="color3">Movies</span>
          </h1>
          <div className="input-container">
            <input
              type="text"
              value={searchMovie}
              onChange={onSearchChange}
              className="search-input"
              placeholder="search movies by genre,rating,title"
            />

            <div className="adornment">
              <IoSearchCircle color="#F5AB40" />
            </div>
          </div>
        </div>

      <div className="container">
        {loading ? (
          <div className="loadIcon">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        ) : (
          <>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((data, index) => (
                <MovieDetails
                  key={index}
                  movie={data}
                  showInPopup={showInPopup}
                />
              ))
            ) : (
              <div className="message">No exact matches found for: {searchMovie}</div>
            )}

            {filteredMovies.length === 0 && partialMatches.length > 0 && (
              <div className="container">
                <h3>Did you mean:</h3>
                {partialMatches.map((data,index) => (
                    <MovieDetails
                    key={index}
                    movie={data}
                    showInPopup={showInPopup}
                  />
                ))}
              </div>
            )}

            {selectedMovie && (
              <div>
                <div className="popup-overlay" onClick={closePopup}></div>
                <div className="popup">
                  <MovieDetails
                    movie={selectedMovie}
                    isPopup={true}
                    showInPopup={showInPopup}
                  />
                  <button onClick={closePopup}>Close</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDashBoard;
