/**
 * Client-side validation utilities for KisanMitra forms.
 *
 * Phone numbers are stored as strings (never numeric).
 * Email validation uses a standard regex pattern.
 */

/**
 * Indian mobile number regex.
 *
 * Accepted formats:
 *   9876543210
 *   +919876543210
 *   +91 98765 43210
 *   +91-98765-43210
 *   091 9876543210
 *
 * The core requirement: 10-digit number starting with 6-9,
 * optionally prefixed by +91 / 091 with optional spaces/hyphens.
 */
const INDIAN_PHONE_REGEX = /^(?:\+91[\s-]?|091[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;

/**
 * Standard email regex (RFC 5322 simplified).
 * Requires: local-part @ domain . tld (at least 2 chars).
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate an Indian mobile phone number.
 * Returns an error message string, or empty string if valid.
 */
export function validatePhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Phone number is required.";
  }
  if (!INDIAN_PHONE_REGEX.test(trimmed)) {
    return "Enter a valid Indian mobile number (e.g. 9876543210 or +91 98765 43210).";
  }
  return "";
}

/**
 * Validate an email address.
 * Returns an error message string, or empty string if valid.
 */
export function validateEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Enter a valid email address (e.g. farmer@example.com).";
  }
  return "";
}

/**
 * Map a Firebase Auth error code to a user-friendly message.
 * Keeps raw Firebase errors from leaking to the UI.
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  const code: string = error?.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Password must be at least 8 characters.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";

    default:
      return "Unable to complete the request. Please try again.";
  }
}
