import { redirect } from "next/navigation";
import { isBizExpertApp } from "@/config/product";
import routes from "@/routes";
import BusinessOnboarding from "@/container/BizExpert/Onboarding/BusinessOnboarding";

export default function OnboardingBusinessPage() {
  if (!isBizExpertApp()) {
    redirect(routes.ONBOARDING);
  }
  return <BusinessOnboarding />;
}
