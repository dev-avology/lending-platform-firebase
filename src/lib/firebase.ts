import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  UserCredential,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, query, orderBy, limit, getDocs, Timestamp, getDoc, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Firebase Authentication functions
export const register = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const login = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};

// Google Sign-In function
export const signInWithGoogle = (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

// Password Recovery function
export const recoverPassword = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// TypeScript interface for form data
interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  dateOfBirth: string;
  ssn: string;
  businessName: string;
  businessAddress: string;
  industry: string;
  photoURL: string;
}

// Function to save user data in Firestore
export const saveUserData = async (userId: string, formData: FormData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...formData,
      createdAt: Timestamp.now(),
      registrationComplete: true,
    });
    console.log('User data saved successfully!');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Function to save user data in Firestore
export const getUserData = async (user: any) => {
  try {
    if (!user) {
      throw new Error("No authenticated user found");
    }
    const userDoc = await getDoc(doc(db, 'users', user.uid))

    return userDoc;
  } catch (error) {
    console.error('Error saving user data:', error);
    return null;
  }
};


// Function to save a loan application
export const saveLoanApplication = async (data: any) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found");
  }

  try {
    const applicationsRef = collection(db, 'users', user.uid, 'applications');


    const inProgressQuery = query(applicationsRef, where('status', '==', 'In Progress'));

    const querySnapshot = await getDocs(inProgressQuery);

    if (!querySnapshot.empty) {
      console.log('An application is already in progress. Cannot add another one.');
      return null;
    }

    const newApplication = {
      ...data,
      userId: user.uid,
      submissionDate: Timestamp.now(),
      status: 'In Progress',
      loanAmount: data.grossAnnualSales ? parseFloat(data.grossAnnualSales) * 0.1 : 0,
    };

    const docRef = await addDoc(applicationsRef, newApplication);

    console.log('Application submitted successfully with ID:', docRef.id);

    return { id: docRef.id };

  } catch (error) {
    console.error("Error adding loan application:", error);
    throw error;
  }
};

// Function to fetch the latest application
export const fetchLatestApplication = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found");
  }

  try {
    const applicationsRef = collection(db, 'users', user.uid, 'applications');
    const latestApplicationQuery = query(applicationsRef, orderBy('submissionDate', 'desc'), limit(1));
    const querySnapshot = await getDocs(latestApplicationQuery);

    if (!querySnapshot.empty) {
      const latestApplication = querySnapshot.docs[0].data();
      console.log('Latest application:', latestApplication);
      return latestApplication;
    } else {
      console.log('No applications found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching latest application:', error);
    throw error;
  }
};

export { app, auth, db, googleProvider };
