"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCloudUpload,
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";
import { uploadImage } from "@/lib/adminApi";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string; // Current image URL
  onChange: (url: string) => void; // Called when image changes
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Product Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        toast.error("Sirf JPG, PNG, WebP allowed hai!");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File 10MB se chhoti honi chahiye!");
        return;
      }

      setUploading(true);
      setProgress(0);

      // Simulate progress (actual progress is in the API call)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const result = await uploadImage(file);

        clearInterval(progressInterval);
        setProgress(100);
        if (result.success && result.data?.url) {
          onChange(result.data.url);
          setImageUrl(result.data.url);
          toast.success(`Image uploaded! (${result.data.size})`);
        }
      } catch (err: any) {
        clearInterval(progressInterval);
        const msg =
          err.response?.data?.message || "Upload fail ho gaya. Try again!";
        toast.error(msg);
      } finally {
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
        }, 500);
      }
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be uploaded again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div>
      <label className="block text-white/50 text-xs font-bold uppercase mb-2">
        {label}
      </label>

      <AnimatePresence mode="wait">
        {value ? (
          /* ── Image Preview ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="relative aspect-[3/4] max-w-[280px] rounded-2xl overflow-hidden border-2 border-white/10">
              <Image
                src={value || imageUrl}
                alt="Product image"
                fill
                className="object-cover"
                sizes="280px"
              />

              {/* Overlay on hover */}
              <div
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 flex flex-col items-center justify-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm
                             text-white rounded-xl text-sm font-medium hover:bg-white/20
                             transition-colors border border-white/20"
                >
                  <HiOutlinePhotograph size={16} />
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm
                             text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30
                             transition-colors border border-red-500/20"
                >
                  <HiOutlineTrash size={16} />
                  Remove
                </button>
              </div>
            </div>

            {/* Image URL display */}
            <div className="mt-2 flex items-center gap-2">
              <HiOutlineCheck size={14} className="text-green-400 shrink-0" />
              <p className="text-white/30 text-xs truncate max-w-[250px]">
                {value}
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Upload Area ── */
          <motion.div
            key="uploader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              className={`relative aspect-[3/4] max-w-[280px] rounded-2xl border-2 border-dashed
                         cursor-pointer transition-all duration-300 flex flex-col items-center
                         justify-center gap-4 overflow-hidden
                         ${
                           dragActive
                             ? "border-magenta bg-magenta/5 scale-[1.02]"
                             : uploading
                               ? "border-magenta/50 bg-magenta/5"
                               : "border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04]"
                         }`}
            >
              {uploading ? (
                /* Upload Progress */
                <div className="text-center px-6">
                  {/* Spinner */}
                  <div className="w-14 h-14 rounded-full border-3 border-magenta/20 border-t-magenta animate-spin mx-auto mb-4" />

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-magenta rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <p className="text-white/60 text-sm font-medium">
                    Uploading... {progress}%
                  </p>
                </div>
              ) : (
                /* Default State */
                <>
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                    ${
                      dragActive
                        ? "bg-magenta/20 text-magenta"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    <HiOutlineCloudUpload size={28} />
                  </div>

                  <div className="text-center px-4">
                    <p className="text-white/70 text-sm font-medium">
                      {dragActive ? (
                        <span className="text-magenta">Drop it here!</span>
                      ) : (
                        <>
                          <span className="text-magenta underline">
                            Click to upload
                          </span>{" "}
                          or drag & drop
                        </>
                      )}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      JPG, PNG, WebP • Max 10MB
                    </p>
                    <p className="text-white/20 text-xs mt-0.5">
                      Auto-converts to WebP & optimizes
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Or enter URL manually */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/20 text-[10px] uppercase tracking-widest">
                or paste URL
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              onChange={(e) => {
                if (e.target.value.trim()) onChange(e.target.value.trim());
              }}
              className="mt-2 w-full max-w-[280px] px-4 py-2.5 bg-white/5 border border-white/10
                         rounded-xl text-white text-sm placeholder-white/20
                         focus:outline-none focus:border-magenta transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
