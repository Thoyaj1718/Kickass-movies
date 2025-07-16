import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import { useDebounce } from 'react-use';
import { databases, getTrendingMovies, updateSearchCount } from './appwrite';
import MovieGrid from './components/MovieGrid.jsx';

const DATABASE_ID = '6876020600317fb01a79';
const COLLECTION_ID = '687603e60010afeb31b4';

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce search term to reduce API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch all movies from Appwrite DB (filtered by search term if provided)
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      let filtered = res.documents ?? [];

      if (query.trim()) {
        filtered = filtered.filter((movie) =>
          movie.title?.toLowerCase().includes(query.toLowerCase())
        );
      }

      console.log('Filtered movies:', filtered); // Debug print
      setMovieList(filtered);

      if (query && filtered.length > 0) {
        await updateSearchCount?.(query, filtered[0]); // Optional
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch trending movies (optional function)
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies?.(); // Optional
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  // Run on search term update
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Run once on page load
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending Movies */}
        {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* All Movies */}
        <section className="all-movies">
          <h2>All Movies</h2>

          {/* Optional debug: print movies as JSON */}
          <pre className="text-white text-xs mb-4 overflow-auto max-h-40">
            {JSON.stringify(movieList, null, 2)}
          </pre>

          {isLoading ? (
            <p className="text-white text-center mt-4">Loading movies...</p>
          ) : errorMessage ? (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          ) : (
            <MovieGrid movies={movieList} />
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
