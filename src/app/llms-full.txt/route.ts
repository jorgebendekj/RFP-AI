import { BLOG_POSTS } from "@/lib/blogPosts";
import { postToMarkdown } from "@/lib/blogMarkdown";
import { SITE_URL, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const header = [
    `# ${SITE_NAME} — full content`,
    `> Free, independent service by Ribentek (not affiliated with the Bolivian State). Reads active tenders from the official SICOES portal (sicoes.gob.bo) and emails a daily AI-ranked digest at 9am Bolivia time. Site: ${SITE_URL}. Support: ${SUPPORT_EMAIL}.`,
    "All guides below are in Spanish (es-BO). Always verify thresholds, deadlines and requirements on sicoes.gob.bo and in each process's DBC.",
  ].join("\n\n");
  const body = [header, ...BLOG_POSTS.map(postToMarkdown)].join("\n\n---\n\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
