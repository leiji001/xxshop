# XXshop 商城 API 接口文档 — 总览与通用规范

> **文档版本**: v1.0  
> **生成日期**: 2026-06-30  
> **框架**: ThinkPHP 5.0  
> **数据库**: MySQL (表前缀 `vueshop_`)

---

## 目录

- [一、环境列表与 Base URL](#一环境列表与-base-url)
- [二、统一响应格式](#二统一响应格式)
- [三、全局错误码表](#三全局错误码表)
- [四、分页参数与分页响应约定](#四分页参数与分页响应约定)
- [五、文件上传约定](#五文件上传约定)
- [六、认证方式](#六认证方式)
- [七、路由与 URL 规则](#七路由与-url-规则)
- [八、已知不一致/待确认事项](#八已知不一致待确认事项)
- [九、接口概览表](#九接口概览表)
- [十、模块文档链接](#十模块文档链接)

---

## 一、环境列表与 Base URL

| 环境 | Base URL | 说明 |
|------|----------|------|
| 开发/测试 | `http://localhost`（根据实际部署自行替换） | 项目代码中未区分多环境配置 |

所有接口的完整 URL 格式为：

```
{Base URL}/{模块组}/{控制器}/{方法}
```

例如：`http://localhost/admin/admin/login`

> **注**: 当前数据库配置位于 `application/database.php`，连接 `127.0.0.1`，数据库名 `vueshop`，用户名 `root`，密码 `123456`。部署时请修改。

---

## 二、统一响应格式

所有接口（除 `home/Index/index` 和文件上传类接口有特殊格式外）均使用基类 `BaseController` 提供的两个方法返回 JSON：

### 2.1 成功响应

使用 `jsonSuccess($data, $msg, $code)`：

```json
{
    "code": 200,
    "msg": "ok",
    "data": { ... }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 业务状态码，200 表示成功 |
| msg | string | 提示信息 |
| data | object/array | 业务数据主体 |

### 2.2 错误响应

使用 `jsonError($msg, $code, $data)`：

```json
{
    "code": 400,
    "msg": "错误描述",
    "data": []
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 业务状态码，4xx 表示业务错误 |
| msg | string | 错误描述 |
| data | array | 默认为空数组 |

### 2.3 特殊响应：`/home/index/index`（数据库连通性测试）

```json
{
    "code": 200,
    "msg": "数据库连接成功，接口正常",
    "data": {
        "db_version": "5.7.26",
        "server_time": "2026-06-30 12:00:00"
    }
}
```

> 该接口返回格式略有不同，且直接 `echo` + `exit` 输出，不走 `BaseController` 封装。

### 2.4 特殊响应：图片上传接口

上传接口返回格式适配 `el-upload` 组件的 `on-success` 回调：

```json
{
    "code": 200,
    "data": {
        "url": "upload/goods/xxx.jpg"
    },
    "msg": "上传成功"
}
```

---

## 三、全局错误码表

本项目未定义全局异常处理器（`exception_handle` 为空），也无自定义异常类。所有业务错误通过 `jsonError()` 直接返回，以下是所有接口中出现的状态码：

| code | 含义 | 出现场景 |
|------|------|----------|
| 200 | 成功 | 所有正常响应 |
| 201 | 创建成功 | 添加资源类接口 |
| 400 | 参数错误/业务校验失败 | 缺少必填参数、密码错误、文件验证失败等 |
| 404 | 资源不存在 | 查询详情/更新/删除时目标不存在 |
| 500 | 服务器内部错误 | 数据库连接失败（仅 `/home/index/index`） |

> 注：项目未使用 HTTP 状态码区分业务状态，所有响应 body 中的 `code` 字段才是业务状态码。

---

## 四、分页参数与分页响应约定

### 4.1 请求分页参数

所有列表类接口统一使用以下两个 Query 参数：

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | Query | int | 否 | 1 | 当前页码，从 1 开始 |
| limit | Query | int | 否 | 不定（各接口不同） | 每页记录数 |

### 4.2 分页响应结构

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total": 100,
        "per_page": 10,
        "current_page": 1,
        "last_page": 10,
        "data": [
            { ... 单条记录 ... }
        ]
    }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| data.total | int | 总记录数 |
| data.per_page | int | 每页数量 |
| data.current_page | int | 当前页码 |
| data.last_page | int | 最后一页页码 |
| data.data | array | 当前页数据列表 |

### 4.3 已知分页异常

- `admin/Goods/index()` 的 `limit` 默认值为 **100000**（即几乎不分页），与其他接口行为不一致。
- 各个列表接口的默认 `limit` 值不同（admin/admin/index 默认 10，admin/user/index 默认 10000，admin/goods/index 默认 100000），缺少统一约定。
- 推荐/热卖商品接口 (`home/goods/recommend`, `home/goods/hot`) 使用 `select()` 而非 `paginate()`，返回纯数组而非分页结构。

---

## 五、文件上传约定

多个控制器中存在图片上传接口，遵循以下规则：

| 项 | 内容 |
|----|------|
| 请求方法 | POST |
| 请求类型 | `multipart/form-data` |
| 参数名 | `file` |
| 文件大小上限 | 5 MB (`1024 * 1024 * 5`) |
| 允许格式 | `jpg, jpeg, png, gif, webp` |
| 存储目录 | `public/upload/{模块}/`（goods / category / user） |
| 文件名规则 | `uniqid` 生成唯一文件名 |
| 响应格式 | `{ code: 200, data: { url: "..." }, msg: "上传成功" }` |

---

## 六、认证方式

**当前项目未实现 Token/鉴权机制。**

- 所有接口（后台和前台）均**无中间件鉴权**。
- 后台管理员 `login` 接口仅返回用户信息，不生成 token。
- 前台用户 `login` 接口同样仅返回用户信息，不生成 token。
- 后台各管理接口（列表、添加、修改、删除）**无登录校验**，可直接访问。

> [TODO: 需与开发确认] 如果后续需要增加鉴权，建议在 `admin` 路由组上增加中间件。

---

## 七、路由与 URL 规则

### 7.1 路由模式

- 已开启路由 (`url_route_on => true`)
- **未强制使用路由** (`url_route_must => false`)，因此即使未在 `route.php` 中定义的路由，也可以通过 `模块/控制器/方法/参数值` 的默认 URL 格式访问
- 支持多模块 (`app_multi_module => true`)
- 默认模块为 `home`

### 7.2 路由前缀说明

路由文件使用 `Route::group` 进行了分组：

- **后台组** (`admin`)：所有路径以 `/admin/` 开头，映射到 `application/admin/controller/`
- **前台组** (`home`)：所有路径以 `/home/` 开头，映射到 `application/home/controller/`

### 7.3 路由定义与控制器实际方法签名对照

存在以下**不一致**需要关注：

| 路由定义 | 控制器方法签名 | 问题 |
|----------|---------------|------|
| `POST /admin/category/update` | `update($id)` | 路由无 `:id` 参数，方法却接收 `$id`；方法内使用 `input('put.')` 但路由为 POST |
| `POST /admin/category/delete` | `delete($id)` | 路由无 `:id` 参数，方法却接收 `$id` |
| `POST /admin/user/update` | `update($id)` | 同上 |
| `POST /admin/user/delete` | `delete($id)` | 同上 |
| `POST /admin/admin/update` | `update()` (无参数，从 `$data['id']` 读取) | 正常但与众不同的写法 |
| `admin/admin/delete` | `delete($id)` | **路由未定义**该接口 |
| `admin/admin/upload` | `upload()` | **路由未定义**该接口 |
| `admin/category/tree` | `tree()` | **路由未定义**该接口 |
| `home/user/upload` | `upload()` | **路由未定义**该接口 |

> **建议**: 对于 `update` 和 `delete` 类接口，建议统一为两种模式之一：
> 1. RESTful 风格：`POST /admin/{resource}/update` body 中传 `id`
> 2. 参数绑定：`POST /admin/{resource}/update/:id` 从 URL 获取 `$id`

---

## 八、已知不一致/待确认事项

| # | 不一致说明 | 接口 |
|---|-----------|------|
| 1 | `home/goods/index` 的筛选参数使用 `is_recomented`（拼写错误），`admin/goods/index` 使用 `is_recoment`（另一种拼写），两者指向同一数据库字段 `is_recomented` | 前后台商品列表 |
| 2 | `admin/admin/login` 读取的密码字段名为 `pass`，但其他登录接口用 `password` | 管理员登录 |
| 3 | `admin/Category/index()` 忽略了 `pid` 参数，硬编码 `pid=0` | 分类列表 |
| 4 | 上传接口响应格式与其他接口不同（统一响应是 `{code, msg, data}`，上传接口也是 `{code, data: {url}, msg}`，但实际上传接口直接 `json([...])` 而非 `$this->jsonSuccess()`） | 所有 upload 接口 |
| 5 | `home/Index/index` 使用 `echo`+`exit` 输出而非框架的 response 机制 | 数据库连通测试 |

---

## 九、接口概览表

### 后台管理接口 (`/admin/...`)

| 方法 | 路径 | 所属控制器 | 简述 |
|------|------|-----------|------|
| POST | `/admin/admin/login` | Admin | 管理员登录 |
| GET | `/admin/admin/list` | Admin | 管理员列表（分页） |
| GET | `/admin/admin/:id` | Admin | 管理员详情 |
| POST | `/admin/admin/add` | Admin | 添加管理员 |
| POST | `/admin/admin/update` | Admin | 更新管理员 |
| POST | `/admin/admin/delete` | Admin | 删除管理员 ⚠️ 未注册路由 |
| POST | `/admin/admin/upload` | Admin | 图片上传 ⚠️ 未注册路由 |
| GET | `/admin/goods/list` | Goods | 商品列表（筛选+分页） |
| GET | `/admin/goods/:id` | Goods | 商品详情 |
| POST | `/admin/goods/add` | Goods | 添加商品 |
| POST | `/admin/goods/update` | Goods | 更新商品 |
| POST | `/admin/goods/delete` | Goods | 删除商品 |
| POST | `/admin/goods/upload` | Goods | 图片上传 |
| GET | `/admin/category/list` | Category | 分类列表（顶级） |
| GET | `/admin/category/:id` | Category | 分类详情 |
| POST | `/admin/category/add` | Category | 添加分类 |
| POST | `/admin/category/update` | Category | 更新分类 |
| POST | `/admin/category/delete` | Category | 删除分类 |
| POST | `/admin/category/upload` | Category | 图片上传 |
| GET | `/admin/category/tree` | Category | 全部分类(树形) ⚠️ 未注册路由 |
| GET | `/admin/user/list` | User | 用户列表（分页） |
| GET | `/admin/user/:id` | User | 用户详情 |
| POST | `/admin/user/add` | User | 添加用户 |
| POST | `/admin/user/update` | User | 更新用户 |
| POST | `/admin/user/delete` | User | 删除用户 |
| POST | `/admin/user/upload` | User | 图片上传 |

### 前台接口 (`/home/...`)

| 方法 | 路径 | 所属控制器 | 简述 |
|------|------|-----------|------|
| GET | `/home/index` | Index | 数据库连通性测试 |
| GET | `/home/goods/list` | Goods | 商品列表（筛选+分页+关键词） |
| GET | `/home/goods/show/:id` | Goods | 商品详情 |
| GET | `/home/goods/recommend` | Goods | 推荐商品列表 |
| GET | `/home/goods/hot` | Goods | 热卖商品列表 |
| GET | `/home/category/top` | Category | 顶级分类列表 |
| GET | `/home/category/list` | Category | 子分类列表 |
| POST | `/home/user/reg` | User | 用户注册 |
| POST | `/home/user/login` | User | 用户登录 |
| GET | `/home/user/info/:id` | User | 用户信息 |
| PUT | `/home/user/update/:id` | User | 更新用户信息 |
| POST | `/home/user/upload` | User | 图片上传 ⚠️ 未注册路由 |

---

## 十、模块文档链接

- [后台管理模块接口文档](./API-后台管理模块.md)
- [前台模块接口文档](./API-前台模块.md)
