# 纤讯和新材料 · 多语言外贸官网

面向东南亚 + 俄罗斯市场的 B2B 官网，含 6 语言前台和后台管理系统。

**线上地址：https://nbxxh.com**（已部署至香港服务器，Docker + Nginx + HTTPS）

## 本地启动

```bash
cd website
node server.js
```

打开 http://localhost:3000 即可（默认跳转英文版）。

- 前台：http://localhost:3000/en （可换 /zh /ru /vi /th /id）
- 后台：http://localhost:3000/admin
- 初始账号：**admin / admin**（登录后请立即在"修改密码"里改掉）

## 线上部署（103.12.149.76）

- 代码目录：`/opt/xxh-web/`，Docker 容器 `xxh-web`（node:22-slim，监听 127.0.0.1:3000，`--restart always`）
- 数据持久化：`/opt/xxh-web/data.db` + `/opt/xxh-web/public/uploads`（volume 挂载，重建容器不丢数据）
- Nginx：宝塔 vhost `html_www.nbxxh.com.conf` 已配置反代（**勿在宝塔面板修改该站点设置，会覆盖手改的反代配置**）
- Nginx 重载：`bash /opt/xxh-web/reload-nginx.sh`（systemctl reload 在该服务器无效）
- HTTPS：acme.sh 自动续期（Let's Encrypt 双域名 nbxxh.com + www.nbxxh.com）
- 更新代码：本地打包（排除 node_modules）→ 上传解压到 /opt/xxh-web → `docker build -t xxh-web .` → `docker rm -f xxh-web` → 重新 `docker run`（沿用原 volume 参数）
- 注意：必须用 `node:22-slim` 镜像，**不能用 alpine**（node:sqlite 在 musl 上无法写入）

## 技术栈

| 组件 | 方案 | 说明 |
|---|---|---|
| 运行时 | Node.js 22+ | 使用内置 `node:sqlite`，无需安装数据库 |
| 数据库 | SQLite | 单文件 `data.db`，零配置零维护 |
| 后端 | Express | 静态页面 + REST API |
| 模板 | EJS | 前台服务端渲染（SEO 友好），后台为单页应用 |

## 六种语言

英语（默认）/ 中文 / 俄语 / 越南语 / 泰语 / 印尼语

- 界面文案：`i18n.js`
- 产品内容：数据库多语言字段，**英文字段为必填**，其他语言留空时自动回退英文
- 语言切换：右上角地球图标，任意页面一键切换

## 后台功能

- **仪表盘**：询盘 / 产品 / 分类 / 新闻统计
- **询盘管理**：前台表单提交的询盘，可标记已处理、删除
- **产品管理**：新增/编辑/删除产品，支持 6 语言字段、技术参数表、图片上传（自动存储到 uploads/）
- **分类管理**：19 个产品分类的品牌、描述、应用领域
- **新闻管理**：中英文新闻发布
- **网站设置**：公司名、WhatsApp、电话、邮箱、地址——修改后全站即时生效
- **修改密码**

## 目录结构

```
website/
├── server.js          # Express 服务器 + API
├── db.js              # SQLite 初始化 + 种子数据
├── i18n.js            # 6 语言翻译包
├── data.db            # 数据库（首次运行自动生成）
├── views/             # EJS 模板（前台页面）
├── public/
│   ├── admin.html     # 后台管理（单页应用）
│   ├── css/style.css
│   ├── js/main.js     # 询盘表单提交
│   ├── uploads/       # 产品图片（后台上传自动存这里）
│   └── assets/warehouse.mp4   # 仓库实拍视频
└── package.json
```

## 部署建议

上线时任意支持 Node 22 的服务器均可（云主机 / 宝塔 / Docker）。数据备份只需拷贝 `data.db` 和 `public/uploads/` 两个位置。

## 待办（上线前建议）

- [ ] 换上真实企业邮箱（当前 sales@xianxunhe.com 为占位，后台"网站设置"里改）
- [ ] 确认 WhatsApp 号码（当前用的是 152-2116-8218，即上海华骄水印上的号码）
- [ ] 后台逐个录入完整产品库（目前预置了 10 个代表性产品）
- [ ] 英文公司名确认：暂用 Ningbo Xianxunhe New Materials Co., Ltd.（拼音方案），如需品牌化英文名（如 PolyLink 之类）可在后台设置里直接改
- [ ] 绑定域名 + HTTPS
