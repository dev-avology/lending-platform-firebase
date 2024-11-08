'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';

export default function Loan() {
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
      <h1 className="text-3xl font-bold">Loan</h1>
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