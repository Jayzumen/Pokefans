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
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function LoginForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (auth.currentUser) {
      toast.error("You are already logged in!");
      return;
    }

    setIsLoading(true);
    
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
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="h-11"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 text-base" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In / Sign Up"
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        New users will automatically have an account created. 
        Existing users will be signed in.
      </p>
    </form>
  );
}