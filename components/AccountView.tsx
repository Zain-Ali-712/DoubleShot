"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function AccountView() {
  const { user, signOut, count } = useStore();
  const router = useRouter();

  return (
    <section className="min-h-[80svh] pb-24 pt-36 md:pt-48">
      <div className="container-x max-w-3xl">
        {user ? (
          <>
            <h1 className="font-display text-[clamp(72px,11vw,150px)]">Hi, {user.name.split(" ")[0]}</h1>
            <p className="mt-4 text-lg text-pine/70">Signed in as {user.email}.</p>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              <Link href="/menu" className="rounded-[28px] bg-milk p-7 transition-colors hover:bg-mint-soft">
                <p className="font-display text-[44px]">Order again</p>
                <p className="text-pine/65">Browse the menu</p>
              </Link>
              <Link href="/checkout" className="rounded-[28px] bg-milk p-7 transition-colors hover:bg-mint-soft">
                <p className="font-display text-[44px]">Your cart</p>
                <p className="text-pine/65">{count} item{count === 1 ? "" : "s"} waiting</p>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="mt-12 h-12 rounded-full border-2 border-pine/25 px-6 font-semibold hover:border-sage hover:bg-mint-wash"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h1 className="font-display text-[clamp(72px,11vw,150px)]">You&apos;re signed out</h1>
            <p className="mt-4 text-lg text-pine/70">Sign in to see your account.</p>
            <Link href="/login" className="mt-8 inline-flex h-12 items-center rounded-full bg-btn px-6 font-semibold text-pine hover:bg-btn-hover">
              Sign in
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
