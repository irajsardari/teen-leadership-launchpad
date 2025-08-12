import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollManager: handles hash-based in-page navigation across the app
// - Smoothly scrolls to #id when the hash changes or on initial load
// - Minimal behavior: only scrolls when a hash is present to avoid interfering with normal navigation
export default function ScrollManager() {
  const location = useLocation();

  // Disable browser scroll restoration to prevent keeping old positions on SPA navigations
  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.replace('#', ''));

    // Defer to ensure target elements mounted
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);

    return () => clearTimeout(t);
  }, [location.hash, location.pathname]);

  // Ensure we start at the top on normal route changes (no hash)
  // Start at the top on normal route changes (no hash), after render to avoid scroll anchoring
  useEffect(() => {
    if (location.hash) return;
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return null;
}
