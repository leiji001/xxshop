# XXshop 商城 API — 前台模块

**控制器目录**: `application/home/controller/`  
**路由前缀**: `/home`  
**Base URL**: `http://localhost`

---

## 目录

- [首页 (Index)](#首页-index)
- [商品管理 (Goods)](#商品管理-goods)
- [分类管理 (Category)](#分类管理-category)
- [用户管理 (User)](#用户管理-user)

---

## 首页 (Index)

**控制器**: `IndexController`

---

### 1.1 数据库连通性测试

**接口说明**: 测试数据库连接是否正常，返回数据库版本和服务器时间。

- **请求方法**: `GET`
- **路径**: `/home/index`
- **鉴权**: 否

#### 请求参数

无

#### 请求示例

```
GET /home/index
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200 成功 / 500 失败 |
| msg | string | 提示信息 |
| data.db_version | string | MySQL 版本号（仅成功时） |
| data.server_time | string | 服务器当前时间 `Y-m-d H:i:s`（仅成功时） |
| error | string | 异常详细信息（仅失败时，非调试模式可能隐藏） |

> **注意**: 此接口直接 `echo json_encode(...)` + `exit` 输出，不遵循 `BaseController` 的统一响应格式。

#### 响应示例（成功）

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

#### 响应示例（失败）

```json
{
    "code": 500,
    "msg": "数据库连接失败",
    "error": "SQLSTATE[HY000] [1045] Access denied for user..."
}
```

---

## 商品管理 (Goods)

**控制器**: `GoodsController`  
**数据表**: `vueshop_goods`

---

### 2.1 商品列表

**接口说明**: 分页获取商品列表，支持分类筛选、是否推荐/热卖筛选、关键词模糊搜索。

- **请求方法**: `GET`
- **路径**: `/home/goods/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | Query | int | 否 | 1 | 当前页码 |
| limit | Query | int | 否 | 100000 | 每页记录数（默认值极大） |
| category_id | Query | int | 否 | - | 分类 ID 精确筛选 |
| is_hot | Query | int | 否 | - | 是否热卖：0 或 1 |
| is_recomented | Query | int | 否 | - | 是否推荐：0 或 1 |
| keyword | Query | string | 否 | - | 商品名称模糊搜索（LIKE %keyword%） |

> **注意**: 参数名 `is_recomented` 与数据库字段名一致，但与后台商品列表接口的 `is_recoment` 拼写不同。

#### 请求示例

```
GET /home/goods/list?page=1&limit=10&category_id=5&keyword=白日
```

#### 响应参数

分页结构见[总览文档](./API-总览与通用规范.md#42-分页响应结构)，`data.data[]` 中每项字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 商品 ID |
| category_id | int | 所属分类 ID |
| name | string | 商品名称 |
| price | string(十进制) | 商品价格 |
| picture | string | 商品图片 URL |
| stock | int | 库存量 |
| spec | string | 商品规格 |
| description | string | 商品简介 |
| is_hot | int(0/1) | 是否热卖 |
| is_recomented | int(0/1) | 是否推荐 |
| category_name | string | 附加的分类名称（LEFT JOIN `category` 表，若分类不存在则显示"未分类"） |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total": 8,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1,
        "data": [
            {
                "id": 35,
                "category_id": 5,
                "name": "白日梦我",
                "price": "199.00",
                "picture": "upload/goods/6a39e10db915b.png",
                "stock": 10,
                "spec": "北京出版社",
                "description": "讲述了因父母离异而来到新城市的女孩林语惊...",
                "is_hot": 1,
                "is_recomented": 1,
                "category_name": "校园小说"
            }
        ]
    }
}
```

---

### 2.2 商品详情

**接口说明**: 获取单个商品详细信息，包含分类名称。

- **请求方法**: `GET`
- **路径**: `/home/goods/show/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 商品 ID |

#### 请求示例

```
GET /home/goods/show/35
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 商品 ID |
| category_id | int | 分类 ID |
| name | string | 商品名称 |
| price | string | 价格 |
| picture | string | 图片 URL |
| stock | int | 库存 |
| spec | string | 规格 |
| description | string | 简介 |
| is_hot | int | 是否热卖 |
| is_recomented | int | 是否推荐 |
| category_name | string | 分类名称（单独查询后附加，与列表接口不同） |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "id": 35,
        "category_id": 5,
        "name": "白日梦我",
        "price": "199.00",
        "picture": "upload/goods/6a39e10db915b.png",
        "stock": 10,
        "spec": "北京出版社",
        "description": "讲述了...",
        "is_hot": 1,
        "is_recomented": 1,
        "category_name": "校园小说"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 商品不存在 |

---

### 2.3 推荐商品

**接口说明**: 获取推荐商品列表，用于首页展示。

- **请求方法**: `GET`
- **路径**: `/home/goods/recommend`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| limit | Query | int | 否 | 6 | 返回记录数 |

#### 请求示例

```
GET /home/goods/recommend?limit=4
```

#### 响应参数

返回纯数组（非分页结构），每项字段同商品详情。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 商品 ID |
| category_id | int | 分类 ID |
| name | string | 商品名称 |
| price | string | 价格 |
| picture | string | 图片 URL |
| stock | int | 库存 |
| spec | string | 规格 |
| description | string | 简介 |
| is_hot | int | 是否热卖 |
| is_recomented | int(1) | 固定为 1 |

> **注意**: 本接口的条件是 `is_recomented = 1`，按 `id desc` 排序，`limit` 限制条数。返回为普通数组，**不含分页结构**。

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "id": 35,
            "category_id": 5,
            "name": "白日梦我",
            "price": "199.00",
            "picture": "upload/goods/6a39e10db915b.png",
            "stock": 10,
            "spec": "北京出版社",
            "description": "讲述了...",
            "is_hot": 1,
            "is_recomented": 1
        }
    ]
}
```

---

### 2.4 热卖商品

**接口说明**: 获取热卖商品列表，用于首页展示。

- **请求方法**: `GET`
- **路径**: `/home/goods/hot`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| limit | Query | int | 否 | 6 | 返回记录数 |

#### 请求示例

```
GET /home/goods/hot?limit=4
```

#### 响应参数

同推荐商品，条件为 `is_hot = 1`，按 `id desc` 排序，返回纯数组。

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "id": 35,
            "category_id": 5,
            "name": "白日梦我",
            "price": "199.00",
            "picture": "upload/goods/6a39e10db915b.png",
            "stock": 10,
            "spec": "北京出版社",
            "description": "讲述了...",
            "is_hot": 1,
            "is_recomented": 1
        }
    ]
}
```

---

## 分类管理 (Category)

**控制器**: `CategoryController`  
**数据表**: `vueshop_category`

---

### 3.1 顶级分类列表

**接口说明**: 获取所有顶级分类（用于导航栏）。

- **请求方法**: `GET`
- **路径**: `/home/category/top`
- **鉴权**: 否

#### 请求参数

无

#### 请求示例

```
GET /home/category/top
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 分类 ID |
| name | string | 分类名称 |
| picture | string | 图片 URL |
| pid | int | 父级 ID（固定为 0） |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "id": 5,
            "name": "校园小说",
            "picture": "upload/category/6a3b4efc4a445.jpg",
            "pid": 0
        },
        {
            "id": 11,
            "name": "武侠小说",
            "picture": "upload/category/6a39e0c31d0bf.jpg",
            "pid": 0
        }
    ]
}
```

---

### 3.2 子分类列表

**接口说明**: 根据父级分类 ID 获取子分类列表。

- **请求方法**: `GET`
- **路径**: `/home/category/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| pid | Query | int | 否 | 0 | 父级分类 ID |

> **安全风险**: 代码中直接拼接 SQL: `where("pid = '$pid'")`，存在 SQL 注入风险。建议改为参数绑定。

#### 请求示例

```
GET /home/category/list?pid=5
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 分类 ID |
| name | string | 分类名称 |
| picture | string | 图片 URL |
| pid | int | 父级分类 ID |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": [
        {
            "id": 35,
            "name": "校园小说-子分类",
            "picture": "upload/category/xxx.jpg",
            "pid": 5
        }
    ]
}
```

---

## 用户管理 (User)

**控制器**: `UserController`  
**数据表**: `vueshop_user`

---

### 4.1 用户注册

**接口说明**: 用户注册账号。

- **请求方法**: `POST`
- **路径**: `/home/user/reg`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| username | Body | string | 是 | - | 用户名（数据库 UNIQUE） |
| password | Body | string | 是 | - | 密码 |
| re_password | Body | string | 是 | - | 确认密码（需与 password 一致） |
| avatar | Body | string | 否 | "" | 头像 URL |

#### 请求示例

```json
{
    "username": "newuser",
    "password": "123456",
    "re_password": "123456",
    "avatar": "upload/user/avatar.jpg"
}
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 201 成功 / 400 失败 |
| msg | string | 提示信息 |
| data.id | int | 用户 ID |
| data.username | string | 用户名 |
| data.avatar | string | 头像 URL |

#### 响应示例（成功）

```json
{
    "code": 201,
    "msg": "注册成功",
    "data": {
        "id": 18,
        "username": "newuser",
        "avatar": "upload/user/avatar.jpg"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 400 | 用户名/密码为空、两次密码不一致、用户名已存在 |

---

### 4.2 用户登录

**接口说明**: 用户登录验证，返回用户信息（无 token）。

- **请求方法**: `POST`
- **路径**: `/home/user/login`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| username | Body | string | 是 | 用户名 |
| password | Body | string | 是 | 密码（明文） |

#### 请求示例

```json
{
    "username": "demo2",
    "password": "123456"
}
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200 成功 / 400 失败 |
| msg | string | 提示信息 |
| data.id | int | 用户 ID |
| data.username | string | 用户名 |
| data.avatar | string | 头像 URL |

#### 响应示例

```json
{
    "code": 200,
    "msg": "登录成功",
    "data": {
        "id": 2,
        "username": "demo2",
        "avatar": "upload/user/6a3b584ecb2fe.png"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 400 | 用户名/密码为空、用户不存在、密码错误 |

---

### 4.3 用户信息

**接口说明**: 获取指定用户的个人信息。

- **请求方法**: `GET`
- **路径**: `/home/user/info/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 用户 ID |

#### 请求示例

```
GET /home/user/info/2
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "id": 2,
        "username": "demo2",
        "avatar": "upload/user/6a3b584ecb2fe.png"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 用户不存在 |

---

### 4.4 更新用户信息

**接口说明**: 更新用户个人资料（可修改密码、头像等，不能修改用户名和 salt）。

- **请求方法**: `PUT`
- **路径**: `/home/user/update/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 用户 ID |
| password | Body | string | 否 | 新密码（传入则自动加密更新） |
| avatar | Body | string | 否 | 头像 URL |

> 代码中 `unset($data['username'], $data['salt'])` 禁止修改用户名和盐。其他字段（如 avatar、password）可以修改。

#### 请求示例

```
PUT /home/user/update/2
password=newpass456
avatar=upload/user/new_avatar.jpg
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "更新成功",
    "data": {
        "id": 2,
        "username": "demo2",
        "avatar": "upload/user/new_avatar.jpg"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 用户不存在 |

---

### 4.5 用户图片上传

**接口说明**: 上传用户头像等图片。

> ⚠️ **此接口未在 `route.php` 中注册路由**，但可通过默认 URL 模式访问。

- **请求方法**: `POST`
- **路径**: `/home/user/upload`
- **鉴权**: 否
- **Content-Type**: `multipart/form-data`

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| file | Body | file | 是 | 图片文件（jpg/jpeg/png/gif/webp，≤5MB） |

#### 响应示例

```json
{
    "code": 200,
    "data": {
        "url": "upload/user/6a3b584ecb2fe.png"
    },
    "msg": "上传成功"
}
```
