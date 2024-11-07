import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  signOut,
  UserCredential,
  User 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Firebase Authentication functions
export const register = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send email verification
  await sendEmailVerification(userCredential.user);
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

// Function to save user data in Firestore
export const saveUserData = async (
    userId: string,
    formData: {
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
  ) => {
    try {
      // Save user data to Firestore with userId as the document ID
      await setDoc(doc(db, 'users', userId), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        ssn: formData.ssn,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        industry: formData.industry,
        photoURL: formData.photoURL,
        createdAt: new Date(), // Store timestamp of when the user was created
        registrationComplete: true // Optionally add this flag
      });
  
      console.log('User data saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

export { app, auth, db,googleProvider };
