'use client';

/* oxlint-disable next/no-img-element -- project-bound generated demo media uses local WebP assets. */

export type ArtifactMedia = {
  src: string;
  alt: string;
  title: string;
  metadata: string[];
  tone?: 'neutral' | 'success' | 'risk';
};

export function ArtifactMediaCard({ media, className = '' }: { media: ArtifactMedia; className?: string }) {
  return <article className={`artifact-media-card is-${media.tone ?? 'neutral'} ${className}`.trim()}><img src={media.src} alt={media.alt} onError={(event) => event.currentTarget.classList.add('is-missing')} /><span><strong>{media.title}</strong>{media.metadata.map((item) => <small key={item}>{item}</small>)}</span></article>;
}
