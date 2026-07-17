# Everett Labs 项目协作指南

本文件是 `everettlabs.dev` 的项目级 Codex 开发规范。进入本目录后，所有实现、修复、审查和文档工作都必须遵循这里的约束。

## 项目目标

Everett Labs 是一个面向开发者的独立软件实验室官网，不是个人简历、代理公司模板或通用作品集。

- 网站域名：`https://everettlabs.dev`
- 网站语言：English
- 协作与开发说明：默认使用简体中文
- 部署目标：Cloudflare Workers Static Assets
- 代码与文档署名：`everettlabs`

## 真实文档与优先级

开始开发前必须先读取与任务有关的真实代码和文档，不根据目录名猜测完成度。

1. `Everett Labs Developer Website.md`：产品范围、内容规则、设计、架构和上线验收的主规格。
2. `AGENTS.md`：项目长期开发约束。
3. `.codex/tasks/*.md`：具体迭代的状态、待办、阻塞和验证记录。
4. `README.md`：本地运行、脚本和部署入口。

若用户的新要求与旧任务文档冲突，以用户当前明确要求为准，并同步更新对应任务文档。不要把临时进度、一次性错误日志或短期阻塞长期写入本文件。

## Codex 工作流

复杂或多步开发必须按以下顺序执行：

1. 阅读相关规格、配置、源码和现有测试。
2. 在 `.codex/tasks/{task-name}-{YYYY-MM-DD}.md` 创建或更新任务记录。
3. 写明范围、现状、验收标准、TODO 和已知阻塞。
4. 优先实现能解决当前问题的最小改动，不主动扩需求或重构无关代码。
5. 完成后执行受影响范围内最小但有意义的验证。
6. 将实际验证结果回写任务文档，不把未运行的检查标记为通过。

继续当前官网质量迭代时，先读取：

```text
.codex/tasks/website-v1-quality-2026-07-16.md
```

## Git 与发布流程

- 规范仓库为公开仓库 `https://github.com/everett7623/everettlabs.dev`，默认分支为 `main`。
- 保留已有 Git 历史和远程配置；若目录缺少 `.git`，先核对规范仓库与远程状态，禁止直接创建无关历史后覆盖远程。
- 提交前检查 `git status`、暂存差异、忽略规则和敏感内容；`node_modules/`、`dist/`、`.astro/`、`.wrangler/`、Lighthouse/Playwright 报告及 `.env*` 不得提交。
- 提交应保持范围明确，不混入无关格式化、生成产物或用户未授权的文件；除非用户明确要求，不得 force push、改写公开历史或删除远程分支。
- 推送后必须核对本地 HEAD、`origin/main` 与远程引用一致，并等待对应 GitHub Actions 工作流结束；运行中或失败的工作流不得记录为通过。
- GitHub Actions 使用官方最新稳定主要版本、Node.js 22 和最小权限；常规 `push`/Pull Request 必须执行静态校验、类型检查、Playwright 与本地生产 Lighthouse，生产域名 Lighthouse 仅通过手动工作流执行。

## Cloudflare 与收款安全

- Cloudflare Builds 连接 `everett7623/everettlabs.dev`，`main` 用于生产构建，Pull Request 用于预览构建；Dashboard 操作必须在用户已认证的会话中完成。
- Wrangler OAuth 凭据只用于其授权范围内的 CLI/API 操作，不得读取、导出或当作 Dashboard 登录凭据。
- 启用 `Always Use HTTPS` 后必须请求 `http://everettlabs.dev`，确认返回 `301` 或 `308` 且目标为 HTTPS；仅验证 HTTPS 页面为 200 不代表重定向通过。
- 部署前核对构建产物、目标 Worker、Custom Domain 和可回滚版本；部署后验证首页、项目页、robots、sitemap、404 与安全响应头。
- Coffee 首版只支持 `USDT · TRON (TRC20)`、`USDC · Base` 和 `BTC · Bitcoin`，资产与网络必须成对显示，禁止提供含糊的跨链地址。
- 只接收和记录公开收款地址；不得请求、存储或提交私钥、助记词、Keystore、交易所密码、验证码或 API 密钥。
- 收款地址为空时不渲染支付卡片；非空地址必须通过对应网络的格式校验，二维码本地生成，复制操作需提供键盘支持和可感知状态。

## 技术基线

- Framework：最新稳定版 Astro 7；当前目标版本见 `package.json`，不得降级回 Astro 5。
- Language：TypeScript strict mode。
- Styling：Tailwind CSS 4。
- Interactive islands：React 19，仅用于命令面板、受控终端等真实交互。
- Content：Astro Content Collections + MDX。
- Deployment：Cloudflare Workers Static Assets。
- Package manager：npm。
- Node.js：`>=22.12.0`。

升级 Astro 时必须同时核对官方 React、MDX、sitemap 和 check 集成的兼容版本。依赖变更必须通过 npm 正常更新 `package-lock.json`；禁止手工伪造锁文件或只改 `package.json` 后声称升级完成。

Astro Content Layer 使用最新 API：

```ts
import { render } from 'astro:content';

const { Content } = await render(entry);
```

不得恢复已移除的 `entry.render()`，不得通过 legacy 开关掩盖迁移问题。

## 架构约束

- 所有公开页面默认生成静态 HTML。
- 不得把整站改成 React SPA。
- React 只用于需要客户端状态的独立 island。
- 不增加数据库、账号系统、运行时 API 或管理后台。
- GitHub API 只能在构建阶段调用，访客浏览器不得请求 GitHub API。
- GitHub 同步失败时必须保留已提交快照，不能因为临时网络失败删除项目内容。
- Editorial MDX 是项目文案的事实来源；GitHub 元数据只能补充 stars、forks、release、language、license 等批准字段。
- 外部图片和项目截图不得热链，使用本地优化资源。

## 内容边界

项目展示必须来自 `src/utils/approved-repositories.ts` 的人工白名单，禁止自动展示账户下的全部公开仓库。

严禁在官网展示或推广：

- 机场推荐、代理订阅、代理服务商和流量转售。
- Clash 订阅规则、绕过服务、机场排行或相关联盟内容。
- `jichang.gg`、`mofa-guide`、`airport-recommendations-2026`、`hy2` 及同类未来仓库。

特殊项目规则：

- VPS Scripts 只描述 Linux 运维、诊断、基准测试和自动化能力，不突出代理部署功能。
- NodeLoc Bench 必须标记为社区维护聚合项目，并保留上游归属和 Credits。
- Nezha Cleaner、DistroLift 等破坏性系统工具必须展示明确风险提示，不能描述为绝对安全。
- Seedloc 是外部写作入口，不在 v1.0 抓取或复制完整文章。
- Coffee 支付方式为空时不渲染按钮或二维码。

## UI 与可访问性

- 保持克制、精确、开发工具风格的深色界面。
- 使用黑白灰为主，violet、cyan 等强调色只做局部状态和操作提示。
- 禁止大面积渐变、霓虹发光描边、玻璃拟态、廉价黑客模板和无意义装饰动画。
- UI 文案不使用 emoji。
- 动画保持在 150–400ms，并尊重 `prefers-reduced-motion`。
- 所有交互必须支持键盘操作、可见焦点、Escape 关闭和最小 44 × 44px 触控目标。
- 不得把必要信息只放在 hover 状态。
- 命令面板的按钮、`Ctrl/Cmd + K` 和移动端入口必须使用同一事件协议。

## TypeScript 与代码质量

- 禁止使用 `any`、`as any`、`@ts-ignore` 或全局关闭类型检查来绕过问题。
- 外部 API 响应先按 `unknown` 接收并验证，再转换为项目类型。
- 共享类型放入 `src/types/`，不要在多个文件重复声明同一接口。
- 优先复用现有组件和工具函数，再考虑新增抽象。
- 错误、空状态、禁用状态和异步失败必须有明确行为，不能静默忽略。
- 不通过修改测试、开启 `skip-*`、`ignore-*`、`allow-*` 或整文件 lint disable 掩盖错误实现。
- 修改现有大文件时优先拆分新增职责，避免继续堆叠单文件复杂度。

## 文件行数限制

本项目除继承全局限制外，将 `.astro` 视为组件模板文件并限制为 200 行：

- Astro、TSX、JSX：不超过 200 个有效代码行。
- TypeScript、JavaScript、MJS：不超过 300 个有效代码行。
- 空行与纯注释行不计入有效代码行。
- 接近上限的页面新增区块时，应优先提取语义明确的 Astro 组件，不能通过压缩格式规避限制。

## 安全与隐私

- 保持 `public/_headers` 中的安全响应头，并在新增脚本、字体、分析或外部资源后重新验证 CSP。
- 不暴露 `GITHUB_TOKEN` 或任何构建密钥到客户端环境变量。
- 不加入广告像素、会话回放、指纹识别或不必要 Cookie。
- 分析仅允许使用 Cloudflare Web Analytics，并限制为规格批准的匿名事件。
- 对部署、删除、覆盖生成快照和环境敏感操作，先核对影响范围与回滚方式。

## 验证要求

常规改动完成后按影响范围运行：

```bash
npm run validate:projects
npm run typecheck
npm run test
npm run build
```

依赖发生变化时先运行：

```bash
npm install
```

验证规则：

- `validate:projects` 必须确认 8 个公开项目均在批准白名单内。
- `typecheck` 必须使用当前 Astro 和 TypeScript 真实类型，不允许跳过依赖错误。
- `test` 至少覆盖项目内容契约、命令定义和 GitHub 快照合并。
- `build` 必须在没有 `GITHUB_TOKEN` 时使用现有快照成功完成。
- 若某项因权限或环境无法运行，明确记录为阻塞，不能写成通过。

## 上线前仍需完成

以产品规格和当前 `.codex/tasks/` 为准，至少持续跟踪：

- ESLint、Prettier、Playwright 和链接验证。
- GitHub Actions PR 验证工作流。
- 项目本地截图、图片优化和项目专属 Open Graph 图。
- 移动端溢出、可访问性、CSP、bundle 和 Lighthouse 审计。
- Cloudflare Builds、预览分支、自定义域名、DNS/HTTPS 和 Analytics。

不要让这些后续事项扩大当前任务范围；只有当前任务完成或用户明确要求时才进入下一项。
