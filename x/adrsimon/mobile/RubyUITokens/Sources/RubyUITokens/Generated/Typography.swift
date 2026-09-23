// DO NOT EDIT — Generated from RubyUI (tailwind.config.js)
// Run: cd ui && node scripts/generate-swift.mjs


import SwiftUI

/// Font size definitions matching RubyUI's mobile typography scale.
public enum RubyUIFont {
    /// xs: mobile 15px / 23px line-height / normal tracking
    public static let xsSize: CGFloat = 15
    public static let xsLineHeight: CGFloat = 23
    public static let xsTracking: CGFloat = 0

    /// sm: mobile 17px / 26px line-height / -0.34px tracking
    public static let smSize: CGFloat = 17
    public static let smLineHeight: CGFloat = 26
    public static let smTracking: CGFloat = -0.34

    /// base: mobile 19px / 29px line-height / -0.38px tracking
    public static let baseSize: CGFloat = 19
    public static let baseLineHeight: CGFloat = 29
    public static let baseTracking: CGFloat = -0.38

    /// lg: mobile 22px / 32px line-height / -0.44px tracking
    public static let lgSize: CGFloat = 22
    public static let lgLineHeight: CGFloat = 32
    public static let lgTracking: CGFloat = -0.44

    /// xl: mobile 24px / 36px line-height / -0.48px tracking
    public static let xlSize: CGFloat = 24
    public static let xlLineHeight: CGFloat = 36
    public static let xlTracking: CGFloat = -0.48

    /// 2xl: mobile 30px / 44px line-height / -1.2px tracking
    public static let _2xlSize: CGFloat = 30
    public static let _2xlLineHeight: CGFloat = 44
    public static let _2xlTracking: CGFloat = -1.2

    /// 3xl: mobile 39px / 50px line-height / -1.56px tracking
    public static let _3xlSize: CGFloat = 39
    public static let _3xlLineHeight: CGFloat = 50
    public static let _3xlTracking: CGFloat = -1.56

    /// 4xl: mobile 49px / 64px line-height / -2.94px tracking
    public static let _4xlSize: CGFloat = 49
    public static let _4xlLineHeight: CGFloat = 64
    public static let _4xlTracking: CGFloat = -2.94

    /// 5xl: mobile 59px / 77px line-height / -3.54px tracking
    public static let _5xlSize: CGFloat = 59
    public static let _5xlLineHeight: CGFloat = 77
    public static let _5xlTracking: CGFloat = -3.54

    /// 6xl: mobile 68px / 89px line-height / -4.08px tracking
    public static let _6xlSize: CGFloat = 68
    public static let _6xlLineHeight: CGFloat = 89
    public static let _6xlTracking: CGFloat = -4.08

    /// 7xl: mobile 78px / 102px line-height / -4.68px tracking
    public static let _7xlSize: CGFloat = 78
    public static let _7xlLineHeight: CGFloat = 102
    public static let _7xlTracking: CGFloat = -4.68

    /// 8xl: mobile 88px / 115px line-height / -5.28px tracking
    public static let _8xlSize: CGFloat = 88
    public static let _8xlLineHeight: CGFloat = 115
    public static let _8xlTracking: CGFloat = -5.28

    /// 9xl: mobile 98px / 128px line-height / -5.88px tracking
    public static let _9xlSize: CGFloat = 98
    public static let _9xlLineHeight: CGFloat = 128
    public static let _9xlTracking: CGFloat = -5.88

}

// MARK: - Text Style View Modifiers

public extension View {

    /// RubyUI text style: s-label-xs
    func uiLabelXs() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.xsSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.xsTracking)
    }

    /// RubyUI text style: s-label-sm
    func uiLabelSm() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.smSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.smTracking)
    }

    /// RubyUI text style: s-label-base
    func uiLabelBase() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.baseSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.baseTracking)
    }

    /// RubyUI text style: s-heading-xs
    func uiHeadingXs() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.xsSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.xsTracking)
    }

    /// RubyUI text style: s-heading-sm
    func uiHeadingSm() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.smSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.smTracking)
    }

    /// RubyUI text style: s-heading-base
    func uiHeadingBase() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.baseSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.baseTracking)
    }

    /// RubyUI text style: s-heading-lg
    func uiHeadingLg() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.lgSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.lgTracking)
    }

    /// RubyUI text style: s-heading-xl
    func uiHeadingXl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.xlSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont.xlTracking)
    }

    /// RubyUI text style: s-heading2xl
    func uiHeading2xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._2xlSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont._2xlTracking)
    }

    /// RubyUI text style: s-heading3xl
    func uiHeading3xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._3xlSize))
            .fontWeight(.semibold)
            .tracking(RubyUIFont._3xlTracking)
    }

    /// RubyUI text style: s-heading4xl
    func uiHeading4xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._4xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._4xlTracking)
    }

    /// RubyUI text style: s-heading5xl
    func uiHeading5xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._5xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._5xlTracking)
    }

    /// RubyUI text style: s-heading6xl
    func uiHeading6xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._6xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._6xlTracking)
    }

    /// RubyUI text style: s-heading7xl
    func uiHeading7xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._7xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._7xlTracking)
    }

    /// RubyUI text style: s-heading8xl
    func uiHeading8xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._8xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._8xlTracking)
    }

    /// RubyUI text style: s-heading9xl
    func uiHeading9xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._9xlSize))
            .fontWeight(.medium)
            .tracking(RubyUIFont._9xlTracking)
    }

    /// RubyUI text style: s-heading-mono-lg
    func uiHeadingMonoLg() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont.lgSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.lgTracking)
    }

    /// RubyUI text style: s-heading-mono-xl
    func uiHeadingMonoXl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont.xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.xlTracking)
    }

    /// RubyUI text style: s-heading-mono2xl
    func uiHeadingMono2xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._2xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._2xlTracking)
    }

    /// RubyUI text style: s-heading-mono3xl
    func uiHeadingMono3xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._3xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._3xlTracking)
    }

    /// RubyUI text style: s-heading-mono4xl
    func uiHeadingMono4xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._4xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._4xlTracking)
    }

    /// RubyUI text style: s-heading-mono5xl
    func uiHeadingMono5xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._5xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._5xlTracking)
    }

    /// RubyUI text style: s-heading-mono6xl
    func uiHeadingMono6xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._6xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._6xlTracking)
    }

    /// RubyUI text style: s-heading-mono7xl
    func uiHeadingMono7xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._7xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._7xlTracking)
    }

    /// RubyUI text style: s-heading-mono8xl
    func uiHeadingMono8xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._8xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._8xlTracking)
    }

    /// RubyUI text style: s-heading-mono9xl
    func uiHeadingMono9xl() -> some View {
        self
            .font(.custom("Geist Mono", size: RubyUIFont._9xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._9xlTracking)
    }

    /// RubyUI text style: s-copy-xs
    func uiCopyXs() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.xsSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.xsTracking)
    }

    /// RubyUI text style: s-copy-sm
    func uiCopySm() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.smSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.smTracking)
    }

    /// RubyUI text style: s-copy-base
    func uiCopyBase() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.baseSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.baseTracking)
    }

    /// RubyUI text style: s-copy-lg
    func uiCopyLg() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.lgSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.lgTracking)
    }

    /// RubyUI text style: s-copy-xl
    func uiCopyXl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont.xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont.xlTracking)
    }

    /// RubyUI text style: s-copy2xl
    func uiCopy2xl() -> some View {
        self
            .font(.custom("Geist", size: RubyUIFont._2xlSize))
            .fontWeight(.regular)
            .tracking(RubyUIFont._2xlTracking)
    }

}
