"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./landing.css";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".feature-card").forEach((card, i) => {
      (card as HTMLElement).style.transitionDelay = `${(i % 3) * 0.12}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-root">
      <div className="hero">
        <header>
          <div className="logo">
            <span className="mark">K</span> KisanMitra
          </div>
          <div className="auth-links">
            <button className="btn-login" onClick={() => router.push("/login")}>
              Log in
            </button>
            <button className="btn-signup" onClick={() => router.push("/signup")}>
              Sign up
            </button>
          </div>
        </header>

        <div className="hero-body">
          <div className="eyebrow-line">
            <span className="dot"></span>
            <span>Live mandi prices, right where you farm</span>
          </div>
          <h1>Know your price before you sell</h1>
          <p>
            Real-time rates, verified buyers and sale-window guidance &mdash;
            built for farmers and FPOs, in the field where decisions actually get
            made.
          </p>
          <div className="stat-row">
            <div>
              <strong>320+</strong>
              <span>mandis tracked</span>
            </div>
            <div>
              <strong>1,200+</strong>
              <span>verified buyers</span>
            </div>
            <div>
              <strong>18%</strong>
              <span>avg. price gain</span>
            </div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="features-head">
          <span>Why farmers choose KisanMitra</span>
          <h2>Everything you need to sell smarter, in one place</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">₹</div>
            <h3>Live mandi prices</h3>
            <p>
              Track rates across nearby mandis and get alerts on the best sale
              window for your crop.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">✓</div>
            <h3>Verified buyers</h3>
            <p>
              Connect with processors and institutional buyers whose credentials
              and payment history are checked.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">⇄</div>
            <h3>Logistics &amp; storage</h3>
            <p>
              Coordinate transport and storage options right after you list, so
              less of your harvest goes to waste.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">◧</div>
            <h3>Lot creation &amp; grading</h3>
            <p>
              Create a sale lot with quality grading in minutes, ready to share
              with matched buyers.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">$</div>
            <h3>Payment tracking</h3>
            <p>
              See every offer, payment and settlement in one transparent record,
              from offer to payout.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">!</div>
            <h3>Grievance support</h3>
            <p>
              Raise a dispute directly in-app and get it resolved without losing
              your next selling season.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
