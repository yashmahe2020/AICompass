import { NextApiRequest, NextApiResponse } from "next";
import { getSampleProductsReviews, saveSampleProductsReviews } from "@/lib/sample-data";
import { Review } from "@/lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { toolName, review, authorName, stars } = req.body;

    // Validate the input
    if (!toolName || !review || !authorName || stars === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert tool name to lowercase for consistent dictionary keys
    const normalizedToolName = toolName.toLowerCase();

    // Create a new review object
    const newReview: Review = {
      id: `${normalizedToolName}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      review,
      authorName,
      date: new Date().toISOString(),
      stars,
      productId: normalizedToolName,
      productName: toolName // Keep original case for display
    };

    try {
      // Get existing reviews
      const sampleProductsReviews = await getSampleProductsReviews();

      // Check if the tool exists, if not, create it
      if (!sampleProductsReviews[normalizedToolName]) {
        sampleProductsReviews[normalizedToolName] = {
          name: toolName, // Keep original case for display
          reviews: [],
        };
      }

      // Add the review to the corresponding tool in sampleProductsReviews
      sampleProductsReviews[normalizedToolName].reviews.push(newReview);

      // Save the updated reviews back to the JSON file
      await saveSampleProductsReviews(sampleProductsReviews);

      return res.status(200).json({ message: "Review submitted successfully." });
    } catch (error) {
      console.error("Error submitting review:", error);
      return res.status(500).json({ message: "Error submitting review. Please try again." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 