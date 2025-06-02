import { useEffect } from "react";

export default function useGoogleLoginEffect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    if (email) {
      localStorage.setItem("user_email", email);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
}