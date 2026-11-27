import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BusinessOnboardingValues } from "./businessOnboardingSchema";

type Props = {
  register: UseFormRegister<BusinessOnboardingValues>;
  errors: FieldErrors<BusinessOnboardingValues>;
};

export function BusinessOnboardingFields({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          {...register("businessName")}
          autoComplete="organization"
          placeholder="Okeke General Stores"
        />
        {errors.businessName && (
          <p className="text-xs text-error-primary">
            {errors.businessName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Business phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          autoComplete="tel"
          placeholder="+2348012345678"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Business email</Label>
        <Input
          id="email"
          {...register("email")}
          type="email"
          autoComplete="organization"
          placeholder="contact@business.ng"
        />
        {errors.email && (
          <p className="text-xs text-error-primary">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address")}
          autoComplete="street-address"
          placeholder="14 Broad Street, Lagos"
        />
      </div>
    </div>
  );
}
