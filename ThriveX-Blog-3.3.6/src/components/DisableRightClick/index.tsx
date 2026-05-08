'use client';

import { useEffect } from 'react';

const CUSTOM_CONTEXT_MENU_KEY = 'customContextMenuEnabled';

export default function DisableRightClick() {
  useEffect(() => {
    let isCustomContextMenuEnabled = localStorage.getItem(CUSTOM_CONTEXT_MENU_KEY) !== 'false';

    const handleContextMenu = (e: MouseEvent) => {
      if (!isCustomContextMenuEnabled) return;

      e.preventDefault();
      return false;
    };

    const handleCustomContextMenuChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      isCustomContextMenuEnabled = customEvent.detail;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('custom-context-menu-change', handleCustomContextMenuChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('custom-context-menu-change', handleCustomContextMenuChange);
    };
  }, []);

  return null;
}
