import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BusinessOnboardingValues } from "./businessOnboardingSchema";

type Props = {
  register: UseFormRegister<BusinessOnboardingValues>;
  errors: FieldErrors<BusinessOnboardingValues>;
};

export function BusinessOnboardingAccountFields({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ownerName">Your name</Label>
        <Input
          id="ownerName"
          {...register("ownerName")}
          autoComplete="name"
          placeholder="Ada Okeke"
        />
        {errors.ownerName && (
          <p className="text-xs text-error-primary">
            {errors.ownerName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="ownerEmail">Email</Label>
        <Input
          id="ownerEmail"
          {...register("ownerEmail")}
          type="email"
          autoComplete="email"
          placeholder="you@business.com"
        />
        {errors.ownerEmail && (
          <p className="text-xs text-error-primary">
            {errors.ownerEmail.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password")}
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        {errors.password && (
          <p className="text-xs text-error-primary">
            {errors.password.message}
          </p>
        )}
      </div>
    </div>
  );
}
