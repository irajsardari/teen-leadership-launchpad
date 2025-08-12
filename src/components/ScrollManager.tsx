import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollManager: handles hash-based in-page navigation across the app
// - Smoothly scrolls to #id when the hash changes or on initial load
// - Minimal behavior: only scrolls when a hash is present to avoid interfering with normal navigation
export default function ScrollManager() {
  const location = useLocation();

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

  return null;
}
