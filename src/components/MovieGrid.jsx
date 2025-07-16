import React from 'react';

const MovieGrid = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-white mt-4">No movies found</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6">
      {movies.map((movie) => (
        <div key={movie.$id} className="bg-gray-800 text-white rounded p-4">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-60 object-cover rounded"
          />
          <h3 className="mt-2 text-xl font-semibold">{movie.title}</h3>
          <p>{movie.genre} | {movie.year}</p>
          <p className="text-sm text-gray-300">{movie.platform}</p>
          {movie.rating && (
            <p className="text-yellow-400 mt-1">⭐ {movie.rating}/10</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;