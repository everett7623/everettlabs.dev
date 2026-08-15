# Rackora 项目接入（2026-08-16）

## 范围

- 读取本地项目内容模型、白名单、验证契约与远程 `everett7623/halo-theme-rackora` 仓库。
- 将 Rackora 作为人工批准的原创产品加入 Projects 索引、详情页、命令面板、构建时 GitHub 元数据快照和 `llms.txt`。
- 使用仓库当前提交提供的真实主题截图，生成本地 WebP/AVIF 资源；不热链外部媒体。
- 修正当前 11 个内容条目与旧 9 项目验证契约不一致的问题，并使本次新增后统一为 12 个项目。

## 已核对现状

- 本地人工白名单和 GitHub 快照均有 11 个项目，MDX 内容也有 11 个；`scripts/project-validation.ts` 和部分测试仍保留过时的 9 项目精确集合。
- 远程仓库公开、默认分支为 `main`，HEAD 为 `48874f40482e558dd06ff440af5bde14f4a5ec93`。
- Rackora 是原创、GPL-3.0 的 Halo `>= 2.20.0` 主题，版本 `v0.6.7`；仓库 README、`theme.yaml` 与 Release 共同确认其适用于独立发布、知识库和技术写作。
- 远程根目录的 `screenshot.png` 是可验证的主题界面截图，当前大小 105,697 bytes。

## 验收标准

- [x] Rackora 的 English Editorial MDX 生成 `/projects/rackora`，定位、兼容性、许可和能力与远程仓库一致。
- [x] 白名单、GitHub 快照、内容契约、命令面板、OG 图和 `llms.txt` 对 12 个项目保持一致。
- [x] Rackora 截图为本地 WebP/AVIF，包含尺寸、替代文本和固定到远程 HEAD 的 GitHub 来源链接。
- [x] `npm run validate:projects`、`npm run typecheck`、`npm run test`、`npm run build` 均真实执行并记录结果。

## TODO

- [x] 新增 Rackora 内容、白名单、命令和机器可读索引。
- [x] 接入远程截图，刷新项目 OG 图和 GitHub 快照。
- [x] 更新项目精确契约与相关测试。
- [x] 运行验证并记录结果。

## 已知阻塞

- 无。

## 验证结果

- `[通过]` GitHub 远程核对：`git ls-remote`、Repository API、README、`theme.yaml`、Release
  API 和文件树确认 Rackora 的公开状态、`main` HEAD、GPL-3.0、Halo `>= 2.20.0`、`v0.6.7`
  发布及真实首页截图来源。
- `[通过]` 本地媒体核验：将远程 1440 x 900 截图转换为 61,728-byte WebP 与 40,412-byte
  AVIF；已视觉检查，图片显示 Rackora 的真实首页、文章流与侧栏，且来源固定至远程 HEAD。
- `[通过]` `npm run generate:og`：生成 12 张本地项目 Open Graph 图，包括 Rackora。
- `[通过]` `npm run validate:static`：ESLint、Prettier、源码行数、12 个项目、50 个链接、
  可访问性、GitHub 快照、安全、站点发现契约及 13 个测试文件共 73 项测试全部通过。
- `[通过]` `npm run typecheck`：0 errors、0 warnings；保留 `SEO.astro` inline script 与
  React `FormEvent` 的两条既有上游提示，以及 Vite 的既有 Rolldown 迁移警告。
- `[通过]` `npm run test`：13 个测试文件、73 项测试全部通过。
- `[通过]` 在移除 `GITHUB_TOKEN` 的进程环境后执行 `npm run build`：同步步骤保留提交的
  GitHub 快照，生产构建生成 17 个静态页面，包含 `/projects/rackora`。
- `[失败，已修复]` GitHub Actions `31897896173` 的 Playwright 阶段仍将项目集合 JSON-LD 的
  `numberOfItems` 断言为 9，而页面正确输出 12；其余静态校验和类型检查均通过。
- `[通过]` 将 E2E 契约同步为 12 项，并新增 Rackora 在目录页、详情页、GitHub 链接和 GPL-3.0
  许可的桌面与移动断言；本地 `npm run validate:static` 与 `npm run test:e2e` 均通过，后者为
  11 项通过、3 项按设备范围跳过。
