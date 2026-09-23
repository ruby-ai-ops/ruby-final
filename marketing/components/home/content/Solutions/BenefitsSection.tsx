import { ImgBlock } from "@marketing/components/home/ContentBlocks";
import { H2 } from "@marketing/components/home/ContentComponents";
import { Avatar, Icon } from "@ruby-ai/ui";

type RubyUIIcon = React.ComponentType<{
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}>;

export interface BenefitsProps {
  sectionTitle?: string;
  items: {
    icon: RubyUIIcon;
    title: string;
    description: string;
  }[];
}

export interface MetricProps {
  metrics: {
    value: string;
    description: React.ReactNode;
  }[];
  color?: "blue" | "green" | "rose" | "golden";
}

interface BenefitsSectionProps {
  benefits: BenefitsProps;
  page?: string;
}

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  return (
    <section className="mt-16 w-full">
      {benefits.sectionTitle && (
        <div className="mb-8">
          <H2>{benefits.sectionTitle}</H2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-8">
        {benefits.items.map((benefit, index) => (
          <ImgBlock
            key={index}
            title={
              <div className="md:text-left">
                <span className="font-['Bricolage_Grotesque'] tracking-[-0.05em]">
                  {benefit.title}
                </span>
              </div>
            }
            content={<>{benefit.description}</>}
            className="h-full flex-1 md:text-left"
          >
            <div className="relative flex h-8 items-center justify-center sm:justify-start">
              <Avatar
                size="xl"
                visual={
                  <Icon
                    visual={benefit.icon}
                    className="text-sky-500"
                    size="xl"
                  />
                }
              />
            </div>
          </ImgBlock>
        ))}
      </div>
    </section>
  );
}
