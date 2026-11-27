"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import routes from "@/routes";
import { bizExpertLoginCardClass } from "@/container/BizExpert/Auth/bizExpertLoginClasses";
import { BusinessOnboardingAccountFields } from "./BusinessOnboardingAccountFields";
import { BusinessOnboardingFields } from "./BusinessOnboardingFields";
import { BusinessOnboardingOtp } from "./BusinessOnboardingOtp";
import {
  businessOnboardingDefaults,
  businessOnboardingSchema,
  type BusinessOnboardingValues,
} from "./businessOnboardingSchema";
import { readBizExpertOnboardingError } from "./readBizExpertOnboardingError";
import {
  createOnboardingBusiness,
  registerOnboardingAccount,
  resendOnboardingOtp,
  verifyOnboardingEmail,
} from "./submitBusinessOnboarding";

type Props = {
  needsAccount: boolean;
};

export function BusinessOnboardingForm({ needsAccount }: Props) {
  const { persistSession, setBusiness } = useBizExpertAuth();
  const { push, isPending } = useTransitionRouter();
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [pending, setPending] = useState<BusinessOnboardingValues | null>(null);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const schema = useMemo(
    () => businessOnboardingSchema(needsAccount),
    [needsAccount],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessOnboardingValues>({
    resolver: zodResolver(schema),
    defaultValues: businessOnboardingDefaults,
  });

  const finish = async (values: BusinessOnboardingValues, token?: string) => {
    const business = await createOnboardingBusiness(
      bizexpertApi,
      values,
      token,
    );
    setBusiness(business);
    toast.success("Business created");
    push(routes.OVERVIEW);
  };

  const onSubmit = async (values: BusinessOnboardingValues) => {
    setSubmitting(true);
    try {
      if (!needsAccount) {
        await finish(values);
        return;
      }
      const { email } = await registerOnboardingAccount(bizexpertApi, values);
      setPending(values);
      setOtpEmail(email);
      toast.success("Check your email for the verification code");
    } catch (err) {
      toast.error(readBizExpertOnboardingError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async (otp: string) => {
    if (!pending || !otpEmail) return;
    setVerifying(true);
    try {
      const { user, token } = await verifyOnboardingEmail(
        bizexpertApi,
        otpEmail,
        otp,
      );
      persistSession(user, token);
      await finish(pending, token);
    } catch (err) {
      toast.error(readBizExpertOnboardingError(err, "Invalid or expired code"));
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    if (!otpEmail) return;
    setResending(true);
    try {
      await resendOnboardingOtp(bizexpertApi, otpEmail);
      toast.success("A new code was sent");
    } catch (err) {
      toast.error(
        readBizExpertOnboardingError(err, "Could not resend the code"),
      );
    } finally {
      setResending(false);
    }
  };

  if (otpEmail) {
    return (
      <BusinessOnboardingOtp
        email={otpEmail}
        verifying={verifying || isPending}
        resending={resending}
        onVerify={onVerify}
        onResend={onResend}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={bizExpertLoginCardClass}>
      <div className="flex flex-col gap-y-2 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          {needsAccount ? "Create your business" : "Set up your business"}
        </h1>
        <p className="text-sm text-gray-600">
          {needsAccount
            ? "Create an account and your first business. We will email a verification code."
            : "Add your business details. A main store is created for you."}
        </p>
      </div>
      <div className="space-y-6">
        {needsAccount ? (
          <BusinessOnboardingAccountFields
            register={register}
            errors={errors}
          />
        ) : null}
        <BusinessOnboardingFields register={register} errors={errors} />
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={submitting || isPending}
        >
          Continue
        </Button>
      </div>
      {needsAccount ? (
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={routes.LOGIN}
            className="font-semibold text-brand-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      ) : null}
    </form>
  );
}
