"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function SplitPosterShowcase() {
  const [splitPosters, setSplitPosters] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchProducts({
          type: "split-poster",
          limit: "3",
        });
        if (result.data && result.data.length > 0) {
          setSplitPosters(result.data);
        } else {
          setSplitPosters(
            FALLBACK.filter((p) => p.type === "split-poster").slice(0, 3),
          );
        }
      } catch (err) {
        console.log("SplitPosterShowcase: Using fallback", err);
        setSplitPosters(
          FALLBACK.filter((p) => p.type === "split-poster").slice(0, 3),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || splitPosters.length === 0) return null;

  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="split-heading"
      style={{
        background: "linear-gradient(135deg, #2F3542 0%, #1A202C 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      <div className="absolute top-20 right-10 w-80 h-80 bg-magenta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-sky/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <AnimateIn>
            <span className="badge-split text-sm px-4 py-2 mb-4 inline-block">
              🔥 Trending
            </span>
            <h2
              id="split-heading"
              className="font-display text-4xl md:text-6xl font-bold leading-tight text-white"
            >
              Split{" "}
              <span
                className="font-comic text-yellow"
                style={{ textShadow: "3px 3px 0 #E10F80" }}
              >
                Posters
              </span>
              <br />
              <span className="text-white/50">Multi-Panel Wall Art</span>
            </h2>
            <p className="text-white/60 mt-4 max-w-lg">
              Transform your wall with 3 &amp; 5 panel sets. The ultimate
              statement piece for any room.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <Link
              href="/shop?category=split-poster"
              className="btn-primary text-sm"
            >
              <span>View All Splits →</span>
            </Link>
          </AnimateIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {splitPosters.map((poster, i) => (
            <motion.div
              key={poster._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Link href={`/product/${poster._id}`} className="group block">
                <div
                  className="relative mb-4 border-3 border-white/20 rounded-2xl overflow-hidden
                              shadow-[5px_5px_0_rgba(225,15,128,0.3)]
                              group-hover:shadow-[8px_8px_0_rgba(225,15,128,0.4)]
                              group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]
                              transition-all duration-300"
                >
                  <div
                    className="flex gap-1"
                    style={{
                      aspectRatio: poster.panels === 5 ? "2.5/1" : "2/1",
                    }}
                  >
                    {Array.from({ length: poster.panels || 3 }).map(
                      (_, panelIdx) => (
                        <div
                          key={panelIdx}
                          className="relative overflow-hidden bg-charcoal"
                          style={{
                            flex:
                              panelIdx === Math.floor((poster.panels || 3) / 2)
                                ? 1.3
                                : 1,
                          }}
                        >
                          <Image
                            src={poster.image}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            style={{
                              objectPosition: `${(panelIdx / ((poster.panels || 3) - 1)) * 100}% center`,
                            }}
                            sizes="250px"
                          />
                        </div>
                      ),
                    )}
                  </div>
                  <span className="absolute top-3 right-3 badge-split">
                    {poster.panels} Panels
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-yellow transition-colors">
                      {poster.name}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      {poster.sizes.length} sizes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-comic text-lg text-yellow">
                      {formatPrice(poster.price)}
                    </span>
                    {poster.comparePrice && (
                      <span className="block text-xs text-white/40 line-through">
                        {formatPrice(poster.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
