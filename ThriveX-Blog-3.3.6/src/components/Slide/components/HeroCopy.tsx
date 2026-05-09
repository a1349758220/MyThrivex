'use client';

interface Props {
  isDark: boolean;
}

export default function HeroCopy({ isDark }: Props) {
  return (
    <div className={`home-hero-copy ${isDark ? 'home-hero-copy--dark' : ''}`} translate="no">
      {isDark ? (
        <p className="home-hero-title home-hero-title--dark" aria-label="于星河里散发微光" translate="no">
          <span translate="no">于星河里</span>
          <span translate="no">散发微光</span>
        </p>
      ) : (
        <p className="home-hero-title home-hero-title--light" aria-label="在寂静中观察世界" translate="no">
          <span translate="no">在寂静中</span>
          <span translate="no">观察世界</span>
        </p>
      )}
    </div>
  );
}
