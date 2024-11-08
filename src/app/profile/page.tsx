'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Building, Calendar, Camera, Mail, MapPin, Phone, User } from "lucide-react"
import Link from 'next/link';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100")

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-left space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt="Profile picture" />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <div className='w-full'>
              <div className="flex flex-wrap justify-between space-x-5">
                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" />
                    <Label>User Name </Label>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-400" />
                    <Label>User@email.com </Label>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="text-gray-400" />
                    <Label>Not Provided </Label>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <Building className="text-gray-400" />
                    <Label>Not Provided </Label>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-gray-400" />
                    <Label>Not Provided </Label>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="text-gray-400" />
                    <Label>Industry </Label>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" />
                    <Label>Member since N/A </Label>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-left space-y-4">

            {isEditing && (
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                    <Camera className="h-4 w-4" />
                    <span>Change Avatar</span>
                  </div>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue="John Doe"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john@example.com"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue="I'm a software developer passionate about creating user-friendly applications."
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                defaultValue="San Francisco, CA"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                defaultValue="https://johndoe.com"
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isEditing && (
            <Button className="w-full">Save Changes</Button>
          )}
        </CardFooter>
      </Card>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">

        <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}