# GEO 与生成式搜索可发现性（2026-07-25）

## 范围

- 按生成式搜索可发现性（Generative Engine Optimization）审查静态页面、robots、sitemap、
  canonical、结构化数据和机器可读站点索引。
- 保持页面可见文本为事实来源，不增加只对爬虫展示的隐藏内容、虚构 FAQ、评分或用户数量。
- 同步产品规格、README、AGENTS、自动验证和本任务记录。
- 归档已经完成的 Citeoryx 与 Ko-fi 活跃任务，不改动仍有待办的 v1 质量和项目清理任务。

## 官方依据

- Google Search Central 明确说明 AI Overviews 与 AI Mode 继续使用基础 SEO 要求，不需要特殊
  AI 标记；关键条件包括允许抓取、可索引文本、内部链接和与可见内容一致的结构化数据。
- OpenAI Publisher FAQ 要求站点不阻止 `OAI-SearchBot`，才能使内容进入 ChatGPT 搜索摘要与
  snippet；该搜索爬虫与训练用途的 `GPTBot` 是不同控制面。
- `/llms.txt` 是社区提出的机器可读内容索引方案，不是 Google、OpenAI 或 Schema.org 的正式
  排名标准。本项目将其作为补充发现入口，不承诺收录或排名效果。

参考：

- <https://developers.google.com/search/docs/appearance/ai-features>
- <https://help.openai.com/en/articles/12627856-publishers-and-developers-faq>
- <https://llmstxt.org/>

## 已核对现状

- 全部公开页面是静态 HTML，主要内容无需客户端 JavaScript 即可读取。
- `robots.txt` 的 wildcard 规则允许全站抓取并声明 sitemap，但没有显式记录
  `OAI-SearchBot` 契约。
- 页面已具备 title、description、canonical、Open Graph、Twitter Card 和 JSON-LD；首页、
  About 与项目详情分别使用 `WebSite`、`ProfilePage` 与 `SoftwareApplication`。
- Projects 索引仍使用通用 `WebPage`，没有表达九个项目之间的集合关系。
- 当前没有 `/llms.txt`，自动站点验证也未覆盖生成式发现契约。

## 验收标准

- [x] `robots.txt` 明确允许 `OAI-SearchBot` 和普通搜索爬虫访问公开内容，并保留 sitemap。
- [x] `/llms.txt` 提供 Everett Labs、核心页面和全部九个批准项目的规范 HTTPS 链接。
- [x] JSON-LD 为组织、站点、页面和项目集合提供稳定身份关系，且字段与可见内容一致。
- [x] canonical 和 snippet 控制允许公开页面进入普通与生成式搜索，404 继续 `noindex`。
- [x] 主规格、AGENTS 和 README 明确 GEO 边界、维护入口和非保证性质。
- [x] 自动测试拒绝缺失 OAI 搜索爬虫规则、不完整 `llms.txt` 和虚构结构化信号。
- [x] `validate:static`、`typecheck`、无 `GITHUB_TOKEN` 的 `build` 与受影响浏览器检查通过。

## TODO

- [x] 归档已完成任务并更新开发文档索引。
- [x] 增加 robots 与 `llms.txt` 生成式发现契约。
- [x] 强化 JSON-LD 站点身份和 Projects 集合语义。
- [x] 扩展站点、SEO 和构建测试。
- [x] 同步主规格、AGENTS 和 README。
- [x] 执行验证并回写实际结果。

## 已知阻塞

- 无。搜索引擎抓取、索引、引用和排名由外部平台决定，技术契约通过不代表一定被收录。

## 验证结果

- `[通过]` `npm run validate:static`：lint、Prettier、72 个源文件行数、9 个项目内容边界、
  43 个链接、可访问性、GitHub 快照、安全、站点发现契约和 13 个测试文件共 73 项测试全部通过；
  `llms.txt` 的项目名称、URL 与摘要必须和 Editorial MDX 精确一致。
- `[通过]` `npm run typecheck`：0 errors、0 warnings；保留结构化数据脚本和
  `React.FormEvent` 的 2 条既有提示，以及上游 Vite deprecation 控制台提示。
- `[通过]` 未设置 `GITHUB_TOKEN` 的 `npm run build`：保留提交快照并生成 14 个静态页面；
  `dist/llms.txt`、`dist/robots.txt` 与 Projects HTML 均存在。
- `[通过]` `npm run test:e2e`：11 项通过、3 项按设备范围跳过；桌面与移动 Chromium 均请求
  构建后的 robots/llms 文件，并解析 Projects canonical、snippet 控制和 9 项 `ItemList`。
- `[已修复]` 首次浏览器检查发现 Astro 目录路由 canonical 带尾斜杠，而 JSON-LD 与
  `llms.txt` 使用无尾斜杠 URL；统一 canonical 后复测通过。
- `[文档]` Citeoryx、Ko-fi 和本任务均已完成并归档；v1 质量与项目清理任务继续保留为活跃任务。

## 发布结果

- `[通过]` 提交 `bf3850b` 已推送到 `main`；GitHub Actions `30112428837` 在同一提交上完成
  静态校验、类型检查、Playwright 与本地 Lighthouse。
- `[通过]` Cloudflare Builds 将同一推送部署为 Worker 版本 15
  `4ba9172b-76c9-4f26-a1a5-9fa43de4857d`，当前承载 100% 生产流量。
- `[通过]` 生产 `/robots.txt` 与 `/llms.txt` 均为 200；OAI 搜索爬虫、sitemap、9 个批准项目链接
  和禁用内容边界均符合契约。
- `[通过]` 生产 `/projects` 为 200，canonical 为 `https://everettlabs.dev/projects`，snippet
  控制完整，JSON-LD 为含 9 项的 `CollectionPage`；HSTS、CSP 与 nosniff 响应头保持有效。
- `[通过]` `http://everettlabs.dev` 返回 301，目标为 `https://everettlabs.dev/`。
