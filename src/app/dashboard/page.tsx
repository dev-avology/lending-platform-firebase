'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, CreditCard, DollarSign, Banknote} from "lucide-react"

export default function Dashboard() {
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

  return (
<div className="space-y-6">
<h1 className="text-3xl font-bold">Dashboard</h1>

<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Current Loan Balance</CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">No active loans</div>
      {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Line of Credit</CardTitle>
      <Activity className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">Not available</div>
      {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Term Loan</CardTitle>
      <CreditCard className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">No active term loan</div>
      {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
    </CardContent>
  </Card>
</div>
<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
  
<Button className="w-full">
              <Banknote className="mr-2 h-4 w-4" /> Get Funding
  </Button>
  </div>
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
  <Card className="col-span-7">
    <CardHeader>
      <CardTitle>Business Credit Score</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        {/* {[
          { user: "Olivia Martin", action: "Subscribed to Pro Plan", time: "1h ago" },
          { user: "Jackson Lee", action: "Submitted a bug report", time: "2h ago" },
          { user: "Isabella Nguyen", action: "Upgraded to Business Plan", time: "3h ago" },
          { user: "William Kim", action: "Cancelled subscription", time: "4h ago" },
        ].map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{item.user}</p>
              <p className="text-sm text-muted-foreground">{item.action}</p>
            </div>
            <div className="ml-auto font-medium">{item.time}</div>
          </div>
        ))} */}
              <div className="text-xs text-muted-foreground">No credit score data available yet. Complete your profile to get started.</div>
      </div>
    </CardContent>
  </Card>
</div>
</div>
  );
}