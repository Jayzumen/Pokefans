"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./../firebase";
import { toast } from "react-toastify";
import { signUpUser, signInUser, auth } from "../auth";

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
      className="mx-auto flex min-w-[300px] max-w-[600px] flex-col gap-4"
    >
      <label htmlFor="username">Enter a Username</label>
      <input
        className="rounded-lg p-2 text-black outline-none"
        type="text"
        name="username"
        id="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter username..."
      />
      <label htmlFor="email">Enter a Email</label>
      <input
        className="rounded-lg p-2 text-black outline-none"
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email..."
      />

      <label htmlFor="password">Enter a Password</label>
      <input
        className="rounded-lg p-2 text-black outline-none"
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
      />
      <button
        className="rounded-lg bg-sky-700 p-2 text-lg font-semibold transition hover:bg-sky-800"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
