"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { Field } from "./Field";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn } = useStore();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signup = mode === "signup";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const name = signup ? String(f.get("name") ?? "").trim() : email.split("@")[0];
    const next: Record<string, string> = {};
    if (signup && name.length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter an email like name@example.com.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    signIn({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    router.push("/account");
  }

  return (
    <section className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-mint-soft lg:block">
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 1.3, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image src="/img/hero-can.png" alt="" width={375} height={700} priority className="h-[62vh] w-auto drop-shadow-[0_40px_45px_rgba(10,30,25,0.45)]" />
        </motion.div>
        <p className="font-display absolute bottom-10 left-10 text-[clamp(56px,6vw,96px)] text-sage-deep">Rise &amp; Shot.</p>
      </div>
      <div className="flex items-center justify-center px-4 pb-16 pt-32 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="w-full max-w-[440px]"
        >
          <h1 className="font-display text-[clamp(64px,9vw,96px)]">{signup ? "Create account" : "Welcome back"}</h1>
          <p className="mt-2 text-pine/65">
            {signup ? "Save your details for faster checkout." : "Sign in to check out faster and see your orders."}
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {signup && <Field label="Full name" name="name" autoComplete="name" error={errors.name} />}
            <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              hint={signup ? "At least 6 characters." : undefined}
              error={errors.password}
            />
            <button type="submit" className="h-14 w-full rounded-full bg-btn font-semibold text-pine hover:bg-btn-hover">
              {signup ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-pine/70">
            {signup ? "Already have an account? " : "New to Double Shot? "}
            <Link href={signup ? "/login" : "/signup"} className="font-semibold text-pine underline underline-offset-4">
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <p className="mt-8 rounded-2xl bg-mint-soft px-4 py-3 text-sm text-pine/70">
            Demo only: any email and a 6+ character password will work. Nothing leaves your browser.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
