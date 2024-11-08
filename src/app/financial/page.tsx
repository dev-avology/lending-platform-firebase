'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';

export default function Financial() {
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
      <h1 className="text-3xl font-bold mb-16">Financial Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Average Daily Balance</CardTitle>
      <DollarSign className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${financialMetrics.averageDailyBalance.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Average Monthly Deposits</CardTitle>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${financialMetrics.averageMonthlyDeposits.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">+180.1% from last month</p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Average Monthly Expenses</CardTitle>
      <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${financialMetrics.averageMonthlyExpenses.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">+19% from last month</p>
    </CardContent>
  </Card>
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Negative Balance Days</CardTitle>
      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{financialMetrics.negativeDays.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">+19% from last month</p>
    </CardContent>
  </Card>
</div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { user: "Term Loan", amount: 195000, interest: 5.5, term: "5 year", time: "7/15/2023" },
                { user: "Line of Credit", amount: 195000, interest: 5.5, term: "5 year", time: "7/15/2023" },
                { user: "personel", amount: 195000, interest: 5.5, term: "5 year", time: "7/15/2023" }
              ].map((item, index) => (
                <div key={index} className="flex items-center py-4 border-b last:border-b-0">
                  <div className="space-y-1">
                    <p className="text-md font-medium leading-none">{item.user}</p>
                    <p className="text-sm text-muted-foreground">Amount: ${item.amount} | Interest Rate: {item.interest}%</p>
                    <p className="text-sm text-muted-foreground">Term: {item.term}</p>
                  </div>
                  <div className="ml-auto font-medium">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
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