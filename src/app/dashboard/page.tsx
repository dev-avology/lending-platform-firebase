'use client'
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'
import { Home, Briefcase, PieChart, Settings, Bell, X, User, CreditCard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/lib/firebase'
import { useUser } from '@/contexts/UserContext'
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/icons/UserAvatar'
import { HeaderLogo } from '@/components/icons/Headerlogo'


const creditScoreData = [
  { month: 'Jan', score: 620 },
  { month: 'Feb', score: 640 },
  { month: 'Mar', score: 655 },
  { month: 'Apr', score: 670 },
  { month: 'May', score: 685 },
  { month: 'Jun', score: 700 },
]

const notifications = [
  { id: 1, message: 'Your loan application has been approved', time: '2 hours ago' },
  { id: 2, message: 'New credit score update available', time: '1 day ago' },
  { id: 3, message: 'Upcoming payment due in 3 days', time: '2 days ago' },
]

export default function Dashboard() {

  const { userData } = useUser();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen)
    if (isProfileOpen) setIsProfileOpen(false)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    if (isNotificationOpen) setIsNotificationOpen(false)
  }


  
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

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logout(); // Assuming you have signOut defined in your firebase helper file
      router.push('/login'); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center mr-8">
              <span className="sr-only">Your Company</span>
              <HeaderLogo width={80} height={80} />
            </Link>

              <div className="ml-10 flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Home
                </Link>
                <Link href="/loan" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Loan
                </Link>
                <Link href="/financial" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <PieChart className="mr-2 h-5 w-5" /> Financial
                </Link>
                <Link href="/setting" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black" 
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
                    <div className="py-2">
                      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        <button onClick={toggleNotifications} className="text-gray-400 hover:text-gray-500">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-900 text-sm font-medium">Hello, Dayten</p>
              <div className="relative">

              <Button  onClick={toggleProfile} variant="ghost" className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out" size="icon">
                  <UserAvatar imageUrl={userData?.photoURL} size={50} />
                </Button>

               
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                    <div className="py-1 bg-white rounded-md shadow-xs">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <User className="mr-3 h-5 w-5 text-gray-400" /> Your Profile
                      </Link>
                      <Link href="/loan-status" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <CreditCard className="mr-3 h-5 w-5 text-gray-400" /> Loan Status
                      </Link>
                      <Link href="/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Settings className="mr-3 h-5 w-5 text-gray-400" /> Settings
                      </Link>
                      <Link href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" /> Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Current Loan Balance
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  $245,000
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Line of Credit
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  $50,000
                </dd>
                <p className="mt-2 text-sm text-gray-500">Available: $30,000</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Term Loan
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  $195,000
                </dd>
                <p className="mt-2 text-sm text-gray-500">5-year term</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-start mb-4">
            <button className="bg-black text-white px-6 py-3 rounded-md text-lg font-medium">
              Get Funding
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Credit Score</h2>
            <div className="bg-white p-6 rounded-lg shadow" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creditScoreData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[400, 800]} 
                    ticks={[400, 500, 600, 700, 800]} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f3f4f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f3f4f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="none" fillOpacity={1} fill="url(#colorScore)" />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#ff0000" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#fff', stroke: '#ff0000', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#ff0000', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}