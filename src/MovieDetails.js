import React, { useState, useMemo } from "react";

const MovieDetails = ({ movie, showInPopup, isPopup }) => {
  const [showFullStory, setShowFullStory] = useState(false);

  const toggleShowFullStory = () => {
    setShowFullStory(!showFullStory);
  };

  const convertDurationToTime = (duration) => {
    const match = duration.match(/PT(\d+)M/);
    if (!match) {
      throw new Error("Invalid duration format");
    }
    const totalMinutes = parseInt(match[1], 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h : ${minutes.toString().padStart(2, "0")}m`;
  };

  const durationTime = useMemo(() => convertDurationToTime(movie.duration), [movie.duration]);

  return (
    <div className={isPopup !== undefined ? "" : "movie_block"}>
      <div className="movie_title">
        {movie.title} ({movie.year})
      </div>
      <img
        src={movie.posterurl}
        alt={movie.title}
        onClick={() => showInPopup(movie)}
      />
      <p>
        <strong>Genres: </strong>
        {movie.genres.join(", ")}
      </p>
      <p>
        <strong>IMDb Rating: </strong>
        {movie.imdbRating}
      </p>
      <p>
        <strong>Content Rating: </strong>
        {movie.contentRating}
      </p>
      <p>
        <strong>Duration: </strong>
        {durationTime}
      </p>
      <p>
        <strong>Release Date: </strong>
        {movie.releaseDate}
      </p>
      <p>
        <strong>Actors: </strong>
        {movie.actors.join(", ")}
      </p>
      <p>
        <strong>Storyline: </strong>
        {showFullStory
          ? movie.storyline
          : `${movie.storyline.slice(0, 100)}... `}
        {movie.storyline.length > 100 && (
          <button onClick={toggleShowFullStory} className="showMore-button">
            {showFullStory ? "Show less" : "Show more"}
          </button>
        )}
      </p>
    </div>
  );
};

export default MovieDetails;
