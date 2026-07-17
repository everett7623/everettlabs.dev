# GA4 上线后生产性能复测

## 范围

- 对生产首页与 Linketry 项目页执行干净 Ubuntu 环境 Lighthouse。
- 核对 GA4 上线后 Performance、Accessibility、Best Practices、SEO 与控制台错误。
- 只有审计暴露可量化回归时才修改实现，不为未出现的问题增加复杂度。
- 复核 Cloudflare Dashboard 登录状态；认证可用时继续完成 Builds 与 Always Use HTTPS。

## 基线与验收标准

- GA4 上线前生产基线：首页与 Linketry 均为 Performance 99、Accessibility 100、Best Practices 93、SEO 100；当时 Best Practices 失败已定位并修复为 CSP 兼容实现。
- 两条生产路由四分类分数均不得低于 0.95。
- `errors-in-console` 必须通过，不能出现 GA4、CSP 或 Astro islands 相关控制台错误。
- 若审计通过，不进行没有真实收益依据的代码调整。
- Always Use HTTPS 只有在 HTTP 返回 `301` 或 `308` 且目标为 HTTPS 时才通过。

## TODO

- [x] 手动触发 `PR Validation` 的生产 Lighthouse。
- [x] 记录两条路由的分类分数与关键性能指标。
- [x] 根据真实报告决定是否需要实现修复；未发现页面或 GA4 回归，不调整加载策略。
- [x] 为 Lighthouse 包装脚本增加分类分数与 FCP、LCP、TBT、CLS 摘要，后续工作流可直接比较趋势。
- [x] 运行受影响范围验证并回写结果。
- [x] 核对 Cloudflare Dashboard 登录态，完成 Builds 与 Always Use HTTPS 配置。

## Cloudflare 完成状态

- Dashboard 账号、Worker 与 Zone 均已核对为 Account ID `4cc48c9e3b9f084844f4485d51899e36` 下的 `everettlabs-dev` 和 `everettlabs.dev`。
- Cloudflare Builds 已连接 `everett7623/everettlabs.dev`；构建命令为 `npm run build`，部署命令为 `npx wrangler deploy`，生产分支为 `main`，非生产分支构建已启用。
- Always Use HTTPS 已启用；公网 HTTP 请求返回 `301 Moved Permanently`，目标为 `https://everettlabs.dev/`。
- 首次真实 push 构建与自动部署等待本任务记录提交后验证。

## 验证记录

- `[通过]` GitHub Actions `29564541504` 在提交 `c895f1e` 上完成静态校验、类型检查、Playwright、本地 Lighthouse 与生产 Lighthouse；两条生产路由四分类均达到 0.95，`errors-in-console` 通过。
- `[通过]` 摘要增强提交 `527b92d` 的常规工作流 `29565069917` 通过；本地生产构建首页与 Linketry 均为 100/100/100/100，FCP 1.1 秒，LCP 分别 1.5 秒与 1.2 秒，TBT 0ms、CLS 0。
- `[通过]` 手动生产工作流 `29565216609` 通过；线上首页为 99/100/100/100，FCP 1.6 秒、LCP 2.0 秒、TBT 42ms、CLS 0；Linketry 为 99/100/100/100，FCP 1.5 秒、LCP 1.9 秒、TBT 62ms、CLS 0。
- `[结论]` GA4 上线后未出现性能、可访问性、最佳实践、SEO 或控制台回归，不调整现有生产域名限定和隐私受限加载策略。
- `[通过]` `npm run validate:static`：13 个测试文件、70 项测试全部通过，包含 Lighthouse 摘要格式与缺失指标拒绝测试。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留 2 条既有上游提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留已有 GitHub 快照并生成 13 个静态页面。
- `[环境阻塞]` 本机 `npm run audit:lighthouse` 再次受到 AdGuard 注入、Lighthouse `NO_LCP` 与 Windows 临时目录 `EPERM` 影响；不把受污染结果记为代码失败，最终指标继续以干净 Ubuntu 工作流为准。
- `[通过]` 已认证 Dashboard 会话确认登录账号为 `Everett7623@gmail.com's Account`，Account ID、Zone ID 与 Worker 均匹配项目配置。
