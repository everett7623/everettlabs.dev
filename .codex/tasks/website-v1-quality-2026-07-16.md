# Everett Labs 官网 v1.0 开发任务

## 任务信息

- 创建日期：2026-07-16
- 规格来源：`Everett Labs Developer Website.md` v1.0
- 当前目标：将现有项目升级到最新 Astro 7，在保留英文站点内容的前提下恢复可验证构建，并继续推进规格中的质量阶段。
- 部署目标：Cloudflare Workers Static Assets

## 已核对的真实现状

### 已实现

- Astro 5、TypeScript、Tailwind CSS 4 和 React islands 基础架构（本轮将 Astro 升级到最新版本）。
- 首页、项目索引、About、Coffee、404 和 8 个项目详情页。
- 8 个项目 MDX 内容、人工仓库白名单和 GitHub 构建时元数据快照。
- 产品、基础设施、社区项目分组；NodeLoc Bench 社区归属与危险操作提示。
- Seedloc、GitHub、Telegram、Coffee 入口。
- 受控终端、命令面板、响应式布局和 reduced-motion 样式。
- sitemap、robots、manifest、默认 Open Graph 图和 Cloudflare 安全响应头。
- Cloudflare Workers Static Assets 配置。

### 基线验证结果

- `[通过]` `npm run lint` 与 `npm run format:check`：ESLint 和 Prettier 检查通过。
- `[通过]` `npm run validate:static`：所有静态契约校验与 10 个测试文件、43 项测试通过。
- `[通过]` `npm run typecheck`：Astro 7 类型检查为 0 errors、0 warnings；保留 2 条上游兼容性提示。
- `[通过]` `npm run test`：10 个测试文件、43 项测试通过。
- `[通过]` `npm run test:e2e`：桌面与移动 Chromium 共 5 项关键浏览器流程通过；3 项按设备范围跳过。
- `[通过]` `npm run audit:lighthouse`：本地生产构建的首页和 Linketry 详情均为 Performance 99、Accessibility 100、SEO 100，文档标题和颜色对比度审计通过；本地 HTTP 不断言 Best Practices。
- `[通过]` `npm run build`：在未设置 `GITHUB_TOKEN` 时保留提交的快照，并生成 13 个静态页面。
- `[通过]` Cloudflare Workers Static Assets：`everettlabs-dev` 当前版本 `62de78ed-f02e-4088-a187-0138c91b1af2` 已部署并绑定 `https://everettlabs.dev`；上一稳定回滚点为 `4e00134b-5ab8-4bd2-86b1-83e5389b8de8`。生产首页、Linketry、robots、sitemap 均为 200，未知路由为 404，标题、安全头与 canonical 已验证。

### 当前质量缺口

- 其余项目仍需补充来源可验证的本地截图；禁止使用虚构界面代替。
- 干净 Ubuntu CI 已完成 GA4 上线后的生产 HTTPS Lighthouse：当前线上首页与 Linketry 均为 Performance 99、Accessibility 100、Best Practices 100、SEO 100，控制台错误为 0；LCP 分别为 2.0 秒与 1.9 秒，CLS 均为 0。

### 2026-07-17 收尾范围

- [x] 恢复所有页面的 `<title>`，并增加静态站点契约防止回归。
- [x] 修正 muted 文本、violet 徽章和主按钮对比度，并把主题关键颜色对比度纳入静态可访问性校验。
- [x] 将本地 Lighthouse 的 Performance、Accessibility 和 SEO 断言提升到 0.95；新增 HTTPS 生产审计入口并记录本机环境阻塞，不降低四分类 0.95 门槛。
- [x] 重新运行 `validate:static`、`typecheck`、`build`、`test:e2e` 和 `audit:lighthouse`。
- [x] 完成 Cloudflare Builds、Web Analytics 与 Always Use HTTPS：Web Analytics 已从生产 DOM 验证，Builds 已连接规范 GitHub 仓库，HTTP 已实测 301 跳转至 HTTPS。
- [x] 回写本轮真实验证结果、生产状态和最终剩余阻塞。

## 2026-07-17 同步与生产验收续作

### 范围

- [x] 核对本地工作区、`main`、`origin/main` 与规范远程，并在保留本地文件的前提下恢复 Syncthing 同步期间缺失的 Git 对象。
- [x] 执行 `git pull --ff-only origin main`，确认本地与远程均位于 `f0c97e3`，工作区在本地同步完成后保持干净。
- [x] 手动触发 GitHub Actions `PR Validation`，在干净 Ubuntu 环境运行生产 HTTPS Lighthouse。
- [x] 根据工作流真实结果更新生产 Lighthouse 验收状态，不降低四分类 0.95 门槛。
- [x] 通过项目命名 profile 与已认证 Dashboard 会话核对正确 Cloudflare 账号，完成 Builds 与 Always Use HTTPS 设置。

### 验收标准

- GitHub Actions 必须在 `main` 当前提交上完成静态校验、类型检查、Playwright、本地 Lighthouse 和生产 Lighthouse。
- 生产首页与 Linketry 详情的 Performance、Accessibility、Best Practices、SEO 均不得低于 0.95，且无控制台错误。
- Always Use HTTPS 只有在 `http://everettlabs.dev` 返回 `301` 或 `308`，且 `Location` 指向 HTTPS 时才能标记为通过。

### 实际结果

- `[失败，已定位]` GitHub Actions `29548528016` 在提交 `f0c97e3` 上完成静态校验、类型检查、Playwright 和本地 Lighthouse，仅生产 Lighthouse 失败。两条生产路由均为 Performance 99、Accessibility 100、Best Practices 93、SEO 100；`errors-in-console` 确认响应头 CSP 阻止 Astro 生成的两段 islands 运行时脚本。
- `[通过]` 启用 Astro 7 原生 CSP hash 生成，将 `frame-ancestors` 等响应头专属指令保留在 Cloudflare `_headers`，并移除首页唯一的内联样式属性；安全契约同时拒绝重复的响应头资源策略和新的内联样式属性。
- `[通过]` `npm run validate:static`：11 个测试文件、53 项测试全部通过；`npm run typecheck`：0 errors、0 warnings，保留 2 条既有上游提示；无 `GITHUB_TOKEN` 的 `npm run build` 生成 13 个静态页面。
- `[通过]` Playwright 使用已安装的完整 Chromium 完成 5 项、按设备范围跳过 3 项；默认 headless-shell 缺失且 CDN 安装在 5 分钟后超时，因此未把默认 `npm run test:e2e` 的浏览器启动失败记录为代码通过。
- `[通过]` Wrangler 4.111.0 `deploy --dry-run` 成功读取 55 个静态资源；`wrangler dev` 下响应头和 CSP meta 同时生效，首页终端与命令面板 hydration 正常，浏览器控制台错误和 CSP 错误均为 0。
- `[阻塞]` 当前 Wrangler OAuth 只列出账号 `b0fa092c63382065751fc97b15171f51`，而已部署 `everettlabs-dev` 的版本请求使用账号 `4cc48c9e3b9f084844f4485d51899e36` 并返回 API 认证错误 `10000`。在切换到正确账号前不部署、不修改 Zone 设置，也不把本地修复记为生产通过。

## 本轮开发范围

本轮先完成能恢复可靠开发闭环的最小改动：

- [x] 按官方迁移指南升级到 Astro 7，并同步安装官方 React、MDX、sitemap 和 check 集成；锁文件当前解析 Astro 7.1.0。
- [x] 核对 Astro 7 的 Rust 编译器、Sätteri MDX 管线和 JSX 空白处理对现有页面的影响。
- [x] 将项目详情内容渲染从已移除的 `entry.render()` 迁移到 `render(entry)`。
- [x] 修复命令面板按钮事件通道，并补充可验证的事件常量。
- [x] 强化 GitHub 同步的响应类型和缓存合并逻辑，避免部分失败删除已有快照。
- [x] 为白名单、命令定义和 GitHub 快照合并补充 Vitest 单元测试。
- [x] 运行项目校验、类型检查、单元测试和生产构建。
- [x] 回写本任务文档的验证结果。

## 当前阻塞

- 公开仓库复核确认 LinkVitals、Nezha Cleaner、DistroLift、VPS Scripts、NodeLoc Bench 没有可验证界面截图，GloboKit 仅有项目插画；Linketry 仓库存在应用资源但未找到可直接复用的已发布界面截图。不得使用虚构媒体。
- Cloudflare 账号、生产 Lighthouse、Builds 与 Always Use HTTPS 阻塞均已解除；首次真实 push 已自动构建并部署成功。

## 当前继续推进范围

- [x] 配置 Lighthouse CI，对生产构建的首页和 Linketry 项目详情执行性能、可访问性、控制台错误和 SEO 审计。
- [x] 配置可维护的最低评分门槛，并且不上传到外部服务或使用审计令牌。
- [x] 验收：`npm run audit:lighthouse` 完成目标路由审计；CI 失败时上传本地 Lighthouse 报告。

## 后续待办

- [x] 引入 ESLint 与 Prettier，并增加 `lint`、`format:check` 脚本。
- [x] 引入 Playwright，覆盖首页、项目详情、命令面板键盘与移动按钮流程。
- [x] 增加内部路由和外部链接校验。
- [x] 增加 GitHub Actions PR 验证工作流。
- [x] 接入首个来源可验证的本地项目截图，并完成 WebP/AVIF 优化、Alt 文本、尺寸和来源契约。
- [ ] 为其余项目补充仓库已发布或可从真实产品页面验证的本地截图；当前公开仓库复核未找到合格来源，禁止使用虚构界面代替。
- [x] 生成每个项目的 1200 × 630 Open Graph 图并接入详情页。
- [x] 为首页、普通页面、About 和项目详情提供对应的结构化数据类型。
- [x] 自动校验 Cloudflare 安全响应头、CSP 必需指令和内联脚本冲突。
- [x] 完成静态可访问性修复和契约校验。
- [x] 校验 canonical、sitemap、robots、manifest、404 索引策略和 Cloudflare 静态资源配置。
- [x] 自动校验 Astro/TSX/JSX 与 TypeScript/JavaScript 文件行数，并提供统一 `validate:static` 验收入口。
- [x] 使用真实浏览器完成移动端溢出和动态可访问性审计。
- [x] 完成 Lighthouse 上线性能审计。
- [x] 创建并部署 `everettlabs-dev` Worker，绑定 `everettlabs.dev` Custom Domain，验证 DNS、HTTPS、生产路由与安全头。
- [x] 在 Cloudflare Dashboard 连接 GitHub 仓库，启用 Cloudflare Builds 的 `main` 生产和 PR 预览构建。
- [x] Cloudflare Web Analytics 已在生产端自动注入，公开 beacon token 为 `628d2b9d0e2e45429316236593a48a5e`；CSP 已仅放行 `static.cloudflareinsights.com` 和 `cloudflareinsights.com`，安全契约与生产响应头通过。
- [x] 启用 Cloudflare Always Use HTTPS 并复测 HTTP 重定向。

## 本轮验收标准

- `npm run validate:projects`、`npm run typecheck`、`npm run test`、`npm run build` 全部成功。
- `package.json` 和锁文件使用当前最新 Astro 7 与兼容的官方集成。
- 无 `GITHUB_TOKEN` 时继续使用已提交快照，构建不依赖运行时 GitHub API。
- GitHub 部分同步失败时不丢失对应的已有缓存项。
- Header 按钮和 `Ctrl/Cmd + K` 使用同一事件协议打开命令面板。
- 不引入全局错误屏蔽或跳过检查配置。

## 开发记录

- 2026-07-16：完成规格、源码、配置和基线验证核对，建立本任务文档。
- 2026-07-16：用户要求 Astro 使用最新版本；根据官方迁移指南将目标更新为 Astro 7.0.9。
- 2026-07-16：完成 Astro 7 Content Layer API 迁移、命令面板事件修复、GitHub 元数据缓存合并与响应类型收敛。
- 2026-07-16：新增 2 个 Vitest 文件、8 个测试；`npm run test` 和 `npm run validate:projects` 通过。
- 2026-07-16：npm 安装被执行策略阻塞，Astro 7 锁文件、类型检查和生产构建等待解除阻塞后继续。
- 2026-07-16：新增项目级 `AGENTS.md`，固化真实文档入口、Astro 7 基线、内容边界、开发流程和验证要求。
- 2026-07-16：新增 `validate:links` 与 `validate:links:external`，覆盖页面路由、`public/` 静态资源、命令、项目仓库和站点外链。
- 2026-07-16：链接契约校验通过（40 个引用、18 个内部目标）；单元测试扩展到 3 个文件、12 项并全部通过。
- 2026-07-16：外链探测确认 Seedloc 可访问；Linketry 当前连接失败、Telegram 在本环境超时，按规格仅记录 warning，不阻断构建。
- 2026-07-16：修正 SEO 默认结构化数据，首页使用 `WebSite`、普通页使用 `WebPage`、About 使用 `ProfilePage`、项目页使用 `SoftwareApplication`；同时修复 About 标题重复。
- 2026-07-16：新增可重复执行的 `generate:og`，生成并接入 8 张本地 1200 × 630 项目 OG SVG；视觉抽查通过。
- 2026-07-16：当前单元测试共 5 个文件、19 项，全部通过。
- 2026-07-16：强化 `validate:projects`，新增 8 项目精确契约、重复 slug/repository、社区归属、风险提示和敏感内容边界校验。
- 2026-07-16：移除与 `script-src 'self'` 冲突且功能重复的 `is:inline` reduced-motion 脚本；CSP 增加 `object-src 'none'`。
- 2026-07-16：新增 `validate:security`，自动校验 Cloudflare 安全响应头、CSP 和 Astro 内联脚本兼容性。
- 2026-07-16：当前可执行校验全部通过，单元测试共 7 个文件、26 项。
- 2026-07-16：完善命令面板 combobox/listbox 语义、活动项关联和单焦点 Tab 陷阱；空结果方向键不再产生无效索引。
- 2026-07-16：Header、命令选项和 Footer 主要操作补齐最小 44px 触控高度，全站增加统一 `:focus-visible` 样式。
- 2026-07-16：终端输出改为独立 `role="log"`，移除强制平滑滚动并补充装饰元素隐藏语义。
- 2026-07-16：新增 `validate:a11y`，校验外链 rel、图片 alt、按钮 type、输入标签、焦点样式和 reduced-motion；当前 8 个测试文件、30 项全部通过。
- 2026-07-16：新增共享 GitHub 快照解析器，页面读取和构建同步均从 `unknown` 开始逐字段校验，拒绝重复仓库、非法计数与无效时间。
- 2026-07-16：新增 `validate:github`，已提交快照的 9 个缓存条目通过白名单与完整性校验；当前 8 个测试文件、33 项全部通过。
- 2026-07-16：404 页面增加 `noindex, nofollow` 并从 sitemap 排除；Web App Manifest 补齐 ID、scope、描述和本地 SVG 图标。
- 2026-07-16：新增 `validate:site`，校验 canonical、sitemap、robots、manifest、404 和 Wrangler 静态部署契约；当前 9 个测试文件、36 项全部通过。
- 2026-07-16：核对 8 个批准仓库的真实媒体资源；FavGrove 提供 5 张界面截图，GloboKit 仅有项目插画，其余仓库未发现可直接复用的栅格截图。
- 2026-07-16：接入 FavGrove 1280 × 800 管理界面截图，生成 42.5 KB WebP 与 30.3 KB AVIF，并固定到来源提交 `a4b1702fa44facba56fc13346dee1a64c1bd16aa`。
- 2026-07-16：扩展项目内容与媒体校验，要求本地路径、双格式、Alt 文本、尺寸、来源、格式签名和 250 KB 上限；当前 9 个测试文件、37 项全部通过。
- 2026-07-16：GloboKit 公开站点连续两次超过 60 秒无法加载，Linketry 也曾连接失败；未将不可验证在线页面或插画冒充项目界面截图。
- 2026-07-16：按 `cc-size-check` 扫描全项目，无文件超限、无 TSX/Astro 内联样式问题；规格文档重复标题来自 8 个项目字段模板，属于预期结构。
- 2026-07-16：项目 `AGENTS.md` 明确 Astro 200 行限制；新增 `validate:size`，当前扫描 56 个源文件，最接近上限的是 `src/pages/index.astro`，剩余 14 个有效代码行。
- 2026-07-16：新增 `validate:static` 统一运行所有非构建契约与单元测试；当前 10 个测试文件、40 项全部通过。
- 2026-07-16：执行 `npm install`，锁文件与依赖树升级至 Astro 7.1.0、`@astrojs/react` 6.0.1、`@astrojs/mdx` 7.0.3、`@astrojs/sitemap` 3.7.3、`@astrojs/check` 0.9.9。
- 2026-07-16：Astro 7 预渲染发现 GitHub 快照运行时路径在构建产物中不存在；`src/utils/github.ts` 改为静态 JSON 模块导入，并继续使用既有 `unknown` 快照校验。
- 2026-07-16：`npm run validate:static`、`npm run typecheck`、`npm run test` 与无 `GITHUB_TOKEN` 的 `npm run build` 均通过；生产构建生成 13 个静态页面。
- 2026-07-16：新增 ESLint 平铺配置、Prettier Astro 配置、忽略规则及 `lint`、`lint:fix`、`format:check`、`format:write` 脚本，并将检查并入 `validate:static`。
- 2026-07-16：格式化暴露首页超出 200 行限制，已提取工程原则区块为独立组件；`validate:size` 通过。
- 2026-07-16：Prettier 写入的合法 JSONC 尾随逗号暴露 `validate:site` 对 `wrangler.jsonc` 的错误 JSON 解析；改用 `jsonc-parser` 后，lint、格式检查、静态验收和生产构建均通过。
- 2026-07-17：新增 Playwright Chromium 桌面和移动项目，覆盖首页、Linketry 详情、命令面板键盘打开/搜索/Escape 与移动 Header 按钮；`test:e2e` 为 4 项通过、2 项按设备范围跳过。
- 2026-07-17：Astro 7 `dev` 会启动后台服务后退出，无法被 Playwright `webServer` 管理；E2E 改由独立端口的生产构建与 `astro preview` 运行。
- 2026-07-17：Vitest 默认扫描 `e2e/*.spec.ts` 导致将 Playwright 测试作为单元测试执行；`test` 脚本现限定为 `vitest run tests`，静态验收恢复通过。
- 2026-07-17：新增 GitHub Actions PR 验证工作流，使用 Node 22、`npm ci`、Chromium、静态验收、类型检查与 E2E；仅授予 `contents: read`，失败时上传 Playwright 报告，无部署或 GitHub API 密钥。
- 2026-07-17：Prettier YAML 校验、`npm run validate:static`、`npm run typecheck` 和无 `GITHUB_TOKEN` 的 `npm run test:e2e` 均通过；E2E 为 4 项通过、2 项按设备范围跳过。
- 2026-07-17：扩展 Playwright 真实浏览器审计：移动 Chromium 覆盖首页、项目索引、Linketry 详情、About、Coffee 的横向溢出；命令面板覆盖自动焦点、滚动锁定、Escape 和触发按钮焦点恢复。静态验收、类型检查和生产预览 E2E 均通过；E2E 为 5 项通过、3 项按设备范围跳过。
- 2026-07-17：新增 Lighthouse CI 审计，使用 Playwright 管理的 Chromium 对生产构建首页和 Linketry 详情执行审计；无令牌上传，CI 失败时保留本地报告。最终审计：首页性能 0.99、可访问性 0.91、SEO 0.92；Linketry 性能 0.98–0.99、可访问性 0.91、SEO 0.92。
- 2026-07-17：本机系统级 AdGuard 注入请求会使性能降至约 0.53 且本地 HTTP 使最佳实践 HTTPS 项失败；审计仅阻止该系统注入 URL，并以 Lighthouse 12 支持的控制台错误、性能、可访问性和 SEO 断言验证站点，不降低这些类别门槛。
- 2026-07-17：Lighthouse 生成 `.lighthouseci/` 和 `lighthouse-reports/`，已加入 ESLint 与 Prettier 忽略规则；`npm run validate:static` 和 `npm run typecheck` 通过。
- 2026-07-17：使用已授权的 Cloudflare OAuth 创建并部署 `everettlabs-dev` Workers Static Assets，先后部署版本 `58cdd72b-2743-4cdb-9095-ff90f91de7af`、`f643ba9e-ddb2-4d59-9d31-4976a62d7c10` 和当前版本 `4e00134b-5ab8-4bd2-86b1-83e5389b8de8`；绑定 `everettlabs.dev`，显式启用 workers.dev 和版本预览 URL。
- 2026-07-17：生产域名 DNS 解析为 Cloudflare 地址，HTTPS 主页与 Linketry 返回 200、未知路由返回 404，robots 和 sitemap 返回 200；CSP、nosniff、DENY、Referrer Policy 与 canonical 通过。Windows 证书吊销服务离线，HTTP 验证使用 `curl --ssl-no-revoke`；HTTP 当前未重定向至 HTTPS，不能标记为通过。
- 2026-07-17：扩展站点部署契约，强制 `workers_dev`、`preview_urls` 和 `everettlabs.dev` Custom Domain；静态验收、类型检查、E2E、Lighthouse 与无 `GITHUB_TOKEN` 的生产构建均通过。
- 2026-07-17：复核其余批准 GitHub 仓库的 HEAD 文件树。LinkVitals、Nezha Cleaner、DistroLift、VPS Scripts、NodeLoc Bench 未发现真实界面截图；GloboKit 仅有项目插画；Linketry 未发现可直接复用的已发布界面截图。保留 FavGrove 的可验证截图，不添加虚构媒体。
- 2026-07-17：Lighthouse 报告暴露 `SEO.astro` 缺少 `<title>` 与多处颜色对比度不足；补齐页面标题，拆分 violet 按钮色和深色背景文本色，提高 muted 文本亮度，并增加站点标题与主题对比度静态契约。
- 2026-07-17：本地 Lighthouse 的 Performance、Accessibility、SEO 门槛统一提升到 0.95；首页与 Linketry 最终均为 Performance 99、Accessibility 100、SEO 100，LCP 2.0 秒、CLS 0。构建 JavaScript 合计约 63.2 KB gzip，低于 100 KB 目标。
- 2026-07-17：确认 Cloudflare Web Analytics 已在生产端自动注入公开 beacon；CSP 仅新增官方脚本与上报域名，未加入 `unsafe-inline` 或其他宽泛来源，并把这两个域名纳入安全校验。
- 2026-07-17：将修复后的站点部署为 `a99c148a-cf24-4150-b4d2-b03a72cfc04c`，随后以 CSP 更新部署当前版本 `62de78ed-f02e-4088-a187-0138c91b1af2`；生产首页和 Linketry 为 200、未知路由为 404、robots 与 sitemap 为 200，页面标题和安全头通过。
- 2026-07-17：最终 `validate:static` 为 10 个测试文件、43 项测试通过；`typecheck` 0 errors，`test:e2e` 5 项通过、3 项按设备范围跳过，无 `GITHUB_TOKEN` 的构建生成 13 个静态页面。
- 2026-07-17：生产 Lighthouse 在本机受到系统代理/AdGuard 主文档注入与 Windows 临时目录文件锁污染；未降低 0.95 门槛，也未把受污染报告标记为通过。已验证的生产指标为 Accessibility 100、SEO 100、FCP 1.1 秒、LCP 1.7 秒，最终四分类报告等待干净 Linux/CI 环境复测。
- 2026-07-17：GitHub Actions 的 `workflow_dispatch` 现会额外运行 `audit:lighthouse:production`，为无本机注入的 Linux 环境提供最终生产验收入口；PR 和 `main` 常规验证仍使用确定性的本地生产构建审计。
- 2026-07-17：手动运行 GitHub Actions `29548528016`；干净 Ubuntu 环境确认线上首页与 Linketry 为 99/100/93/100，Best Practices 唯一失败来自响应头 CSP 阻止 Astro islands 内联运行时，不再归因于本机 AdGuard。
- 2026-07-17：改用 Astro 7 原生 CSP hash，Cloudflare 响应头只保留响应头专属指令；首页内联网格样式迁移到共享 CSS，Markdown 高亮切换为 CSP 兼容的 Prism；`.wrangler/**` 纳入 ESLint 生成物忽略。静态验收 53 项、类型检查、构建、完整 Chromium E2E、Wrangler dry-run 和本地 Cloudflare 浏览器验证通过。
- 2026-07-17：当前 Wrangler OAuth 账号与已部署 Worker 账号不一致，版本 API 返回认证错误 `10000`；未部署本地 CSP 修复，等待切换正确 Cloudflare 账号后继续生产验收。

## 2026-07-17 Coffee 加密货币支持

### 范围与现状

- 用户明确 Coffee 页面只接受加密货币，不再保留 Buy Me a Coffee、GitHub Sponsors、微信或支付宝收款入口。
- 首版支持 `USDT · TRON (TRC20)`、`USDC · Base` 和 `BTC · Bitcoin`；资产与网络必须成对展示。
- 当前尚未提供公开收款地址，因此完成实现后仍保持空配置不渲染支付卡片，不写入示例或虚构地址。

### 验收标准

- [x] 使用共享类型定义三种加密货币收款方式，并在构建时拒绝明显不符合目标网络格式的非空地址。
- [x] Coffee 页面只渲染已配置方式，提供本地生成的二维码、完整地址、复制按钮和明确的转账网络警告。
- [x] 复制交互支持键盘、可见焦点、至少 44 × 44px 触控目标，并提供可感知的成功或失败状态。
- [x] 删除旧的法币与第三方赞助配置字段，不引入外部二维码、跟踪脚本、私钥或助记词。
- [x] 增加空配置、地址校验和页面契约测试，并运行静态校验、类型检查和无 `GITHUB_TOKEN` 的生产构建。

### 验证结果

- `[通过]` `npm run validate:static`：11 个测试文件、51 项测试全部通过，包含空配置、三类地址格式、本地 PNG 二维码生成、旧支付字段移除和单一 Coffee 命令契约。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留项目原有 2 条上游兼容提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留 GitHub 快照并生成 13 个静态页面；Coffee 空配置未渲染支付卡片或二维码。
- `[通过]` `npm run test:e2e`：5 项通过、3 项按设备范围跳过；Coffee 已纳入移动端横向溢出检查。

### 已知阻塞

- `[已解除]` 2026-07-17 已收到并逐字符核对四个公开收款地址，真实地址下的页面渲染、复制按钮和移动端布局均已完成浏览器验收。

### 2026-07-17 公开地址上线与 TON 扩展

#### 范围与现状

- 用户通过本地文本和四张 Binance 充值截图提供了四个公开收款地址；本轮只处理公开地址，不读取、请求或存储任何私钥、助记词、验证码或 API 密钥。
- 在原三种方式基础上启用可选的 `USDT · The Open Network (TON)`，最终保持四个入口，不扩展 ERC20、BSC、SOL、DOGE、LTC 等重复或低优先级网络。
- 当前 BTC 校验只接受 `bc1` 地址，不能接受本轮提供的 `1...` 主网地址；页面也缺少区块浏览器入口，四张卡片需要调整为更稳定的双列布局。
- 当前地址来自交易所充值页面，存在交易所变更或停用充值地址的维护风险；上线后需要把页面地址视为公开配置，并在交易所侧地址变化时同步更新和复验。

#### 验收标准

- [x] 四个地址逐字符匹配用户提供的文本，资产与网络严格成对展示，构建时拒绝明显错网或错格式地址。
- [x] 二维码继续在构建时从完整地址本地生成，不复用外部截图或热链资源。
- [x] 每张卡片提供完整地址、复制状态、对应地址的区块浏览器入口和明确的网络警告。
- [x] 桌面端使用稳定的双列卡片布局；移动端无横向溢出，交互保持键盘可达和至少 44 × 44px 触控目标。
- [x] 更新单元与浏览器测试，并运行静态校验、类型检查、无 `GITHUB_TOKEN` 构建和 Coffee 桌面/移动端视觉验收。

#### 验证结果

- `[通过]` `npm run validate:static`：11 个测试文件、55 项测试全部通过，覆盖四个真实地址、四种网络格式、区块浏览器映射、二维码生成和旧支付字段隔离。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留项目原有 2 条上游兼容提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留 GitHub 快照并生成 13 个静态页面，Coffee 四个二维码均在构建时本地生成。
- `[通过]` `npx playwright test --headed --workers=1`：7 项通过、3 项按设备范围跳过；桌面与移动 Chromium 均验证四个完整地址的真实剪贴板写入，移动端无横向溢出。
- `[通过]` 1440 × 1000 桌面和 Pixel 5 全页截图视觉复核：二维码非空，桌面 2 × 2、移动端单列，完整地址、操作按钮和警告均无重叠或裁切。

## 2026-07-17 Cloudflare 部署账号与自动发布修复

### 范围与现状

- `main` 已推送到 `f529c6e` 且 GitHub Actions 验证通过，但生产 `/coffee` 仍返回不含收款地址的旧版 12.5 KB HTML；禁用浏览器缓存后 Cloudflare 仍返回旧 Worker 静态资源。
- 仓库工作流只负责校验，没有部署步骤；Cloudflare Builds 尚未连接 GitHub，因此 push 不会自动发布生产版本。
- 当前默认 Wrangler OAuth 只属于账号 `b0fa092c63382065751fc97b15171f51`，生产 Worker `everettlabs-dev` 属于账号 `4cc48c9e3b9f084844f4485d51899e36`，版本 API 返回认证错误 `10000`。
- 本轮固定生产账号、绑定项目专用认证配置并部署当前提交；原生产版本 `62de78ed-f02e-4088-a187-0138c91b1af2` 保留为回滚点，`main` 自动构建仍需 Dashboard 登录后配置。

### 验收标准

- [x] `wrangler.jsonc` 显式指定生产账号，错误账号凭据必须快速失败，不能静默部署到其他账号。
- [x] 本机创建 `everettlabs-prod` 命名认证配置并绑定当前项目目录，`wrangler whoami` 能确认目标账号和 Worker 版本可见。
- [x] 当前 `f529c6e` 构建产物部署到 `everettlabs-dev`，生产 Coffee 包含四个真实地址和本地生成二维码。
- [x] 生产首页、项目页、Coffee、robots、sitemap、404 和安全响应头完成回归验证，HTTPS 响应包含一年期 HSTS。
- [x] `http://everettlabs.dev` 返回 `301 Moved Permanently`，`Location` 为 `https://everettlabs.dev/`。
- [x] Cloudflare Builds 连接 `everett7623/everettlabs.dev`，`main` 用于生产，非生产分支构建已启用。
- [x] 实际结果回写后提交并推送账号配置与任务记录，不提交 OAuth Token、API Token 或浏览器会话数据。

### 验证结果

- `[通过]` 创建并绑定命名 profile `everettlabs-prod`；`wrangler whoami --json` 确认登录邮箱为 `everett7623@gmail.com`、账号为 `4cc48c9e3b9f084844f4485d51899e36`，默认错误账号不再用于本项目。
- `[通过]` `npm run validate:static`：11 个测试文件、56 项测试全部通过；`npm run typecheck` 为 0 errors、0 warnings，保留 2 条原有上游提示；无 `GITHUB_TOKEN` 构建生成 13 个静态页面。
- `[通过]` 部署版本 `8e948b66-1b50-4af8-867d-c3c1c7bdae20`：自定义域名与 workers.dev 均返回新版 Coffee，四个地址和四张二维码存在；生产浏览器渲染 4 张卡片、无横向溢出、控制台 0 errors。
- `[通过]` 生产关键路由状态为首页 200、Linketry 200、Coffee 200、robots 200、sitemap 200、未知路由 404；CSP、HSTS、X-Content-Type-Options、X-Frame-Options 和 Referrer-Policy 均从公网响应验证。
- `[通过]` 已认证 Dashboard 会话完成 Always Use HTTPS 与 GitHub Builds 配置；公网 HTTP 实测 301，Builds 的仓库、命令、根目录与分支控制均与项目规范一致。
- `[通过]` Cloudflare Build `b336d145-02d1-40a7-9a95-8d982ac13467` 将提交 `bf1d580` 自动部署为版本 `db9617ab` 并承载 100% 流量；生产路由、Coffee 地址、GA4 与安全头回归通过。

## 2026-07-17 GitHub 首次发布

### 发布范围

- 用户要求提交并推送当前官网实现；规格指定目标仓库为 `everett7623/everettlabs.dev`。
- 当前目录最初没有 Git worktree，GitHub 目标仓库也尚未创建；GitHub CLI 已认证为 `everett7623`，Git 提交身份已配置。
- 仓库按公开官网源码定位创建为 public；不提交依赖、构建产物、部署临时文件、测试报告或环境变量。

### 发布验收

- [x] 增加 `.gitignore` 与 LF 属性，并确认暂存区不包含生成产物、凭据或本地环境文件。
- [x] 初始化 `main` 分支，创建包含当前完整官网实现的首次提交 `c97fb54`。
- [x] 创建 `everett7623/everettlabs.dev` 公开仓库并推送 `main`。
- [x] 核对远程、提交哈希、工作树状态和 GitHub Actions 工作流可见性。

### 发布记录

- 公开仓库已创建：`https://github.com/everett7623/everettlabs.dev`，默认分支为 `main`。
- 首次 GitHub Actions `PR Validation` 在干净 Ubuntu 环境通过静态校验、类型检查、Playwright 和 Lighthouse；生产 Lighthouse 按预期仅在手动触发时运行。
- 首次运行提示旧版官方 Actions 使用已弃用的 Node.js 20；已根据官方最新 release 将 checkout、setup-node 和 upload-artifact 升级到 `v7`，等待后续提交复测。
- `8556031` 已推送并通过升级后的第二次 `PR Validation`；静态校验、类型检查、Playwright 和 Lighthouse 全部通过，Node.js 20 弃用注解已消失。
- 最终文档提交 `6918eb6` 已推送，第三次 `PR Validation` 在提交 `6918eb61136c6cb2a792bb44f46a40c1caeef6b6` 上通过；本地 `main`、`origin/main` 与远程引用完全一致，工作树在发布完成时保持干净。
