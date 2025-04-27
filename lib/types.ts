export interface Review {
  id: string;
  review: string;
  authorName: string;
  date: string;
  stars: number;
  userId?: string;
  productId: string;
  productName: string;
}

export interface Product {
  name: string;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
  theme1?: string;
  theme2?: string;
  theme3?: string;
  theme4?: string;
  summaryUpdatedAt?: string;
}
