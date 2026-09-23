import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";

const videoUrl = "/static/workspace-demo/index.html";

export function ProductVideoSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <HomeReveal>
          <div className="relative w-full rounded-2xl pt-[56.25%]">
            {/* 16:9 aspect ratio */}
            <iframe
              src={videoUrl.toString()}
              title="Ruby product overview"
              allow="autoplay; fullscreen"
              frameBorder="0"
              className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl"
            />
          </div>
        </HomeReveal>
      </div>
    </section>
  );
}
