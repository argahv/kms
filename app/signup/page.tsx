"use client";

import { ErrorAlert } from "@/components/error-alert";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter();
  const { setUser } = useAuthStore();
  const signup = useSignup();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      signup.reset();
      // signup.setError(new Error("Please fill in all fields"));
      return;
    }

    try {
      const result = await signup.mutateAsync({
        name,
        email,
        password,
        role,
      });
      setUser(result.user);
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex justify-center mb-4'>
            <Logo />
          </div>
          <CardTitle className='text-2xl text-primary text-center'>
            Signup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='input w-full'
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='input w-full'
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='input w-full'
              />
            </div>
            <div>
              <Label htmlFor='role'>Role</Label>
              <select
                id='role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='input w-full'
                required>
                <option value=''>Select a role</option>
                <option value='TEACHER'>Teacher</option>
                <option value='PARENT'>Parent</option>
                <option value='KID'>Kid</option>
                <option value='ADMIN'>Admin</option>
              </select>
            </div>
            {signup.error && <ErrorAlert message={signup.error.message} />}
            <Button
              type='submit'
              className='w-full'
              disabled={signup.isLoading}>
              {signup.isLoading ? "Signing up..." : "Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
