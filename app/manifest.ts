import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mozza Aquatic POS & Store",
    short_name: "Mozza POS",
    description: "Sistem Kasir & Manajemen Toko Mozza Aquatic Banyuwangi",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#2563EB",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/mozza_logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/mozza_logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
