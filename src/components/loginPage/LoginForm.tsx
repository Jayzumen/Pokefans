"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "@/lib/firebase";
import { auth, signInUser, signUpUser } from "@/lib/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function LoginForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
      try {
        let foundUsername = false;
        const querySnapshot = await getDocs(collection(db, "Users"));
        querySnapshot.forEach(async (doc) => {
          if (doc.data().username === username) {
            foundUsername = true;
            await signInUser(username, email, password);
            toast.success(`Welcome Back ${username}!`);
            navigate.push(`/teams/${username}`);
          }
        });
        if (!foundUsername) {
          await signUpUser(username, email, password);
          toast.success(`Welcome ${username}!`);
          navigate.push(`/teams/${username}`);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("You are already logged in!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-[600px] min-w-[300px] flex-col gap-4"
    >
      <Label htmlFor="username">Enter a Username</Label>
      <Input
        className="rounded-lg p-2 text-black outline-none"
        type="text"
        name="username"
        id="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter username..."
      />
      <Label htmlFor="email">Enter a Email</Label>
      <Input
        className="rounded-lg p-2 text-black outline-none"
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email..."
      />

      <Label htmlFor="password">Enter a Password</Label>
      <Input
        className="rounded-lg p-2 outline-none"
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
      />
      <Button className="cursor-pointer" type="submit">
        Login
      </Button>
    </form>
  );
}
