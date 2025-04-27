import { notFound } from "next/navigation";
import { Product } from "./types";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), 'lib', 'data.json');

// Ensure the JSON file exists and has initial data
const initializeDataFile = () => {
  if (!fs.existsSync(dataFilePath)) {
    const initialData = {
      canva: { name: "Canva", reviews: [] },
      notebook: { name: "Google Notebook", reviews: [] },
      chatgpt: { name: "ChatGPT", reviews: [] },
      nearpod: { name: "Nearpod", reviews: [] },
      flipgrid: { name: "Flipgrid", reviews: [] },
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  }
};

export async function getProduct(id: string) {
  initializeDataFile(); // Ensure the data file is initialized
  const reviews = await getSampleProductsReviews();
  // Normalize the id to lowercase for consistent lookups
  const normalizedId = id.toLowerCase();
  const product = reviews[normalizedId] as Product;
  if (!product) {
    notFound();
  }
  return product;
}

export async function getSampleProductsReviews() {
  initializeDataFile(); // Ensure the data file is initialized
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

export async function saveSampleProductsReviews(reviews: Record<string, Product>) {
  fs.writeFileSync(dataFilePath, JSON.stringify(reviews, null, 2));
}
