# Coffee 新增 Ko-fi 支持方式（2026-07-24）

## 范围

- 在 `/coffee` 增加 Everett Labs 官方 Ko-fi 入口：`https://ko-fi.com/everettlabs`。
- 保留现有四种加密货币资产与网络组合、公开地址、二维码和校验规则。
- 不接入 Ko-fi 脚本、嵌入式结账、远程图片、Cookie 或新的分析事件。
- 同步产品规格、项目约束和受影响测试。

## 现状

- 生产 `/coffee/` 与本地源码一致，仅渲染 4 张链上收款卡片。
- 生产页面标题为 `Buy Me a Coffee — Everett Labs`，H1 为 `Buy Me a Coffee`。
- `https://ko-fi.com/everettlabs` 可访问，页面标题为 `Buy Everettlabs a Coffee`，canonical 指向同一 URL。
- 旧规格禁止第三方 Coffee 服务，但用户在 2026-07-24 明确作出新增 Ko-fi 的产品决定。

## 验收标准

- [x] Coffee 页面在加密货币列表之前显示独立的 Ko-fi 支持方式。
- [x] Ko-fi 链接固定为 HTTPS 官方页面，并使用 `target="_blank"`、`rel="noopener noreferrer"`。
- [x] 页面文案明确区分 Ko-fi 与直接链上支持，不改变四种资产/网络规则。
- [x] 不加载 Ko-fi 第三方脚本、iframe 或远程图片，不扩大 CSP。
- [x] 桌面端和移动端无横向溢出，交互可键盘访问且触控目标至少 44 × 44px。
- [x] 相关单元、契约、E2E、类型与构建验证通过。

## TODO

- [x] 增加 Ko-fi 配置和页面组件。
- [x] 调整 Coffee 页面结构与元数据。
- [x] 更新主规格与 AGENTS 长期约束。
- [x] 更新单元、契约和浏览器测试。
- [x] 运行验证并记录实际结果。

## 阻塞

- 无。

## 验证结果

- `[通过]` `npm run validate:static`：lint、Prettier、源码行数、9 个项目契约、43 个链接、可访问性、安全、站点契约和 13 个测试文件共 70 项测试全部通过。
- `[通过]` `npm run typecheck`：0 errors，保留项目原有 2 条提示。
- `[通过]` 无 `GITHUB_TOKEN` 的 `npm run build`：保留 GitHub 快照并生成 14 个静态页面，Ko-fi 图片进入构建产物。
- `[通过]` `npm run test:e2e`：桌面和移动 Chromium 共 9 项通过、3 项按设备范围跳过；Ko-fi 链接、图片、四组地址复制与移动端横向溢出检查通过。
- `[通过]` Playwright 1440 × 1000 桌面首屏与 Pixel 5 全页截图：Ko-fi 卡片、分组标题、图片、按钮和四张链上卡片无重叠或裁切。
- `[通过]` 本地生产预览浏览器控制台 0 errors；Ko-fi 图片实际加载尺寸为 672 × 356，外链属性为 `target="_blank"` 与 `rel="noopener noreferrer"`。
