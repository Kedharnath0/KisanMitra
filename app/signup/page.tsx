"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, RoleProvider } from "@/lib/role-context";
import "./signup.css";

function SignupContent() {
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const router = useRouter();
  const { setCurrentRole } = useRole();

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole("FARMER");
    router.push("/farmer");
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole("BUYER");
    router.push("/buyer");
  };

  return (
    <div className="signup-page-root">
      <div className="page">
        {/* Form side */}
        <div className="form-side">
        <header>
          <div className="header-note">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </header>

        <main>
          <div className="panel">
            <div className="panel-head">
              <h2>Create your account</h2>
              <p>
                Tell us which side of the sale you&apos;re on, and we&apos;ll set
                up the right account for you.
              </p>
            </div>

            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${role === "farmer" ? "active" : ""}`}
                id="btn-farmer"
                onClick={() => setRole("farmer")}
              >
                <span className="role-icon">🌾</span>
                <strong>I&apos;m a farmer</strong>
                <span>Sell your harvest and track mandi prices</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "buyer" ? "active" : ""}`}
                id="btn-buyer"
                onClick={() => setRole("buyer")}
              >
                <span className="role-icon">₹</span>
                <strong>I&apos;m a buyer</strong>
                <span>Source verified lots directly from farmers</span>
              </button>
            </div>

            {/* Farmer form */}
            <form
              className="details"
              id="form-farmer"
              style={{ display: role === "farmer" ? "grid" : "none" }}
              onSubmit={handleFarmerSubmit}
            >
              <div className="field">
                <label htmlFor="f-name">Full name</label>
                <input
                  type="text"
                  id="f-name"
                  name="fullName"
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input
                  type="email"
                  id="f-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="f-password">Password</label>
                <input
                  type="password"
                  id="f-password"
                  name="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-phone">Phone number</label>
                  <input
                    type="tel"
                    id="f-phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-village">Village / location</label>
                  <input
                    type="text"
                    id="f-village"
                    name="village"
                    placeholder="e.g. Kandukur"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-district">
                  District <span className="optional">(optional)</span>
                </label>
                <input
                  type="text"
                  id="f-district"
                  name="district"
                  placeholder="e.g. Guntur"
                />
              </div>
              <button type="submit" className="btn-submit">
                Create farmer account
              </button>
              <div className="fine-print">
                By continuing you agree to KisanMitra&apos;s{" "}
                <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </div>
            </form>

            {/* Buyer form */}
            <form
              className="details"
              id="form-buyer"
              style={{ display: role === "buyer" ? "grid" : "none" }}
              onSubmit={handleBuyerSubmit}
            >
              <div className="field">
                <label htmlFor="b-business">Business name</label>
                <input
                  type="text"
                  id="b-business"
                  name="businessName"
                  placeholder="e.g. Sri Lakshmi Traders"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="b-email">Email</label>
                <input
                  type="email"
                  id="b-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="b-password">Password</label>
                <input
                  type="password"
                  id="b-password"
                  name="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="b-phone">Phone number</label>
                  <input
                    type="tel"
                    id="b-phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="b-location">Location</label>
                  <input
                    type="text"
                    id="b-location"
                    name="location"
                    placeholder="e.g. Vijayawada"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="b-district">
                  District <span className="optional">(optional)</span>
                </label>
                <input
                  type="text"
                  id="b-district"
                  name="district"
                  placeholder="e.g. Krishna"
                />
              </div>
              <button type="submit" className="btn-submit">
                Create buyer account
              </button>
              <div className="fine-print">
                By continuing you agree to KisanMitra&apos;s{" "}
                <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
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

export default function SignupPage() {
  return (
    <RoleProvider>
      <SignupContent />
    </RoleProvider>
  );
}
