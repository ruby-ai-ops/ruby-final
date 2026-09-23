import { cn } from "@marketing/components/admin/shadcn/lib/utils";

interface HomeEyebrowProps {
  label: string;
  className?: string;
}

export function HomeEyebrow({ label, className }: HomeEyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2.5 text-slate-700",
        className
      )}
    >
      <span
        aria-hidden="true"
        data-home-eyebrow-rail="true"
        className="flex h-[18px] shrink-0 items-center gap-0.5"
      >
        <span className="h-[18px] w-[3px] bg-[#D5E7F7]" />
        <span className="h-3 w-[3px] bg-[#4D92DC]" />
        <span className="h-[7px] w-[3px] bg-[#91BCE5]" />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px]">
        {label}
      </span>
    </span>
  );
}
