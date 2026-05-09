import Link from 'next/link';
import { getWebConfigDataAPI } from '@/api/config';
import { Web } from '@/types/app/config';
import Tooltip from './components/Tooltip';
import ICPBeian from './components/ICPBeian';
import MengBeiAn from './components/mengBeian';

export default async () => {
  const webResponse = await getWebConfigDataAPI<{ value: Web }>('web');
  const web = webResponse?.data?.value as Web;

  return (
    <div className="py-4 bg-white dark:bg-black-b border-t dark:border-black-b px-10">
      <ICPBeian icp={web?.icp} />
      <div className="flex flex-wrap justify-end items-center gap-3 pb-4">
        <a
          style={{ textDecoration: 'none', color: '#e77c8e' }}
          href="https://travel.moe/go.html?travel=on"
          title="异次元之旅-跃迁-我们一起去萌站成员的星球旅行吧！"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm"
        >
          <img src="https://travel.moe/images/icon/icon64pink.png" style={{ width: 24, height: 24 }} alt="" />
        </a>
        <MengBeiAn mnengbei={web?.mnengbei} />
      </div>

      <div className="py-4 dark:border-black-a">
        
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-[#8c9ab1]">
            <span>Powered by</span>
            <Tooltip content="一款免费、开源、年轻、高颜值的现代化博客管理系统">
            <Link
              href="https://github.com/LiuYuYang01/ThriveX-Admin"
              target="_blank"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <span>Thrivex</span>
                <img src="https://bu.dusays.com/2025/12/04/6930fdfbda057.png" width={30} height={30} alt="ThriveX 博客管理系统" />
              </Link>
            </Tooltip>
            <span>|</span>
            <span>© 2026-2026</span>
            <span>|</span>
            <span>Theme By Astromint</span>
          </div>
        
      </div>
    </div>
  );
};
