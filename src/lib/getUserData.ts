// src/lib/getUserData.ts
import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { UserData } from '@/types/user'

export async function getUserData(uid: string): Promise<UserData | null> {
  const userDocRef = doc(db, 'users', uid)
  const userDoc = await getDoc(userDocRef)
  return userDoc.exists() ? (userDoc.data() as UserData) : null
}
