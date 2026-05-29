"use client";

import { SignInButton } from "@clerk/nextjs";

export function SignInPrompt({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
      <p className="text-sm text-zinc-400">
        {message ?? "Sign in to submit reports and vote on community posts."}
      </p>
      <SignInButton mode="modal">
        <button type="button" className="btn-primary mt-4">
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}
