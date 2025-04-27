import { Reviews } from "@/components/reviews";
import { getProduct, getSampleProductsReviews } from "@/lib/sample-data";

export default async function ProductPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const product = await getProduct(productId);
  const sampleProductsReviews = await getSampleProductsReviews();
  const reviews = sampleProductsReviews[productId] || [];

  return <Reviews product={product} reviews={reviews} />;
}

export async function generateStaticParams() {
  const sampleProductsReviews = await getSampleProductsReviews();
  const productIds = Object.keys(sampleProductsReviews);

  return productIds.map((id) => ({
    productId: id,
  }));
}
