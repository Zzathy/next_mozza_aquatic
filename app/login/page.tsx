"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      console.error("Login gagal:", result.error);
      alert("Login gagal! cek lagi username dan passwordnya.");
    } else if (result?.ok) {
      console.log("Login berhasil!");
      alert("Login sukses!");
      router.push("/dashboard");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Mozza Aquatic</CardTitle>
          <CardDescription>Login khusus admin.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username Admin</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
