import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DashboardBack() {
    return(
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        <Link href="/dashboard" className="flex items-center text-gray-900 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
          <ArrowLeft width={20} height={20} className="ml-2 mr-4"/>  Back to Dashboard
        </Link>
      </div>
    );
}