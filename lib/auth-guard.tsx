"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import { getUserProfile } from "@/lib/firestore";
import type { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login");
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);

        if (!allowedRoles.includes(profile.role)) {
          switch (profile.role) {
            case "FARMER":
              router.replace("/farmer");
              break;

            case "BUYER":
              router.replace("/buyer");
              break;

            case "ADMIN":
            case "FPO":
              router.replace("/admin");
              break;

            default:
              router.replace("/login");
          }

          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router, allowedRoles]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}