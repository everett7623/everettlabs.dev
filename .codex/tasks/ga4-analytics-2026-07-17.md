# GA4 基础分析接入（2026-07-17）

## 范围

- 在所有公开页面接入 Google tag `G-905QVGHLT6`。
- 保留现有 Cloudflare Web Analytics，不加入广告、再营销、会话回放或指纹识别。
- 更新 Astro CSP、长期规格与安全契约，避免 `unsafe-inline`、`unsafe-eval` 和广告域名。
- 完成构建、浏览器网络与生产页面验证。

## 当前状态

- Cloudflare Web Analytics 由生产平台自动注入，现有 CSP 仅放行其脚本与上报域名。
- 项目禁止可执行 `is:inline` 脚本，Astro 负责生成哈希 CSP。
- 用户提供的 GA4 Measurement ID 为公开配置 `G-905QVGHLT6`。
- Cloudflare Dashboard 仍未登录，Builds 与 Always Use HTTPS 继续保持阻塞。

## 隐私边界

- Consent Mode v2 默认将 `analytics_storage`、`ad_storage`、`ad_user_data` 和
  `ad_personalization` 设为 `denied`，不提供改为 `granted` 的隐式路径。
- 禁用 Google Signals 与广告个性化信号，不放行 DoubleClick、Google Ads 或广告 frame。
- 不采集支付二维码交互、自定义用户 ID、钱包地址、表单内容或其他敏感事件。

## 验收标准

- [x] 所有页面加载公开 Measurement ID，且初始化命令早于远程 `gtag.js` 加载。
- [x] GA4 通过本地 TypeScript 模块引导，不新增未哈希的手写内联脚本。
- [x] CSP 只新增 GA4 基础测量所需的脚本与连接域名，安全契约拒绝宽泛来源。
- [x] 单元测试覆盖 Measurement ID、四项默认拒绝状态和广告信号禁用。
- [x] 静态校验、类型检查、无 `GITHUB_TOKEN` 构建和桌面/移动浏览器回归通过。
- [ ] 推送后 GitHub Actions 成功，生产域名存在 GA4 引导脚本且无 CSP 控制台错误。

## TODO

- [x] 新增 GA4 引导模块并挂载到全站 Layout。
- [x] 更新 CSP、安全验证、主规格与长期协作约束。
- [x] 增加分析配置契约测试并运行完整验证。
- [ ] 提交、推送、等待 Actions、部署和验证生产行为。
- [ ] Dashboard 登录后继续完成 Cloudflare Builds 与 Always Use HTTPS。

## 已知阻塞

- Cloudflare Dashboard 当前跳转登录页；首次 GitHub Builds 授权和 Zone 设置写入不得使用
  Wrangler OAuth 凭据代替。

## 验证结果

- `[通过]` `npm run validate:static`：12 个测试文件、68 项测试全部通过，包含 7 项 GA4
  配置契约和扩展后的 CSP 安全契约。
- `[通过]` `npm run typecheck`：0 errors、0 warnings，保留 2 条既有上游提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 Playwright 生产预览构建生成 13 个静态页面；GA4 仅在
  `everettlabs.dev` hostname 初始化，本地与 CI 不发送正式统计流量。
- `[通过]` `npx playwright test --headed --workers=1`：桌面与 Pixel 5 共 7 项通过、3 项按
  设备范围跳过，Coffee 地址复制和移动端溢出无回归。
- `[通过]` 构建 HTML 包含 `G-905QVGHLT6`、四项 denied consent、广告信号禁用、生产域名
  限制及 Astro 生成的脚本哈希；CSP 未加入 `unsafe-inline`、`unsafe-eval` 或广告域名。
