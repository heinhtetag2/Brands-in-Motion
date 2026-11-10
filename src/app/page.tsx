import { ResourceGrid } from "@/components/ResourceGrid";
import { posts } from "@/lib/data";

export default function Home() {
  return <ResourceGrid posts={posts} />;
}
