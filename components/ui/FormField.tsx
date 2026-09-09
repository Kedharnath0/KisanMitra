import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export function FormField({
  label,
  error,
  helperText,
  children,
  htmlFor,
  required,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-km-neutral-700"
      >
        {label}
        {required && <span className="text-km-error ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-km-error mt-1">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-km-neutral-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

// Reusable Input and Select styling for the forms
export const inputStyles = "block w-full rounded-md border border-km-neutral-300 bg-white px-3 py-2 text-sm text-km-neutral-900 placeholder-km-neutral-400 focus:border-km-primary-500 focus:outline-none focus:ring-1 focus:ring-km-primary-500 disabled:bg-km-neutral-50 disabled:text-km-neutral-500";
