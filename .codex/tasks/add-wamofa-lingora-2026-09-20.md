# DistroLift 仓库更名与 WAMofa / Lingora 接入（2026-09-20）

## 范围

- 将 DistroLift 白名单与内容仓库从 `everett7623/debian-auto-upgrade` 对齐到已重命名的公开仓 `everett7623/DistroLift`。
- 将公开原创产品 WAMofa、Lingora 加入 Projects 索引、详情页、命令面板、GitHub 快照和 `llms.txt`。
- 保留 2026-08 已接入的 Rackora（`everett7623/halo-theme-rackora`），不重复新增。
- 不接入私有仓、机场/代理仓，以及 `vpsknow-stock`。
- 不为 WAMofa / Lingora 添加虚构截图；仓库当前无已批准的界面截图。

## 已核对现状

- 站点从 12 个白名单项目扩到 14 个：Rackora 保留，新增 WAMofa 与 Lingora，DistroLift 仓库名对齐。
- GitHub 将 `debian-auto-upgrade` 重定向到 `DistroLift`（HEAD `cdea314`，最新 Release `v3.8.1`）。
- `everett7623/wamofa` 公开、MIT、TypeScript、主页 `https://wamofa.com`，无 GitHub Release。
- `everett7623/Lingora` 公开、GPL-2.0-or-later 插件头、PHP、版本 `0.0.1`，无 GitHub Release。
- `everett7623/halo-theme-rackora` 已在白名单、MDX、命令面板、OG、`llms.txt`、快照、E2E 与规格中，截图为本地 WebP/AVIF。
- WAMofa / Lingora 均未发现可验证的项目界面截图。

## 验收标准

- [x] DistroLift 页面、白名单、快照与 GitHub 链接使用 `everett7623/DistroLift`。
- [x] WAMofa 与 Lingora 生成英文详情页，能力、许可、状态与远程仓库一致，不出现机场/代理内容。
- [x] Rackora 保留在 14 项目集合中，未重复接入。
- [x] 白名单、MDX、命令面板、OG 图、`llms.txt`、GitHub 快照与测试契约均为 14 个项目。
- [x] `npm run validate:projects`、`npm run typecheck`、`npm run test`、`npm run build` 真实执行并记录结果。

## TODO

- [x] 修正 DistroLift 仓库名。
- [x] 新增 WAMofa 与 Lingora 内容、白名单、命令和机器可读索引。
- [x] 核对 Rackora 已在公开面，不重复新增。
- [x] 刷新项目 OG 图和 GitHub 快照。
- [x] 更新项目精确契约、命令契约与 E2E 项目数量。
- [x] 运行验证并回写结果。
- [x] 提交并推送 `main`，等待 GitHub Actions，核验生产域名。

## 已知阻塞

- 无。WAMofa / Lingora 暂无真实截图，按现有无截图项目处理。
- 未对错误 Cloudflare 账号执行 `wrangler deploy`。生产依赖 Cloudflare Builds 连接 `everett7623/everettlabs.dev` 的 `main`。
- 普通 `push` 工作流按设计跳过生产 Lighthouse；未把它记为通过。

## Git、CI 与生产

- 功能提交：`d93b999bdee8446a88ff8b7da9cac48059075ea4`
  `feat: add WAMofa and Lingora, and point DistroLift at DistroLift`
- 行数修复提交：`60f1e5b40d701841c186238226807cd3af19747c`
  `fix: split project catalog contract to stay under the source-size limit`
- 推送：`origin/main` 与远程 `refs/heads/main` 均为 `60f1e5b40d701841c186238226807cd3af19747c`
- 仓库：https://github.com/everett7623/everettlabs.dev/commit/60f1e5b40d701841c186238226807cd3af19747c
- `[失败，已修复]` GitHub Actions `35498251711`（`d93b999`）：`validate:static` 因 `scripts/project-validation.ts` 306 有效行超过 300 行限制失败。https://github.com/everett7623/everettlabs.dev/actions/runs/35498251711
- `[通过]` GitHub Actions `35498367999`（`60f1e5b`）：Validate 作业完成静态校验、类型检查、Playwright 与本地 Lighthouse；生产 Lighthouse 按普通 `push` 跳过。https://github.com/everett7623/everettlabs.dev/actions/runs/35498367999

## 验证结果

- `[通过]` Rackora 核对：白名单、`src/content/projects/rackora.mdx`、命令面板、`public/og/projects/rackora.svg`、`llms.txt`、GitHub 快照、E2E 与规格均指向 `everett7623/halo-theme-rackora`；本地截图 `public/projects/rackora/home.webp` 与 `home.avif` 仍在 Git 中。未重复新增。
- `[通过]` `npm run generate:og`：生成 14 张本地项目 Open Graph 图。
- `[通过]` `npm run validate:projects`：Validated 14 project content contracts and safety boundaries。
- `[通过]` `npm run typecheck`：0 errors、0 warnings；保留 `SEO.astro` inline script 与 React `FormEvent` 的两条既有上游 hint。
- `[通过]` `npm run test`：13 个测试文件、73 项测试全部通过。
- `[通过]` 在移除 `GITHUB_TOKEN` 的进程环境后执行 `npm run build`：同步步骤保留提交的 GitHub 快照，生产构建生成 19 个静态页面，包含 `/projects/rackora`、`/projects/wamofa`、`/projects/lingora`、`/projects/distrolift`。
- `[通过]` 预览核验 `http://127.0.0.1:4322/projects`：Products 含 Rackora（08）、WAMofa（09）、Lingora（10）；Infrastructure 含 DistroLift（03）；JSON-LD `numberOfItems` 为 14。
- `[通过]` 预览详情页：Rackora GitHub 为 `https://github.com/everett7623/halo-theme-rackora`；WAMofa GitHub 为 `https://github.com/everett7623/wamofa` 且有 Live Site；Lingora GitHub 为 `https://github.com/everett7623/Lingora`；DistroLift GitHub 为 `https://github.com/everett7623/DistroLift`，页面无 `debian-auto-upgrade`。
- `[通过]` 生产 HTTPS：`https://everettlabs.dev/`、`/projects`（`numberOfItems` 14，含 Rackora / WAMofa / Lingora / DistroLift）、`/projects/rackora`、`/projects/wamofa`、`/projects/lingora`、`/projects/distrolift` 均为 200。DistroLift GitHub 链接为 `https://github.com/everett7623/DistroLift`。
- `[通过]` 生产 `robots.txt` 与 `llms.txt` 均为 200；`robots.txt` 允许 `OAI-SearchBot`；`sitemap-0.xml` 含 wamofa、lingora、rackora、distrolift。
- `[通过]` `http://everettlabs.dev/` 返回 `301`，`Location: https://everettlabs.dev/`。
- `[跳过，按设计]` 生产 Lighthouse 仅手动 `workflow_dispatch` 执行。
- `[未执行]` Wrangler CLI 部署：账号不匹配风险，依赖 Cloudflare Builds。
