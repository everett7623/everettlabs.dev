# 月度站点维护框架

## 任务信息

- 创建日期：2026-11-03
- 规格来源：月度站点维护框架规划；`AGENTS.md`；`Everett Labs Developer Website.md`
- 当前目标：落地半自动月度维护（快照同步 PR、候选发现、生产健康检查），并完成首轮内容冲刺。

## 范围

- [x] `scripts/blocked-repositories.ts` + `scripts/candidate-discovery.ts` + `discover:candidates`
- [x] 候选过滤单测
- [x] `github-sync-meta.json` 新鲜度闸门（警告 45 天 / 失败 90 天；可用环境变量覆盖）
- [x] `.github/workflows/monthly-maintenance.yml`
- [x] Runbook + README 入口
- [x] 刷新 GitHub 快照并上架 `wordpress-theme-rackora`（slug `rackora-wp`）
- [x] 现有 `rackora.mdx` 增加 `https://rackora.cc` 外链
- [x] 运行验证并回写结果

## 设计说明

- 新鲜度检查使用 `syncedAt` 元数据，而不是各仓库的 `updatedAt`，避免不活跃但已批准的项目误伤 CI。
- 新项目永不由 cron 自动写入白名单或 MDX。

## 首轮内容

- 白名单新增 `everett7623/wordpress-theme-rackora`。
- 新增 `src/content/projects/rackora-wp.mdx`、本地截图（来源仓库 `docs/screenshots/home-light.png`）、OG、命令面板、`llms.txt`。
- Halo Rackora 与 WP Rackora 均链接 `https://rackora.cc`（不上架独立 `Rackora` 官网仓）。
- GitHub 快照刷新为 15 个仓库；`github-sync-meta.json` `syncedAt` = `2026-11-03T01:26:33.044Z`。

## 验证结果

- `[通过]` `npm run validate:static`：lint、format、size、projects、links、a11y、github、security、site、Vitest 14 files / 81 tests。
- `[通过]` `npm run typecheck`：0 errors；保留既有 Astro/React 上游 hint。
- `[通过]` `npm run build`：无 `GITHUB_TOKEN` 时保留快照，生成 20 个静态页面，含 `/projects/rackora-wp`。
- `[阻塞 / 待推送]` `workflow_dispatch` Monthly Maintenance：新工作流文件尚未推到 `origin/main`，需提交并推送后才能调度；推送后执行 `gh workflow run "Monthly Maintenance"` 并核对 Actions 与生产 Lighthouse。
