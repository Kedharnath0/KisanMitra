"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, RoleProvider } from "@/lib/role-context";
import { signInWithEmail } from "@/lib/auth";
import { getUserProfile } from "@/lib/firestore";
import "./login.css";

function LoginContent() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setCurrentRole } = useRole();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input = emailOrPhone.trim();

    try {
      let resolvedRole: "FARMER" | "BUYER" = "BUYER";

      // 1. If email is provided, attempt Firebase authentication
      if (input.includes("@")) {
        try {
          const credential = await signInWithEmail(input, password);
          if (credential?.user) {
            try {
              const profile = await getUserProfile(credential.user.uid);
              if (profile?.role === "FARMER") {
                resolvedRole = "FARMER";
              } else if (profile?.role === "BUYER") {
                resolvedRole = "BUYER";
              }
            } catch (profileErr) {
              console.warn("Could not fetch user profile:", profileErr);
            }
          }
        } catch (authErr) {
          console.warn("Firebase sign-in fallback to demo mode:", authErr);
          // Check for demo farmer credentials or keywords
          if (input.toLowerCase().includes("farmer") || input.toLowerCase().includes("ramesh")) {
            resolvedRole = "FARMER";
          } else {
            resolvedRole = "BUYER";
          }
        }
      } else {
        // Phone number or username demo input
        if (input.toLowerCase().includes("farmer") || input.toLowerCase().includes("ramesh")) {
          resolvedRole = "FARMER";
        } else {
          resolvedRole = "BUYER";
        }
      }

      // Auto-detect role and redirect to the appropriate dashboard
      setCurrentRole(resolvedRole);
      if (resolvedRole === "FARMER") {
        router.push("/farmer");
      } else {
        router.push("/buyer");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      <div className="page">
        {/* Form side */}
        <div className="form-side">
        <header>
          <div className="header-note">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </div>
        </header>

        <main>
          <div className="panel">
            <div className="panel-head">
              <h2>Log in to KisanMitra</h2>
              <p>Enter your credentials to access your dashboard.</p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#FCA5A5",
                  padding: "10px 14px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            <form className="details" id="login-form" onSubmit={handleLoginSubmit}>
              <div className="field">
                <label htmlFor="login-email-phone">Email or phone number</label>
                <input
                  type="text"
                  id="login-email-phone"
                  name="emailOrPhone"
                  placeholder="Enter your email or phone number"
                  autoComplete="username"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
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
                    minLength={6}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Logging in..." : (
                  <>
                    Log in <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <div className="fine-print">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
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
