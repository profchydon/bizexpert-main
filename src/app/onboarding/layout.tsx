import { BizExpertAuthProvider } from "@/store/bizexpert/auth-context";
import { isBizExpertApp } from "@/config/product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: isBizExpertApp() ? "BizExpert | Onboarding" : "Rayda | Onboarding",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isBizExpertApp()) {
    return <BizExpertAuthProvider>{children}</BizExpertAuthProvider>;
  }
  return children;
}
