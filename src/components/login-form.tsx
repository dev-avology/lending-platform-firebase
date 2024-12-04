'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { GoogleAuthButton } from './ui/google-auth-button'
import Link from 'next/link'
import { Logo } from './icons/logo'
import { ArrowRight } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  const validatePassword = () => {

    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (!isEmailValid || !isPasswordValid) return

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch{
      setLoginError('Failed to log in. Please check your credentials.')
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-center mb-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">Welcome back! Please enter your details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <Input
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Button type="submit" className="w-full">
                Log in <ArrowRight className="icon" />
              </Button>
            </div>
          </div>
          {/* Login Error */}
          {loginError && <p className="text-red-500 mt-2">{loginError}</p>}

          </form>
          <CardFooter className="flex flex-col items-center gap-4 mt-4">

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="relative w-full">
              <GoogleAuthButton />
            </div>
            <p className="text-sm text-muted-foreground">
              {`Don't have an account?`}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Forgot your password?{' '}
              <Link href="/forgot-password" className="text-primary hover:underline">
                Reset here
              </Link>
            </p>
          </CardFooter>
        
      </CardContent>
    </Card>
  )
}
