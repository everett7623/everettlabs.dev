# 项目文件与开发文档整理（2026-07-17）

## 范围

- 盘点 Git 跟踪文件、忽略目录、源码引用、文件体积和任务状态。
- 删除可通过现有命令重新生成的本地输出，不删除依赖、源码、公开素材或历史。
- 整理 README、活跃任务和已完成任务归档，消除过时的 Cloudflare 阻塞描述。
- 保持网站行为、公开内容、收款配置和部署配置不变。

## 盘点结果

- 2026-07-25 已执行 `git fetch origin --prune`；本地 `main`、`origin/main` 与远程均为
  `8ed9bec`，没有待合并远程提交。工作区的文档整理改动是本任务预期内容。
- 全部 72 个受限源文件均未超过项目行数上限。
- 当前只存在 `.astro`（9 个文件、32,682 B）、`dist`（44 个文件、668,173 B）和
  `test-results`（3 个文件、677,579 B）；其余已列出的可再生目录不存在。它们均已由
  `.gitignore` 覆盖，可在完成验证后清理。
- `node_modules` 是当前本地开发依赖，不视为无用文件；公开媒体、OG 图、GitHub 元数据快照和
  Coffee 地址均有真实构建或页面引用。
- `coffee-release-hardening`、`ga4-analytics` 与 `production-performance-followup` 已完成，适合
  归档；`website-v1-quality` 仍跟踪缺少可验证来源的项目截图，继续保留为活跃任务。

## 删除与恢复

- `.astro`：由 Astro 类型检查或构建重新生成。
- `dist`：由 `npm run build` 重新生成。
- `.wrangler`：由 Wrangler 本地运行或部署重新生成。
- `.lighthouseci` 与 `lighthouse-reports`：由 Lighthouse 命令重新生成。
- `test-results`：由 Playwright 重新生成。

## 验收标准

- [ ] 只删除现有的已验证忽略目录，保留 `node_modules` 和所有跟踪文件。
- [x] README 准确描述 Node.js/npm 要求、常用脚本、项目结构、Cloudflare Builds 和生成物。
- [x] 已完成任务状态无过时阻塞，并移动到按月份组织的归档目录。
- [x] `validate:size`、`validate:static`、`typecheck` 和无 `GITHUB_TOKEN` 的 `build` 通过。
- [ ] 验证后再次清理可再生输出，Git 差异只包含文档整理和任务移动。
- [ ] 提交推送后 GitHub Actions 与 Cloudflare Builds 均成功。

## TODO

- [x] 修正已完成专项任务中的 Cloudflare 状态。
- [x] 重写 README 并更新任务归档约定。
- [x] 移动已完成任务。
- [ ] 删除本地生成物并复核 Git 差异。
- [x] 运行验证并记录真实结果。
- [ ] 经用户授权后提交、推送并等待自动验证与部署。

## 当前阻塞

- 当前 Codex 环境策略在执行前拒绝对已核验的 `.astro`、`dist` 和 `test-results` 运行
  `Remove-Item -Recurse`。这些路径仍保持 Git 忽略状态，未影响跟踪文件或构建验证；需要在允许
  本地删除的会话中完成最后的输出清理。

## 本次验证

- `[通过]` `git fetch origin --prune`：本地 HEAD、`origin/main` 与远程均为 `8ed9bec`。
- `[通过]` `npm run validate:static`：13 个测试文件、70 项测试全部通过。
- `[通过]` `npm run typecheck`：0 errors；保留结构化数据脚本和 `React.FormEvent` 的既有提示。
- `[通过]` 未设置 `GITHUB_TOKEN` 的 `npm run build`：保留快照并生成 14 个静态页面。
