'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import ICPIcon from '../../images/ICP.png';

interface ICPBeianProps {
  icp?: string;
}

export default function ICPBeian({ icp }: ICPBeianProps) {
  const icpRef = useRef<HTMLDivElement>(null);

  const isHtml = Boolean(icp && (icp.includes('<') || icp.includes('script')));

  useEffect(() => {
    if (!icp || !icpRef.current || !isHtml) {
      return;
    }

    icpRef.current.innerHTML = icp;

    const scripts = icpRef.current.getElementsByTagName('script');
    Array.from(scripts).forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [icp, isHtml]);

  if (!icp) {
    return null;
  }

  if (isHtml) {
    return (
      <div className="flex justify-end pb-4">
        <div ref={icpRef} className="flex items-center" />
      </div>
    );
  }

  const [, icpPrefix = 'ICP备案', icpNumber = icp] = icp.match(/^(\D+)(\d.*)$/) || [];

  return (
    <div className="flex justify-end pb-4">
      <a
        href="https://beian.miit.gov.cn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-6 items-center overflow-hidden rounded-[2px] text-xs leading-none text-white transition-opacity hover:opacity-90"
        aria-label={icp}
      >
        <span className="inline-flex h-full items-center gap-1 bg-[#1f1f1f] px-2">
          <Image src={ICPIcon} alt="" width={14} height={14} className="h-3.5 w-3.5" />
          <span>{icpPrefix}</span>
        </span>
        <span className="inline-flex h-full items-center bg-[#e53935] px-2 font-mono">
          {icpNumber}
        </span>
      </a>
    </div>
  );
}
