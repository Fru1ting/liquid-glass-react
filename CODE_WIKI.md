# Liquid Glass React - Code Wiki

## 1. 项目概述

### 1.1 项目简介

**Liquid Glass React** 是一个 React 组件库，用于在 Web 应用中实现 Apple's Liquid Glass（液态玻璃）视觉效果。该库利用 SVG 滤镜、CSS backdrop-filter、WebGL shader 等技术，创建具有折射、模糊、色差等真实玻璃质感的 UI 组件。

### 1.2 项目结构

```
/workspace
├── src/                          # 核心库源代码
│   ├── index.tsx                 # 主组件和辅助组件
│   ├── shader-utils.ts           # Shader 工具类和函数
│   └── utils.ts                  # 位移贴图数据
├── liquid-glass-example/         # 示例项目
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx         # 示例主页面
│   │   │   ├── _app.tsx          # Next.js 应用入口
│   │   │   └── api/
│   │   │       └── hello.ts      # API 路由示例
│   │   └── styles/
│   │       └── globals.css       # 全局样式
│   ├── public/                    # 静态资源
│   ├── next.config.ts            # Next.js 配置
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── assets/                       # 项目资源文件
│   ├── button.png
│   ├── card.png
│   ├── project-liquid.gif
│   └── video.mov
├── package.json                  # 根 package.json
├── tsconfig.json                 # TypeScript 配置
├── esbuild.config.js             # 构建配置
└── README.md                     # 项目文档
```

### 1.3 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | React 18+ |
| 构建工具 | esbuild, Next.js 15 |
| 语言 | TypeScript 5 |
| 样式 | CSS, Tailwind CSS 4 |
| 特效实现 | SVG filters, CSS backdrop-filter, Canvas 2D |

---

## 2. 核心模块架构

### 2.1 模块依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                      LiquidGlass (主组件)                    │
│                     src/index.tsx (L612)                    │
├─────────────────────────────────────────────────────────────┤
│  依赖关系:                                                    │
│  ├── GlassContainer (forwardRef 组件)                        │
│  │   └── GlassFilter (SVG 滤镜组件)                          │
│  │       └── getMap() → 位移贴图选择器                        │
│  │           ├── displacementMap (utils.ts)                 │
│  │           ├── polarDisplacementMap (utils.ts)            │
│  │           └── prominentDisplacementMap (utils.ts)         │
│  │       └── generateShaderDisplacementMap()                 │
│  │           └── ShaderDisplacementGenerator (shader-utils.ts)│
│  │               └── fragmentShaders.liquidGlass              │
│  └── 鼠标追踪逻辑                                             │
│      ├── handleMouseMove()                                   │
│      ├── calculateDirectionalScale()                        │
│      ├── calculateFadeInFactor()                             │
│      └── calculateElasticTranslation()                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心模块说明

#### 模块 1: LiquidGlass 主组件 (`src/index.tsx`)

**文件路径**: `/workspace/src/index.tsx`  
**代码行数**: 612 行  
**导出**: 默认导出 `LiquidGlass` 组件

**主要职责**:
- 作为库的公共 API 入口
- 处理鼠标追踪和状态管理
- 计算玻璃组件的弹性变形效果
- 协调子组件的渲染

**关键 Props**:
```typescript
interface LiquidGlassProps {
  children: React.ReactNode              // 玻璃容器内的内容
  displacementScale?: number             // 位移强度 (默认: 70)
  blurAmount?: number                    // 模糊程度 (默认: 0.0625)
  saturation?: number                    // 饱和度 (默认: 140)
  aberrationIntensity?: number           // 色差强度 (默认: 2)
  elasticity?: number                    // 弹性系数 (默认: 0.15)
  cornerRadius?: number                  // 圆角半径 (默认: 999)
  globalMousePos?: { x: number; y: number }  // 全局鼠标位置
  mouseOffset?: { x: number; y: number }      // 鼠标偏移量
  mouseContainer?: React.RefObject<HTMLElement | null>  // 鼠标追踪容器
  className?: string
  padding?: string
  style?: React.CSSProperties
  overLight?: boolean                    // 是否覆盖亮色背景
  mode?: "standard" | "polar" | "prominent" | "shader"  // 折射模式
  onClick?: () => void
}
```

---

#### 模块 2: GlassContainer 组件 (`src/index.tsx:131-247`)

**类型**: React.forwardRef 组件  
**职责**: 渲染玻璃容器的底层结构

**关键实现**:
- 组合 GlassFilter 和内容层
- 应用 backdrop-filter 模糊效果
- 管理 hover/active 状态

**样式特性**:
- `backdropFilter: blur(${blurAmount}px) saturate(${saturation}%)`
- 动态阴影: `overLight ? "0px 16px 70px rgba(0, 0, 0, 0.75)" : "0px 12px 40px rgba(0, 0, 0, 0.25)"`

---

#### 模块 3: GlassFilter 组件 (`src/index.tsx:35-128`)

**类型**: SVG 滤镜组件  
**职责**: 生成 SVG displacement 滤镜实现折射效果

**核心 SVG 滤镜链**:
```
SourceGraphic → feImage (位移图)
    ↓
feDisplacementMap (R/G/B 通道分离)
    ↓
feColorMatrix (通道提取)
    ↓
feBlend (通道混合 - screen 模式)
    ↓
feGaussianBlur (边缘模糊)
    ↓
feComposite (边缘遮罩 + 中心合成)
```

**Chromatic Aberration 实现**:
- Red 通道: `scale * 1`
- Green 通道: `scale * (1 - aberrationIntensity * 0.05)`
- Blue 通道: `scale * (1 - aberrationIntensity * 0.1)`
- 混合模式: `screen` (屏幕混合)

---

#### 模块 4: ShaderDisplacementGenerator (`src/shader-utils.ts`)

**文件路径**: `/workspace/src/shader-utils.ts`  
**代码行数**: 134 行  
**类型**: 类 (Class)

**类签名**:
```typescript
export class ShaderDisplacementGenerator {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasDPI = 1
  
  constructor(private options: ShaderOptions)
  updateShader(mousePosition?: Vec2): string
  destroy(): void
  getScale(): number
}
```

**核心方法详解**:

##### `updateShader(mousePosition?: Vec2): string`

**功能**: 生成基于 shader 的位移贴图

**算法流程**:
1. 遍历 canvas 每个像素
2. 对每个 UV 坐标调用 fragment shader
3. 计算位移向量 (dx, dy)
4. 应用边缘平滑处理
5. 将位移值编码到 RGBA 通道
6. 返回 Base64 编码的 data URL

**关键实现** (第 66-125 行):
```typescript
// 计算位移值
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const uv: Vec2 = { x: x / w, y: y / h }
    const pos = this.options.fragment(uv, mousePosition)
    const dx = pos.x * w - x
    const dy = pos.y * h - y
    rawValues.push(dx, dy)
  }
}

// 边缘平滑处理
const edgeDistance = Math.min(x, y, w - x - 1, h - y - 1)
const edgeFactor = Math.min(1, edgeDistance / 2)
const smoothedDx = dx * edgeFactor
const smoothedDy = dy * edgeFactor
```

---

#### 模块 5: Fragment Shaders (`src/shader-utils.ts:35-44`)

**对象**: `fragmentShaders`  
**类型**: 命名空间/对象字面量

```typescript
export const fragmentShaders = {
  liquidGlass: (uv: Vec2): Vec2 => {
    // uv: 归一化的坐标 (0-1)
    const ix = uv.x - 0.5
    const iy = uv.y - 0.5
    
    // 计算到边缘的距离 (使用有符号距离函数)
    const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6)
    
    // smoothStep 缓动函数计算位移强度
    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15)
    const scaled = smoothStep(0, 1, displacement)
    
    // 返回变换后的坐标
    return texture(ix * scaled + 0.5, iy * scaled + 0.5)
  }
}
```

**辅助函数**:

| 函数 | 签名 | 功能 |
|------|------|------|
| `smoothStep` | `(a: number, b: number, t: number) => number` | Hermite 插值平滑 |
| `length` | `(x: number, y: number) => number` | 向量长度计算 |
| `roundedRectSDF` | `(x, y, w, h, r) => number` | 圆角矩形有符号距离函数 |
| `texture` | `(x: number, y: number) => Vec2` | 创建 Vec2 向量 |

---

#### 模块 6: 位移贴图 (`src/utils.ts`)

**文件路径**: `/workspace/src/utils.ts`  
**导出内容**: 三个预定义的 Base64 位移贴图

| 导出名 | 类型 | 尺寸 | 用途 |
|--------|------|------|------|
| `displacementMap` | `string` (JPEG Base64) | ~300x300 | 标准折射效果 |
| `polarDisplacementMap` | `string` (JPEG Base64) | ~300x300 | 极坐标折射模式 |
| `prominentDisplacementMap` | `string` (PNG Base64) | ~200x200 | 突出边缘效果 |

**选择逻辑** (`src/index.tsx:19-32`):
```typescript
const getMap = (mode: "standard" | "polar" | "prominent" | "shader", shaderMapUrl?: string) => {
  switch (mode) {
    case "standard": return displacementMap
    case "polar": return polarDisplacementMap
    case "prominent": return prominentDisplacementMap
    case "shader": return shaderMapUrl || displacementMap
    default: throw new Error(`Invalid mode: ${mode}`)
  }
}
```

---

## 3. 关键算法详解

### 3.1 鼠标追踪与弹性效果

#### 方向性缩放 (`calculateDirectionalScale`)

**位置**: `src/index.tsx:342-391`  
**功能**: 根据鼠标位置计算玻璃容器的方向性缩放

**算法原理**:
```
1. 计算鼠标到元素中心的向量 (deltaX, deltaY)
2. 计算鼠标到边缘的距离 (不是到中心的距离)
3. 定义激活区域 (200px)
4. 计算渐入因子 (fadeInFactor)
5. 根据方向计算 X/Y 轴缩放比例:
   - 沿鼠标移动方向拉伸
   - 垂直方向轻微压缩
   - 缩放范围: [0.8, 1.0 + elasticity * 0.3]
```

**伪代码**:
```typescript
// 计算边缘距离
const edgeDistanceX = max(0, abs(deltaX) - pillWidth / 2)
const edgeDistanceY = max(0, abs(deltaY) - pillHeight / 2)
const edgeDistance = sqrt(edgeDistanceX² + edgeDistanceY²)

// 激活区域判断
if (edgeDistance > 200) return "scale(1)"

// 渐入因子
const fadeInFactor = 1 - edgeDistance / 200

// 计算缩放
const stretchIntensity = min(distance / 300, 1) * elasticity * fadeInFactor
const scaleX = 1 + abs(normalizedX) * stretchIntensity * 0.3 - abs(normalizedY) * stretchIntensity * 0.15
const scaleY = 1 + abs(normalizedY) * stretchIntensity * 0.3 - abs(normalizedX) * stretchIntensity * 0.15
```

---

#### 弹性位移 (`calculateElasticTranslation`)

**位置**: `src/index.tsx:414-428`  
**功能**: 计算玻璃容器向鼠标方向的弹性位移

**公式**:
```typescript
return {
  x: (globalMousePos.x - pillCenterX) * elasticity * 0.1 * fadeInFactor,
  y: (globalMousePos.y - pillCenterY) * elasticity * 0.1 * fadeInFactor
}
```

---

### 3.2 Chromatic Aberration 实现

**位置**: `src/index.tsx:71-105`  
**原理**: 将图像分解为 RGB 通道，分别应用不同程度的位移

**SVG 实现**:
```xml
<!-- Red 通道 - 最大位移 -->
<feDisplacementMap in="SourceGraphic" in2="DISPLACEMENT_MAP" 
  scale={displacementScale * -1} 
  xChannelSelector="R" yChannelSelector="B" 
  result="RED_DISPLACED"/>

<!-- Green 通道 - 中等位移 -->
<feDisplacementMap in="SourceGraphic" in2="DISPLACEMENT_MAP" 
  scale={displacementScale * (-1 - aberrationIntensity * 0.05)} 
  xChannelSelector="R" yChannelSelector="B" 
  result="GREEN_DISPLACED"/>

<!-- Blue 通道 - 最小位移 -->
<feDisplacementMap in="SourceGraphic" in2="DISPLACEMENT_MAP" 
  scale={displacementScale * (-1 - aberrationIntensity * 0.1)} 
  xChannelSelector="R" yChannelSelector="B" 
  result="BLUE_DISPLACED"/>

<!-- 屏幕混合 -->
<feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen"/>
```

---

### 3.3 有符号距离函数 (SDF)

**位置**: `src/shader-utils.ts:24-28`  
**功能**: 计算点到圆角矩形边缘的距离

```typescript
function roundedRectSDF(x: number, y: number, width: number, height: number, radius: number): number {
  const qx = Math.abs(x) - width + radius
  const qy = Math.abs(y) - height + radius
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius
}
```

**几何解释**:
- `qx`, `qy`: 调整后的坐标 (考虑圆角)
- `Math.min(Math.max(...), 0)`: 取内部距离 (负值表示内部)
- `length(...)`: 圆角区域的最短距离
- 最终值: 负数 = 内部, 0 = 边缘, 正数 = 外部

---

## 4. 视觉效果参数系统

### 4.1 视觉效果参数表

| 参数 | 默认值 | 范围 | 视觉效果 |
|------|--------|------|----------|
| `displacementScale` | 70 | 0-200 | 边缘折射扭曲强度 |
| `blurAmount` | 0.0625 | 0-1 | 背景模糊程度 |
| `saturation` | 140 | 100-300 | 背景饱和度 (%) |
| `aberrationIntensity` | 2 | 0-20 | RGB 通道分离程度 |
| `elasticity` | 0.15 | 0-1 | 液态弹性响应强度 |
| `cornerRadius` | 999 | 0-100 | 圆角半径 (px) |
| `overLight` | false | boolean | 深色遮罩 (用于亮色背景) |

### 4.2 折射模式 (mode)

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `standard` | 标准折射，使用预生成的 JPEG 位移图 | 一般用途 |
| `polar` | 极坐标折射，圆形扩散效果 | 圆形/胶囊形组件 |
| `prominent` | 突出边缘，更强的边缘扭曲 | 高对比度背景 |
| `shader` | 程序化生成，最精确但不稳定 | 实验性/追求极致效果 |

---

## 5. 示例项目架构

### 5.1 Next.js 应用结构

**文件**: `liquid-glass-example/src/pages/index.tsx`

**组件结构**:
```
Home (主组件)
├── 状态管理
│   ├── User Info Card 状态
│   │   ├── displacementScale, blurAmount, saturation
│   │   ├── aberrationIntensity, elasticity, cornerRadius
│   │   └── userInfoMode, userInfoOverLight
│   └── Log Out Button 状态
│       └── 对应上述参数的 logout 前缀版本
│
├── 左侧面板 (Glass Effect Demo)
│   ├── containerRef (鼠标追踪容器)
│   ├── 背景图片层 (picsum.photos)
│   ├── 明亮内容区域 (bright-section)
│   ├── LiquidGlass (User Info Card) - conditional
│   └── LiquidGlass (Log Out Button) - conditional
│
└── 右侧面板 (Control Panel)
    ├── Tab Switcher (切换示例)
    ├── 动态控件渲染
    │   ├── Radio Group (mode)
    │   └── Range Sliders (各参数)
    └── GitHub 链接
```

### 5.2 样式系统

**文件**: `liquid-glass-example/src/styles/globals.css`

**关键样式**:
- Tailwind CSS v4 基础导入
- 自定义 range slider 样式 (webkit/moz)
- 渐变轨道: `linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))`
- 滑块样式: 渐变背景 + 光晕效果

---

## 6. 依赖关系

### 6.1 核心库依赖 (`package.json`)

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "esbuild": "^0.19.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### 6.2 示例项目依赖 (`liquid-glass-example/package.json`)

```json
{
  "dependencies": {
    "liquid-glass-react": "^1.0.2",
    "lucide-react": "^0.514.0",
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 6.3 外部资源依赖

| 资源 | URL | 用途 |
|------|-----|------|
| Google Fonts (Geist) | next/font/google | 示例字体 |
| Picsum Photos | picsum.photos | 示例背景图片 |
| Lucide Icons | lucide-react | 示例图标 |

---

## 7. 构建与发布

### 7.1 构建脚本 (`package.json`)

```json
{
  "scripts": {
    "build": "npm run clean && npm run build:esm && npm run build:cjs && npm run build:types",
    "build:esm": "esbuild src/index.tsx --bundle --format=esm --outfile=dist/index.esm.js --external:react --external:react-dom",
    "build:cjs": "esbuild src/index.tsx --bundle --format=cjs --outfile=dist/index.js --external:react --external:react-dom",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rm -rf dist",
    "dev": "npm run build:esm -- --watch",
    "prepublishOnly": "npm run build"
  }
}
```

### 7.2 输出格式

| 文件 | 格式 | 模块系统 |
|------|------|----------|
| `dist/index.js` | CJS | CommonJS |
| `dist/index.esm.js` | ESM | ECMAScript Modules |
| `dist/index.d.ts` | TypeScript Definitions | 类型声明 |

### 7.3 esbuild 配置 (`esbuild.config.js`)

**入口点**: `src/index.ts`  
**目标环境**: ES2020, Browser  
**外部依赖**: `react`, `react-dom`  
**压缩**: 生产环境启用

---

## 8. 运行方式

### 8.1 安装依赖

```bash
# 安装核心库依赖
npm install

# 安装示例项目依赖
cd liquid-glass-example
npm install
```

### 8.2 构建库

```bash
# 开发模式 (watch)
npm run dev

# 生产构建
npm run build
```

### 8.3 运行示例

```bash
cd liquid-glass-example
npm run dev
# 访问 http://localhost:3000
```

### 8.4 可用命令汇总

| 命令 | 位置 | 功能 |
|------|------|------|
| `npm run build` | 根目录 | 构建核心库 (ESM + CJS + Types) |
| `npm run dev` | 根目录 | 开发模式 (ESM watch) |
| `npm run dev` | liquid-glass-example/ | 启动 Next.js 开发服务器 |
| `npm run build` | liquid-glass-example/ | 构建 Next.js 生产版本 |
| `npm run start` | liquid-glass-example/ | 启动 Next.js 生产服务器 |
| `npm run lint` | liquid-glass-example/ | 运行 Next.js lint |

---

## 9. 浏览器兼容性

### 9.1 支持情况

| 特性 | Chrome/Edge | Safari | Firefox |
|------|-------------|--------|---------|
| CSS backdrop-filter | ✅ | ✅ | ✅ |
| SVG feDisplacementMap | ✅ | ✅ | ✅ |
| Chromatic Aberration | ✅ | ⚠️ 部分 | ⚠️ 部分 |
| Shader Mode | ✅ | ⚠️ 性能问题 | ❌ |

### 9.2 已知限制

- **Safari/Firefox**: 位移效果 (displacement) 不完全支持，仅显示模糊效果
- **Shader Mode**: 实验性功能，最精确但可能不稳定
- **性能**: 复杂的位移计算可能影响低端设备性能

---

## 10. 类型定义

### 10.1 核心类型

```typescript
// src/shader-utils.ts
export interface Vec2 {
  x: number
  y: number
}

export interface ShaderOptions {
  width: number
  height: number
  fragment: (uv: Vec2, mouse?: Vec2) => Vec2
  mousePosition?: Vec2
}

// src/index.tsx
type RefractionMode = "standard" | "polar" | "prominent" | "shader"

interface LiquidGlassProps {
  children: React.ReactNode
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  globalMousePos?: { x: number; y: number }
  mouseOffset?: { x: number; y: number }
  mouseContainer?: React.RefObject<HTMLElement | null> | null
  className?: string
  padding?: string
  style?: React.CSSProperties
  overLight?: boolean
  mode?: RefractionMode
  onClick?: () => void
}
```

---

## 11. 最佳实践

### 11.1 使用建议

1. **性能优化**:
   - 避免在大量元素上使用 (建议 < 10 个)
   - 使用 `mouseContainer` 集中追踪鼠标
   - 非交互元素可设置 `elasticity: 0`

2. **视觉效果**:
   - 背景复杂度越高，效果越明显
   - 暗色背景使用默认配置
   - 亮色背景启用 `overLight: true`

3. **响应式设计**:
   - 圆角在移动端可能需要调整
   - `displacementScale` 在小屏幕上可适当降低

### 11.2 示例代码

**基础用法**:
```tsx
import LiquidGlass from 'liquid-glass-react'

function App() {
  return (
    <LiquidGlass>
      <div className="p-6">
        <h2>Your content here</h2>
      </div>
    </LiquidGlass>
  )
}
```

**按钮样式**:
```tsx
<LiquidGlass
  displacementScale={64}
  blurAmount={0.1}
  saturation={130}
  aberrationIntensity={2}
  elasticity={0.35}
  cornerRadius={100}
  padding="8px 16px"
  onClick={() => console.log('Clicked!')}
>
  <span className="text-white font-medium">Click Me</span>
</LiquidGlass>
```

**鼠标容器模式**:
```tsx
function ContainerExample() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef}>
      <LiquidGlass
        mouseContainer={containerRef}
        elasticity={0.3}
        style={{ position: 'fixed', top: '50%', left: '50%' }}
      >
        <div>Content</div>
      </LiquidGlass>
    </div>
  )
}
```

---

## 12. 变更日志

| 版本 | 主要变更 |
|------|----------|
| 1.1.1 | 当前版本 |
| 1.0.2 | 示例项目依赖版本 |
| 1.0.0 | 初始发布 |

---

*文档生成时间: 2026-05-31*  
*项目仓库: https://github.com/rdev/liquid-glass-react*
