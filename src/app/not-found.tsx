import Link from "next/link";
import { SplitText } from "@/components/Reveal";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col justify-center">
      <SplitText text="This page stopped moving." className="text-[clamp(2.4rem,6vw,5.6rem)] leading-none tracking-[-0.015em]" />
      <Link href="/" className="pill mt-10 w-fit text-lg">
        Back to Resource <span className="arrow">→</span>
      </Link>
    </div>
  );
}
