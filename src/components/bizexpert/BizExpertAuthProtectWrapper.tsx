"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import { getBusiness, isAuthenticated } from "@/lib/bizexpert/auth";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";

export function BizExpertAuthProtectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading } = useBizExpertAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!isAuthenticated()) {
      router.replace(routes.LOGIN);
      return;
    }
    if (!getBusiness()) {
      router.replace(routes.ONBOARDING_BUSINESS);
    }
  }, [mounted, isLoading, router]);

  if (!mounted || isLoading) {
    return null;
  }

  if (!isAuthenticated() || !getBusiness()) {
    return null;
  }

  return <>{children}</>;
}
