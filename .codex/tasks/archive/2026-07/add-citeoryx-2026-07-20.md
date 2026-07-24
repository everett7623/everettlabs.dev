# Citeoryx 项目接入（2026-07-20）

## 范围

- 读取本地官网项目契约、产品规格与远程 `everett7623/Citeoryx` 仓库。
- 将 Citeoryx 作为人工批准的第 9 个公开项目加入 Projects 索引、详情页和命令面板。
- 刷新构建时 GitHub 元数据快照，不引入访客浏览器端 GitHub API 请求。
- 保持首页现有 4 个 Featured 项目，不为缺少可验证来源的 Citeoryx 虚构截图。

## 现状

- 产品规格、人工白名单和 GitHub 快照已包含 `everett7623/Citeoryx`，但缺少 Editorial MDX，
  因此网站不会生成 Citeoryx 项目页。
- 远程仓库为公开原创 WordPress 插件，默认分支为 `master`；仓库声明
  `GPL-2.0-or-later`，包含内容盘点、健康评分、优化工作流、SEO 插件适配、REST API、
  Google Search Console 与可选 AI Provider 集成，以及 PHPUnit 测试。
- 远程文件树未提供 PNG、JPEG、WebP、AVIF 或 GIF 项目截图。
- 本地 HEAD 与 `origin/main` 一致；工作树已有用户的文档整理和任务归档改动，本任务不回退或
  覆盖这些改动。

## 验收标准

- [x] Citeoryx 使用 English Editorial MDX 生成 `/projects/citeoryx`，仓库、许可、状态和能力描述
      与远程源码一致。
- [x] Projects 索引显示 9 个白名单项目，命令面板包含 Citeoryx 入口，首页 Infrastructure 区不
      错误展示非 Featured 产品。
- [x] 项目契约、规格与长期校验规则同步为 9 个公开项目，且仍禁止自动发布账号下全部仓库。
- [x] GitHub 快照通过现有构建时同步流程刷新；无 `GITHUB_TOKEN` 时生产构建仍可使用快照。
- [x] `npm run validate:projects`、`npm run typecheck`、`npm run test` 和 `npm run build` 通过。

## TODO

- [x] 新增 Citeoryx Editorial MDX 和命令入口。
- [x] 更新项目数量、分类与内容契约。
- [x] 同步 GitHub 元数据和项目 Open Graph 图。
- [x] 运行验证并记录实际结果。

## 已知阻塞

- 无。远程仓库缺少可验证截图属于内容限制，不阻塞文本项目页上线。

## 验证结果

- `[通过]` `git fetch origin --prune`：本地 HEAD、`origin/main` 与远程引用均为 `8524f2c`；
  本任务开始前的用户文档整理和任务归档改动均保留。
- `[通过]` GitHub 远程核对：公开仓库默认分支为 `master`，当前提交为
  `e8f2c28694967ba4c5ac0c4ae5f6379733220835`；README、WordPress `readme.txt`、
  `composer.json`、架构、测试和文件树共同确认项目定位、PHP/WordPress 要求与
  `GPL-2.0-or-later` 声明，且未发现可接入的项目截图。
- `[通过]` `npm run sync:github`：同步 9 个白名单仓库，保留 0 个旧缓存条目；Citeoryx 快照记录
  PHP、0 stars、0 forks、未归档和远程更新时间。GitHub License API 暂未识别仓库许可，页面
  使用 Editorial MDX 中经仓库文件核对的 `GPL-2.0-or-later`。
- `[通过]` `npm run validate:static`：lint、Prettier、源码行数、9 个项目契约、42 个内部链接、
  可访问性、GitHub 快照、安全与站点部署契约全部通过；13 个测试文件、70 项测试全部通过。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留 2 条既有 Astro 提示及上游 Vite
  deprecation 控制台警告。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留已提交快照，生成 Citeoryx OG 图与
  `/projects/citeoryx`，共构建 14 个静态页面。
- `[通过]` `npx playwright test --headed --workers=1`：9 项通过、3 项按设备范围跳过；桌面与
  移动 Chromium 均验证 Citeoryx 位于 Products 区、详情仓库和许可正确，移动端无横向溢出。
