"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/lib/firebase";
import { addReview } from "@/lib/firebase-client-db";
import { Review } from "@/lib/types";

// Sample Nearpod reviews (hard‑coded on the client for testing)
// 5 positive, 3 negative, 2 neutral – roughly three sentences each
const sampleReviews: Omit<Review, "id" | "userId" | "productId" | "productName" | "safe">[] = [
  {
    review:
      "Nearpod has transformed my virtual classroom. The interactive slides, quizzes, and VR field trips keep my students engaged from start to finish. I love how easily I can import Google Slides and add formative assessments in minutes.",
    authorName: "Alicia Gomez",
    date: "2025-03-10",
    stars: 5
  },
  {
    review:
      "The real‑time analytics in Nearpod give me instant insight into student understanding. I can immediately reteach concepts when I spot misconceptions. The collaborative board feature sparks great discussion even with shy learners.",
    authorName: "Brian Lee",
    date: "2025-03-08",
    stars: 5
  },
  {
    review:
      "Nearpod's library of pre‑made lessons saves me hours of prep. I can quickly tweak a math lesson and push it to students' devices. The immersive reader integration is fantastic for my ELL students.",
    authorName: "Carmen Nguyen",
    date: "2025-03-05",
    stars: 4
  },
  {
    review:
      "I use Nearpod every day for bell‑ringer activities. The gamified Time to Climb gets my middle‑schoolers excited to review vocabulary. Having everything self‑paced makes differentiation simple.",
    authorName: "Derek Patel",
    date: "2025-03-01",
    stars: 5
  },
  {
    review:
      "Nearpod pairs perfectly with my interactive whiteboard. Students come up and annotate while their classmates respond on their Chromebooks. The seamless Google Classroom integration is a huge plus.",
    authorName: "Emily Foster",
    date: "2025-02-25",
    stars: 4
  },
  {
    review:
      "Although Nearpod offers many features, the platform can feel sluggish during peak hours. I have experienced lag when loading large video files, which interrupts the flow of my lesson. The offline mode needs improvement for schools with unstable internet.",
    authorName: "Felix Martin",
    date: "2025-02-20",
    stars: 2
  },
  {
    review:
      "The cost of the premium version is steep for individual teachers. Basic features are fine, but access to most interactive activities sits behind a paywall. I hate having to pitch another subscription to my admin.",
    authorName: "Grace Kim",
    date: "2025-02-15",
    stars: 2
  },
  {
    review:
      "Nearpod's reporting dashboard looks promising, but exporting data to Excel often breaks formatting. I've also encountered random logouts during live sessions. Customer support responses are slow.",
    authorName: "Henry O'Neill",
    date: "2025-02-10",
    stars: 1
  },
  {
    review:
      "Nearpod does a solid job of combining content delivery with quick checks for understanding. However, I still prefer traditional discussion for deeper topics. It's a helpful supplement rather than a complete solution.",
    authorName: "Isabel Ruiz",
    date: "2025-02-05",
    stars: 3
  },
  {
    review:
      "Setting up lessons in Nearpod is straightforward, but the interface feels cluttered with so many buttons. Once you learn the workflow it becomes second nature, yet the learning curve may deter some colleagues.",
    authorName: "Jason Carter",
    date: "2025-02-01",
    stars: 3
  }
];

export default function TestFirebaseSubmitPage() {
  const { userId, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [eduVerified, setEduVerified] = useState<null | boolean>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Fetch eduVerified flag when auth state changes
  useEffect(() => {
    if (isLoaded && userId) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        try {
          const db = getFirestore(firebaseApp);
          const userDoc = await getDoc(doc(db, "users", userId));
          setEduVerified(userDoc.exists() ? userDoc.data().eduVerified === true : false);
        } catch {
          setEduVerified(false);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    } else if (isLoaded && !userId) {
      setProfileLoading(false);
    }
  }, [isLoaded, userId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatus(null);
    setError(null);
    try {
      if (!userId) {
        setError("You must be signed in.");
        return;
      }
      if (!eduVerified) {
        setError("You must be eduVerified to submit reviews.");
        return;
      }
      // Submit each review
      for (const r of sampleReviews) {
        const review: Review = {
          ...r,
          id: `nearpod_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
          userId,
          productId: "nearpod",
          productName: "Nearpod",
          date: new Date().toISOString(),
          safe: true
        };
        await addReview("nearpod", review);
      }
      setStatus("Successfully submitted 10 Nearpod reviews!");
    } catch (e: any) {
      setError(e.message || "Error submitting reviews");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <button
          onClick={() => openSignIn()}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (eduVerified === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-600">Verification Required</h1>
        <p className="mb-4">You must verify your student or teacher status to use this test.</p>
        <button
          onClick={() => router.push("/verify")}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
        >
          Verify Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-yellow-600">Test Firebase Review Submit</h1>
      <p className="mb-4 text-lg">Click the button below to submit 10 sample Nearpod reviews as the current user.</p>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-yellow-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors mb-4 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit 10 Nearpod Reviews"}
      </button>
      {status && <div className="text-green-600 font-semibold mt-2">{status}</div>}
      {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
    </div>
  );
}
