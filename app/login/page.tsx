"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";
import {
  IconCart,
  IconLock,
  IconMail,
  IconPhoto,
  IconWallet,
} from "@/components/dashboard-icons";
import {
  Button,
  DividerLabel,
  TextField,
} from "@/components/ui";
import { typography } from "@/lib/ui-styles";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 450);
  }

  return (
    <AuthSplitShell
      variant="login"
      eyebrow="Member access"
      headline="Welcome back to your rewards space"
      subhead="Sign in to track orders, submit social posts, and unlock cashback that
        drops straight into your wallet — same energy as your storefront, one
        login away."
      bullets={[
        {
          icon: IconWallet,
          title: "Cashback wallet",
          desc: "See live points and redeem at checkout in one tap.",
        },
        {
          icon: IconCart,
          title: "Order sync",
          desc: "Orders from Shopify appear here the moment they hit your store.",
        },
        {
          icon: IconPhoto,
          title: "Social earnings",
          desc: "Every approved post can stack points toward your next purchase.",
        },
      ]}
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className={typography.linkBrand}>
            Create a free account
          </Link>
        </>
      }
    >
      <div className="text-center sm:text-left">
        <h2 className={typography.titleMd}>Sign in</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use your email and password — we&apos;ll wire real auth when you connect
          the API.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <TextField
          id="login-email"
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<IconMail className="h-5 w-5" strokeWidth={1.5} />}
          focusVariant="brand"
        />

        <TextField
          id="login-password"
          name="password"
          type="password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          leftIcon={<IconLock className="h-5 w-5" strokeWidth={1.5} />}
          focusVariant="brand"
          labelTrailing={
            <a
              href="#"
              className="text-xs font-semibold text-violet-600 hover:text-violet-800"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          }
        />

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <span>Keep me signed in on this device</span>
        </label>

        <Button variant="primary" type="submit" disabled={loading} className="w-full py-3.5">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </Button>

        <DividerLabel>Or continue with</DividerLabel>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="social" type="button" className="w-full">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="social" type="button" className="w-full">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Apple
          </Button>
        </div>
        <p className="text-center text-[11px] text-slate-400">
          OAuth buttons are visual only until you add providers.
        </p>
      </form>
    </AuthSplitShell>
  );
}
