# ThriveX 博客系统部署指南

> 基于 1Panel 面板的完整部署教程（后端 + 控制台 + 前端）

---

## 目录

1. [项目简介](#1-项目简介)
2. [技术栈](#2-技术栈)
3. [环境要求](#3-环境要求)
4. [前置准备](#4-前置准备)
5. [部署后端（ThriveX-Server）](#5-部署后端thrivex-server)
6. [部署控制台（ThriveX-Admin）](#6-部署控制台thrivex-admin)
7. [部署前端（ThriveX-Blog）](#7-部署前端thrivex-blog)
8. [配置说明](#8-配置说明)
9. [常见问题](#9-常见问题)
10. [更新维护](#10-更新维护)

---

## 1. 项目简介

ThriveX 是一个年轻、高颜值、全开源、永不收费的现代化博客管理系统。采用前后端分离开发模式，包含三个子项目：

| 项目 | 说明 | 技术栈 |
|------|------|--------|
| **ThriveX-Server** | 后端 API 服务 | Spring Boot + MySQL |
| **ThriveX-Admin** | 管理控制台 | React + Vite |
| **ThriveX-Blog** | 博客前端（本项目） | Next.js 15 + TailwindCSS |

官方地址：
- 后端：<https://github.com/LiuYuYang01/ThriveX-Server>
- 控制台：<https://github.com/LiuYuYang01/ThriveX-Admin>
- 前端：<https://github.com/LiuYuYang01/ThriveX-Blog>
- 官方文档：<https://docs.liuyuyang.net/>

---

## 2. 技术栈

### 前端（ThriveX-Blog）
- **框架**：Next.js 15 (React 19)
- **样式**：TailwindCSS 4
- **语言**：TypeScript
- **状态管理**：Zustand
- **构建输出**：Standalone（支持 Docker 部署）

### 后端（ThriveX-Server）
- **框架**：Spring Boot
- **ORM**：Mybatis Plus
- **数据库**：MySQL
- **文件存储**：七牛云 OSS（X File Storage）
- **API 文档**：Swagger
- **运行环境**：Java 8+

### 控制台（ThriveX-Admin）
- **框架**：React + Vite
- **语言**：TypeScript

---

## 3. 环境要求

### 服务器要求
- **系统**：Linux（推荐 Ubuntu 20.04/22.04）
- **配置**：2 核 4G 起
- **已安装**：1Panel 面板（或其他服务器管理面板）

### 软件版本
| 组件 | 版本要求 |
|------|----------|
| Node.js | >= 20 |
| npm | >= 10 |
| Java | OpenJDK 1.8（后端必需） |
| MySQL | 5.7+ |
| Nginx | 由 1Panel 自动管理 |

### 本地开发环境
```bash
# 验证版本
node -v   # >= 20
npm -v    # >= 10
java -version  # 1.8+
```

---

## 4. 前置准备

### 4.1 安装 1Panel

```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```

### 4.2 开放端口

| 端口 | 用途 |
|------|------|
| 80 | HTTP |
| 443 | HTTPS |
| 9003 | 后端 API 服务 |
| 9000 | 前端博客服务（按需） |
| 11803 | 1Panel 默认端口 |

### 4.3 域名准备

需要准备三个域名/子域名（以 `https` 为例）：

| 用途 | 示例域名 |
|------|----------|
| 后端 API | `api.yourdomain.com` |
| 管理后台 | `admin.yourdomain.com` |
| 博客前端 | `www.yourdomain.com` |

### 4.4 获取源码

```bash
# 克隆三个仓库
git clone https://github.com/LiuYuYang01/ThriveX-Server.git
git clone https://github.com/LiuYuYang01/ThriveX-Admin.git
git clone https://github.com/LiuYuYang01/ThriveX-Blog.git
```

---

## 5. 部署后端（ThriveX-Server）

### 5.1 创建数据库

1. 1Panel → **数据库** → **创建数据库**
2. 配置：
   - 数据库名称：`thrivex`
   - 用户名：`thrivex`
   - 密码：`自定义密码`
   - 字符集：`utf8mb4`

### 5.2 导入 SQL

1. 从 [ThriveX-Server Releases](https://github.com/LiuYuYang01/ThriveX-Server/releases) 下载最新版 SQL 文件（`ThriveX.sql`）
2. 在 1Panel 数据库列表中选择刚创建的数据库 → **导入备份** → 执行 SQL

### 5.3 上传 Jar 包

1. 从 [Releases 页面](https://github.com/LiuYuYang01/ThriveX-Server/releases) 下载 `blog.jar`
2. 1Panel → **文件** → 创建目录 `/www/thrivex_server` → 上传 `blog.jar`

### 5.4 创建 Java 运行环境

1. 1Panel → **网站** → **运行环境** → **创建**
2. 配置：
   - 应用类型：**Java**
   - Java 版本：**OpenJDK 1.8**（必须选 1.8）
   - 源码目录：`/www/thrivex_server`
   - 启动命令：
     ```bash
     java -jar blog.jar \
       --PORT=9003 \
       --spring.datasource.url=jdbc:mysql://localhost:33016/thrivex?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true \
       --spring.datasource.username=thrivex \
       --spring.datasource.password=你的数据库密码
     ```
   - 端口：`9003`

### 5.5 绑定域名

1. 网站 → 创建网站 → **反向代理**
2. 域名：`api.yourdomain.com`
3. 目标 URL：`http://127.0.0.1:9003`
4. 申请 SSL 证书并开启 HTTPS

### 5.6 验证部署

访问 `https://api.yourdomain.com/doc.html`，看到 Swagger API 文档页面即部署成功。

---

## 6. 部署控制台（ThriveX-Admin）

### 6.1 本地构建

```bash
cd ThriveX-Admin

# 安装依赖
npm install --legacy-peer-deps

# 配置后端 API 地址
echo "VITE_API_BASE_URL=https://api.yourdomain.com" > .env

# 构建
npm run build
```

构建完成后，生成 `dist` 静态资源目录。

### 6.2 上传到服务器

1. 1Panel → **文件** → 创建目录 `/www/thrivex_admin`
2. 将本地 `dist/` 目录下所有文件上传到 `/www/thrivex_admin`

### 6.3 创建网站

1. 1Panel → **网站** → **创建网站**
2. 域名：`admin.yourdomain.com`
3. 根目录：`/www/thrivex_admin`
4. PHP 版本：选择 **纯静态**
5. 申请 SSL 证书并开启 HTTPS

### 6.4 Nginx 配置

编辑网站配置，添加以下内容到 Nginx 配置中的 `location /` 块：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 6.5 验证部署

访问 `https://admin.yourdomain.com`，使用默认账号登录：
- 用户名：`admin`
- 密码：`123456`

> ⚠️ 首次登录后请务必修改密码。

---

## 7. 部署前端（ThriveX-Blog）

### 7.1 本地构建

```bash
cd ThriveX-Blog

# 安装依赖
npm install --legacy-peer-deps

# 配置后端 API 地址
# 编辑 .env 文件
echo "NEXT_PUBLIC_PROJECT_API=https://api.yourdomain.com/api" > .env
echo "NEXT_PUBLIC_CACHING_TIME=300" >> .env

# 构建
npm run build
```

### 7.2 上传到服务器

有两种方式部署前端：

#### 方式一：Node.js 运行环境部署（推荐）

1. 1Panel → **文件** → 创建目录 `/www/thrivex_blog`
2. 上传整个项目（包含下面列出的所有文件）：
   - `.next/`（构建输出目录）
   - `public/`（静态资源）
   - `package.json`
   - `next.config.mjs`
   - `node_modules/`（可选，也可在服务器 install）

3. 1Panel → **网站** → **运行环境** → **创建**
   - 应用类型：**Node.js**
   - Node.js 版本：**20.x**
   - 源码目录：`/www/thrivex_blog`
   - 启动命令：
     ```bash
     npx next start -p 9000
     ```
   - 端口：`9000`

4. **绑定域名**：创建反向代理，域名 `www.yourdomain.com`，目标 `http://127.0.0.1:9000`

#### 方式二：Standalone + PM2 部署

由于 `next.config.mjs` 已配置 `output: 'standalone'`，可以：

```bash
# 本地构建后，.next/standalone/ 目录包含了独立运行所需文件
# 将其上传到服务器

# 安装 PM2（全局）
npm install -g pm2

# 启动
pm2 start .next/standalone/server.js --name thrive-blog -p 9000

# 设置开机自启
pm2 save
pm2 startup
```

### 7.3 .env 配置说明

```env
# 后端 API 地址（必填）
NEXT_PUBLIC_PROJECT_API=https://api.yourdomain.com/api

# 页面缓存时间（秒），300 = 5分钟
# 缓存期间页面不会重新请求数据，发布文章后不会立即显示
NEXT_PUBLIC_CACHING_TIME=1
```

> 开发环境下设为 `1`（不缓存），生产环境建议设为 `300` 或更高。

### 7.4 图片域名配置

`next.config.mjs` 中已配置了允许的图片域名：

```mjs
images: {
    remotePatterns: [
        { protocol: 'https', hostname: '**' },
        { protocol: 'http', hostname: '**' },
    ]
}
```

如使用自定义图床，编辑 `next.config.mjs` 添加相应域名即可。

### 7.5 验证部署

访问 `https://www.yourdomain.com`，看到博客首页即部署成功。

---

## 8. 配置说明

### 8.1 后端配置

后端主要配置在 `application-dev.yml` 中：

```yaml
# 服务器端口
server:
  port: 9003

# 数据库连接
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/thrivex?useSSL=false&serverTimezone=Asia/Shanghai
    username: thrivex
    password: 你的密码
    driver-class-name: com.mysql.cj.jdbc.Driver

# 七牛云 OSS 配置
lyy:
  oss:
    accessKey: 你的七牛云 AccessKey
    secretKey: 你的七牛云 SecretKey
    bucket: thrive

  # 邮箱配置（用于评论通知等）
  email:
    host: smtp.qq.com
    port: 465
    username: 你的邮箱
    password: 你的邮箱授权码
```

### 8.2 控制台配置

```env
# .env 文件
VITE_API_BASE_URL=https://api.yourdomain.com

# 可选：百度统计配置
VITE_BAIDU_TONGJI_KEY=
VITE_BAIDU_TONGJI_SECRET_KEY=
VITE_BAIDU_TONGJI_SITE_ID=
VITE_BAIDU_TONGJI_ACCESS_TOKEN=
VITE_BAIDU_TONGJI_REFRESH_TOKEN=

# 可选：星火 AI 配置
VITE_AI_APIPassword=
VITE_AI_MODEL=
```

### 8.3 前端配置

```env
# .env 文件
NEXT_PUBLIC_PROJECT_API=https://api.yourdomain.com/api
NEXT_PUBLIC_CACHING_TIME=300
```

---

## 9. 常见问题

### Q1: 后端出现 `UnknownHostException`

**原因**：JDBC URL 使用了简写形式。

**解决**：使用完整的 JDBC URL：
```
jdbc:mysql://localhost:3306/thrivex?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
```

### Q2: `npm install` 报错

**原因**：部分依赖需要编译原生模块。

**解决**：
```bash
# Windows 下使用 CMD（而非 PowerShell）
# 或添加 --legacy-peer-deps 参数
npm install --legacy-peer-deps
```

### Q3: 前端 `fetch failed (ECONNREFUSED)` 构建错误

**原因**：构建时后端 API 不可达（如本地构建时未启动后端）。

**解决**：
1. 确保 `.env` 中 `NEXT_PUBLIC_PROJECT_API` 指向正确的后端地址
2. 构建时后端不需要运行（已在代码中添加错误处理）
3. 如使用 CI/CD，确保环境变量已正确配置

### Q4: 图片无法显示

**原因**：Next.js Image 组件域名白名单限制。

**解决**：编辑 `next.config.mjs`，将图片域名添加到 `images.remotePatterns`。

### Q5: 页面数据未更新

**原因**：页面缓存策略导致。

**解决**：编辑 `.env`，将 `NEXT_PUBLIC_CACHING_TIME` 设为 `1`（不缓存），或等待缓存过期。

---

## 10. 更新维护

### 后端更新
1. 下载最新的 `blog.jar`
2. 停止 Java 运行环境
3. 替换 `blog.jar`
4. 重启 Java 运行环境
5. 如有数据库变更，先备份后执行新的 SQL

### 前端更新
```bash
cd ThriveX-Blog
git pull
npm install --legacy-peer-deps
npm run build
# 重新上传构建产物
```

### 控制台更新
```bash
cd ThriveX-Admin
git pull
npm install --legacy-peer-deps
npm run build
# 重新上传 dist 目录
```

> ⚠️ 更新前请**务必备份数据库**。

---

## 部署架构图

```
用户访问
    │
    ├── https://www.yourdomain.com  ────▶  Nginx ────▶  Node.js (:9000) ────▶ Next.js (ThriveX-Blog)
    │
    ├── https://admin.yourdomain.com  ──▶  Nginx ────▶  /www/thrivex_admin (静态文件)
    │
    └── https://api.yourdomain.com  ────▶  Nginx ────▶  Java (:9003) ────▶ Spring Boot (ThriveX-Server)
                                                                                  │
                                                                                  ▼
                                                                              MySQL
```

---

> 参考来源：
> - [腾讯云开发者社区 - 从零到一搭建ThriveX现代化博客系统](https://cloud.tencent.com/developer/article/2624582)
> - [ThriveX 官方文档](https://docs.liuyuyang.net/)
> - [手把手教你用 1Panel 部署 ThriveX](https://blog.ccswust.org/21441.html)
