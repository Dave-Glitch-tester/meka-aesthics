interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any; // The body can be any type, but it's usually an object or string
}

const axios = async (url: string, options: FetchOptions = {}) => {
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers, // Merge custom headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined, // Stringify body if provided
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }
    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default axios;
