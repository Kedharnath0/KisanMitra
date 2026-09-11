/**
 * High-quality crop image mapping with optimized images and emoji/SVG fallbacks.
 */

export const CROP_IMAGES: Record<string, { image: string; emoji: string; color: string }> = {
  Tomato: {
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=160&auto=format&fit=crop&q=80",
    emoji: "🍅",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  Chilli: {
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=160&auto=format&fit=crop&q=80",
    emoji: "🌶️",
    color: "bg-red-50 text-red-800 border-red-300",
  },
  Cotton: {
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=160&auto=format&fit=crop&q=80",
    emoji: "🌱",
    color: "bg-neutral-50 text-neutral-800 border-neutral-200",
  },
  Rice: {
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=160&auto=format&fit=crop&q=80",
    emoji: "🌾",
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  Wheat: {
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=160&auto=format&fit=crop&q=80",
    emoji: "🌾",
    color: "bg-yellow-50 text-yellow-800 border-yellow-200",
  },
  Onion: {
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=160&auto=format&fit=crop&q=80",
    emoji: "🧅",
    color: "bg-purple-50 text-purple-800 border-purple-200",
  },
  Maize: {
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=160&auto=format&fit=crop&q=80",
    emoji: "🌽",
    color: "bg-yellow-50 text-yellow-900 border-yellow-300",
  },
  Potato: {
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=160&auto=format&fit=crop&q=80",
    emoji: "🥔",
    color: "bg-amber-50 text-amber-900 border-amber-300",
  },
  Turmeric: {
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=160&auto=format&fit=crop&q=80",
    emoji: "🌿",
    color: "bg-orange-50 text-orange-900 border-orange-200",
  },
};

export function getCropInfo(cropName: string) {
  const normalized = Object.keys(CROP_IMAGES).find(
    (k) => k.toLowerCase() === cropName.toLowerCase()
  );
  if (normalized) {
    return CROP_IMAGES[normalized];
  }
  return {
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=160&auto=format&fit=crop&q=80",
    emoji: "🌾",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
  };
}
