/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lock, ChevronRight } from 'lucide-react';
import { EmailAuthProvider,  reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface FormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const [hasPasswordProvider, setHasPasswordProvider] = useState(false);

  useEffect(() => {
    const checkProviders = () => {
      const hasPasswordProvider = auth.currentUser?.providerData.some(
        (provider) => provider.providerId === "password"
      ) || false; // Ensure it defaults to false
      setHasPasswordProvider(hasPasswordProvider);
    };

      checkProviders();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = (): boolean => {
    const { newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return false;
    }
    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast({
          title: 'Error',
          description: 'No user is signed in.',
          variant: 'destructive',
        });
        return;
      }

      if (isLoginRequired) {
        const credential = EmailAuthProvider.credential(formData.email, formData.currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
      }

      await updatePassword(currentUser, formData.newPassword);
      toast({
        title: 'Success',
        description: 'Password updated successfully.',
      });
      setIsOpen(false);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setIsLoginRequired(true);
      }
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password.',
        variant: 'destructive',
      });
    } finally {
      setFormData({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  if (!hasPasswordProvider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setIsLoginRequired(false); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and new password to update.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {isLoginRequired && (
              <>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Current password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            <Input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <DialogFooter>
          <div className="grid gap-4"><Button type="submit" className='mt-5'>Save Changes</Button></div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
