import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseService } from "@/lib/firebaseService";
import Link from "next/link";

export function GetFunding() {
  const { user } = useAuth();
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!user) return;

    try {
      // Fetch the pending application with the given condition
      const currentApplication = await firebaseService.getRecordByCondition(
        `users/${user.uid}/applications`,
        [["status", "==", "pending"]]
      );

      // Set the application ID or null if not found
      setCurrentApplicationId(currentApplication?.id || null);
    } catch (error) {
      console.error("Error fetching the current application:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const linkHref = currentApplicationId
    ? `/loan-application/${currentApplicationId}`
    : "/loan-application/";

  return (
    <div className="mt-8 flex justify-start mb-4">
      <Link
        href={linkHref}
        className="bg-black text-white px-6 py-3 rounded-md text-lg font-medium"
      >
        Get Funding
      </Link>
    </div>
  );
}
