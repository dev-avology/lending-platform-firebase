'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, Lock, CreditCard, User, HelpCircle, ChevronRight } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardBack } from '@/components/dashboard-back';
import PlaidConnectButton from '@/components/plaid/PlaidConnectButton';
import PlaidConnectAccount from '@/components/plaid/PlaidConnectAccount';
import { useUser } from '@/contexts/UserContext';

export default function Setting() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { userData,loading:userLoading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading && userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          {/* Navigation bar code (same as in Dashboard.tsx) */}
        </nav>
  
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
  
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={`${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()} />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={userData?.email || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={userData?.phoneNumber || ''} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Email Notifications</span>
                    </Label>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications" className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>SMS Notifications</span>
                    </Label>
                    <Switch id="sms-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Push Notifications</span>
                    </Label>
                    <Switch id="push-notifications" />
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your billing information and subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Current Plan: Business Pro</span>
                    </div>
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select defaultValue="visa">
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa ending in 1234</SelectItem>
                        <SelectItem value="mastercard">Mastercard ending in 5678</SelectItem>
                        <SelectItem value="amex">American Express ending in 9012</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Billing Information
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Connected Bank Accounts</CardTitle>
                  <CardDescription>Manage your connected bank accounts via Plaid or Decision Logic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PlaidConnectAccount />
                  <PlaidConnectButton />
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected accounts and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>QuickBooks</span>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Xero</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Stripe</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help and find answers to your questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      FAQs
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Contact Support
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      User Guide
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <DashboardBack />

        </main>
      </div>
    );
}