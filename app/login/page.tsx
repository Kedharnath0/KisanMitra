"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, RoleProvider } from "@/lib/role-context";
import "./login.css";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setCurrentRole } = useRole();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole("FARMER");
    router.push("/farmer");
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

            <form className="details" id="login-form" onSubmit={handleLoginSubmit}>
              <div className="field">
                <label htmlFor="login-email-phone">Email or phone number</label>
                <input
                  type="text"
                  id="login-email-phone"
                  name="emailOrPhone"
                  placeholder="Enter your email or phone number"
                  autoComplete="username"
                  required
                />
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
