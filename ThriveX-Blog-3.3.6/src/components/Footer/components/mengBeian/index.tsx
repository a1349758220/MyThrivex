import Image from 'next/image';
import mengBei from '../../images/mengBei.png';

interface MengBeiAnProps {
  mnengbei?: string;
}

export default function MengBeiAn({ mnengbei }: MengBeiAnProps) {
  if (!mnengbei) {
    return null;
  }

  const recordNumber = mnengbei.replace(/^萌?ICP备?/, '').replace(/号$/, '');

  return (
    <a
      href={`https://icp.gov.moe/?keyword=${recordNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-6 items-center overflow-hidden rounded-[2px] text-xs leading-none text-white transition-opacity hover:opacity-90"
      aria-label={`萌ICP备${recordNumber}号`}
    >
      <span className="inline-flex h-full items-center gap-1 bg-[#1f1f1f] px-2">
        <Image src={mengBei} alt="" width={14} height={14} className="h-3.5 w-3.5" />
        <span>萌ICP备</span>
      </span>
      <span className="inline-flex h-full items-center bg-[#ff2f92] px-2 font-mono">
        {recordNumber}号
      </span>
    </a>
  );
}
