import type { Metadata } from "next";
import LoginForm from "@/components/loginPage/LoginForm";
import { PokeballIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create an account to build your Pokémon team.",
};

export default function Login() {
  return (
    <main className="relative grid min-h-[calc(100dvh-5rem)] place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10"
      />
      <div className="surface fade-up relative w-full max-w-[26rem] p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
            <PokeballIcon className="size-7" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
            Welcome, Trainer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in or create an account to build your team.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
