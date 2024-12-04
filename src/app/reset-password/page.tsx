/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [perror, pSetError] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oobCode) {
            setErrorMessage('Invalid or expired reset link.');
            return;
        }
        if (newPassword == '' || confirmPassword == '') {
            setErrorMessage('fill the required fields');
            pSetError(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            pSetError(true);
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('Password should be at least 6 characters.');
            return;
        }

        try {
            setIsSubmitting(true);
            await verifyPasswordResetCode(auth, oobCode); // Verify the reset code
            await confirmPasswordReset(auth, oobCode, newPassword); // Reset the password

            setSuccessMessage('Password has been reset successfully. You can now log in.');
            setErrorMessage(null);
            setTimeout(() => router.push('/login'), 3000); // Redirect to login page after success
        } catch (error: any) {
            const errorMsg =
                error.code === 'auth/invalid-action-code'
                    ? 'Invalid or expired reset link.'
                    : 'Failed to reset password. Please try again later.';
            setErrorMessage(errorMsg);
            setSuccessMessage(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Card className="w-[350px]">
                <CardHeader>
                    <div className="flex items-center justify-center mb-2">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center"> Enter your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={perror ? `border-red-300` : ``}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={perror ? `border-red-300` : ``}

                            />
                        </div>
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                        <CardFooter className="flex flex-col items-center gap-4 mt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Setting Password...' : 'Set Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}