import Image from 'next/image';
import mengBei from '../../images/mengBei.png';

interface MengBeiAnProps {
  mnengbei?: string;
}

export default function MengBeiAn({ mnengbei }: MengBeiAnProps) {
  if (!mnengbei) {
    return null;
  }

  return (
    <div className="group flex justify-center items-center space-x-2 cursor-pointer">
      <Image src={mengBei} alt="萌ICP" width={22} height={22} className="w-5 h-[22px]" />
      <a
        href={`https://icp.gov.moe/?keyword=${mnengbei}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group-hover:text-primary"
      >
        萌ICP备{mnengbei}号
      </a>
    </div>
  );
}
