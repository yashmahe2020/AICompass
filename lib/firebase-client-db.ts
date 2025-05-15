import { db } from './firebase';
import { doc, getDoc, setDoc, increment, updateDoc } from 'firebase/firestore';
import { Review } from './types';

export async function getUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function setUserProfile(userId, profile) {
  try {
    await setDoc(doc(db, 'users', userId), profile, { merge: true });
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
}

export async function addReview(productId: string, review: Review): Promise<void> {
  const reviewId = review.id || `${productId}_${Date.now()}`;
  await setDoc(doc(db, 'reviews', reviewId), {
    ...review,
    id: reviewId
  });
  // Optionally update product review count (client-side, best effort)
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    reviewCount: increment(1),
    updatedAt: new Date().toISOString()
  }).catch(() => {});
} 