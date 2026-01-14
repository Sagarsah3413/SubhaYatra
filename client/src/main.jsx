import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import "./i18n/index.js"; // Initialize i18n

// Optimized theme initialization - apply immediately to prevent flash
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || 'dark';
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  if (!savedTheme) {
    localStorage.setItem('theme', 'dark');
  }
};

// Initialize theme immediately
initializeTheme();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Optimized root creation with error boundary
const renderApp = () => {
  const root = createRoot(document.getElementById("root"));
  
  const AppWithProviders = PUBLISHABLE_KEY ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StrictMode>
        <App />
      </StrictMode>
    </ClerkProvider>
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  );

  root.render(AppWithProviders);
};

// Handle potential errors during initialization
try {
  renderApp();
} catch (error) {
  console.error("Failed to initialize app:", error);
  // Fallback rendering without StrictMode if needed
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
}

