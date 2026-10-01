## 项目简介

《纪元战争》是一款回合制卡牌战棋游戏。玩家在 5×7 的棋盘上放置单位、使用法术，通过移动、攻击、技能配合来摧毁敌方大本营。游戏内置了可学习的 AI 系统，支持 AI 自动对弈、并行训练、策略权重进化，并提供三个具有特殊机制的 BOSS 挑战关卡。同时通过 WebSocket 支持双人联机对战。

---

## 功能特性

- **回合制战棋**：放置阶段 + 战斗阶段，行动点数、抽卡费用、手牌上限等完整规则。
- **多阵营单位**：人族、暗影族、兽灵魔族，每个单位拥有独特技能。
- **法术卡牌**：医疗包、护盾卡、抽卡牌、重置卡、寒冰新星等。
- **AI 对战**：可切换任意玩家为 AI，AI 会评估攻击、移动、技能、法术并做出决策。
- **AI 学习系统**：根据胜负调整策略权重，数据保存在 `localStorage`，支持导入/导出/重置。
- **自动对弈**：双方 AI 自动进行多局对战，最多 100 局。
- **并行训练**：多游戏实例同时运行，进化策略权重。
- **BOSS 挑战**：暗影议会、冰霜女王、钢铁教父，每个 BOSS 拥有独特机制。
- **剧情/预览模式**：角色选择、事件卡（战斗/宝箱/岔路口/商店）、经验升级系统。
- **多人联机**：基于 WebSocket 的房间制联机，支持游戏状态同步和聊天。
- **工具提示**：卡牌、单位、大本营悬停显示详细信息。

---

## 技术栈

| 层级       | 技术                                  |
| ---------- | ------------------------------------- |
| 前端       | 原生 HTML5 / CSS3 / JavaScript (ES6+) |
| 联机       | WebSocket (`ws` 库)                   |
| 服务端     | Node.js                               |
| 静态服务   | `http-server`（或 IIS Express）       |
| 数据持久化 | `localStorage`（AI 学习数据）         |

---

## 目录结构

```
纪元战争网页版/
├── game.html                  # 主游戏页面（包含大量内联 JS 逻辑）
├── css/
│   └── base.css               # 全部样式
├── js/
│   ├── constants/
│   │   ├── units.js           # 单位/法术/BOSS/敌人库定义
│   │   ├── player.js          # 全局游戏状态 gameState
│   │   └── multiplayer.js     # WebSocket 联机逻辑
│   └── display/
│       └── ui-manager.js      # UI 管理器
├── card_game_server/
│   ├── server.js              # Node.js WebSocket 服务器
│   ├── package.json
│   └── package-lock.json
├── 命令.txt                    # 启动命令备忘
├── .vs/                       # Visual Studio / IIS 配置
├── applicationhost.config     # IIS Express 配置
├── launch.json                # VS Code 调试配置
├── ProjectSettings.json
├── VSWorkspaceState.json
├── DocumentLayout.json
├── DocumentLayout.backup.json
└── README.md
```

> 注意：`game.html` 内联了绝大多数游戏逻辑，后续可考虑拆分为多个模块。

---

## 快速开始

### 环境要求

- Node.js（建议 16 及以上）
- 现代浏览器（Chrome / Edge / Firefox）
- 可选：`http-server`（全局安装）

### 1. 启动 WebSocket 服务器

```bash
cd card_game_server
npm install
node server.js
```

服务器默认监听 `3000` 端口，控制台输出：`服务器已启动，监听端口 3000`。

### 2. 启动静态文件服务器

在项目根目录执行：

```bash
npm install -g http-server
http-server -p 8080
```

### 3. 访问游戏

- 单机体验：`http://localhost:8080/game.html`
- 玩家 1：`http://localhost:8080/game.html?player=1&room=testroom`
- 玩家 2：`http://localhost:8080/game.html?player=2&room=testroom`

局域网联机时，将 `localhost` 换成运行静态服务器的机器 IP，例如：
`http://192.168.1.7:8080/game.html?player=1&room=testroom`

---

## 配置说明

### WebSocket 服务器地址

前端默认连接地址位于 `js/constants/multiplayer.js`：

```js
const wsUrl = `ws://10.12.17.233:3000?room=${roomId}&player=${playerId}`;
```

请将 `10.12.17.233` 修改为实际运行 `server.js` 的机器 IP。本地测试可改为：

```js
const wsUrl = `ws://localhost:3000?room=${roomId}&player=${playerId}`;
```

### URL 参数

| 参数     | 说明                              | 示例       |
| -------- | --------------------------------- | ---------- |
| `room`   | 房间 ID，同一房间的玩家会同步状态 | `testroom` |
| `player` | 玩家编号，`1` 或 `2`              | `1`        |

### 端口

| 服务      | 默认端口 |
| --------- | -------- |
| WebSocket | `3000`   |
| 静态文件  | `8080`   |

### IIS Express（可选）

`applicationhost.config` 中配置了站点，但包含硬编码绝对路径：
`C:\Users\22626\Desktop\游戏设计\纪元战争网页版`
换机器后需要修改，或直接使用 `http-server` 替代。

---

## 游戏玩法

### 棋盘与目标

- 棋盘为 **5 行 × 7 列**。
- 双方大本营位于第 3 行第 1 列（玩家 1）和第 3 行第 7 列（玩家 2）。
- 将对方大本营生命值降至 0 即可获胜。

### 回合流程

1. **放置阶段**：消耗行动点数从手牌放置单位或使用法术。
2. **战斗阶段**：选择单位进行移动、攻击或使用技能。
3. **结束回合**：切换到对方回合，恢复行动点数、重置单位行动状态。

### 资源

- **行动点数（AP）**：每回合恢复，用于放置、抽卡、技能等。
- **金币**：胜利后获得，用于商店购买等（剧情模式）。
- **手牌上限**：7 张，超出需弃牌。

### 单位与技能

| 阵营     | 单位     | 技能                                                    |
| -------- | -------- | ------------------------------------------------------- |
| 人族     | 盾兵     | 防御：停止行动一回合后减免每次攻击 2 点伤害             |
| 人族     | 弓箭手   | 精准射击：1/6 概率造成双倍伤害                          |
| 人族     | 刀兵     | 溅射：对目标周围敌方单位造成 1 点额外伤害               |
| 暗影族   | 暗影刺客 | 刺杀：移动后可攻击；敏捷：可向后移动                    |
| 暗影族   | 暗影法师 | 暗影移动：与 3 格内队友交换位置                         |
| 暗影族   | 暗影领主 | 侵蚀：击杀单位后叛变为己方满血单位，需献祭一名己方单位  |
| 兽灵魔族 | 狂暴狼   | 野性冲锋：目标前方无单位时击退并造成 1 点额外伤害       |
| 兽灵魔族 | 牛头战士 | 笨重：仅能向前移动；野性祝福：增加周围 1 格内单位攻击力 |
| 兽灵魔族 | 冰霜龙   | 冰霜：消耗 1 点充能冰冻目标 1 回合                      |

### 法术卡

| 法术     | 费用 | 效果                                    |
| -------- | ---- | --------------------------------------- |
| 医疗包   | 1    | 恢复己方单位 3 点生命（不可恢复大本营） |
| 护盾卡   | 2    | 给己方单位添加 1 点护盾（不可给大本营） |
| 抽卡牌   | 2    | 抽取 3 张卡牌                           |
| 重置卡   | 1    | 将己方单位移回手牌并重置状态            |
| 寒冰新星 | 3    | 冻结所有敌方单位 2 回合（冰霜女王专属） |

---

## AI 系统

### 策略权重

AI 使用以下权重评估决策（初始均为 1.0，范围 0.1 ~ 3.0）：

- `attackPriority`：攻击优先级
- `moveTowardsEnemy`：向敌方移动
- `protectLowHealth`：保护低血量单位
- `aggressivePlacement`：激进放置
- `defensivePlacement`：防守放置
- `spellUsage`：法术使用
- `skillUsage`：技能使用
- `rageSkill`：狂暴技能
- `shadowMoveSkill`：暗影移动
- `erosionSkill`：侵蚀技能

### 学习机制

- 每局结束后，根据胜负和决策效果调整权重。
- 数据保存在 `localStorage` 的 `aiLearningData` 键中。
- 支持通过界面按钮 **导出 / 导入 / 重置 / 查看统计**。

### 自动对弈与并行训练

- **自动对弈**：点击“AI 自动对弈”，双方 AI 自动进行多局，最多 100 局。
- **并行训练**：设置并行游戏数（1~10），多个游戏实例同时运行，每完成一定局数后进化策略。

---

## BOSS 机制

| BOSS     | 描述        | 特殊机制                                                     |
| -------- | ----------- | ------------------------------------------------------------ |
| 暗影议会 | 刺客型 BOSS | 每回合自动召唤 1 个低级暗影（不消耗 AP）；卡组仅暗影族；每回合仅恢复 1 AP；大本营血量 5 |
| 冰霜女王 | 控制型 BOSS | 冰冻领域：敌方单位移动后 30% 概率被冰冻；专属卡“寒冰新星”；每回合恢复 3 AP |
| 钢铁教父 | 增益型 BOSS | 只招募人族；齐心协力：每回合开始 1 格内每个人族单位提供 1 点攻击力；每回合恢复 3 AP；基地被毁后生成“反攻巨像” |

> 反攻巨像：基地被毁后生成，攻击力极高，会自动向玩家基地方向移动并攻击。

---

## 剧情/预览模式

- **主菜单**：开始游戏 / 继续游戏 / 体验内容。
- **角色选择**：3 个占位角色，各自拥有不同初始卡组。
- **战斗预览界面**：
  - 左侧显示卡牌详情、角色立绘、生命/AP/金币/经验条。
  - 右侧显示事件卡（最多 3 张）。
  - 事件类型：战斗、宝箱、岔路口、商店。
- **经验与升级**：
  - 升级所需经验：Lv1→2 需 2，Lv2→3 需 4，Lv3→4 需 7，Lv4→5 需 12，Lv5→6 需 21，Lv6 为 MAX。
  - 最大生命值随等级提升：3 / 3 / 4 / 6 / 8 / 11。

---

## 开发与扩展

### 添加新单位

在 `js/constants/units.js` 的 `unitDefinitions` 中添加：

```js
newUnit: {
    name: "新单位",
    type: "human", // human / shadow / beast
    health: 5,
    attackRange: 1,
    damage: 2,
    cost: 2,
    skills: ["技能描述"],
    desc: "单位描述",
    img: "图片地址"
}
```

同时将卡牌 key 加入 `cardPool`。

### 添加新法术

在 `spellDefinitions` 中添加，并在 `applySpellEffect` / `aiApplySpellEffect` 中实现效果。

### 添加新 BOSS

1. 在 `game.html` 末尾的 `BOSSES` 数组中添加配置。
2. 在 `initDecks()` 中根据 `type` 设置专属卡组。
3. 在 `endTurn()`、`moveUnit()`、`attack()` 等位置添加特殊机制判定。

### 修改 AI 权重

在 `loadAILearningData()` 的默认数据中调整初始值，或通过界面导出后手动修改再导入。

---

## 已知问题与待办

- [ ] `game.html` 内联 JS 过多，建议拆分为模块。
- [ ] `applicationhost.config` 包含硬编码绝对路径，换机需修改。
- [ ] `multiplayer.js` 中 WebSocket 地址硬编码为 `10.12.17.233`，建议改为动态获取或配置项。
- [ ] 大量使用 `alert()`，会阻塞 UI，建议改为页面内提示。
- [ ] `showWinner` 被重写覆盖，可读性较差。
- [ ] `showDiscardModal` 中 `card.appendChild(cost)` 变量名错误（应为 `cardElement`）。
- [ ] 联机状态同步为全量 `gameState` 覆盖，未做差量同步。
- [ ] 缺少单元测试和构建流程。
- [ ] 剧情模式角色与事件内容为占位数据。

---

## 许可证

本项目为个人学习/原型项目，未指定开源许可证。如需使用请自行确认相关素材（图片占位符等）的授权。

---

## 参考命令（命令.txt）

```bash
# 大型服务器（管理员权限）
cd card_game_server
npm install
node server.js

# 静态服务器
npm install -g http-server
http-server -p 8080

# 访问
http://localhost:8080/game.html?player=1&room=testroom
http://localhost:8080/game.html?player=2&room=testroom
```