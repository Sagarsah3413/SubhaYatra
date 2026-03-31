/**
 * useUserSync — fires on every Clerk sign-in.
 * Calls POST /api/users/sync to upsert the user row and record the login.
 * Also calls POST /api/users/logout on Clerk sign-out.
 */
import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useUserSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const syncedRef = useRef(null); // track which clerk_id we already synced this session

  // ── Sync on login ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (syncedRef.current === user.id) return; // already synced this session

    const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
    if (!primaryEmail) return;

    syncedRef.current = user.id;

    fetch(`${API_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_id:   user.id,
        email:      primaryEmail,
        name:       user.fullName || user.firstName || '',
        avatar_url: user.imageUrl || '',
      }),
    }).catch((err) => console.warn('User sync failed:', err));
  }, [isLoaded, isSignedIn, user]);

  // ── Record logout ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || isSignedIn || !syncedRef.current) return;

    const clerkId = syncedRef.current;
    syncedRef.current = null;

    fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerk_id: clerkId }),
    }).catch((err) => console.warn('Logout sync failed:', err));
  }, [isLoaded, isSignedIn]);
}
