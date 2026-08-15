<div align="center">

# ✦ 星河启明 ✦

### *Celestial Enlightenment — AI 天文助教平台*

> **「星河灿烂，若出其里」—— 曹操《观沧海》**

*让每一位乡村教师，都能带孩子仰望星空*

<br>

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-ffd83d?style=flat-square)](https://pinia.vuejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## 🌌 项目简介

**星河启明**是一款面向乡村小学科学教育的 **AI 天文教学助手平台**。

在中国广大乡村地区，天文教学长期面临"三缺"困境 —— **缺专业教师、缺观测设备、缺可视化工具**。本项目通过 AI 赋能，将抽象的天文知识转化为 **可交互、可可视化、可生成** 的沉浸式课堂体验，让没有天文背景的教师也能轻松开展天文教学。

平台包含 **教学总览仪表盘**、**日食模拟交互**、**星河诗词明信片** 三大核心模块，并集成了多模型 AI 对话助教，随时解答教学疑问。

> 🏆 本项目参加 **ModelScope「小有可为」AI 公益挑战赛** — 乡村小学科学教育赛道

---

## ✨ 核心功能

### 📊 教学总览 · Overview

| 功能 | 说明 |
|------|------|
| 教学进度追踪 | 累计课时、目标完成度一目了然 |
| 学生掌握度分析 | 太阳系结构 / 星座识别 / 月相变化 三维知识雷达 |
| 每日天象板 | 实时月相、最佳观测目标、天气状况 |
| 迷你星图 | Canvas 绘制的动态星空，含流星动画 |

### 🌑 日月交辉 · 日食模拟

- **Canvas 2D 实时渲染** — 太阳、地球、月球三体运动，含本影/半影锥体动画
- **五阶段时间轴** — 初亏 → 食既 → 食甚 → 生光 → 复圆，支持拖拽 / 自动播放 / 跳转
- **月相同步显示** — 八相月相环与日食进程实时联动
- **AI 视频生成** — 食甚阶段可触发 Wan2.2 模型生成日食视频（预留接口）

### 🌠 星河入梦 · 星图与诗词

- **交互式星图** — 绘制东方青龙、北方玄武、西方白虎、南方朱雀四大天区
- **二十八宿点击探索** — 点击星宿查看神话传说与现代天文学数据
- **三垣展示** — 紫微垣、太微垣、天市垣以虚线圆标注
- **诗词意象生成** — 输入古诗词，AI 匹配天文意象
- **天文明信片** — 将诗词与星空背景合成精美明信片，支持一键下载

### 🤖 AI 天文助教

- **多模型支持** — Agnes AI / 通义千问 / OpenAI / 自定义端点
- **天文教学专用 Prompt** — 针对小学至初中学生优化回答风格
- **快捷提问** — 内置常用教学问题模板
- **API 配置持久化** — 本地存储，刷新不丢失

---

## 🛠 技术栈

<div align="center">

| 分类 | 技术 | 版本 |
|------|------|------|
| 🖼 前端框架 | Vue 3 (Composition API) | 3.5 |
| 🧭 路由 | Vue Router 4 (Lazy Loading) | 4.5 |
| 🏪 状态管理 | Pinia 3 | 3.0 |
| ⚡ 构建工具 | Vite 6 | 6.3 |
| 🎨 图形渲染 | Canvas 2D API (原生) | — |
| 📸 图像导出 | html2canvas | 1.4 |
| 🐳 容器化 | Docker (多阶段构建) | — |
| 🌐 反向代理 | Nginx (SPA + API Proxy) | — |
| 🔤 字体 | Space Grotesk / Be Vietnam Pro / JetBrains Mono | — |

</div>

**设计亮点：**
- 🎨 **完整设计系统** — 90+ CSS 变量，深色/浅色主题切换，毛玻璃效果
- 🪶 **轻量级** — 全部天文可视化基于原生 Canvas 2D，无需 Three.js 等重型 3D 库
- 📱 **零后端** — 纯前端 SPA，API 通过 Nginx 反向代理，可部署至任意静态托管

---

## 📁 项目结构

```
xingheqiming/
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件（三栏仪表盘布局）
│   ├── style.css               # 全局设计系统（主题变量 + 工具类）
│   ├── router/
│   │   └── index.js            # 路由配置（3 个懒加载页面）
│   ├── stores/
│   │   └── app.js              # Pinia 全局状态（API / 主题 / 通知）
│   ├── components/
│   │   ├── Sidebar.vue         # 左侧导航栏
│   │   └── AIPanel.vue         # 右侧 AI 对话面板
│   └── views/
│       ├── Overview.vue        # 📊 教学总览
│       ├── SunMoonEclipse.vue  # 🌑 日食模拟
│       └── StarGallery.vue     # 🌠 星河画廊
├── public/images/postcards/    # 明信片背景图
├── Dockerfile                  # 多阶段构建（Node → Nginx）
├── docker-compose.yml          # 一键容器编排
├── nginx.conf                  # 生产环境 Nginx 配置
└── vite.config.js              # 开发服务器 + API 代理
```

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone <repo-url>
cd xingheqiming

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:3000）
npm run dev
```

### Docker 部署

```bash
# 构建并启动容器（端口 7860）
docker-compose up -d

# 查看运行状态
docker-compose ps
```

### 生产构建

```bash
npm run build    # 输出至 dist/
npm run preview  # 本地预览构建产物
```

---

## 🎨 界面预览

<table>
<tr>
  <td width="50%">
    <h4 align="center">📊 教学总览仪表盘</h4>
    <p align="center">课时进度、知识掌握度、每日天象、动态星图</p>
  </td>
  <td width="50%">
    <h4 align="center">🌑 日食交互模拟</h4>
    <p align="center">Canvas 三体动画、五阶段时间轴、月相同步</p>
  </td>
</tr>
<tr>
  <td width="50%">
    <h4 align="center">🌠 星河诗词画廊</h4>
    <p align="center">二十八宿交互星图、诗词明信片生成与下载</p>
  </td>
  <td width="50%">
    <h4 align="center">🤖 AI 天文助教</h4>
    <p align="center">多模型对话、天文专用 Prompt、快捷提问</p>
  </td>
</tr>
</table>

---

## 🔌 API 支持

平台支持多种 AI 模型提供商，可在设置面板中自由切换：

| 提供商 | 模型 | 说明 |
|--------|------|------|
| **Agnes AI** ⭐ | `agnes-2.0-flash` | 推荐，通过 Vite/Nginx 代理 |
| **通义千问** | `qwen-turbo` | 阿里云 DashScope |
| **OpenAI** | `gpt-3.5-turbo` | 直连 |
| **自定义** | 自选 | 兼容 OpenAI 格式的任意端点 |

---

## 🌟 设计亮点

- **🏕 面向乡村场景** — 轻量无后端，低配设备流畅运行，离线友好架构
- **🎭 沉浸式体验** — 深空主题 UI + 毛玻璃面板 + 星空粒子动画
- **📖 跨学科融合** — 天文科学 × 古典诗词 × 传统文化（二十八宿体系）
- **🔓 开放可扩展** — 多 AI 提供商抽象层，可快速接入新模型

---

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

---

<div align="center">

*星河灿烂，启明引路*

*让每一个孩子都能看见头顶的星空* ✦

</div>
