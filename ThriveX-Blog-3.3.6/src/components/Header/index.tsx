'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import { Switch } from '@heroui/react';
import Show from '@/components/Show';
import SidebarNav from './components/SidebarNav';

import { IoIosArrowDown } from 'react-icons/io';
import { FaRegSun } from 'react-icons/fa';
import { BsFillMoonStarsFill, BsTextIndentLeft } from 'react-icons/bs';

import { Cate } from '@/types/app/cate';
import { getCateListAPI } from '@/api/cate';

import { useConfigStore } from '@/stores';
import { transitionTheme } from '@/utils/themeTransition';

export default () => {
  const patchName = usePathname();

  const { isDark, setIsDark, theme } = useConfigStore();
  const themeSwitchRef = useRef<HTMLDivElement>(null);

  // 这些路径段不需要改变导航样式
  const isPathSty = ['/my', '/wall', '/record', '/equipment', '/tags', '/resume', '/album', '/fishpond', '/friend'].some((path) => patchName.includes(path));
  // 是否改变导航样式
  const [isScrolled, setIsScrolled] = useState(false);

  // 获取分类列表
  const [cateList, setCateList] = useState<Cate[]>([]);
  const getCateList = async () => {
    const { data } = await getCateListAPI();
    setCateList(data?.result ?? []);
  };

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    });

    getCateList();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 手动切换主题
  const toTheme = () => {
    const nextDark = !isDark;
    transitionTheme(nextDark, () => setIsDark(nextDark), themeSwitchRef.current);
  };
  // 判断当前主题
  useEffect(() => {
    const html = document.querySelector('html');
    if (html && html.classList) {
      html?.classList?.toggle('dark', isDark);
    }
  }, [isDark]);

  // 是否打开侧边栏导航
  const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

  return (
    <>
      <div className={`header fixed top-0 w-full h-16 z-50 after:content-[''] after:block after:w-full after:h-0 after:bg-[linear-gradient(#fff,transparent_70%)] dark:after:bg-[linear-gradient(#2b333e,transparent_70%)] ${isPathSty || isScrolled ? 'bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(44,51,62,0.7)] backdrop-blur-md border-b dark:border-[#2b333e] after:!h-8 after:transition-height]' : 'border-transparent'}`}>
        <div className="relative flex justify-center lg:justify-start w-full lg:w-[1500px] h-16 mx-auto">
          <div className={`lg:hidden group absolute top-0 left-0 h-full py-2 px-3 pl-7 ${isPathSty || isScrolled ? 'hover:bg-[#e9edf4] dark:hover:bg-[#455162] rounded-lg' : ''} cursor-pointer  `} onClick={() => setIsOpenSidebarNav(true)}>
            <BsTextIndentLeft className="group-hover:text-primary h-full text-[30px] text-black dark:text-white" />
          </div>

          {/* logo */}
          <Link href="/" className="flex items-center p-5 text-[15px]  ">
            <img src={isDark ? theme?.dark_logo : theme?.light_logo} alt="Logo" className="min-w-10 h-10 hover:scale-90 transition-transform" />
          </Link>

          <ul className="hidden lg:flex items-center h-16">
            <li className="group/one relative">
              <Link href="/" className="flex items-center p-5 text-[18px] font-bold text-black dark:text-white group-hover/one:!text-slate-500 dark:group-hover/one:!text-[#efcea2]">
                首页
              </Link>
            </li>

            {/* 文章分类 */}
            {cateList?.map((one) => (
              <div key={one.id}>
                {/* 渲染分类 */}
                {one.type === 'cate' && (
                  <li className="group/one relative">
                    <Link href={`/cate/${one.id}?name=${one.name}`} target={`${one.url.startsWith('http') ? '_blank' : '_self'}`} className="flex items-center p-5 text-[18px] font-bold text-black dark:text-white group-hover/one:!text-slate-500 dark:group-hover/one:!text-[#efcea2]">
                      {one.name}
                      <Show is={!!one.children.length}>
                        <IoIosArrowDown className="ml-2" />
                      </Show>
                    </Link>

                    
                  </li>
                )}

                {/* 渲染导航 */}
                
              </div>
            ))}
          </ul>

          {/* 主题切换开关 */}
          <div ref={themeSwitchRef} className="absolute top-0 right-7 h-full flex items-center">
            <Switch aria-label="切换主题" size="lg" isSelected={isDark} onValueChange={toTheme} thumbIcon={({ isSelected }) => (isSelected ? <BsFillMoonStarsFill className="text-gray-500" /> : <FaRegSun className="text-gray-500" />)} className={`${isDark ? '[&>.bg-default-200]:!bg-[#4e5969]' : '[&>.bg-default-200]:!bg-[#e1e1e1]'}`} />
          </div>
        </div>
      </div>

      {/* 侧边导航：移动端时候显示 */}
      <SidebarNav list={cateList} open={isOpenSidebarNav} onClose={() => setIsOpenSidebarNav(false)} />
    </>
  );
};
