"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { BoofUser } from "@/lib/types";
import { isConvexConfigured } from "@/lib/convex/config";

interface AuthUser {
  uid: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: BoofUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

function useClerkAuthState() {
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const signedIn = Boolean(isSignedIn && clerkUser);
  const user = signedIn ? { uid: clerkUser!.id } : null;
  return { clerkLoaded, signedIn, user };
}

function BoofAuthClerkOnly({ children }: { children: ReactNode }) {
  const { clerkLoaded, signedIn, user } = useClerkAuthState();

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: null,
        loading: !clerkLoaded,
        isAdmin: false,
        isAuthenticated: signedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function BoofAuthWithConvex({ children }: { children: ReactNode }) {
  const { clerkLoaded, signedIn, user } = useClerkAuthState();
  const { isLoading: convexAuthLoading, isAuthenticated: convexAuthenticated } =
    useConvexAuth();
  const syncCurrentUser = useMutation(api.users.syncCurrentUser);

  useEffect(() => {
    if (!convexAuthenticated) return;
    void syncCurrentUser({});
  }, [convexAuthenticated, syncCurrentUser]);

  const profile = useQuery(
    api.users.getMe,
    convexAuthenticated ? {} : "skip"
  );

  const loading =
    !clerkLoaded ||
    (signedIn &&
      (convexAuthLoading ||
        (convexAuthenticated && profile === undefined)));

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: profile ?? null,
        loading,
        isAdmin,
        isAuthenticated: signedIn && convexAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function BoofAuthProvider({ children }: { children: ReactNode }) {
  if (!isConvexConfigured()) {
    return <BoofAuthClerkOnly>{children}</BoofAuthClerkOnly>;
  }
  return <BoofAuthWithConvex>{children}</BoofAuthWithConvex>;
}
