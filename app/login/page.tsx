"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { useLogin } from "@/lib/api";
import { ErrorAlert } from "@/components/error-alert";
import Logo from "@/components/logo";

export default function LoginPage() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { setUser } = useAuthStore();
  const login = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      login.reset();
      // login.setError(new Error("Please fill in all fields"));
      return;
    }

    try {
      const result = await login.mutateAsync({
        email,
        password,
        // role: selectedRole,
      });
      setUser(result.user);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
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
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='text'
                value={email}
                onChange={(e) => setUsername(e.target.value)}
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
            {/* <div>
              <Label htmlFor='role'>Select Role</Label>
              <select
                id='role'
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className='input w-full'
                required>
                <option value=''>Select a role</option>
                <option value='teacher'>Teacher</option>
                <option value='parent'>Parent</option>
                <option value='kid'>Kid</option>
                <option value='admin'>Admin</option>
              </select>
            </div> */}
            {login.error && <ErrorAlert message={login.error.message} />}
            <Button type='submit' className='w-full' disabled={login.isLoading}>
              {login.isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className='text-center mt-4'>
            <a href='/signup' className='text-primary'>
              Don't have an account? Signup
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
