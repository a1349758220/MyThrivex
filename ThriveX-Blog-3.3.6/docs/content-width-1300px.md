# 主体内容区域宽度改为 1300px

## 改动说明

将网站主体内容区域的总宽度从原来的 1200px 调整为 1300px，涉及布局版心变量、CSS 样式文件及 Tailwind 行内类名。

## 改动文件清单

| # | 文件路径 | 修改内容 |
|---|---------|---------|
| 1 | src/styles/var.scss | SCSS 变量 `$w` 从 `1200px` 改为 `1300px` |
| 2 | src/components/Container/index.scss | `.main` 的 `width` 从 `1200px` 改为 `1300px` |
| 3 | src/components/Container/index.tsx | Tailwind 类 `xl:w-[1200px]` 改为 `xl:w-[1300px]` |
| 4 | src/components/Footer/index.tsx | Tailwind 类 `xl:w-[1200px]` 改为 `xl:w-[1300px]` |
| 5 | src/app/equipment/page.tsx | Tailwind 类 `lg:w-[1200px]` 改为 `lg:w-[1300px]`（共 2 处） |
| 6 | src/app/wall/[cate]/page.tsx | Tailwind 类 `xl:w-[1200px]` 改为 `xl:w-[1300px]` |
| 7 | src/app/my/components/Project/index.tsx | Tailwind 类 `xl:w-[1200px]` 改为 `xl:w-[1300px]` |

## 未改动的文件说明

以下文件中的 `1200` 值为 Open Graph 分享图片的尺寸（1200×630），**非页面布局宽度**，无需修改：

- src/app/layout.tsx（OG image width）
- src/app/article/[id]/page.tsx（OG image width）

## 改后检查要点

- 布局容器 `.ContainerComponent .main` 使用了 SCSS 变量 `$w`（已同步更新）
- 其余页面通过 Tailwind 的 `w-[1200px]` 类名单独控制（已逐个替换）
- 响应式断点保持不变：`lg:`（1024px+）/ `xl:`（1280px+）
