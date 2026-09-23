// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import { H1, P } from "@marketing/components/home/ContentComponents";
import { HeroVisual } from "@marketing/components/home/content/Product/HeroVisual";
import TrustedBy from "@marketing/components/home/TrustedBy";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
} from "@marketing/lib/marketing_visibility";
import { LegacyButton as Button, Rocket02 } from "@ruby-ai/ui";
import Link from "next/link";
import { useState } from "react";

export function ProductIntroSection() {
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const showDemoVideo = isMarketingSurfaceVisible(MARKETING_SURFACES.demoVideo);

  return (
    <div className="sm:pt-18 w-full pt-12 lg:pt-36">
      <div className="flex flex-col gap-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:gap-2 sm:px-6">
          <H1 className="title-display text-center text-5xl font-normal tracking-[-0.05em] md:text-6xl lg:text-7xl">
            Build your team of&nbsp;AI&nbsp;agents
          </H1>
          <P size="lg" className="text-base text-muted-foreground sm:text-lg">
            Ruby empowers teams to create agents that actually understand your
            company context,&nbsp; fully customized to match how you actually
            work. Deploy everything from simple workflows to complex enterprise
            integrations.
          </P>
          <div className="mt-4 flex flex-row justify-center gap-4">
            <Link href="/home/pricing" shallow={true}>
              <Button
                variant="primary"
                size="md"
                label="Try Ruby Now"
                icon={Rocket02}
              />
            </Link>
            <Link href="/home/contact" shallow={true}>
              <Button variant="outline" size="md" label="Contact Sales" />
            </Link>
          </div>
        </div>
        <HeroVisual
          showVideo={showDemoVideo && showHeroVideo}
          showVideoControl={showDemoVideo}
          onWatch={() => {
            if (showDemoVideo) {
              setShowHeroVideo(true);
            }
          }}
        />
        {isMarketingSurfaceVisible(MARKETING_SURFACES.customerProof) && (
          <div className="mt-16">
            <TrustedBy />
          </div>
        )}
      </div>
    </div>
  );
}
