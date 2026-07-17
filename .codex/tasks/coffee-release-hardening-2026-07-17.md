# Coffee 与发布链路加固（2026-07-17）

## 范围

- 统一 `/coffee` 的页面标题、H1 与站内 `Buy Me a Coffee` 入口文案。
- 将四种公开收款地址从正则格式检查升级为对应网络的真实地址校验。
- 统一 `AGENTS.md`、任务记录与当前页面的 TON 支持范围。
- 完成 Cloudflare Builds 自动发布与 Always Use HTTPS 配置并验证生产行为。
- 明确 Everett Labs Support Wallet 的自托管边界和公开地址迁移流程。

## 当前状态

- `main` 与 `origin/main` 均为 `8bea04e`，生产 Worker 版本为
  `95f28ff4-9c07-4789-832c-4f692f766eca`。
- `/coffee` 当前浏览器标题和 H1 为 `Support Everett Labs`，与站内入口文案不一致。
- 四个地址当前只做正则校验，无法拒绝格式相似但校验和错误的地址。
- 当前公开地址来自 Binance 充值页，属于第三方托管充值地址；本任务不得生成、读取、
  存储或提交私钥、助记词、Keystore、验证码或 API 密钥。
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
- [ ] 提交和推送只包含本任务文件、依赖锁文件、相关源码、测试与长期规范。
- [ ] 使用 `everettlabs-prod` dry run 后部署，保留部署前 Worker 版本作为回滚点。
- [ ] Cloudflare Builds 的生产分支为 `main`，非生产分支生成预览版本。
- [ ] `http://everettlabs.dev` 返回 `301` 或 `308` 且 `Location` 指向 HTTPS。
- [x] Support Wallet 只迁移用户确认的公开地址；任何秘密材料均不得进入本任务上下文或仓库。

## TODO

- [x] 在不新增依赖的约束下接入 Base58Check、Bech32/Bech32m 与 TON CRC 校验。
- [x] 修复 Coffee 页面标题与文案，补充地址校验测试。
- [x] 更新 TON 长期规范与主产品规格。
- [ ] 提交、推送、等待 GitHub Actions 并部署生产版本。
- [ ] 在已认证 Cloudflare Dashboard 中连接 GitHub Builds、启用 Always Use HTTPS 并复测。
- [ ] 用户创建独立自托管钱包后，只替换经小额测试确认的公开地址。

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

## 已知阻塞

- Cloudflare Dashboard 当前未登录，Chrome 浏览器控制扩展不可用。首次 GitHub App 授权和
  Zone 设置修改必须在用户完成 Dashboard 登录后继续，不能使用默认错误账号代替。
- 自托管 Support Wallet 的密钥必须由用户在自己的设备或硬件钱包中生成；Codex 不能代为
  生成或接收密钥，因此公开地址迁移需等待用户提供四个确认后的公开地址。
