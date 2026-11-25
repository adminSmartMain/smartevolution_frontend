import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

export default function CaptchaGate({ onToken }) {
  const container = useRef(null);
  const onTokenRef = useRef(onToken);
  // CAPTCHA is opt-in by environment.  No provider key is embedded in the
  // client: production supplies it through NEXT_PUBLIC_TURNSTILE_SITE_KEY.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey || !container.current) return undefined;
    let widgetId;
    const render = () => {
      if (!window.turnstile || !container.current) return;
      widgetId = window.turnstile.render(container.current, {
        sitekey: siteKey,
        // Invisible Turnstile keeps the login screen clean. Cloudflare only
        // interrupts when it detects a real challenge is necessary.
        size: "invisible",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
      });
    };
    const existing = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]');
    if (existing) {
      render();
      return () => {
        if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
      };
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
    return () => {
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey]);

  // Do not disclose configuration specifics.  Backend logs and audit events
  // carry the operational reason when a required provider is unavailable.
  if (!siteKey) {
    return <Box role="alert" sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
      La verificación de seguridad no está disponible temporalmente. Intenta más tarde.
    </Box>;
  }
  return <Box ref={container} aria-hidden="true" sx={{ height: 0, overflow: "hidden" }} />;
}
