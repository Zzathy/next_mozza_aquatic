import React from "react";
import Image from "next/image";

interface ProductVisualProps {
  categorySlug?: string;
  categoryName?: string;
  productName: string;
  imageUrl?: string | null;
  className?: string;
}

export default function ProductVisual({
  categorySlug = "",
  categoryName = "",
  productName,
  imageUrl,
  className = "h-48 sm:h-52 w-full",
}: ProductVisualProps) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-zinc-100 flex items-center justify-center ${className}`}>
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  const slug = (categorySlug || categoryName || "").toLowerCase();
  const isPlant = slug.includes("tanam") || slug.includes("plant") || slug.includes("aquascape");
  const isFish = slug.includes("ikan") || slug.includes("fish");
  const isFood = slug.includes("pakan") || slug.includes("food") || slug.includes("pelet");
  const isTool = slug.includes("alat") || slug.includes("tool") || slug.includes("mesin") || slug.includes("filter");

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#f4f4f5] to-[#ececed] group-hover:from-[#f0f0f2] group-hover:to-[#e8e8ea] transition-colors duration-500 ${className}`}
    >
      {/* Subtle floor shadow with delicate micro-hint of emerald on hover */}
      <div className="absolute bottom-3 w-28 h-5 rounded-full bg-zinc-300/50 blur-md group-hover:bg-emerald-500/10 transition-colors duration-500" />

      {/* Subtle background circular halo */}
      <div className="absolute w-36 h-36 rounded-full bg-white/60 blur-xl pointer-events-none" />

      {/* Artwork with deep charcoal / black silhouette and delicate micro-green touch */}
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
        {isPlant && (
          <svg
            className="w-24 h-24 text-zinc-900 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Plant stem & leaves in monochrome with a tiny emerald dot on tip */}
            <path
              d="M50 88C50 60 48 35 52 18"
              stroke="#52525b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M51 68C65 65 74 54 75 42C62 42 53 52 51 68Z"
              fill="#27272a"
              fillOpacity="0.95"
            />
            <path
              d="M49 55C35 52 26 41 25 29C38 29 47 39 49 55Z"
              fill="#3f3f46"
              fillOpacity="0.9"
            />
            <path
              d="M51 40C62 37 68 28 69 18C58 18 52 27 51 40Z"
              fill="#18181b"
              fillOpacity="0.95"
            />
            <path
              d="M49 30C40 26 35 18 35 10C44 11 48 19 49 30Z"
              fill="#52525b"
              fillOpacity="0.85"
            />
            {/* Delicate micro-emerald spark at leaf tip */}
            <circle cx="52" cy="16" r="2.5" fill="#10b981" />
          </svg>
        )}

        {isFish && (
          <svg
            className="w-24 h-24 text-zinc-900 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant Manfish silhouette */}
            <path
              d="M50 12C50 12 55 32 60 42C72 44 88 47 88 50C88 53 72 56 60 58C55 68 50 88 50 88C48 76 42 66 38 60C26 58 12 55 12 50C12 45 26 42 38 40C42 34 48 24 50 12Z"
              fill="#27272a"
              fillOpacity="0.92"
            />
            <path
              d="M38 40C42 45 42 55 38 60C32 58 20 53 20 50C20 47 32 42 38 40Z"
              fill="#3f3f46"
              fillOpacity="0.9"
            />
            {/* Micro emerald eye */}
            <circle cx="70" cy="48" r="2.5" fill="#10b981" />
            <path
              d="M55 42C62 47 62 53 55 58"
              stroke="#e4e4e7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}

        {isFood && (
          <svg
            className="w-24 h-24 text-zinc-900 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Modern nutrition canister in monochrome */}
            <rect x="30" y="24" width="40" height="10" rx="3" fill="#3f3f46" />
            <rect x="34" y="34" width="32" height="46" rx="6" fill="#18181b" />
            <rect x="38" y="44" width="24" height="20" rx="3" fill="#27272a" />
            {/* Micro emerald dot badge on label */}
            <circle cx="50" cy="54" r="3.5" fill="#10b981" />
            <circle cx="24" cy="74" r="2.5" fill="#71717a" />
            <circle cx="76" cy="70" r="2" fill="#71717a" />
          </svg>
        )}

        {isTool && (
          <svg
            className="w-24 h-24 text-zinc-900 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hardware canister / gear */}
            <rect x="32" y="30" width="36" height="48" rx="8" fill="#18181b" />
            <path d="M42 20V30M58 20V30" stroke="#71717a" strokeWidth="4" strokeLinecap="round" />
            <rect x="40" y="42" width="20" height="16" rx="4" fill="#27272a" />
            {/* Micro emerald indicator light */}
            <circle cx="50" cy="50" r="3" fill="#10b981" />
            <path d="M40 68H60" stroke="#52525b" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {!isPlant && !isFish && !isFood && !isTool && (
          <svg
            className="w-24 h-24 text-zinc-900 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 18C50 18 30 42 30 60C30 71 39 80 50 80C61 80 70 71 70 60C70 42 50 18 50 18Z"
              fill="#18181b"
            />
            <path
              d="M50 36C45 48 45 64 50 72"
              stroke="#52525b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="58" r="3" fill="#10b981" />
          </svg>
        )}
      </div>

      {/* Subtle border line */}
      <div className="absolute inset-0 ring-1 ring-inset ring-black/[0.04] rounded-t-2xl pointer-events-none" />
    </div>
  );
}
