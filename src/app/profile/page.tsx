'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Building, MapPin, Briefcase, Calendar, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/contexts/UserContext';
import { DashboardBack } from '@/components/dashboard-back';
import { UserData } from '@/types/user';
import { updateUserProfile } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userLoading } = useUser();
  const router = useRouter();
  const [avatar] = useState("/placeholder.svg?height=100&width=100");

  // Initialize form state with user data
  const [formData, setFormData] = useState<UserData>({
    uid: userData?.uid || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    username: userData?.username || '',
    dateOfBirth: userData?.dateOfBirth || '',
    ssn: userData?.ssn || '',
    businessName: userData?.businessName || '',
    businessAddress: userData?.businessAddress || '',
    industry: userData?.industry || '',
    createdAt: userData?.createdAt || null,
    photoURL: userData?.photoURL || '',
    bio: userData?.bio || '',
    registrationComplete: true,
  });


  const industries = [
    'Accounting', 'Advertising', 'Agriculture', 'Animal boarding', 'Apparel accessories',
    // List truncated for brevity...
    'Transportation', 'Travel', 'Uniform', 'Veterinary',
    'Waste', 'Wholesaler', 'Wine spirits'
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if no user
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        {/* Navigation bar code (same as in Dashboard.tsx) */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.photoURL || avatar} alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{formData.firstName} {formData.lastName} </CardTitle>
                  <CardDescription>Owner, {formData.businessName || 'Not provided'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{formData.phoneNumber || 'Not Provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-gray-500" />
                  <span>{formData.businessName || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{formData.businessAddress || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <span>{formData.industry || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Member since {formData.createdAt ? new Date(formData.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled={true}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={formData.businessAddress} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
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
                        <SelectValue placeholder={formData.industry}/>
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your business"
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
                <CardFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
        <DashboardBack />
      </main>
    </div>
  );
}
