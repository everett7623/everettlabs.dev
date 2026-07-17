# Coffee 与发布链路加固（2026-07-17）

## 范围

- 统一 `/coffee` 的页面标题、H1 与站内 `Buy Me a Coffee` 入口文案。
- 将四种公开收款地址从正则格式检查升级为对应网络的真实地址校验。
- 统一 `AGENTS.md`、任务记录与当前页面的 TON 支持范围。
- 完成 Cloudflare Builds 自动发布与 Always Use HTTPS 配置并验证生产行为。
- 记录继续使用用户确认的 Binance 公开充值地址，不引入独立钱包或第三方收款系统。

## 当前状态

- 本轮决策更新起点为 `266b869`；生产 Worker 版本为
  `25197e62-837e-4649-b510-d3d2a3d11219`。
- `/coffee` 浏览器标题与 H1 已统一为 `Buy Me a Coffee`，四种地址已通过对应网络验证。
- 用户明确决定继续使用当前 Binance 公开充值地址，不迁移独立 Support Wallet；本任务
  仍不得生成、读取、存储或提交私钥、助记词、Keystore、验证码或 API 密钥。
- Cloudflare Builds 尚未连接 GitHub；`http://everettlabs.dev` 当前返回 `200`，未跳转 HTTPS。
- Wrangler 项目目录绑定命名 profile `everettlabs-prod`，目标 Account ID 为
  `4cc48c9e3b9f084844f4485d51899e36`。

## 验收标准

- [x] Coffee 浏览器标题为 `Buy Me a Coffee — Everett Labs`，H1 为 `Buy Me a Coffee`。
- [x] TRON 使用 Base58Check 与主网前缀校验；Base 使用 EVM 地址校验；Bitcoin 使用主网
      地址解析；TON 使用友好地址 CRC、主网标记与 workchain 校验。
- [x] 保持 `USDT · TRON (TRC20)`、`USDC · Base`、`BTC · Bitcoin` 和
      `USDT · The Open Network (TON)` 四个入口，不再扩展其他网络。
- [x] 静态校验、类型检查、无 `GITHUB_TOKEN` 构建与桌面/移动浏览器回归通过。
- [x] 提交和推送只包含本任务文件、相关源码、测试与长期规范。
- [x] 使用 `everettlabs-prod` dry run 后部署，保留部署前 Worker 版本作为回滚点。
- [ ] Cloudflare Builds 的生产分支为 `main`，非生产分支生成预览版本。
- [ ] `http://everettlabs.dev` 返回 `301` 或 `308` 且 `Location` 指向 HTTPS。
- [x] 保留用户确认的 Binance 公开充值地址，不自行迁移钱包或引入其他收款平台。

## TODO

- [x] 在不新增依赖的约束下接入 Base58Check、Bech32/Bech32m 与 TON CRC 校验。
- [x] 修复 Coffee 页面标题与文案，补充地址校验测试。
- [x] 更新 TON 长期规范与主产品规格。
- [x] 提交、推送、等待 GitHub Actions 并部署生产版本。
- [ ] 在已认证 Cloudflare Dashboard 中连接 GitHub Builds、启用 Always Use HTTPS 并复测。
- [x] 将保留 Binance 地址的当前产品决定同步到长期规范与主规格。

## 验证结果

- `[通过]` `npm run validate:static`：11 个测试文件、61 项测试全部通过；新增校验覆盖
  TRON、Bitcoin 与 TON 的错误校验和、Bitcoin 主网 SegWit 地址，以及未验证的 Base
  混合大小写地址。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留 2 条既有上游提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留 GitHub 快照并生成 13 个静态页面。
- `[通过]` `npx playwright test --headed --workers=1`：桌面与 Pixel 5 共 7 项通过、3 项按
  设备范围跳过；覆盖 Coffee 标题、H1、四个地址复制和移动端溢出。
- `[环境说明]` 默认 headless shell 缺失，安装命令在 4 分钟后网络超时；未把首次浏览器
  启动失败记录为代码通过，改用同版本已安装的完整 Chromium 完成上述回归。
- `[通过]` 应用内浏览器在 1280px 视口确认标题、H1、4 张卡片、二维码和地址存在，页面
  `scrollWidth` 为 1265、`innerWidth` 为 1280，无桌面横向溢出。
- `[通过]` `wrangler whoami --json` 与 `wrangler versions list` 确认活动 profile 为
  `everettlabs-prod`、目标账号为 `4cc48c9e3b9f084844f4485d51899e36`；`deploy --dry-run`
  读取 55 个静态资源，部署前版本 `95f28ff4-9c07-4789-832c-4f692f766eca` 保留为回滚点。
- `[通过]` 提交 `1d6aa26` 已推送到 `origin/main`；GitHub Actions `29559206202` 的静态校验、
  类型检查、Playwright 与本地生产 Lighthouse 全部成功。
- `[通过]` 使用 `everettlabs-prod` 部署版本 `25197e62-837e-4649-b510-d3d2a3d11219`；生产
  首页、Linketry、Coffee、robots 与 sitemap 返回 `200`，未知路由返回 `404`，Coffee 的
  标题、H1、4 张卡片和 4 个二维码均从公网验证。
- `[通过]` 生产 Coffee 保持 CSP、HSTS、X-Content-Type-Options、X-Frame-Options 和
  Referrer-Policy；浏览器渲染无桌面横向溢出。
- `[未通过]` `http://everettlabs.dev` 仍返回 `200`，不是要求的 `301` 或 `308`；必须在正确
  Cloudflare Dashboard 会话中启用 Always Use HTTPS 后重新验证。

## 已知阻塞

- Cloudflare Dashboard 当前未登录，Chrome 浏览器控制扩展不可用。首次 GitHub App 授权和
  Zone 设置修改必须在用户完成 Dashboard 登录后继续，不能使用默认错误账号代替。

## 产品决定

- 2026-07-17：用户明确保留当前 Binance 充值地址。独立 Support Wallet 不再属于本轮或
  后续默认优化范围；只有用户再次明确要求时才讨论地址迁移。
