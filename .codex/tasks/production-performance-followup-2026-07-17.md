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
- [ ] 记录两条路由的分类分数与关键性能指标；首次运行已通过全部门槛，但旧脚本未输出具体数据。
- [x] 根据真实报告决定是否需要实现修复；未发现页面或 GA4 回归，不调整加载策略。
- [x] 为 Lighthouse 包装脚本增加分类分数与 FCP、LCP、TBT、CLS 摘要，后续工作流可直接比较趋势。
- [x] 运行受影响范围验证并回写结果。
- [ ] 核对 Cloudflare Dashboard 登录态，继续 Builds 与 Always Use HTTPS。

## 当前阻塞

- Cloudflare Builds 与 Zone 设置需要已认证 Dashboard 会话；若仍停留在登录页，保留为用户登录后的下一步，不使用其他账号代替。

## 验证记录

- `[通过]` GitHub Actions `29564541504` 在提交 `c895f1e` 上完成静态校验、类型检查、Playwright、本地 Lighthouse 与生产 Lighthouse；两条生产路由四分类均达到 0.95，`errors-in-console` 通过。
- `[通过]` `npm run validate:static`：13 个测试文件、70 项测试全部通过，包含 Lighthouse 摘要格式与缺失指标拒绝测试。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留 2 条既有上游提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留已有 GitHub 快照并生成 13 个静态页面。
- `[环境阻塞]` 本机 `npm run audit:lighthouse` 再次受到 AdGuard 注入、Lighthouse `NO_LCP` 与 Windows 临时目录 `EPERM` 影响；不把受污染结果记为代码失败，最终指标继续以干净 Ubuntu 工作流为准。
- `[阻塞]` 应用内 Cloudflare Dashboard 仍重定向至登录页，未修改 Builds 或 Zone 设置。
