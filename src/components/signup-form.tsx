'use client';

import { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth, db, logout, register, saveUserData, signInWithGoogle } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from './icons/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GoogleIcon } from './icons/GoogleIcon';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserData } from '@/types/user'; // Import UserData type

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [type, setType] = useState<'email' | 'google'>('email');
  const router = useRouter();

  const [formData, setFormData] = useState<UserData & { password?: string; confirmPassword?: string }>({
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    ssn: '',
    businessName: '',
    businessAddress: '',
    industry: '',
    createdAt: null,
    photoURL: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#808080"/><text x="50" y="50" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">N</text></svg>`)}`,
    registrationComplete: false,
  });

  const steps = [
    { title: 'Sign Up', description: 'Create your account' },
    { title: 'Account Details', description: 'Set up your login information' },
    { title: 'Personal Information', description: 'Tell us about yourself' },
    { title: 'Business Information', description: 'Tell us about your business' }
  ];

  const industries = [
    'Accounting', 'Advertising', 'Agriculture', 'Animal boarding', 'Apparel accessories',
    // List truncated for brevity...
    'Transportation', 'Travel', 'Uniform', 'Veterinary',
    'Waste', 'Wholesaler', 'Wine spirits'
  ];

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userData: Partial<UserData> = {
          uid:user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#808080"/><text x="50" y="50" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">N</text></svg>`)}`,
        };
        setFormData({ ...formData, ...userData });

        await setDoc(doc(db, 'users', user.uid), userData);

        setStep(0);
        setType('google');
      } else {
        await logout();
        alert('An account with this Google email already exists. Please log in.');
        router.push("/login");
      }
    } catch {
      setError('Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid(3)) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      let user = auth.currentUser;

      if (!user && formData.password) {
        const userCredential = await register(formData.email, formData.password);
        user = userCredential.user;
        await sendEmailVerification(user);
      }

      delete formData.password;
      delete formData.confirmPassword;
      if (user) {
      const userData: UserData = {
        ...formData,
        uid:user.uid,
        registrationComplete: true,
        photoURL: formData.photoURL || `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#808080"/><text x="50" y="50" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">N</text></svg>`)}`,
      };
        await saveUserData(user.uid, userData);
        if (!user.emailVerified) {
          await logout();
          alert('A verification email has been sent to your email address. Please verify your email before logging in.');
          router.push("/login");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError('Failed to create an account');
    }
  };

  const isStepValid = (stepIndex: number) => {
    const validations = {
      0: !!(formData.firstName && formData.lastName && formData.email && formData.phoneNumber),
      1: !!(formData.username && (type === 'google' || (formData.password && formData.password === formData.confirmPassword))),
      2: !!(formData.dateOfBirth && formData.ssn),
      3: !!(formData.businessName && formData.businessAddress && formData.industry),
    } as { [key: number]: boolean };

    return validations[stepIndex];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UserData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Input id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <Input id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <Input id="email" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleInputChange} required />
            <Input id="phoneNumber" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
          </>
        );
      case 1:
        return (
          <>
            <Input id="username" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
            {type === 'email' && (
              <>
                <Input id="password" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleInputChange} required />
                <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
              </>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Input id="dateOfBirth" name="dateOfBirth" placeholder="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
            <Input id="ssn" name="ssn" placeholder="Social Security Number" value={formData.ssn} onChange={handleInputChange} required />
          </>
        );
      case 3:
        return (
          <>
            <Input id="businessName" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleInputChange} required />
            <Input id="businessAddress" name="businessAddress" placeholder="Business Address" value={formData.businessAddress} onChange={handleInputChange} required />
            <Select
              name="industry"
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  industry: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        );
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-center mb-2"><Logo /></div>
        <CardTitle className="text-2xl font-bold text-center">{steps[step].title}</CardTitle>
        <CardDescription className="text-center">{steps[step].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">{renderStepFields()}</div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <CardFooter className="flex flex-col items-center gap-4 mt-4">
            {step === 0 && (
              <>
                <div className="relative w-full">
                  <div>
                    <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
                      <GoogleIcon /> <span>Sign in with Google</span>
                    </Button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                </div>
              </>
            )}
            {step > 0 && <Button className="w-full" onClick={() => setStep((s) => Math.max(s - 1, 0))}><ArrowLeft /> Back</Button>}
            {step < 3 ? (
              <Button className="w-full" onClick={() => isStepValid(step) && setStep((s) => Math.min(s + 1, 3))}>Next <ArrowRight /></Button>
            ) : (
              <Button className="w-full" onClick={handleSubmit}>Finish <Check /></Button>
            )}
            <p className="text-sm">Already have an account? <Link href="/" className="text-primary hover:underline">Log in</Link></p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
