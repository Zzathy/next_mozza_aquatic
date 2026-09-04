"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, User, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        setErrorMessage("Username atau password salah! Silakan coba lagi.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Brand Logo & Name */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden border border-neutral-700/80 bg-black shadow-lg">
              <Image
                src="/mozza_logo.png"
                alt="Mozza Aquatic"
                fill
                sizes="80px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-950/80 text-blue-400 border border-blue-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Point of Sale & Store Management
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Mozza Aquatic
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Masuk ke akun kasir atau admin toko
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-bold text-neutral-300">
                Username Akun
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username (contoh: admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 bg-neutral-950/80 border-neutral-800 text-white placeholder:text-neutral-600 rounded-xl focus-visible:border-blue-500 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-neutral-300">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-neutral-950/80 border-neutral-800 text-white placeholder:text-neutral-600 rounded-xl focus-visible:border-blue-500 text-sm font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-3 bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-500 font-medium">
              Mozza Aquatic Banyuwangi &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
