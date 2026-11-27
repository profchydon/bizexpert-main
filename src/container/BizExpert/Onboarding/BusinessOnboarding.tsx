"use client";

import { useEffect } from "react";
import { getBusiness } from "@/lib/bizexpert/auth";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { BizExpertLoginPanel } from "@/container/BizExpert/Auth/BizExpertLoginPanel";
import {
  bizExpertLoginFormColumnClass,
  bizExpertLoginFormShellClass,
  bizExpertLoginMobileBrandClass,
  bizExpertLoginPageClass,
} from "@/container/BizExpert/Auth/bizExpertLoginClasses";
import { BusinessOnboardingForm } from "./BusinessOnboardingForm";

export default function BusinessOnboarding() {
  const { user, business, isLoading } = useBizExpertAuth();
  const { replace } = useTransitionRouter();

  useEffect(() => {
    if (isLoading) return;
    if (business ?? getBusiness()) {
      replace(routes.OVERVIEW);
    }
  }, [business, isLoading, replace]);

  if (isLoading || business || getBusiness()) {
    return null;
  }

  return (
    <div className={bizExpertLoginPageClass}>
      <BizExpertLoginPanel />
      <div className={bizExpertLoginFormColumnClass}>
        <p className={bizExpertLoginMobileBrandClass}>BizExpert</p>
        <div className={bizExpertLoginFormShellClass}>
          <BusinessOnboardingForm needsAccount={!user} />
        </div>
      </div>
    </div>
  );
}
