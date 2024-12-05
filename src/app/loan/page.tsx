/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DollarSign, Calendar, FileText, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { DashboardBack } from '@/components/dashboard-back';

export default function Loan() {
  
  const { user, loading } = useAuth();
  const router = useRouter();

  // Mock data for loans
  const loans: any[] = []

  // const loans = [
  //   { id: 1, type: 'Term Loan', amount: 195000, interestRate: 5.5, term: '5 years', nextPayment: '2023-07-15' },
  //   { id: 2, type: 'Line of Credit', amount: 50000, interestRate: 7.0, available: 30000, nextPayment: '2023-07-20' },
  // ]

  // Mock data for payment history
  // const paymentHistory = [
  //   { date: '2023-06-15', amount: 3500, type: 'Payment' },
  //   { date: '2023-05-15', amount: 3500, type: 'Payment' },
  //   { date: '2023-04-15', amount: 3500, type: 'Payment' },
  //   { date: '2023-03-15', amount: 3500, type: 'Payment' },
  //   { date: '2023-02-15', amount: 3500, type: 'Payment' },
  //   { date: '2023-01-15', amount: 3500, type: 'Payment' },
  // ]

  const paymentHistory: any[] = []

  // Mock data for payment chart
  // const paymentChartData = [
  //   { month: 'Jan', payment: 3500 },
  //   { month: 'Feb', payment: 3500 },
  //   { month: 'Mar', payment: 3500 },
  //   { month: 'Apr', payment: 3500 },
  //   { month: 'May', payment: 3500 },
  //   { month: 'Jun', payment: 3500 },
  // ]


  const paymentChartData: any[] | undefined = []

  const [activeTab, setActiveTab] = useState('overview')

  const totalBalance = loans.reduce((sum, loan) => sum + loan.amount, 0)

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        {/* Navigation bar code (same as in Dashboard.tsx) */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Loan Details</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Loan Summary</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Balance</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${totalBalance.toLocaleString()}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Number of Active Loans</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{loans.length}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Next Payment Due</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                   {new Date(Math.min(...loans.map(loan => new Date(loan.nextPayment).getTime()))).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Active Loans</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {loans.map((loan) => (
                  <li key={loan.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{loan.type}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Amount: ${loan.amount.toLocaleString()} | Interest Rate: {loan.interestRate}%
                        </p>
                        {loan.term && (
                          <p className="mt-1 text-sm text-gray-500">Term: {loan.term}</p>
                        )}
                        {loan.available !== undefined && (
                          <p className="mt-1 text-sm text-gray-500">Available: ${loan.available.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Next payment: {new Date(loan.nextPayment).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Payment History</h2>
                <div className="flex space-x-4">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'details' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200">
              {activeTab === 'overview' ? (
                <div className="px-4 py-5 sm:p-6" style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="payment" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {paymentHistory.map((payment, index) => (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-gray-900">${payment.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-sm text-gray-500">{payment.type}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FileText className="mr-2 h-5 w-5" />
              Generate Statement
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Download className="mr-2 h-5 w-5" />
              Download CSV
            </button>
          </div>
        </div>
        <DashboardBack />

      </main>
    </div>
  );
}