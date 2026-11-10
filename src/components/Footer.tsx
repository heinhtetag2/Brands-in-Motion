import Link from "next/link";
import { site } from "@/lib/data";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";

const cols: Array<{ title: string; links: Array<[string, string]> }> = [
  { title: "NAV", links: [["Resource", "/"], ["Information", "/information"]] },
  { title: "INFO", links: [["Get Featured", `mailto:${site.email}`], ["Feature Guide", "/information"]] },
  { title: "FIND", links: [["Talent", "/directory"], ["Your Agency", "/partner"]] },
  { title: "DIRECTORY", links: [["Apply to The Directory", "/partner"], ["Directory Guide", "/directory"]] },
];

// Column positions from the reference at 1440px: 275px apart, copyright 81px below.
export function Footer() {
  return (
    <footer className="gutter relative mt-[150px] pb-[21px]">
      <hr className="absolute inset-x-[4vw] top-[9px] border-[#808080]" />

      {/* Contact row: big line on the left, form on the right */}
      <Reveal className="grid gap-8 pt-[60px] md:grid-cols-[repeat(2,19.1vw)_1fr] md:items-end">
        <h2 className="t-h2 md:col-span-1">Let&rsquo;s talk.</h2>
        <ContactForm />
      </Reveal>

      <Reveal className="mt-[80px] grid grid-cols-2 gap-y-10 md:grid-cols-[repeat(4,19.1vw)_1fr] md:gap-y-0">
        {cols.map((col) => (
          <div key={col.title} className="md:w-[14.5vw]">
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
        <div className="md:w-[154px] md:justify-self-end">
          <h4 className="mb-[11px]">CONTACT</h4>
          <ul className="leading-[1.2]">
            <li><a className="u-hover" href={`mailto:${site.email}`}>Email</a></li>
            <li><a className="u-hover" href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a className="u-hover" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </Reveal>

      <p className="mt-[81px] text-[13.5px] uppercase leading-[1.2]">
        ©{site.name} 2026 | All images © their respective owners
      </p>
    </footer>
  );
}
