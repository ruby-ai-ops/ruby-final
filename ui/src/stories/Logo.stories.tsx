import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Div3D, Hover3D } from "..";
import {
  RubyLogo,
  RubyLogoGray,
  RubyLogoLayer1,
  RubyLogoLayer2,
  RubyLogoSquare,
  RubyLogoSquareGray,
  RubyLogoSquareLayer1,
  RubyLogoSquareLayer2,
  RubyLogoSquareWhite,
  RubyLogoWhite,
} from "../logo/ruby";

const meta = {
  title: "Assets/Logo/Ruby Logo",
  tags: ["!manifest", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The Ruby logo assets (\`@ui/logo/ruby\`): wordmark and square marks, including white, gray, and layered variants for 3D/parallax treatments. Import the variant that suits the background and context rather than recreating the mark. Reach for **RubyLogoWhite** / **RubyLogoSquareWhite** on dark surfaces.`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "48px 16px",
};
const itemStyle = {
  marginTop: "12px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
  width: "100%",
};

export const RubyLogos: Story = {
  render: () => (
    <>
      <div style={gridStyle}>
        <div className="p-6">
          <RubyLogo className="h-8 w-32" />
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            RubyLogo
          </div>
        </div>
        <div className="p-6">
          <RubyLogoGray className="h-8 w-32" />
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            RubyLogoGray
          </div>
        </div>
        <div className="bg-primary-800 p-6">
          <RubyLogoWhite className="h-8 w-32" />
          <div
            style={itemStyle as React.CSSProperties}
            className="text-sm text-white"
          >
            RubyLogoWhite
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        <div className="p-6">
          <RubyLogoSquare className="h-16 w-16" />
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            RubyLogoSquare
          </div>
        </div>
        <div className="p-6">
          <RubyLogoSquareGray className="h-16 w-16" />
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            RubyLogoSquareGray
          </div>
        </div>
        <div className="bg-primary-800 p-6">
          <RubyLogoSquareWhite className="h-16 w-16" />
          <div
            style={itemStyle as React.CSSProperties}
            className="text-sm text-white"
          >
            RubyLogoWhite
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        <div className="p-6">
          <Hover3D className="relative h-8 w-32">
            <Div3D depth={0} className="h-8 w-32">
              <RubyLogoLayer1 className="h-8 w-32" />
            </Div3D>
            <Div3D depth={25} className="absolute top-0">
              <RubyLogoLayer2 className="h-8 w-32" />
            </Div3D>
          </Hover3D>
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            Horizontal Hover3D
          </div>
        </div>
        <div className="p-6">
          <Hover3D className="relative h-16 w-16">
            <Div3D depth={0} className="h-16 w-16">
              <RubyLogoSquareLayer1 className="h-16 w-16" />
            </Div3D>
            <Div3D depth={25} className="absolute top-0">
              <RubyLogoSquareLayer2 className="h-16 w-16" />
            </Div3D>
          </Hover3D>
          <div style={itemStyle as React.CSSProperties} className="text-sm">
            Square Hover3D
          </div>
        </div>
      </div>
    </>
  ),
};
