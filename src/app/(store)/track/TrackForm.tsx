"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackForm() {
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <form
      className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        const id = value.trim();
        if (id) router.push(`/order/${encodeURIComponent(id)}`);
      }}
    >
      <div className="flex-1">
        <label htmlFor="orderNumber" className="field-label">
          Order number
        </label>
        <input
          id="orderNumber"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          autoComplete="off"
          className="field"
        />
      </div>
      <button type="submit" className="btn-ink">
        Track order
      </button>
    </form>
  );
}
