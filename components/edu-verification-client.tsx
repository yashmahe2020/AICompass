"use client";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app as firebaseApp } from "@/lib/firebase";
import { getUserProfile, setUserProfile } from "@/lib/firebase-client-db";
import { isSchoolEmail } from "@/lib/edu-utils";

export default function EduVerificationClient() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    async function maybeAutoVerify() {
      if (isLoaded && userId && user) {
        const email = user.primaryEmailAddress?.emailAddress || "";
        const isEdu = isSchoolEmail(email);
        let role = null;
        if (isEdu) {
          if (email.includes("student")) role = "student";
          else if (email.includes("teacher")) role = "teacher";
          else role = "student";
        }
        // Fetch user profile from Firestore
        const profile = await getUserProfile(userId);
        if (profile && profile.verified === true) {
          // Already verified, never set to false
          return;
        }
        if (isEdu) {
          // Only set to true if not already true
          await setUserProfile(userId, {
            eduVerified: true,
            verified: true,
            role,
            email,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
    maybeAutoVerify();
  }, [isLoaded, userId, user]);
  return null;
} 