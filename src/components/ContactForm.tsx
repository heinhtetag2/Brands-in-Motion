"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/data";
import { easeExpo } from "./Reveal";

/**
 * Footer contact form. For now it opens the visitor's email app with a ready-to-send message
 * to site.email. To deliver straight to your inbox instead, connect an email service
 * (e.g. Resend via the Vercel Marketplace) and post to an API route.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const field =
    "w-full border-b border-line bg-transparent py-3 outline-none transition-colors placeholder:text-muted focus:border-fg";

  return (
    <form
      className="md:col-span-2"
      onSubmit={(e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Website enquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setSent(true);
      }}
    >
      <p className="mb-[11px]">GET IN TOUCH</p>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          autoComplete="name"
          className={`${field} sm:w-[22%] sm:shrink-0`}
        />
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Your email"
          className={`${field} sm:w-[28%] sm:shrink-0`}
        />
        <input
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project"
          aria-label="Message"
          className={field}
        />
        <button className="pill mt-4 shrink-0 !px-6 !py-[0.7em] !text-base sm:mt-0">
          Send <span className="arrow">→</span>
        </button>
      </div>
      <AnimatePresence>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeExpo }}
            className="mt-3 text-sm text-muted"
          >
            Your email app should open with the message ready to send.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
