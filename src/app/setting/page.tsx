'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Lock, User, Mail, Smartphone, MessageSquare, Shield, Key, CreditCard, ChevronRight, CircleHelp, Building, Plus, User2 } from "lucide-react"
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Setting() {
  const { user, loading } = useAuth();
  const router = useRouter();

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


  // Mock data for financial metrics
  const financialMetrics = {
    averageDailyBalance: 15000,
    averageMonthlyDeposits: 50000,
    averageMonthlyExpenses: 45000,
    negativeDays: 3,
    cashFlow: 5000,
    projectedCashFlow: 7000,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-16">
        <h1 className="text-3xl font-bold">Settings</h1>
        {/* <Button>Save all changes</Button> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Account Information
            </CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              <Input id="username" name="username" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue="john@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" defaultValue="+1 (555) 123-4567" type="text" />
            </div>
            <div className='space-y-2'>
            <Button>Update Account</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
              </div>
              <Switch id="marketing-emails" />
            </div>
           
          </CardContent>
          <CardFooter>
            
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-4 w-4" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your security preferences here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              </div>
              <Switch id="two-factor" />
            </div>
          </CardContent>
          <CardFooter>
          
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Billing
            </CardTitle>
            <CardDescription>Manage your billing information and subscriptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Current Plan: Business Pro</Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Upgrade </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select defaultValue='visa'>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa ending in 1234</SelectItem>
                  <SelectItem value="mastercard">Mastercard ending in 5678</SelectItem>
                  <SelectItem value="amex">American Express ending in 9012</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 ">
              <Button className='w-full bg-white-500 border border-gray-300 text-black hover:bg-white-600 mt-16'>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
                 Update Billing Information
                 <ChevronRight className="h-8 w-8 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Connected Bank Accounts

            </CardTitle>
            <CardDescription>Manage your connected bank accounts via Plaid or Decision Logic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Chase Business Checking (...1234) </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Disconnect </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Wells Fargo Savings (...5678) </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Disconnect </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Bank of America Business (...9012) </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Disconnect </Button>
            </div>
            <div className="space-y-2 ">
              <Button className='w-full bg-white-500 border border-gray-300 text-black hover:bg-white-600 mt-16'>
              <Plus className="h-8 w-8 text-muted-foreground" />
              Connect New Bank Account
                 <ChevronRight className="h-8 w-8 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
            Connected Accounts
            </CardTitle>
            <CardDescription>Manage your connected accounts and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User2 className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">QuickBooks </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Disconnect </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User2 className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Xero </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Connect </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User2 className="h-8 w-8 text-muted-foreground" />
                <Label htmlFor="email-notifications">Stripe </Label>
              </div>
              <Button id="upgrade" className='bg-white-500 border border-gray-500 text-black hover:bg-white-600'> Connect </Button>
            </div>

          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>



        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
            
              Help & Support
            </CardTitle>
            <CardDescription>Get help and find answers to your questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">            
            <div className="space-y-2 ">
              <Button className='w-full bg-white-500 border border-gray-300 text-black hover:bg-white-600 mt-4'>
              <CircleHelp className="h-14 w-14 text-muted-foreground mr-5" />
                FAQs
                 <ChevronRight className="h-8 w-8 text-muted-foreground"/>
              </Button>
            </div>

            <div className="space-y-2 ">
              <Button className='w-full bg-white-500 border border-gray-300 text-black hover:bg-white-600 mt-4'>
              <CircleHelp className="h-14 w-14 text-muted-foreground mr-5" />
              Contact Support
                 <ChevronRight className="h-8 w-8 text-muted-foreground"/>
              </Button>
            </div>


            <div className="space-y-2 ">
              <Button className='w-full bg-white-500 border border-gray-300 text-black hover:bg-white-600 mt-4'>
              <CircleHelp className="h-14 w-14 text-muted-foreground mr-5" />
              User Guide
                 <ChevronRight className="h-8 w-8 text-muted-foreground"/>
              </Button>
            </div>

          </CardContent>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">

        <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}