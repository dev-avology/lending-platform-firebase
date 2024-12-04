/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GoogleIcon } from './icons/GoogleIcon';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserData } from '@/types/user';

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [gerror, setGError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | null }>({});
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
    { title: 'Business Information', description: 'Tell us about your business' },
  ];

  const industries = [
    'Accounting', 'Advertising', 'Agriculture', 'Apparel accessories',
    'Transportation', 'Travel', 'Uniform', 'Veterinary', 'Waste',
    'Wholesaler', 'Wine spirits',
  ];

  const validateFields = (fields: Partial<UserData & { password?: string; confirmPassword?: string }>) => {
    const errors: { [key: string]: string | null } = {};

    if (step === 0) {
      if (!fields.firstName) errors.firstName = 'First Name is required';
      if (!fields.lastName) errors.lastName = 'Last Name is required';
      if (!fields.email) errors.email = 'Email is required';
      if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errors.email = 'Please enter a valid email';
      }
      if (!fields.phoneNumber) errors.phoneNumber = 'Phone Number is required';
    }

    if (step === 1) {
      if (!fields.username) errors.username = 'Username is required';
      if (type === 'email') {
        if (!fields.password) errors.password = 'Password is required';
        if (fields.password && fields.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        if (fields.password !== fields.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    if (step === 2) {
      if (!fields.dateOfBirth) errors.dateOfBirth = 'Date of Birth is required';
      if (!fields.ssn) errors.ssn = 'Social Security Number is required';
    }

    if (step === 3) {
      if (!fields.businessName) errors.businessName = 'Business Name is required';
      if (!fields.businessAddress) errors.businessAddress = 'Business Address is required';
      if (!fields.industry) errors.industry = 'Industry is required';
    }

    return errors;
  };

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
      setGError('Failed to sign in with Google');
    }
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields across all steps
    const errors = validateFields(formData);
    setFieldErrors(errors);
  
    if (Object.values(errors).some((error) => error !== null)) {
      setError('Please fix the errors to proceed.');
      return;
    }
  
    try {
      let user = auth.currentUser;
  
      // If the user is not signed in and using email/password, create the user
      if (!user && formData.password) {
        const userCredential = await register(formData.email, formData.password);
        user = userCredential.user;
  
        // Send email verification
        await sendEmailVerification(user);
      }
  
      if (user) {
        // Clean up data for storage

        delete formData.password;
        delete formData.confirmPassword;

        const userData: UserData = {
          ...formData,
          uid: user.uid,
          photoURL: formData.photoURL || `data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#808080"/><text x="50" y="50" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">N</text></svg>`
          )}`,
          registrationComplete: true,
        };
  
      
  
        // Save user data to Firestore
        await saveUserData(user.uid, userData);
  
        if (!user.emailVerified) {
          await logout();
          alert('A verification email has been sent. Please verify your email before logging in.');
          router.push('/login');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      let errorMessage ; 
      const errors: { [key: string]: string | null } = {};
        switch(error.code){
          case 'auth/email-already-in-use': 
           errorMessage = `This email is already in use.`;
           errors.email = errorMessage;
           setFieldErrors({});
           setFieldErrors(errors);
           setStep(0);
           break;
          default:
            errorMessage = `Failed to create an account. Please try again later.`;
        }
    setError(errorMessage);
    }
  };
  

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isStepValid = () => {
    const errors = validateFields(formData);
    setFieldErrors(errors);
    return Object.values(errors).every((error) => error === null);
  };

  const handleNextStep = () => {
    if (isStepValid()) {
      setStep((s) => s + 1);
      setError(null);
    } else {
      setError('Please fix the errors to proceed.');
    }
  };

  const handlePreviousStep = () => {
    setStep((s) => s - 1);
    setError(null);
  };

  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Input id="firstName" className={fieldErrors.firstName ? `border-red-300`:'' } name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
            <Input id="lastName" className={fieldErrors.lastName ? `border-red-300`:'' } name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
            <Input id="email" name="email"  className={fieldErrors.email ? `border-red-300`:'' } placeholder="Email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input id="phoneNumber" className={fieldErrors.phoneNumber ? `border-red-300`:'' } name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} />
          </>
        );
      // Continue similar logic for other steps
      case 1:
        return (
          <>
            <Input id="username" name="username" placeholder="Username"  className={fieldErrors.username ? `border-red-300`:'' } value={formData.username} onChange={handleInputChange} />
            {type === 'email' && (
              <>
                <Input id="password" name="password" placeholder="Password"  className={fieldErrors.password ? `border-red-300`:'' } type="password" value={formData.password} onChange={handleInputChange} />
                <Input id="confirmPassword" name="confirmPassword" className={fieldErrors.confirmPassword ? `border-red-300`:'' } placeholder="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleInputChange} />

              </>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Input id="dateOfBirth"  className={fieldErrors.dateOfBirth ? `border-red-300`:'' } name="dateOfBirth" placeholder="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
            <Input id="ssn" className={fieldErrors.ssn ? `border-red-300`:'' } name="ssn" placeholder="Social Security Number" value={formData.ssn} onChange={handleInputChange} />
          </>
        );
      case 3:
        return (
          <>
            <Input id="businessName" name="businessName" placeholder="Business Name"  className={fieldErrors.businessName ? `border-red-300`:'' } value={formData.businessName} onChange={handleInputChange} />

            <Input id="businessAddress"   className={fieldErrors.businessAddress ? `border-red-300`:'' } name="businessAddress" placeholder="Business Address" value={formData.businessAddress} onChange={handleInputChange} />

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
        <form onSubmit={handleSubmit} >
          <div className="grid gap-4">{renderStepFields()}</div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex flex-col items-center gap-4 mt-4">
          {step > 0 && <Button className="w-full" onClick={handlePreviousStep}><ArrowLeft /> Back</Button>}
            {step < 3 ? (
              <Button className="w-full" onClick={handleNextStep}>Next <ArrowRight /></Button>
            ) : (
              <Button className="w-full" type="submit">Finish <Check /></Button>
            )}
          </div>
        </form>
          <CardFooter className="flex flex-col items-center gap-4 mt-4">
          {step === 0 && (
              <>
                <div className="relative w-full">
                  <div>
                    <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
                      <GoogleIcon /> <span>Signup with Google</span>
                    </Button>
                    {gerror && <p className="text-red-500 mt-2">{gerror}</p>}
                  </div>
                </div>
              </>
            )}
            <p className="text-sm">Already have an account? <Link href="/" className="text-primary hover:underline">Log in</Link></p>
          </CardFooter>

      </CardContent>
    </Card>
  );
}
