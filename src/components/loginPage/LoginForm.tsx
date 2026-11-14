"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  auth,
  claimUsername,
  friendlyAuthError,
  MIN_PASSWORD_LENGTH,
  requestPasswordReset,
  signInUser,
  signUpUser,
} from "@/lib/auth";
import { useAuth } from "../auth-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function PasswordField({
  id,
  value,
  onChange,
  disabled,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  autoComplete: "current-password" | "new-password";
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        Password
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={autoComplete === "new-password" ? MIN_PASSWORD_LENGTH : undefined}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-11 rounded-lg pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function EmailField({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        Email
      </Label>
      <Input
        id={id}
        type="email"
        autoComplete="email"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 rounded-lg"
      />
    </div>
  );
}

function UsernameField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="username" className="flex items-center">
        Username
      </Label>
      <Input
        id="username"
        autoComplete="username"
        required
        pattern="[A-Za-z0-9_]{3,20}"
        title="3–20 characters: letters, numbers or underscores"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 rounded-lg"
      />
      <p className="text-xs text-muted-foreground">
        3–20 characters: letters, numbers or underscores. Shown on your public
        team.
      </p>
    </div>
  );
}

function SubmitButton({ busy, children }: { busy: boolean; children: string }) {
  return (
    <Button type="submit" className="h-11 w-full rounded-full text-base" disabled={busy}>
      {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const goToTeam = (name: string) => {
    router.push(`/teams/${encodeURIComponent(name)}`);
    router.refresh();
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      toast.error(friendlyAuthError(error));
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const p = await signInUser(email.trim(), password);
      await refreshProfile();
      if (p) {
        toast.success(`Welcome back, ${p.username}!`);
        goToTeam(p.username);
      }
      // No profile: the "choose a username" form below takes over.
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const p = await signUpUser(username.trim(), email.trim(), password);
      await refreshProfile();
      toast.success(`Welcome, ${p.username}!`);
      goToTeam(p.username);
    });
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      if (!auth.currentUser) return;
      await claimUsername(auth.currentUser.uid, username.trim());
      await refreshProfile();
      goToTeam(username.trim());
    });
  };

  const handleReset = () => {
    if (!email.trim()) {
      toast.info("Enter your email first, then click “Forgot password?”.");
      return;
    }
    run(async () => {
      await requestPasswordReset(email.trim());
      toast.info("If an account exists for this email, a reset link is on its way.");
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="space-y-4 text-center">
        <p>
          You&apos;re signed in as <strong>{profile.username}</strong>.
        </p>
        <Button className="w-full" onClick={() => goToTeam(profile.username)}>
          Go to my team
        </Button>
      </div>
    );
  }

  if (user && !profile) {
    return (
      <form onSubmit={handleClaim} className="space-y-6">
        <p className="text-sm text-muted-foreground">
          One more step: choose a username for your account.
        </p>
        <UsernameField value={username} onChange={setUsername} disabled={busy} />
        <SubmitButton busy={busy}>Save username</SubmitButton>
      </form>
    );
  }

  return (
    <Tabs defaultValue="signin" className="gap-6">
      <TabsList className="grid h-10 w-full grid-cols-2 rounded-full">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Create account</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4">
          <EmailField id="signin-email" value={email} onChange={setEmail} disabled={busy} />
          <PasswordField
            id="signin-password"
            value={password}
            onChange={setPassword}
            disabled={busy}
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <SubmitButton busy={busy}>Sign in</SubmitButton>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4">
          <UsernameField value={username} onChange={setUsername} disabled={busy} />
          <EmailField id="signup-email" value={email} onChange={setEmail} disabled={busy} />
          <PasswordField
            id="signup-password"
            value={password}
            onChange={setPassword}
            disabled={busy}
            autoComplete="new-password"
          />
          <SubmitButton busy={busy}>Create account</SubmitButton>
        </form>
      </TabsContent>
    </Tabs>
  );
}
