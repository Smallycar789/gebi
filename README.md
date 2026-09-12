# 合居 · 合租生活管家

专为年轻人合租场景设计的线上管理平台，解决费用分摊、清洁排班、公共物品和室友公约等常见问题。

## 功能模块

- **费用 AA 分摊** — 房租、水电、网费录入与自动均摊
- **清洁值日排班** — 公共区域清洁任务轮换与打卡
- **公共物品登记** — 共用消耗品库存与补货提醒
- **室友公约管理** — 合租规则制定与签署确认

## 在线访问

**GitHub Pages：** https://smallycar789.github.io/gebi/

## 构建与部署

项目通过 GitHub Actions 自动构建并发布到 GitHub Pages。推送 `main` 分支后会自动部署。

手动构建：

```bash
npm install
npm run build
```

构建产物在 `dist/` 目录，可直接用于 GitHub Pages 发布。

### 首次启用 GitHub Pages

1. 打开仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 推送代码到 `main` 分支，等待 Actions 工作流完成
