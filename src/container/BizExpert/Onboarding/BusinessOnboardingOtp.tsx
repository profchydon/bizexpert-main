"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { bizExpertLoginCardClass } from "@/container/BizExpert/Auth/bizExpertLoginClasses";
import { useOtpResendCountdown } from "./useOtpResendCountdown";

const OTP_LENGTH = 6;

type Props = {
  email: string;
  verifying: boolean;
  resending: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
};

export function BusinessOnboardingOtp({
  email,
  verifying,
  resending,
  onVerify,
  onResend,
}: Props) {
  const [otp, setOtp] = useState("");
  const countdown = useOtpResendCountdown();

  return (
    <div className={bizExpertLoginCardClass}>
      <div className="flex flex-col gap-y-2 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          Check your email
        </h1>
        <p className="text-sm text-gray-600">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <InputOTP maxLength={OTP_LENGTH} value={otp} onChange={setOtp}>
          <InputOTPGroup className="flex w-full justify-center gap-2">
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-12 w-10 rounded-lg border-2 text-center"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={otp.length !== OTP_LENGTH}
          isLoading={verifying}
          onClick={() => onVerify(otp)}
        >
          Verify email
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={countdown.isCounting}
          isLoading={resending}
          onClick={async () => {
            if (countdown.isCounting) return;
            await onResend();
            countdown.start();
          }}
        >
          <RefreshCw className="size-4" />
          {countdown.isCounting
            ? `Resend code in ${countdown.seconds}s`
            : "Resend code"}
        </Button>
      </div>
    </div>
  );
}
