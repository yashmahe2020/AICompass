"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { app as firebaseApp } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Notification } from "@/components/ui/notification";
import { CheckCircle, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { getUserProfile, setUserProfile } from "@/lib/firebase-client-db";

const MODES = ["code", "sheerid", "idme"] as const;
type Mode = typeof MODES[number];

export const ALLOWED_DOMAINS = [
  "edu",

  "k12.ak.us",
  "k12.al.us",
  "k12.ar.us",
  "k12.az.us",
  "k12.ca.us",
  "k12.co.us",
  "k12.ct.us",
  "k12.de.us",
  "k12.fl.us",
  "k12.ga.us",
  "k12.hi.us",
  "k12.ia.us",
  "k12.id.us",
  "k12.il.us",
  "k12.in.us",
  "k12.ks.us",
  "k12.ky.us",
  "k12.la.us",
  "k12.ma.us",
  "k12.md.us",
  "k12.me.us",
  "k12.mi.us",
  "k12.mn.us",
  "k12.mo.us",
  "k12.ms.us",
  "k12.mt.us",
  "k12.nc.us",
  "k12.nd.us",
  "k12.ne.us",
  "k12.nh.us",
  "k12.nj.us",
  "k12.nm.us",
  "k12.nv.us",
  "k12.ny.us",
  "k12.oh.us",
  "k12.ok.us",
  "k12.or.us",
  "k12.pa.us",
  "k12.ri.us",
  "k12.sc.us",
  "k12.sd.us",
  "k12.tn.us",
  "k12.tx.us",
  "k12.ut.us",
  "k12.va.us",
  "k12.vt.us",
  "k12.wa.us",
  "k12.wi.us",
  "k12.wv.us",
  "k12.wy.us",
  "k12.dc.us",

  "mvla.net",
  "dpsk12.org",
  "apsva.us",
  "chisd.net",
];


const VALID_CODES = [
  "mvhstech2025app123",
];

function isSchoolEmail(email: string) {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return ALLOWED_DOMAINS.some((d) => domain.endsWith(d));
}

export default function VerifyPage() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const [mode, setMode] = useState<Mode | null>(null);
  const [code, setCode] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testWriteResult, setTestWriteResult] = useState<string | null>(null);
  const [schoolEmail, setSchoolEmail] = useState("");
  const [checkingProfile, setCheckingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAndAutoVerify() {
      if (!isLoaded || !userId || !user) return;
      setCheckingProfile(true);
      const profile = await getUserProfile(userId);
      if (profile && profile.eduVerified && profile.verified) {
        // Already verified, redirect
        router.replace("/submit");
        return;
      }
      // If not verified, check if email is a school domain
      const email = user.primaryEmailAddress?.emailAddress || "";
      if (isSchoolEmail(email)) {
        // Auto-verify
        const autoRole = email.includes("teacher") ? "teacher" : "student";
        await setUserProfile(userId, {
          eduVerified: true,
          verified: true,
          role: autoRole,
          schoolEmail: email,
          updatedAt: new Date().toISOString(),
        });
        router.replace("/submit");
        return;
      }
      setCheckingProfile(false);
    }
    checkAndAutoVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId, user]);

  useEffect(() => {
    if (user && (mode === "sheerid" || mode === "idme")) {
      setSchoolEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user, mode]);

  // Test Firestore write
  async function handleTestWrite() {
    setTestWriteResult(null);
    try {
      const db = getFirestore(firebaseApp);
      const testDocRef = doc(collection(db, "test-debug"));
      console.log("[TEST WRITE] Writing to:", testDocRef.path);
      await setDoc(testDocRef, { test: true, timestamp: new Date().toISOString() });
      setTestWriteResult("Test write succeeded! Firestore config is correct.");
    } catch (err: any) {
      setTestWriteResult("Test write failed: " + (err?.message || err));
      console.error("[TEST WRITE ERROR]", err);
    }
  }

  // Wait for Clerk and profile check
  if (!isLoaded || !userId || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
        <Loader2 className="animate-spin h-10 w-10 text-yellow-600" />
      </div>
    );
  }

  // Debug: Test Firestore write button
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-yellow-600 mb-2 text-center flex items-center justify-center gap-2">
            <ShieldCheck className="h-7 w-7 text-yellow-500" />
            Verify Your Status
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            To post reviews, you must verify you are a student or teacher.<br />
            Choose a verification method:
          </p>
          <div className="flex flex-col gap-4">
            <button
              className="flex items-center gap-3 w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-4 rounded-lg transition-colors border border-yellow-200 shadow-sm"
              onClick={() => setMode("code")}
            >
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              Use School Invite Code
            </button>
            <button
              className="flex items-center gap-3 w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-lg transition-colors border border-blue-200 shadow-sm"
              onClick={() => setMode("sheerid")}
            >
              <UserCheck className="h-5 w-5 text-blue-600" />
              Verify with SheerID
            </button>
            <button
              className="flex items-center gap-3 w-full bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 px-4 rounded-lg transition-colors border border-green-200 shadow-sm"
              onClick={() => setMode("idme")}
            >
              <UserCheck className="h-5 w-5" />
              Verify with ID.me
            </button>
            <button
              className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm underline"
              onClick={() => router.push("/browse")}
            >
              Verify Later
            </button>
            <button
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg border border-gray-200 shadow-sm"
              onClick={handleTestWrite}
            >
              🔎 Test Firestore Write
            </button>
            {testWriteResult && <div className="mt-2 text-sm text-center text-red-600">{testWriteResult}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Choose method
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-yellow-600 mb-2 text-center flex items-center justify-center gap-2">
            <ShieldCheck className="h-7 w-7 text-yellow-500" />
            Verify Your Status
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            To post reviews, you must verify you are a student or teacher.<br />
            Choose a verification method:
          </p>
          <div className="flex flex-col gap-4">
            <button
              className="flex items-center gap-3 w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-4 rounded-lg transition-colors border border-yellow-200 shadow-sm"
              onClick={() => setMode("code")}
            >
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              Use School Invite Code
            </button>
            <button
              className="flex items-center gap-3 w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-lg transition-colors border border-blue-200 shadow-sm"
              onClick={() => setMode("sheerid")}
            >
              <UserCheck className="h-5 w-5 text-blue-600" />
              Verify with SheerID
            </button>
            <button
              className="flex items-center gap-3 w-full bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 px-4 rounded-lg transition-colors border border-green-200 shadow-sm"
              onClick={() => setMode("idme")}
            >
              <UserCheck className="h-5 w-5 text-green-600" />
              Verify with ID.me
            </button>
            <button
              className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm underline"
              onClick={() => router.push("/browse")}
            >
              Verify Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Code entry
  if (mode === "code") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <button className="text-xs text-gray-400 mb-2" onClick={() => setMode(null)}>&larr; Back</button>
          <h2 className="text-2xl font-bold text-yellow-600 mb-2 text-center">Enter School Code</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              if (!userId) {
                setError("User not found. Please sign in again.");
                setLoading(false);
                return;
              }
              if (VALID_CODES.includes(code.trim().toLowerCase())) {
                try {
                  const db = getFirestore(firebaseApp);
                  await setDoc(doc(db, "users", userId), {
                    eduVerified: true,
                    verified: true,
                    role: "student",
                    updatedAt: new Date().toISOString(),
                  }, { merge: true });
                  setSuccess(true);
                  setTimeout(() => router.push("/submit"), 1200);
                } catch (err) {
                  setError("Verification failed. Please try again later.");
                }
              } else {
                setError("Invalid code. Please try again or contact your school admin.");
              }
              setLoading(false);
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter invite code"
              className="w-full border border-yellow-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-md font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle className="h-5 w-5" />} Verify with Code
            </button>
            {error && <Notification show={true} onClose={() => setError(null)}>{error}</Notification>}
            {success && <Notification show={true}>Verification successful! Redirecting...</Notification>}
          </form>
        </div>
      </div>
    );
  }

  // Step 2: SheerID/ID.me mock
  if (mode === "sheerid" || mode === "idme") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <button className="text-xs text-gray-400 mb-2" onClick={() => setMode(null)}>&larr; Back</button>
          <h2 className="text-2xl font-bold text-blue-600 mb-2 text-center flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-500" />
            {mode === "sheerid" ? "SheerID" : "ID.me"} Verification
          </h2>
          {!role ? (
            <>
              <p className="text-gray-600 mb-4 text-center">Select your role to continue:</p>
              <div className="flex gap-4 justify-center mb-4">
                <button
                  className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-lg border border-yellow-200 shadow-sm"
                  onClick={() => setRole("student")}
                >
                  Student
                </button>
                <button
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-lg border border-blue-200 shadow-sm"
                  onClick={() => setRole("teacher")}
                >
                  Teacher
                </button>
              </div>
            </>
          ) : !success ? (
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                if (!schoolEmail || !isSchoolEmail(schoolEmail)) {
                  setError("Please enter a valid school email address.");
                  setLoading(false);
                  return;
                }
                try {
                  const db = getFirestore(firebaseApp);
                  await setDoc(doc(db, "users", userId), {
                    eduVerified: true,
                    verified: true,
                    role,
                    schoolEmail,
                    updatedAt: new Date().toISOString(),
                  }, { merge: true });
                  setSuccess(true);
                  setTimeout(() => router.push("/submit"), 1200);
                } catch (err) {
                  setError("Verification failed. Please try again.");
                }
                setLoading(false);
              }}
            >
              <input
                type="email"
                value={schoolEmail}
                onChange={e => setSchoolEmail(e.target.value)}
                placeholder="Enter your school email"
                className="w-full border border-blue-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle className="h-5 w-5" />} Verify
              </button>
              <button
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors mt-2"
                onClick={() => setRole(null)}
                type="button"
              >
                Change Role
              </button>
              {error && <Notification show={true} onClose={() => setError(null)}>{error}</Notification>}
              {success && <Notification show={true}>Verification successful! Redirecting...</Notification>}
            </form>
          ) : null}
        </div>
      </div>
    );
  }
}

function VerificationAction({ userId, role, setSuccess, setError, router }: { userId: string, role: "student" | "teacher", setSuccess: (v: boolean) => void, setError: (v: string | null) => void, router: any }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("User not found. Please sign in again.");
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      try {
        const db = getFirestore(firebaseApp);
        await setDoc(doc(db, "users", userId), {
          eduVerified: true,
          verified: true,
          role,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        if (isMounted) {
          setSuccess(true);
          setTimeout(() => router.push("/submit"), 1200);
        }
      } catch (e) {
        if (isMounted) setError("Verification failed. Please try again.");
      }
      if (isMounted) setLoading(false);
    }, 1500);

    return () => { isMounted = false; };
  }, [userId, role, setSuccess, setError, router]);

  return null;
} 