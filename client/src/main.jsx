import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = createRoot(document.getElementById("root"));

if (PUBLISHABLE_KEY) {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StrictMode>
        <App />
      </StrictMode>
    </ClerkProvider>
  );
} else {
  // If publishable key is missing (e.g., in local dev), render without Clerk to avoid runtime errors
  console.warn("VITE_CLERK_PUBLISHABLE_KEY not set — rendering without ClerkProvider");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

