import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('single-screen layout contract', () => {
  const css = readFileSync('app/globals.css', 'utf8');

  it('loads both supplied fonts and locks the experience to 16:9 without scrolling', () => {
    expect(css).toContain('font-family: "Ruby Serif"');
    expect(css).toContain('font-family: "Sohne"');
    expect(css).toContain('aspect-ratio: 16 / 9');
    expect(css).toMatch(/overflow:\s*hidden/);
  });

  it('uses responsive columns, the lime brand accent, and an unadorned conversation', () => {
    expect(css).toMatch(/grid-template-columns:[^;]*clamp\(/);
    expect(css.toLowerCase()).toContain('#c7ff3d');
    expect(css).not.toMatch(/\.conversation::(before|after)/);
  });

  it('keeps the long server title compact', () => {
    expect(css).toMatch(
      /\.server-header h1\s*\{[\s\S]*?font-size:\s*clamp\(14px,\s*1\.1vw,\s*18px\)/,
    );
    expect(css).toMatch(/\.server-header h1\s*\{[\s\S]*?font-weight:\s*900/);
    expect(css).toMatch(/\.server-header h1\s*\{[\s\S]*?line-height:\s*1\.2/);
  });

  it('does not add a lime stripe to the active channel', () => {
    expect(css).not.toContain('box-shadow: inset 3px 0 0 var(--lime)');
  });

  it('styles compact logo tiles, workspace tooltips, and animated content swaps', () => {
    expect(css).toMatch(/\.server-logo\s*\{[\s\S]*?width:\s*clamp\(28px,\s*2\.4vw,\s*37px\)/);
    expect(css).toMatch(/\.workspace-rail-tooltip\s*\{[\s\S]*?white-space:\s*nowrap/);
    expect(css).toContain('@keyframes workspace-blur-in');
  });

  it('restores workspace hover motion and an unclipped platform-aware active bar', () => {
    expect(css).toMatch(/\.server-logo:hover,[\s\S]*?transform:\s*translateY\(-1px\) scale\(1\.06\)/);
    expect(css).toMatch(/\.server-tile-shell\.is-active::before\s*\{[^}]*left:\s*0[^}]*width:\s*3px/);
    expect(css).toMatch(/\.platform-slack \.server-tile-shell\.is-active::before\s*\{[^}]*background:\s*#fff/);
    expect(css).toMatch(/\.workspace-rail-tooltip\s*\{[^}]*position:\s*absolute[^}]*z-index:/);
    expect(css).not.toMatch(/\.server-title-meta::after\s*\{/);
    expect(css).toMatch(/html,\s*body\s*\{[^}]*overflow:\s*hidden/);
  });

  it('uses explicit light artifact colors and semantic route dots', () => {
    expect(css).toMatch(/\.theme-light \.scenario-artifact\s*\{[^}]*--artifact-surface:\s*#fff[^}]*--artifact-text:\s*#1f2933/);
    expect(css).toMatch(/\.bespoke-map-routes button i\.is-info\s*\{[^}]*background:\s*var\(--artifact-accent\)/);
    expect(css).toMatch(/\.bespoke-map-routes button i\.is-success\s*\{[^}]*background:\s*var\(--artifact-positive\)/);
  });

  it('animates workspace logos without changing the rail layout', () => {
    expect(css).toMatch(/\.server-tile-shell\s*\{[^}]*width:\s*100%/);
    expect(css).toMatch(/\.server-logo:hover,[\s\S]*?transform:\s*translateY\(-1px\) scale\(1\.06\)/);
  });

  it('uses a blue verified mark, color platform images, and aligned channel title', () => {
    expect(css.toLowerCase()).toContain('#1d9bf0');
    expect(css).not.toContain('filter: grayscale');
    expect(css).toMatch(/\.channel-title\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.channel-button\.is-active \.channel-hash\s*\{[\s\S]*?color:\s*#4f8fc8/);
    expect(css).toMatch(/\.channel-hash,[\s\S]*?\.header-hash\s*\{[\s\S]*?display:\s*inline-grid[\s\S]*?place-items:\s*center/);
    expect(css).toMatch(/\.channel-button > span\s*\{[\s\S]*?line-height:\s*1/);
  });

  it('keeps all company tiles viable in narrow viewports and respects reduced motion', () => {
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.server-logo\s*\{[\s\S]*?width:/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.content-swap\s*\{[\s\S]*?animation-duration:\s*0\.01ms/);
  });

  it('switches to a full-height single-column mobile workspace instead of shrinking 16:9', () => {
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.app-stage\s*\{[\s\S]*?padding:\s*0/);
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.workspace-frame\s*\{[\s\S]*?width:\s*100%[\s\S]*?height:\s*100dvh[\s\S]*?aspect-ratio:\s*auto[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.server-rail\s*\{[\s\S]*?flex-direction:\s*row/);
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.server-list-scroll\s*\{[\s\S]*?flex-direction:\s*row[\s\S]*?overflow-x:\s*auto/);
    expect(css).toMatch(/@media \(max-width: 720px\)[\s\S]*?\.channel-list\s*\{[\s\S]*?flex-direction:\s*row[\s\S]*?overflow-x:\s*auto[\s\S]*?overflow-y:\s*hidden/);
  });

  it('gives each native mobile shell full-height chat, drawers, tabs, and safe-area chrome', () => {
    expect(css).toMatch(/\.mobile-workspace\s*\{[\s\S]*?width:\s*100vw[\s\S]*?height:\s*100dvh/);
    expect(css).toMatch(/\.mobile-chat-canvas\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0,\s*1fr\) auto/);
    expect(css).toMatch(/\.mobile-drawer\s*\{[\s\S]*?width:\s*min\(86vw,\s*380px\)/);
    expect(css).toMatch(/\.mobile-bottom-tabs\s*\{[\s\S]*?padding-bottom:\s*env\(safe-area-inset-bottom\)/);
    expect(css).toMatch(/\.mobile-platform-float\s*\{[\s\S]*?position:\s*fixed[\s\S]*?z-index:/);
    expect(css).toMatch(/\.mobile-shell button\s*\{[\s\S]*?min-width:\s*44px[\s\S]*?min-height:\s*44px/);
    expect(css).toMatch(/@media \(max-height: 460px\) and \(orientation: landscape\)[\s\S]*?\.app-stage\s*\{[\s\S]*?padding:\s*0/);
  });

  it('uses a compact horizontal mobile platform switcher without a reserved gap', () => {
    expect(css).not.toMatch(/\.mobile-switcher-reserve\s*\{/);
    expect(css).toMatch(/\.mobile-platform-options\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*48px\)/);
    expect(css).toMatch(/\.mobile-platform-options button span\s*\{[\s\S]*?position:\s*absolute/);
    expect(css).toMatch(/\.mobile-platform-trigger\s*\{[^}]*position:\s*relative[^}]*width:\s*48px[^}]*min-height:\s*48px/);
    expect(css).toMatch(/\.mobile-platform-options button\s*\{[^}]*min-width:\s*48px[^}]*min-height:\s*48px[^}]*border:\s*0[^}]*background:\s*transparent/);
    expect(css).toMatch(/\.mobile-platform-trigger img,[\s\S]*?\.mobile-platform-options img\s*\{[^}]*width:\s*28px[^}]*height:\s*28px/);
  });

  it('makes Slack and Teams chat views span the full mobile shell', () => {
    expect(css).toMatch(
      /\.slack-mobile-shell > \.mobile-chat-view,[\s\S]*?\.teams-mobile-shell > \.mobile-chat-view\s*\{[^}]*grid-row:\s*1\s*\/\s*-1/,
    );
  });

  it('uses a faded green treatment for Max account tags', () => {
    expect(css).toMatch(/\.plan-max\s*\{[\s\S]*?background:\s*#dcead7[\s\S]*?color:\s*#496244/);
  });

  it('gives the full desktop workspace rail comfortable icon spacing', () => {
    expect(css).toMatch(/\.server-rail\s*\{[^}]*gap:\s*clamp\(7px,\s*0\.75vw,\s*12px\)/);
  });

  it('scrolls only the message log and keeps the composer above it', () => {
    expect(css).toMatch(/\.conversation-scroll\s*\{[\s\S]*?overflow-y:\s*auto/);
    expect(css).toMatch(/\.conversation-scroll\s*\{[\s\S]*?scrollbar-color:/);
    expect(css).toMatch(/\.composer-dock\s*\{[\s\S]*?z-index:\s*[1-9]/);
    expect(css).toMatch(/\.conversation\s*\{[\s\S]*?overflow:\s*hidden/);
  });

  it('centers every platform label against its icon', () => {
    expect(css).toMatch(
      /\.platform-switcher button > span\s*\{[\s\S]*?display:\s*inline-flex[\s\S]*?align-items:\s*center[\s\S]*?line-height:\s*1/,
    );
  });

  it('uses unboxed tool runs, soft action cards, and a rounded-square Ruby avatar', () => {
    const toolRun = css.match(/\.ruby-tool-run\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(toolRun).not.toMatch(/(?:background|border|padding):/);
    expect(css).toMatch(/\.ruby-tool-card\s*\{[\s\S]*?background:\s*#fbfbfc/);
    expect(css).toMatch(/\.ruby-response-header img\s*\{[\s\S]*?border-radius:\s*9px/);
  });

  it('gives Slack messages and Teams posts distinct platform-native surfaces', () => {
    expect(css).toMatch(/\.slack-message-stream\s*\{[\s\S]*?background:\s*#fff/);
    expect(css).toMatch(/\.slack-message\s*\{[\s\S]*?grid-template-columns:/);
    expect(css).toMatch(/\.teams-chat-stream\s*\{[\s\S]*?background:\s*#fff/);
    expect(css).toMatch(/\.teams-chat-bubble\s*\{[\s\S]*?border-radius:/);
  });

  it('keeps industry subtitles bold and in their stored title case', () => {
    const industryTag = css.match(/\.industry-tag\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(industryTag).toMatch(/font-weight:\s*700/);
    expect(industryTag).toMatch(/text-transform:\s*none/);
  });

  it('uses larger, tighter platform messages without nested result cards', () => {
    expect(css).not.toMatch(/\.slack-block-card\s*\{/);
    expect(css).toMatch(/\.slack-message-body > p\s*\{[\s\S]*?font-size:\s*clamp\(13px/);
    const teamsResult = css.match(/\.teams-result-summary\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(teamsResult).not.toMatch(/(?:background|border):/);
    expect(css).toMatch(/\.teams-post-card > p\s*\{[\s\S]*?font-size:\s*clamp\(12px/);
  });

  it('centers both platform feeds and keeps integration receipts visually open', () => {
    expect(css).toMatch(/\.slack-feed-content\s*\{[\s\S]*?width:\s*min\(92%,\s*880px\)[\s\S]*?margin:\s*0 auto/);
    expect(css).toMatch(/\.teams-feed-content\s*\{[\s\S]*?width:\s*min\(100%,\s*820px\)[\s\S]*?margin:\s*0 auto/);

    const slackTools = css.match(/\.slack-tool-receipts > span\s*\{([^}]*)\}/)?.[1] ?? '';
    const teamsTools = css.match(/\.teams-tool-receipts > span\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(slackTools).not.toMatch(/(?:background|border):/);
    expect(teamsTools).not.toMatch(/(?:background|border):/);
  });

  it('keeps the Slack message cluster compact and vertically balanced', () => {
    const feed = css.match(/\.slack-feed-content\s*\{([^}]*)\}/)?.[1] ?? '';
    const body = css.match(/\.slack-message-body > p\s*\{([^}]*)\}/)?.[1] ?? '';
    const title = css.match(/\.slack-result-summary h2\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(feed).toMatch(/display:\s*flex/);
    expect(feed).toMatch(/justify-content:\s*flex-start/);
    expect(feed).toMatch(/min-height:\s*calc\(100%\s*-\s*96px\)/);
    expect(feed).toMatch(/padding:\s*14px/);
    expect(body).toMatch(/font-size:\s*clamp\(12px,\s*0\.9vw,\s*14px\)/);
    expect(title).toMatch(/font-size:\s*clamp\(14px,\s*1vw,\s*16px\)/);
    const thread = css.match(/\.slack-thread\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(thread).toMatch(/width:\s*100%/);
    expect(thread).not.toMatch(/(?:transform|zoom):/);
  });

  it('keeps Slack text-first responses free of artifact rails', () => {
    const textFirst = css.match(/\.slack-result-summary\.is-text-first\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(textFirst).toMatch(/padding:\s*0/);
    expect(textFirst).toMatch(/box-shadow:\s*none/);
    expect(css).toMatch(
      /\.slack-result-summary\.is-text-first \.conversation-paragraph\.is-completion\s*\{[^}]*border-left:\s*0[^}]*padding-left:\s*0/,
    );
  });

  it('makes the Slack reply preview easy to read', () => {
    expect(css).toMatch(/\.slack-thread-summary\s*\{[\s\S]*?font-size:\s*clamp\(10px,\s*0\.85vw,\s*13px\)/);
    expect(css).toMatch(/\.slack-reply-avatars img\s*\{[\s\S]*?width:\s*24px[\s\S]*?height:\s*24px/);
  });

  it('fills the Slack top area with a channel identity and navigation header', () => {
    expect(css).toMatch(/\.slack-channel-header\s*\{[\s\S]*?min-height:\s*96px[\s\S]*?border-bottom:/);
    expect(css).toMatch(/\.slack-channel-tabs\s*\{[\s\S]*?display:\s*flex/);
  });

  it('positions Slack reply and more actions on the message edge', () => {
    expect(css).toMatch(/\.slack-message-actions\s*\{[\s\S]*?position:\s*absolute[\s\S]*?right:\s*2px/);
    expect(css).toMatch(/\.slack-message\s*\{[\s\S]*?position:\s*relative/);
  });

  it('separates the user and Ruby Slack messages', () => {
    expect(css).toMatch(/\.slack-ruby-message\s*\{[\s\S]*?margin-top:\s*16px/);
  });

  it('uses pointer cursors for buttons and visual action affordances', () => {
    const button = css.match(/button\s*\{([^}]*)\}/)?.[1] ?? '';
    const slackReaction = css.match(/\.slack-reactions span\s*\{([^}]*)\}/)?.[1] ?? '';
    const teamsReaction = css.match(/\.teams-reactions > span\s*\{([^}]*)\}/)?.[1] ?? '';
    const composerDock = css.match(/(?:^|\n)\.composer-dock\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(button).toMatch(/cursor:\s*pointer/);
    expect(slackReaction).toMatch(/cursor:\s*pointer/);
    expect(teamsReaction).toMatch(/cursor:\s*pointer/);
    expect(composerDock).toMatch(/pointer-events:\s*auto/);
  });

  it('gives Ruby, Slack, and Teams distinct navigation treatments', () => {
    expect(css).toMatch(/\.ruby-conversation-list\s*\{[\s\S]*?background:\s*#f7f8f9/);
    expect(css).toMatch(/\.platform-slack \.workspace-frame\s*\{[\s\S]*?background:\s*#fff/);
    expect(css).toMatch(/\.platform-slack \.workspace-frame::before\s*\{[\s\S]*?background:\s*linear-gradient/);
    expect(css).toMatch(/\.slack-sidebar-list\s*\{[\s\S]*?color:\s*#f8edf8/);
    expect(css).toMatch(/\.teams-sidebar-list\s*\{[\s\S]*?background:\s*#f4f4f8/);
  });

  it('keeps inactive Slack channels fully readable', () => {
    const slackChannel = css.match(/\.slack-channel-item\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(slackChannel).toMatch(/color:\s*#fff/);
    expect(slackChannel).toMatch(/font-weight:\s*400/);
    expect(slackChannel).toMatch(/opacity:\s*1/);
    expect(css).toMatch(/\.slack-channel-item\.is-active\s*\{[\s\S]*?font-weight:\s*600/);
  });

  it('styles Ruby and Teams conversation titles without hashtag treatment', () => {
    expect(css).toMatch(/\.platform-title-copy\s*\{[\s\S]*?flex-direction:\s*column/);
    expect(css).toMatch(/\.ruby-header-icon\s*\{[\s\S]*?border-radius:\s*8px/);
    expect(css).toMatch(/\.teams-header-icon\s*\{[\s\S]*?background:\s*#6264a7/);
  });

  it('keeps Ruby pod and conversation titles at platform-list scale', () => {
    expect(css).toMatch(/\.ruby-list-section-title\s*\{[\s\S]*?font-size:\s*clamp\(11px,\s*0\.85vw,\s*13px\)/);
    expect(css).toMatch(/\.ruby-pod-list span\s*\{[\s\S]*?min-height:\s*40px[\s\S]*?font-size:\s*clamp\(14px,\s*1\.05vw,\s*17px\)/);
    expect(css).toMatch(/\.ruby-history-item\s*\{[\s\S]*?min-height:\s*40px[\s\S]*?font-size:\s*clamp\(14px,\s*1\.05vw,\s*17px\)/);
  });

  it('forces inactive Slack channels and hashtags to full white', () => {
    expect(css).toMatch(/\.slack-channel-item:not\(\.is-active\)[\s\S]*?color:\s*#fff\s*!important/);
  });

  it('uses a neutral gray Slack hover and larger Teams channel rows', () => {
    expect(css).toMatch(/\.platform-slack \.slack-channel-item:hover:not\(\.is-active\)\s*\{[\s\S]*?background:\s*rgb\(255 255 255 \/ 18%\)/);
    expect(css).toMatch(/\.teams-group-row\s*\{[\s\S]*?min-height:\s*58px[\s\S]*?font-size:\s*clamp\(12px,\s*0\.9vw,\s*14px\)/);
  });

  it('matches Slack active rows and separates its gradient sections with lines', () => {
    expect(css).toMatch(/\.platform-slack \.slack-channel-item\.is-active\s*\{[\s\S]*?background:\s*#f7f7f7[\s\S]*?color:\s*#241126/);
    expect(css).toMatch(/\.platform-slack \.server-header\s*\{[\s\S]*?background:\s*transparent[\s\S]*?border-bottom:\s*0/);
    expect(css).toMatch(/\.platform-slack \.server-rail\s*\{[\s\S]*?border-right:\s*0/);
    expect(css).toMatch(/\.slack-sidebar-list \.sidebar-section-heading\s*\{[\s\S]*?border:\s*0/);
  });

  it('continues one Slack gradient through a glass channel palette', () => {
    expect(css).toMatch(/\.platform-slack \.server-rail[\s\S]*?background:\s*transparent/);
    expect(css).toMatch(/\.platform-slack \.channel-sidebar[\s\S]*?background:\s*transparent/);
    expect(css).toMatch(/\.slack-sidebar-list\s*\{[\s\S]*?background:\s*rgb\(255 255 255 \/ 8%\)[\s\S]*?backdrop-filter:\s*blur\(18px\)/);
  });

  it('contains the Slack gradient and removes excess sidebar outlines', () => {
    expect(css).toMatch(/\.platform-slack \.workspace-frame::before\s*\{[\s\S]*?width:\s*calc\(/);
    expect(css).toMatch(/\.platform-slack \.server-tile-shell\.is-active::before\s*\{[\s\S]*?background:\s*#fff/);
    const glass = css.match(/\.slack-sidebar-list\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(glass).toMatch(/border:\s*0/);
    expect(css).toMatch(/\.platform-slack \.user-panel\s*\{[\s\S]*?border-top:\s*0/);
  });

  it('centers Ruby Pod text against fixed icon boxes', () => {
    expect(css).toMatch(/\.ruby-pod-list i\s*\{[\s\S]*?display:\s*inline-grid[\s\S]*?width:\s*16px[\s\S]*?height:\s*16px[\s\S]*?place-items:\s*center/);
    expect(css).toMatch(/\.ruby-pod-list span\s*\{[\s\S]*?line-height:\s*1/);
    expect(css).toMatch(/\.ruby-pod-list i::before\s*\{[\s\S]*?transform:\s*translateY\(1px\)/);
  });

  it('prevents navigation lists from creating horizontal scroll', () => {
    expect(css).toMatch(/\.channel-list\s*\{[\s\S]*?overflow-x:\s*hidden/);
    expect(css).toMatch(/\.teams-group-row\s*\{[\s\S]*?width:\s*100%/);
  });

  it('keeps sidebar utilities pinned while only navigation lists scroll', () => {
    expect(css).toMatch(/\.workspace-frame\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0,\s*1fr\)/);
    expect(css).toMatch(/\.channel-sidebar\s*\{[\s\S]*?min-height:\s*0[\s\S]*?overflow:\s*hidden/);
    expect(css).toMatch(/\.channel-list\s*\{[\s\S]*?min-height:\s*0[\s\S]*?flex:\s*1[\s\S]*?overflow-y:\s*auto/);
    expect(css).toMatch(/\.user-panel\s*\{[\s\S]*?flex:\s*0 0 auto/);
    const serverScroll = css.match(/\.server-list-scroll\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(serverScroll).toMatch(/min-height:\s*0/);
    expect(serverScroll).toMatch(/overflow-x:\s*hidden/);
    expect(serverScroll).toMatch(/overflow-y:\s*auto/);
  });

  it('aligns integration logos to the surrounding text baseline', () => {
    const inline = css.match(/\.inline-integration\s*\{([^}]*)\}/)?.[1] ?? '';
    const icon = css.match(/\.inline-integration \.integration-brand-icon,[\s\S]*?\{([^}]*)\}/)?.[1] ?? '';
    expect(inline).toMatch(/display:\s*inline-flex/);
    expect(inline).toMatch(/align-items:\s*baseline/);
    expect(inline).toMatch(/vertical-align:\s*baseline/);
    expect(icon).toMatch(/align-self:\s*center/);
    expect(icon).toMatch(/display:\s*block/);
    expect(icon).toMatch(/width:\s*14px/);
    expect(icon).toMatch(/height:\s*14px/);
    expect(icon).toMatch(/min-width:\s*14px/);
    expect(icon).toMatch(/margin-right:\s*0/);
    expect(css).toMatch(
      /\.scenario-artifact \.inline-integration \.integration-brand-icon,[\s\S]*?\.scenario-artifact \.inline-integration \.integration-icon-fallback\s*\{[^}]*width:\s*11px[^}]*height:\s*11px[^}]*min-width:\s*11px/,
    );
  });

  it('gives Teams reactions and group titles more visual weight', () => {
    expect(css).toMatch(/\.teams-group-copy strong\s*\{[\s\S]*?font-size:\s*clamp\(14px,\s*1vw,\s*16px\)/);
    expect(css).toMatch(/\.teams-reactions > span\s*\{[\s\S]*?padding:\s*4px 8px[\s\S]*?font-size:\s*clamp\(11px,\s*0\.85vw,\s*13px\)/);
  });

  it('styles cross-platform deliverables and readable Teams narrative blocks', () => {
    expect(css).toMatch(/\.deliverable-card\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:/);
    expect(css).toMatch(/\.teams-conversation-copy\s*\{[^}]*display:\s*grid[^}]*gap:/);
    expect(css).toMatch(/\.teams-chat-message-body > header\s*\{[^}]*min-height:\s*32px[^}]*align-items:\s*center/);
  });

  it('styles reviewed artifacts as readable responsive systems', () => {
    const reviewed = css.match(/\.reviewed-completion-strip,[\s\S]*?\.reviewed-energy\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(reviewed).toMatch(/--artifact-accent:\s*#4b9fe1/);
    expect(css).toMatch(/\.reviewed-chart-canvas\s*\{[^}]*height:\s*clamp\(180px,\s*18vw,\s*230px\)/);
    expect(css).toMatch(/\.reviewed-completion-strip article > i\s*\{[^}]*background:\s*var\(--artifact-accent-soft\)[^}]*color:\s*var\(--artifact-accent\)/);
    expect(css).toMatch(/\.reviewed-completion-strip article > b\s*\{[^}]*color:\s*var\(--artifact-positive\)/);
    expect(css).toMatch(/\.bespoke-map-routes button\.is-danger i,[\s\S]*?\.bespoke-assignment-table em\.is-danger\s*\{[^}]*color:\s*var\(--artifact-danger\)/);
    expect(css).toMatch(/\.reviewed-signature\s*\{[^}]*font-size:\s*13px/);
    expect(css).toMatch(/@container \(max-width: 560px\)[\s\S]*?\.cold-chain-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  });

  it('uses a floating sidebar scrollbar without changing its width', () => {
    expect(css).toMatch(/\.channel-list::-webkit-scrollbar\s*\{[^}]*width:\s*10px/);
    expect(css).toMatch(/\.channel-list::-webkit-scrollbar-track\s*\{[^}]*margin-block:\s*10px[^}]*background:\s*transparent/);
    expect(css).toMatch(/\.channel-list::-webkit-scrollbar-thumb\s*\{[^}]*border:\s*2px solid transparent[^}]*background-clip:\s*padding-box/);
    expect(css).toMatch(/\.platform-slack \.channel-list::-webkit-scrollbar-thumb\s*\{[^}]*background:/);
  });

  it('uses blue selection, red risk, and centered integration tool cards', () => {
    const darkArtifact = css.match(/\.theme-dark \.scenario-artifact\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(darkArtifact).toMatch(/--artifact-accent:\s*#4b9fe1/);
    expect(darkArtifact).toMatch(/--artifact-warning:\s*var\(--artifact-danger\)/);
    expect(css).toMatch(/\.ruby-tool-copy\s*\{[^}]*justify-content:\s*center/);
    expect(css).toMatch(/\.ruby-tool-check\s*\{[^}]*align-self:\s*center/);
    expect(css).toMatch(/\.artifact-variant-query-plan \.bespoke-console-widget > header button\s*\{[^}]*background:\s*var\(--artifact-positive\)/);
  });

  it('styles the Vector, Stonebridge, and Loom artifacts responsively', () => {
    expect(css).toMatch(/\.batch-widget-header\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.batch-chart\s*\{[^}]*height:\s*clamp\(180px,\s*18vw,\s*230px\)/);
    expect(css).toMatch(/\.code-review-layout\s*\{[^}]*grid-template-columns:\s*150px minmax\(0,\s*1fr\)/);
    expect(css).toMatch(/\.shop-product-list\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    expect(css).toMatch(/\.shop-product-list img\s*\{[^}]*object-fit:\s*cover/);
    expect(css).toMatch(/@container \(max-width: 560px\)[\s\S]*?\.code-review-layout\s*\{[^}]*grid-template-columns:\s*1fr/);
    expect(css).toMatch(/@container \(max-width: 560px\)[\s\S]*?\.shop-product-list\s*\{[^}]*grid-template-columns:\s*1fr/);
  });

  it('styles the theme toggle and a complete dark workspace surface', () => {
    expect(css).toMatch(/\.theme-toggle\s*\{[\s\S]*?border-radius:\s*50%/);
    expect(css).toMatch(/\.theme-dark \.workspace-frame\s*\{[\s\S]*?background:\s*var\(--theme-frame\)/);
    expect(css).toMatch(/\.theme-dark \.chat-panel\s*\{[\s\S]*?background:\s*var\(--theme-canvas\)/);
  });

  it('uses distinct product-accurate dark palettes without replacing the Slack gradient', () => {
    expect(css).toMatch(/\.theme-dark\.platform-ruby\s*\{[\s\S]*?--theme-canvas:\s*#262624[\s\S]*?--theme-composer:\s*#30302e/);
    expect(css).toMatch(/\.theme-dark\.platform-slack\s*\{[\s\S]*?--theme-canvas:\s*#1a1d21[\s\S]*?--theme-surface:\s*#222529[\s\S]*?--theme-text:\s*#d1d2d3[\s\S]*?--theme-accent:\s*#1d9bd1/);
    expect(css).toMatch(/\.theme-dark\.platform-teams\s*\{[\s\S]*?--theme-canvas:\s*#292929[\s\S]*?--theme-surface:\s*#1f1f1f[\s\S]*?--theme-deep:\s*#141414[\s\S]*?--theme-accent:\s*#7f85f5/);

    const slackDarkGradient = css.match(/\.theme-dark\.platform-slack \.workspace-frame::before\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(slackDarkGradient).not.toMatch(/background:/);
  });

  it('animates theme surface changes while respecting reduced motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.workspace-frame[\s\S]*?transition:[\s\S]*?background-color/);
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?transition-duration:\s*0\.01ms\s*!important/);
  });

  it('keeps the Teams chat-list heading visible in dark mode', () => {
    expect(css).toMatch(/\.theme-dark\.platform-teams \.teams-chat-list-header strong\s*\{[\s\S]*?color:\s*var\(--theme-text\)/);
  });

  it('keeps the Ruby dark-mode send control blue', () => {
    const rubyDarkSend = css.match(/\.theme-dark\.platform-ruby \.send-orb\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(rubyDarkSend).toMatch(/background:\s*#4b9fe1/);
    expect(rubyDarkSend).toMatch(/box-shadow:\s*none/);
  });

  it('keeps generated artifacts flat and horizontally contained', () => {
    const artifact = css.match(/\.scenario-artifact\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(artifact).toMatch(/max-width:\s*100%/);
    expect(artifact).toMatch(/box-shadow:\s*none/);
    expect(artifact).not.toMatch(/radial-gradient/);
  });

  it('uses the sans-serif conversation face for scenario prose', () => {
    expect(css).toMatch(/\.scenario-opening\s*\{[\s\S]*?font-family:\s*"Sohne"/);
    expect(css).toMatch(/\.conversation \.bespoke-document-page strong\s*\{[\s\S]*?font-family:\s*"Sohne"/);
  });

  it('aligns Ruby active rows and removes Slack message hover fills', () => {
    const row = css.match(/\.ruby-history-item\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(row).toMatch(/width:\s*calc\(100% - 4px\)/);
    expect(row).toMatch(/margin-inline:\s*2px/);
    expect(row).toMatch(/padding:\s*0 8px/);
    expect(css).not.toMatch(/\.slack-message:hover\s*\{/);
    expect(css).not.toMatch(/\.theme-dark\.platform-slack \.slack-message:hover\s*\{/);
  });

  it('reserves composer clearance in every platform conversation', () => {
    expect(css).toMatch(/\.conversation\s*\{[\s\S]*?--composer-clearance:/);
    expect(css).toMatch(/\.slack-feed-content\s*\{[\s\S]*?padding:[^;]*var\(--composer-clearance\)/);
  });
});
