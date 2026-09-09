"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, RoleProvider } from "@/lib/role-context";
import { Tractor, Building2, ArrowRight } from "lucide-react";
import "./login.css";

function LoginFlow() {
  const [step, setStep] = useState<"LOGIN" | "ROLE_SELECT">("LOGIN");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { setCurrentRole } = useRole();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("ROLE_SELECT");
  };

  const handleRoleSelect = (role: "FARMER" | "BUYER") => {
    setCurrentRole(role);
    if (role === "FARMER") {
      router.push("/farmer");
    } else {
      router.push("/buyer");
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h2>{step === "LOGIN" ? "Welcome Back" : "Who are you?"}</h2>
        <p className="subtitle">
          {step === "LOGIN"
            ? "Enter your phone number to continue to KisanMitra."
            : "Select a role to view the demo dashboard."}
        </p>

        {step === "LOGIN" ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="login-input-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="login-input-wrapper">
                <span className="prefix">+91</span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="99999 99999"
                  required
                />
              </div>
            </div>
            <button type="submit" className="login-submit-btn">
              Continue <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div>
            <button
              onClick={() => handleRoleSelect("FARMER")}
              className="login-role-btn"
            >
              <div className="role-icon">
                <Tractor className="h-6 w-6" />
              </div>
              <div>
                <h3>I am a Farmer</h3>
                <span>Manage lots, compare markets, sell produce.</span>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("BUYER")}
              className="login-role-btn"
            >
              <div className="role-icon">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3>I am a Buyer</h3>
                <span>Source produce, make offers, track logistics.</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <RoleProvider>
      <LoginFlow />
    </RoleProvider>
  );
}
