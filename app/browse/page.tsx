"use client";

import Link from "next/link";
import { Search, Star, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

interface Tool {
  id: string;
  name: string;
  reviewCount: number;
  averageRating: number;
}

export default function BrowsePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools data on component mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tools');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        
        const toolsData = await response.json();
        setTools(toolsData);
        setFilteredTools(toolsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching tools:", error);
        setError("Failed to load tools. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Filter tools based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTools(tools);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tools.filter(tool => 
        tool.name.toLowerCase().includes(query)
      );
      setFilteredTools(filtered);
    }
  }, [searchQuery, tools]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-400">Discover AI Tools</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our curated collection of AI tools with comprehensive reviews and insights from the community.
          </p>
        </div>
        
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-800 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-gray-300">Loading tools...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-300">No tools found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link 
                key={tool.id} 
                href={`/tool/${tool.id}`}
                className="block p-6 border border-gray-800 rounded-lg hover:border-yellow-400 transition-all bg-gray-900 hover:bg-gray-800 group"
              >
                <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-yellow-400">{tool.name}</h2>
                <div className="flex items-center text-sm text-gray-300">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="mr-2 text-yellow-400">{tool.averageRating ? tool.averageRating.toFixed(1) : '0.0'}</span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {tool.reviewCount || 0} reviews
                  </span>
                </div>
                <p className="text-gray-400 mt-3">Explore reviews and insights</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-yellow-400 text-sm font-medium">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 