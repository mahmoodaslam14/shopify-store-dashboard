import { IconSparkles } from "@/components/dashboard-icons";
import { SubmissionsPanel } from "@/components/SubmissionsPanel";
import { PageHeader } from "@/components/ui";

export default function SubmissionsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100/90 px-3 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-200/80">
            <IconSparkles className="h-3.5 w-3.5 text-amber-500" />
            Social proof
          </span>
        }
        title="Social posts & cashback"
        description="Drop a public link to your content featuring the brand. We try to load a
          rich preview (title, image, description) from open-graph tags — Instagram and
          TikTok often block automated fetches, so you may see a styled fallback. Your
          link is still submitted either way."
      />
      <SubmissionsPanel />
    </div>
  );
}
