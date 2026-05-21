"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import { PRODUCTS } from "@/lib/data";

const showcaseProducts = PRODUCTS.filter((p) => p.bestseller).slice(0, 4);

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary halftone"
      aria-label="Hero"
    >
      {/* Decorative Blobs */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-magenta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-[5%] w-72 h-72 bg-sky/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-40 h-40 bg-yellow/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Poster Thumbnails */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        {[
          { x: "5%", y: "15%", rotate: -12, w: "150px", h: "210px", delay: 0 },
          { x: "85%", y: "10%", rotate: 8, w: "130px", h: "180px", delay: 1.5 },
          { x: "2%", y: "60%", rotate: 6, w: "120px", h: "168px", delay: 3 },
          { x: "88%", y: "55%", rotate: -8, w: "160px", h: "224px", delay: 2 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.2, duration: 0.8 }}
            className="absolute poster-frame poster-frame-shadow"
            style={{
              left: pos.x,
              top: pos.y,
              width: pos.w,
              height: pos.h,
              transform: `rotate(${pos.rotate}deg)`,
              animation: `float 6s ease-in-out ${pos.delay}s infinite`,
            }}
          >
            <Image
              src={showcaseProducts[i]?.image || ""}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container-main relative z-10 text-center pt-24">
        {/* Comic Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <span className="speech-bubble text-sm text-charcoal">
            ⚡ 500+ Designs &bull; Premium Quality &bull; Fast Shipping
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display font-bold leading-[0.9] tracking-tight mb-8">
          <span className="hero-line">
            <span className="block text-[clamp(2.5rem,9vw,7.5rem)] text-charcoal">
              Your Walls
            </span>
          </span>
          <span className="hero-line">
            <span className="block text-[clamp(2.5rem,9vw,7.5rem)] text-gradient">
              Your Vibe
            </span>
          </span>
          <span className="hero-line">
            <span className="block text-[clamp(2.5rem,9vw,7.5rem)] text-charcoal">
              Your{" "}
              <span
                className="font-comic text-magenta"
                style={{
                  textShadow: "3px 3px 0 #2F3542",
                }}
              >
                Rules!
              </span>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Premium posters &amp; split wall art —{" "}
          <strong>anime, gaming, supercars, cricket</strong> &amp; more. Thick
          matte paper. Bold colors. Walls that <em>hit different</em>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/shop" className="btn-primary text-base">
            <span>🔥 Browse Collection</span>
          </Link>
          <Link
            href="/shop?category=split-poster"
            className="btn-outline text-base"
          >
            Split Posters →
          </Link>
        </motion.div>

        {/* Stats — Comic Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-16"
        >
          {[
            { value: "500+", label: "Designs", color: "bg-magenta" },
            { value: "50K+", label: "Happy Fans", color: "bg-sky" },
            { value: "4.9★", label: "Rating", color: "bg-yellow" },
            { value: "3-5d", label: "Delivery", color: "bg-magenta" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={`inline-block px-5 py-2 rounded-xl border-3 border-charcoal
                              shadow-[3px_3px_0_#2F3542] ${stat.color} ${stat.color === "bg-yellow" ? "text-charcoal" : "text-white"}`}
              >
                <p className="font-comic text-2xl md:text-3xl">{stat.value}</p>
              </div>
              <p className="text-text-muted text-xs uppercase tracking-widest mt-2 font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <HiArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
