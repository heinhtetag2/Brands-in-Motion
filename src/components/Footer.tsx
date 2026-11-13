import Link from "next/link";
import { site } from "@/lib/data";
import { Reveal } from "./Reveal";

const cols: Array<{ title: string; links: Array<[string, string]> }> = [
  { title: "NAV", links: [["Home", "/"], ["About", "/about"]] },
  { title: "INFO", links: [["Say hello", `mailto:${site.email}`], ["About me", "/about"]] },
  { title: "FIND", links: [["Works", "/works"], ["Contact", "/contact"]] },
  { title: "WORKS", links: [["All projects", "/works"], ["Start a project", "/contact"]] },
];

const contact: Array<[string, string]> = [
  ["Email", `mailto:${site.email}`],
  ["Instagram", site.instagram],
  ["LinkedIn", site.linkedin],
  ["Telegram", site.telegram],
];

export function Footer() {
  return (
    <footer className="gutter relative mt-[150px] pb-[21px]">
      <hr className="absolute inset-x-[4vw] top-[9px] border-[#808080]" />

      <Reveal className="grid grid-cols-2 gap-y-10 pt-[60px] md:grid-cols-4 md:gap-y-0">
        {cols.map((col) => (
          <div key={col.title}>
            <p className="mb-[11px]">{col.title}</p>
            <ul className="leading-[1.2]">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="u-hover">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      {/* Copyright on the left, contact links spread across the right */}
      <div className="mt-[81px] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 max-md:flex-col max-md:items-start">
        <p className="text-[13.5px] uppercase leading-[1.2]">
          ©{site.name} 2026 | All images © their respective owners
        </p>
        <ul className="flex flex-wrap gap-x-[5vw] gap-y-2 text-fg/60 max-md:gap-x-8">
          {contact.map(([label, href]) => (
            <li key={label}>
              <a className="u-hover" href={href} {...(href.startsWith("mailto") ? {} : { target: "_blank", rel: "noreferrer" })}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
