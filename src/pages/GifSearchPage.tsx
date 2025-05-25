import React, { useState, useEffect } from "react";
import { Search, Dumbbell } from "lucide-react";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
}

const GifSearchPage = () => {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises${
          searchTerm ? `/name/${encodeURIComponent(searchTerm)}` : ""
        }?limit=100`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "cbd89ceed7msh49f72c76d9a95e5p12d375jsn4d76b20807fe",
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExercises(search);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Dumbbell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Exercise GIF Library
        </h1>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, body part, or equipment..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Exercises
              </>
            )}
          </button>
        </form>
      </motion.div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-lg mx-auto mb-8">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="relative aspect-square">
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white capitalize">
                  {exercise.name.replace(/-/g, " ")}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full capitalize">
                    {exercise.bodyPart.replace(/-/g, " ")}
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full capitalize">
                    {exercise.target.replace(/-/g, " ")}
                  </span>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full capitalize">
                    {exercise.equipment.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && exercises.length === 0 && !error && (
        <div className="text-center py-12">
          <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No exercises found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {search
              ? "Try a different search term"
              : "Unable to load exercises at this time"}
          </p>
        </div>
      )}
    </div>
  );
};

export default GifSearchPage;