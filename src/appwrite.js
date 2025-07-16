import { Client, Databases, Query } from 'appwrite';

// ✅ 1. Initialize Appwrite client
const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // ✅ Appwrite cloud endpoint
  .setProject('6875ffa60033f53f397b');              // 🔁 Replace with your Appwrite project ID

// ✅ 2. Connect to Databases API
export const databases = new Databases(client);

// ✅ 3. Optional: Get trending movies (e.g. top-rated)
export const getTrendingMovies = async () => {
  try {
    const response = await databases.listDocuments(
      '6876020600317fb01a79', // Replace with your database ID
      '687603e60010afeb31b4', // Replace with your collection ID
      [
        Query.orderDesc('rating'),         // Sort by rating
        Query.limit(5)                     // Top 5 movies
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error getting trending movies:', error);
    return [];
  }
};

// ✅ 4. Optional: Track search count by updating a field
export const updateSearchCount = async (query, movie) => {
  try {
    const currentCount = movie.search_count || 0;
    await databases.updateDocument(
      '6876020600317fb01a79',
      '687603e60010afeb31b4',
      movie.$id,
      {
        search_count: currentCount + 1
      }
    );
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};
