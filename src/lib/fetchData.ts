
  
  export const exerciseOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'cbd89ceed7msh49f72c76d9a95e5p12d375jsn4d76b20807fe', // Ensure this is your actual API key
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  };
  
  // Re-define fetchData as an async function within the component scope
  export const fetchData = async (url: string, options: any) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Fetch Error:", error);
      throw error; // Re-throw the error to be caught in handleSearch
    }
  };