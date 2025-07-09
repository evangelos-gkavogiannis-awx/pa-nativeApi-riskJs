"use client";
import { useEffect, useRef } from 'react';

export function getOrderSessionId() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("awx_order_session_id") || "";
}

export default function AirwallexFingerprint() {
  const sessionId = useRef();

  // Only generate once per checkout "session"
  if (!sessionId.current && typeof window !== "undefined") {
    let sid = window.sessionStorage.getItem("awx_order_session_id");
    if (!sid) {
      sid = crypto.randomUUID().replaceAll("-", ""); // 32 chars, valid for Airwallex
      window.sessionStorage.setItem("awx_order_session_id", sid);
    }
    sessionId.current = sid;
  }

  useEffect(() => {
    // Only mount script if not already present
    if (!sessionId.current) return;
    if (document.getElementById("airwallex-fraud-api")) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.id = "airwallex-fraud-api";
    script.setAttribute("data-order-session-id", sessionId.current);
    script.src = "https://static-demo.airwallex.com/webapp/fraud/device-fingerprint/index.js";
    document.body.appendChild(script);

    return () => {
      // Optional: cleanup
      const s = document.getElementById("airwallex-fraud-api");
      if (s) s.remove();
    };
  }, []);

  return null; // This component does not render UI
}