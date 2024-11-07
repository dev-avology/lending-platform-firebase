'use client'

import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { db,auth, googleProvider, signInWithGoogle } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '../icons/GoogleIcon'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export function GoogleAuthButton() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGoogleAuth = async () => {
    try {
      const result =   await signInWithGoogle()

      const user = result.user
      console.log("Google sign-up successful, user:", user.uid)

      // Check if the user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      console.log("User document exists:", userDoc.exists())

      if (!userDoc.exists()) {
        console.log("New user, preparing initial data")
        // New user, prepare initial data and save to Firestore
        const userData = {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || ''
        }
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), userData)
        console.log("User data saved to Firestore")

      } else {

        
      }


      router.push('/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to sign in with Google')
    }
  }

  return (
    <div>
      <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
        <GoogleIcon /> <span>Sign in with Google</span>
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}