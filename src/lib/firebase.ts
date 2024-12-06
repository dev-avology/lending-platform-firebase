/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData } from "@/types/user";
import { 
  initializeApp, getApps, getApp 
} from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  sendPasswordResetEmail, signOut, UserCredential
} from "firebase/auth";
import { 
  getFirestore, doc, setDoc, collection, addDoc, 
  query, orderBy, limit, getDocs, Timestamp, getDoc, where, updateDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/** Authentication Methods */
export const register = (email: string, password: string): Promise<UserCredential> => 
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string): Promise<UserCredential> => 
  signInWithEmailAndPassword(auth, email, password);

export const logout = (): Promise<void> => signOut(auth);

export const signInWithGoogle = (): Promise<UserCredential> => signInWithPopup(auth, googleProvider);

export const recoverPassword = (email: string): Promise<void> =>  sendPasswordResetEmail(auth, email);

  /** Firestore Operations */
export const saveDocument = async (path: string, data: object) => {
    try {
      await setDoc(doc(db, path), data);
      console.log(`Document saved to path: ${path}`);
    } catch (error) {
      console.log(`Error saving document at ${path}:`, error);
    }
};


export const saveUserData = async (userId: string, formData: UserData) => {

  const data = { ...formData, createdAt: Timestamp.now(), registrationComplete: true };
  await saveDocument(`users/${userId}`, data);
  
};

export const getUserData = async (uid: string) => {
  try {
    const docRef = doc(db, `users/${uid}`);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log('No user data found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.log('Error fetching user data:', error);
    return null;
  }
};

export const updateUserProfile = async (userData: UserData) => {
  try {
    console.log(userData);

    const userRef = doc(db, 'users', userData.uid);

    // Create an update object with only the fields to be updated
    const updateData: Partial<UserData> = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      businessName: userData.businessName,
      businessAddress: userData.businessAddress,
      industry: userData.industry,
      bio:userData.bio
    };

    // Ensure that optional fields like photoURL are included only if they exist
    if (userData.photoURL) {
      updateData.photoURL = userData.photoURL;
    }
    
    console.log(updateData);

    await updateDoc(userRef, updateData);
    console.log('Profile updated successfully!');
  } catch (error) {
    console.log('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
};

/** Loan Application Methods */
export const saveLoanApplication = async (data: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  try {
    const applicationsRef = collection(db, `users/${user.uid}/applications`);
    const inProgressQuery = query(applicationsRef, where('status', '==', 'In Progress'));
    const querySnapshot = await getDocs(inProgressQuery);

    if (!querySnapshot.empty) {
      console.log('An application is already in progress.');
      return null;
    }

    const application = {
      ...data,
      userId: user.uid,
      submissionDate: Timestamp.now(),
      status: 'In Progress',
      loanAmount: data.grossAnnualSales ? parseFloat(data.grossAnnualSales) * 0.1 : 0,
    };

    const docRef = await addDoc(applicationsRef, application);
    console.log('Loan application saved with ID:', docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.log("Error saving loan application:", error);
    throw error;
  }
};

export const fetchLatestApplication = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  try {
    const applicationsRef = collection(db, `users/${user.uid}/applications`);
    const latestQuery = query(applicationsRef, orderBy('submissionDate', 'desc'), limit(1));
    const querySnapshot = await getDocs(latestQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      console.log('No applications found.');
      return null;
    }
  } catch (error) {
    console.log('Error fetching latest application:', error);
    throw error;
  }
};

export { app, auth, db, googleProvider };
