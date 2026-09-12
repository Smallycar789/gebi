# 隔壁 · 合租生活伙伴   https://smallycar789.github.io/gebi/


专为年轻人合租场景设计的线上管理平台，解决费用分摊、清洁排班、公共物品和室友公约等常见问题。

## 功能模块

- **费用 AA 分摊** — 房租、水电、网费录入与自动均摊
- **清洁值日排班** — 公共区域清洁任务轮换与打卡
- **公共物品登记** — 共用消耗品库存与补货提醒
- **室友公约管理** — 合租规则制定与签署确认


## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页仪表盘（入组天数、备忘录、功能入口） |
| `/expenses` | 费用分摊列表 |
| `/expenses/new` | 新增账单 |
| `/expenses/:id` | 账单详情与分摊明细 |
| `/cleaning` | 本周排班表 |
| `/cleaning/checkin` | 值日打卡 |
| `/items` | 物品清单 |
| `/items/:id` | 物品详情与消耗记录 |
| `/agreement` | 公约条款与签署状态 |
| `/room/settings` | 合租房设置 |
| `/profile` | 个人中心 |

## 构建与部署

项目通过 GitHub Actions 自动构建并发布到 GitHub Pages。推送 `main` 分支后会自动部署。

```bash
npm install
npm run build
```

### 首次启用 GitHub Pages

1. 推送代码到 `main` 分支，等待 **Actions** 工作流完成（会自动将 `dist/` 发布到 `gh-pages` 分支）
2. 打开仓库 **Settings → Pages**
3. **Build and deployment → Source** 选择 **Deploy from a branch**
4. **Branch** 选择 `gh-pages`，文件夹选 `/ (root)`，点击 **Save**

> 若页面空白，通常是 Pages 仍指向 `main` 分支的根目录（会加载未编译的 `/src/main.jsx`）。务必切换到 `gh-pages` 分支。
