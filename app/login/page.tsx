"use client";

import React, { useState } from "react";
import { validateEmail, getFirebaseAuthErrorMessage } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useRole, RoleProvider } from "@/lib/role-context";
import "./login.css";
import { signInWithEmail } from "@/lib/auth";
import { getUserProfile } from "@/lib/firestore";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { setCurrentRole } = useRole();

const handleLoginSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const email = formData.get("email") as string;

  // Clear previous form-level error
  setFormError("");

  // Validate email before attempting Firebase auth
  const emailErr = validateEmail(email);
  if (emailErr) {
    setEmailError(emailErr);
    return;
  }
  const password = formData.get("password") as string;

  try {
    // 1. Authenticate with Firebase
    const credential = await signInWithEmail(email, password);

    // 2. Get the user's Firestore profile
    const profile = await getUserProfile(credential.user.uid);

    // 3. Use the stored role for routing
    setCurrentRole(profile.role);

    // 4. Redirect according to role
    switch (profile.role) {
      case "FARMER":
        router.push("/farmer");
        break;

      case "BUYER":
        router.push("/buyer");
        break;

      case "ADMIN":
        router.push("/admin");
        break;

      case "FPO":
        // No dedicated FPO dashboard yet.
        // Temporarily send FPO users to the admin dashboard.
        router.push("/admin");
        break;

      default:
        throw new Error("Invalid user role.");
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    setFormError(getFirebaseAuthErrorMessage(error));
  }
};

  return (
    <div className="page">
      {/* Form side */}
      <div className="form-side">
        <header>
          <div className="header-note">
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </div>
        </header>

        <main>
          <div className="panel">
            <div className="panel-head">
              <h2>Welcome back</h2>
              <p>Sign in to your KisanMitra account and stay connected.</p>
            </div>

            <form className="details" id="login-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="username"
                  required
                  className={emailError ? "input-error" : ""}
                  onBlur={(e) => {
                    const err = validateEmail(e.target.value);
                    setEmailError(err);
                  }}
                  onChange={() => setEmailError("")}
                />
                {emailError && (
                  <span className="field-error">{emailError}</span>
                )}
              </div>

              <div className="field">
                <label htmlFor="login-password">Password</label>
                <div className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    placeholder="Enter your password"
                    minLength={8}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    id="password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    ◉
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              <button type="submit" className="btn-submit">
                Sign In <span aria-hidden="true">→</span>
              </button>

              <div className="fine-print">
                New to KisanMitra? <a href="/signup">Create an account</a>
              </div>
            </form>
          </div>
        </main>
      </div>

      <div className="quote-block" aria-label="KisanMitra message">
        <div className="quote-title">
          <span>Better Farms,</span>
          <span>Brighter Futures</span>
        </div>
        <div className="quote-line"></div>
        <p>
          Connecting farmers and buyers
          <br />
          for a stronger tomorrow.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <RoleProvider>
      <LoginContent />
    </RoleProvider>
  );
}
