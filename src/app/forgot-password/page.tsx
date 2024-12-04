/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

export default function ForgotPassword() {
    
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!email) {
          setError('Please enter your email address.');
          return;
        }
    
        try {
          await sendPasswordResetEmail(auth, email);
          setSuccess('Password reset email has been sent. Please check your inbox.');
          setError(null);
          setEmail(''); // Clear the email field after success
        } catch (error: any) {
          const errorMessage =
            error.code === 'auth/user-not-found'
              ? 'No account found with this email.'
              : 'Failed to send reset email. Please try again later.';
          setError(errorMessage);
          setSuccess(null);
        }
      };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Card className="w-[350px]">
                <CardHeader>
                    <div className="flex items-center justify-center mb-2">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center"> Enter your email address to reset your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        <CardFooter className="flex flex-col items-center gap-4 mt-4">
                            <Button type="submit" className="w-full">
                                Send Reset Email
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}