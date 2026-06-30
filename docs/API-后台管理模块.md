# XXshop 商城 API — 后台管理模块

**控制器目录**: `application/admin/controller/`  
**路由前缀**: `/admin`  
**Base URL**: `http://localhost`

---

## 目录

- [管理员 (Admin)](#管理员-admin)
- [商品管理 (Goods)](#商品管理-goods)
- [分类管理 (Category)](#分类管理-category)
- [用户管理 (User)](#用户管理-user)

---

## 管理员 (Admin)

**控制器**: `AdminController`  
**数据表**: `vueshop_admin`（字段：id, username, password, salt, avatar）

---

### 1.1 管理员登录

**接口说明**: 管理员登录验证，返回管理员信息。

- **请求方法**: `POST`
- **路径**: `/admin/admin/login`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| username | Body | string | 是 | - | 管理员用户名 |
| pass | Body | string | 是 | - | 密码（明文，接口内做 md5 加密校验） |

> **注意**: 参数名是 `pass` 而非 `password`（与其他登录接口不一致）。

#### 请求示例

```json
{
    "username": "admin",
    "pass": "123456"
}
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200 成功 / 400 失败 |
| msg | string | 提示信息 |
| data.id | int | 管理员 ID |
| data.username | string | 用户名 |
| data.avatar | string | 头像 URL |

> `password` 和 `salt` 字段在返回中已被 `unset` 移除。

#### 响应示例（成功）

```json
{
    "code": 200,
    "msg": "登录成功",
    "data": {
        "id": 1,
        "username": "admin",
        "avatar": "upload/user/xxx.jpg"
    }
}
```

#### 响应示例（失败）

```json
{
    "code": 400,
    "msg": "管理员不存在",
    "data": []
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 400 | 用户名/密码为空、管理员不存在、密码错误 |

---

### 1.2 管理员列表

**接口说明**: 分页获取管理员列表。

- **请求方法**: `GET`
- **路径**: `/admin/admin/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | Query | int | 否 | 1 | 当前页码 |
| limit | Query | int | 否 | 10 | 每页记录数 |

#### 请求示例

```
GET /admin/admin/list?page=1&limit=10
```

#### 响应参数

分页结构见[总览文档](./API-总览与通用规范.md#42-分页响应结构)，`data.data[]` 中每项字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 管理员 ID |
| username | string | 用户名 |
| avatar | string | 头像 URL |

> `password` 和 `salt` 字段未在代码中显式 `unset`（与详情接口不同），但在分页循环中未处理。实际数据表中这两个字段存在。

> [TODO: 需与开发确认] 管理员列表是否也应隐藏 `password` 和 `salt`。

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total": 2,
        "per_page": 10,
        "current_page": 1,
        "last_page": 1,
        "data": [
            {
                "id": 1,
                "username": "admin",
                "password": "b605e86d02eef8bfd0646f6a704c17c9",
                "salt": "1234",
                "avatar": "upload/user/xxx.jpg"
            }
        ]
    }
}
```

---

### 1.3 管理员详情

**接口说明**: 获取单个管理员详细信息。

- **请求方法**: `GET`
- **路径**: `/admin/admin/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 管理员 ID，替换 URL 中的 `:id` |

#### 请求示例

```
GET /admin/admin/1
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200 成功 / 404 不存在 |
| data.id | int | 管理员 ID |
| data.username | string | 用户名 |
| data.avatar | string | 头像 URL |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "id": 1,
        "username": "admin",
        "avatar": "upload/user/xxx.jpg"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 管理员不存在 |

---

### 1.4 添加管理员

**接口说明**: 新增管理员账号。

- **请求方法**: `POST`
- **路径**: `/admin/admin/add`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| username | Body | string | 是 | - | 用户名 |
| password | Body | string | 是 | - | 明文密码 |
| salt | Body | string | 是 | - | 密码盐 |
| avatar | Body | string | 否 | - | 头像 URL |

#### 请求示例

```json
{
    "username": "newadmin",
    "password": "123456",
    "salt": "randomsalt",
    "avatar": "upload/user/avatar.jpg"
}
```

#### 响应示例

```json
{
    "code": 201,
    "msg": "添加成功",
    "data": {
        "id": 3,
        "username": "newadmin",
        "avatar": "upload/user/avatar.jpg"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 201 | 创建成功 |

---

### 1.5 更新管理员

**接口说明**: 更新管理员信息（含密码重设置）。

- **请求方法**: `POST`
- **路径**: `/admin/admin/update`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Body | int | 是 | 管理员 ID |
| username | Body | string | 否 | 用户名 |
| password | Body | string | 否 | 新密码（若传则重设） |
| salt | Body | string | 否 | 密码盐（若传 password 则必传） |
| avatar | Body | string | 否 | 头像 URL |

#### 请求示例

```json
{
    "id": 1,
    "username": "updated_admin",
    "avatar": "upload/user/new_avatar.jpg"
}
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "更新成功",
    "data": {
        "id": 1,
        "username": "updated_admin",
        "avatar": "upload/user/new_avatar.jpg"
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 管理员不存在 |

---

### 1.6 删除管理员

**接口说明**: 删除指定管理员账号。

> ⚠️ **此接口未在 `route.php` 中注册路由**，但可通过默认 URL 模式访问: `POST /admin/admin/delete`（body 中传 `id`）。

- **请求方法**: `POST`
- **路径**: `/admin/admin/delete`（未注册路由，或 `POST /admin/admin/delete` 默认模式）
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 管理员 ID（方法签名 `delete($id)` 从 URL 参数绑定） |

#### 请求示例

```
POST /admin/admin/delete/id/1
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "删除成功",
    "data": []
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 管理员不存在 |

---

### 1.7 管理员图片上传

**接口说明**: 上传管理员头像等图片。

> ⚠️ **此接口未在 `route.php` 中注册路由**。

- **请求方法**: `POST`
- **路径**: `/admin/admin/upload`
- **鉴权**: 否
- **Content-Type**: `multipart/form-data`

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| file | Body | file | 是 | 图片文件（jpg/jpeg/png/gif/webp，≤5MB） |

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 200 成功 / 400 失败 |
| data.url | string | 可访问的图片路径 |
| msg | string | 提示信息 |

#### 响应示例

```json
{
    "code": 200,
    "data": {
        "url": "upload/user/6a3b6507f2ce6.jpeg"
    },
    "msg": "上传成功"
}
```

---

## 商品管理 (Goods)

**控制器**: `GoodsController`  
**数据表**: `vueshop_goods`（字段：id, category_id, name, price, picture, stock, spec, description, is_hot, is_recomented）

---

### 2.1 商品列表

**接口说明**: 分页获取商品列表，支持按分类、热卖、推荐筛选。

- **请求方法**: `GET`
- **路径**: `/admin/goods/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | Query | int | 否 | 1 | 当前页码 |
| limit | Query | int | 否 | 100000 | 每页记录数（默认值极大） |
| category_id | Query | int | 否 | - | 分类 ID 精确筛选 |
| is_hot | Query | int | 否 | - | 是否热卖：0 或 1 |
| is_recoment | Query | int | 否 | - | 是否推荐：0 或 1 |

> **注意**: 参数名是 `is_recoment`（数据库中字段是 `is_recomented`，前后台拼写不一致）。

#### 请求示例

```
GET /admin/goods/list?page=1&limit=20&category_id=5&is_hot=1
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
| category_name | string | 附加的分类名称（左联查询） |

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total": 8,
        "per_page": 20,
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

**接口说明**: 获取单个商品的详细信息。

- **请求方法**: `GET`
- **路径**: `/admin/goods/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 商品 ID |

#### 请求示例

```
GET /admin/goods/35
```

#### 响应参数（同列表中的商品字段）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 商品 ID |
| category_id | int | 所属分类 ID |
| name | string | 商品名称 |
| price | string | 价格 |
| picture | string | 图片 URL |
| stock | int | 库存 |
| spec | string | 规格 |
| description | string | 简介 |
| is_hot | int | 是否热卖 |
| is_recomented | int | 是否推荐 |

> **注意**: 代码中虽然查询了分类（`$category = Db::name('category')->find(...)`），但未将分类名称赋值到返回结果中（与 `home/Goods/Show` 不同）。[TODO: 需与开发确认] 是否应补上 `category_name`。

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
        "description": "讲述了因父母离异而来到新城市的女孩林语惊...",
        "is_hot": 1,
        "is_recomented": 1
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 商品不存在 |

---

### 2.3 添加商品

**接口说明**: 新增商品。

- **请求方法**: `POST`
- **路径**: `/admin/goods/add`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| category_id | Body | int | 否 | 分类 ID |
| name | Body | string | 否 | 商品名称 |
| price | Body | decimal | 否 | 价格 |
| picture | Body | string | 否 | 图片 URL |
| stock | Body | int | 否 | 库存 |
| spec | Body | string | 否 | 规格 |
| description | Body | string | 否 | 简介 |
| is_hot | Body | int | 否 | 是否热卖 |
| is_recomented | Body | int | 否 | 是否推荐 |

> **注意**: 代码中直接 `input('post.')` 接收所有字段并 `insert`，无校验规则。数据库表各字段均有默认值。

#### 请求示例

```json
{
    "name": "新商品",
    "category_id": 5,
    "price": "99.00",
    "picture": "upload/goods/xxx.png",
    "stock": 20,
    "spec": "标准版",
    "description": "商品描述文字",
    "is_hot": 1,
    "is_recomented": 0
}
```

#### 响应示例

```json
{
    "code": 201,
    "msg": "添加成功",
    "data": {
        "id": 44,
        "category_id": 5,
        "name": "新商品",
        "price": "99.00",
        "picture": "upload/goods/xxx.png",
        "stock": 20,
        "spec": "标准版",
        "description": "商品描述文字",
        "is_hot": 1,
        "is_recomented": 0
    }
}
```

---

### 2.4 更新商品

**接口说明**: 更新商品信息。

- **请求方法**: `POST`
- **路径**: `/admin/goods/update`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Body | int | 是 | 商品 ID |
| 其他字段 | Body | 各类型 | 否 | 同添加接口，需要更新的字段 |

#### 请求示例

```json
{
    "id": 35,
    "name": "白日梦我（修订版）",
    "price": "199.00",
    "stock": 15
}
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "更新成功",
    "data": {
        "id": 35,
        "category_id": 5,
        "name": "白日梦我（修订版）",
        "price": "199.00",
        "picture": "upload/goods/6a39e10db915b.png",
        "stock": 15,
        "spec": "北京出版社",
        "description": "讲述了...",
        "is_hot": 1,
        "is_recomented": 1
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 商品不存在 |

---

### 2.5 删除商品

**接口说明**: 删除指定商品。

- **请求方法**: `POST`
- **路径**: `/admin/goods/delete`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Body | int | 是 | 商品 ID |

#### 请求示例

```json
{
    "id": 44
}
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "删除成功",
    "data": []
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 商品不存在 |

---

### 2.6 商品图片上传

**接口说明**: 上传商品图片。

- **请求方法**: `POST`
- **路径**: `/admin/goods/upload`
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
        "url": "upload/goods/6a39e10db915b.png"
    },
    "msg": "上传成功"
}
```

---

## 分类管理 (Category)

**控制器**: `CategoryController`  
**数据表**: `vueshop_category`（字段：id, name, picture, pid）

---

### 3.1 顶级分类列表

**接口说明**: 获取所有顶级分类（`pid=0`）。

- **请求方法**: `GET`
- **路径**: `/admin/category/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| pid | Query | int | 否 | 0 | 代码中接收了但硬编码为 `pid=0`，传值无效 |

> **注意**: 代码中 `$pid = input('param.pid', 0);` 但查询条件写死为 `where('pid=0')`，所以 `pid` 参数实际上无效。[TODO: 需与开发确认] 是否应为动态筛选。

#### 请求示例

```
GET /admin/category/list
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 分类 ID |
| name | string | 分类名称 |
| picture | string | 分类图片 URL |
| pid | int | 父级分类 ID（顶级为 0） |

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

### 3.2 全部分类（树形结构）

**接口说明**: 获取全部分类的递归树形结构。

> ⚠️ **此接口未在 `route.php` 中注册路由**，但可通过默认 URL 模式访问: `GET /admin/category/tree`。

- **请求方法**: `GET`
- **路径**: `/admin/category/tree`
- **鉴权**: 否

#### 请求示例

```
GET /admin/category/tree
```

#### 响应参数

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 分类 ID |
| name | string | 分类名称 |
| picture | string | 图片 URL |
| pid | int | 父级 ID |
| children | array | 子分类数组（递归结构，同上述字段） |

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
            "pid": 0,
            "children": []
        },
        {
            "id": 11,
            "name": "武侠小说",
            "picture": "upload/category/6a39e0c31d0bf.jpg",
            "pid": 0,
            "children": []
        }
    ]
}
```

---

### 3.3 分类详情

**接口说明**: 获取单个分类信息。

- **请求方法**: `GET`
- **路径**: `/admin/category/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 分类 ID |

#### 请求示例

```
GET /admin/category/5
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "id": 5,
        "name": "校园小说",
        "picture": "upload/category/6a3b4efc4a445.jpg",
        "pid": 0
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 分类不存在 |

---

### 3.4 添加分类

**接口说明**: 新增分类。

- **请求方法**: `POST`
- **路径**: `/admin/category/add`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| name | Body | string | 否 | 分类名称 |
| picture | Body | string | 否 | 分类图片 URL |
| pid | Body | int | 否 | 父级分类 ID（默认为 0） |

#### 请求示例

```json
{
    "name": "科幻小说",
    "picture": "upload/category/sci-fi.jpg",
    "pid": 0
}
```

#### 响应示例

```json
{
    "code": 201,
    "msg": "添加成功",
    "data": {
        "id": 45,
        "name": "科幻小说",
        "picture": "upload/category/sci-fi.jpg",
        "pid": 0
    }
}
```

---

### 3.5 更新分类

**接口说明**: 更新分类信息。

> ⚠️ **方法签名不匹配**: 路由定义为 `POST /admin/category/update`（无 `:id`），但方法签名是 `update($id)`（期望 URL 参数绑定）。同时方法内部使用 `input('put.')` 读取数据，但路由定义的请求方法是 POST。实际可能需要通过 `_method=PUT` 伪装。

- **请求方法**: `POST`（可通过 `_method=PUT` 伪装）
- **路径**: `/admin/category/update`（或 `/admin/category/update/:id` 默认模式）
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 分类 ID（URL 参数绑定） |
| name | Body | string | 否 | 分类名称 |
| picture | Body | string | 否 | 图片 URL |
| pid | Body | int | 否 | 父级分类 ID |

#### 请求示例

```
POST /admin/category/update/id/5
_method=PUT
name=科幻小说（修订版）
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "更新成功",
    "data": {
        "id": 5,
        "name": "科幻小说（修订版）",
        "picture": "upload/category/sci-fi.jpg",
        "pid": 0
    }
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 分类不存在 |

---

### 3.6 删除分类

**接口说明**: 删除分类及其子分类（递归删除）。

> ⚠️ **方法签名不匹配**: 路由定义为 `POST /admin/category/delete`（无 `:id`），但方法签名是 `delete($id)`。

- **请求方法**: `POST`
- **路径**: `/admin/category/delete`（或 `/admin/category/delete/:id` 默认模式）
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 分类 ID |

#### 请求示例

```
POST /admin/category/delete/id/45
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "删除成功",
    "data": []
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 分类不存在 |

> **注意**: 删除会递归删除该分类下所有子分类。

---

### 3.7 分类图片上传

**接口说明**: 上传分类图片。

- **请求方法**: `POST`
- **路径**: `/admin/category/upload`
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
        "url": "upload/category/6a3b4efc4a445.jpg"
    },
    "msg": "上传成功"
}
```

---

## 用户管理 (User)

**控制器**: `UserController`  
**数据表**: `vueshop_user`（字段：id, username, password, salt, avatar）

---

### 4.1 用户列表

**接口说明**: 分页获取用户列表。

- **请求方法**: `GET`
- **路径**: `/admin/user/list`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|------|--------|------|
| page | Query | int | 否 | 1 | 当前页码 |
| limit | Query | int | 否 | 10000 | 每页记录数 |

#### 请求示例

```
GET /admin/user/list?page=1&limit=20
```

#### 响应参数

分页结构，`data.data[]` 中每项字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 用户 ID |
| username | string | 用户名 |
| avatar | string | 头像 URL |

> `password` 和 `salt` 字段已在返回循环中 `unset`。

#### 响应示例

```json
{
    "code": 200,
    "msg": "ok",
    "data": {
        "total": 15,
        "per_page": 20,
        "current_page": 1,
        "last_page": 1,
        "data": [
            {
                "id": 2,
                "username": "demo2",
                "avatar": "upload/user/6a3b584ecb2fe.png"
            }
        ]
    }
}
```

---

### 4.2 用户详情

**接口说明**: 获取单个用户信息。

- **请求方法**: `GET`
- **路径**: `/admin/user/:id`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 用户 ID |

#### 请求示例

```
GET /admin/user/2
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

### 4.3 添加用户

**接口说明**: 后台直接创建用户。

- **请求方法**: `POST`
- **路径**: `/admin/user/add`
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| username | Body | string | 是 | 用户名 |
| password | Body | string | 是 | 明文密码 |
| salt | Body | string | 是 | 密码盐 |
| avatar | Body | string | 否 | 头像 URL |

#### 请求示例

```json
{
    "username": "newuser",
    "password": "123456",
    "salt": "abcdef",
    "avatar": "upload/user/avatar.jpg"
}
```

#### 响应示例

```json
{
    "code": 201,
    "msg": "添加成功",
    "data": {
        "id": 18,
        "username": "newuser",
        "avatar": "upload/user/avatar.jpg"
    }
}
```

---

### 4.4 更新用户

**接口说明**: 更新用户信息。

> ⚠️ **方法签名不匹配**: 路由定义为 `POST /admin/user/update`（无 `:id`），但方法签名是 `update($id)`，且内部使用 `input('put.')` 读取数据。

- **请求方法**: `POST`（可通过 `_method=PUT` 伪装）
- **路径**: `/admin/user/update`（或 `/admin/user/update/:id` 默认模式）
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 用户 ID（URL 参数绑定） |
| password | Body | string | 否 | 新密码 |
| avatar | Body | string | 否 | 头像 URL |
| salt | Body | string | 否 | 新密码盐（若传 password 则需传） |

#### 请求示例

```
POST /admin/user/update/id/2
_method=PUT
password=newpass
salt=newsalt
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "更新成功",
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

### 4.5 删除用户

**接口说明**: 删除用户账号。

> ⚠️ **方法签名不匹配**: 路由定义为 `POST /admin/user/delete`（无 `:id`），但方法签名是 `delete($id)`。

- **请求方法**: `POST`
- **路径**: `/admin/user/delete`（或 `/admin/user/delete/:id` 默认模式）
- **鉴权**: 否

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|--------|------|------|------|------|
| id | Path | int | 是 | 用户 ID |

#### 请求示例

```
POST /admin/user/delete/id/18
```

#### 响应示例

```json
{
    "code": 200,
    "msg": "删除成功",
    "data": []
}
```

#### 业务错误码

| code | 说明 |
|------|------|
| 404 | 用户不存在 |

---

### 4.6 用户图片上传

**接口说明**: 上传用户头像等图片。

- **请求方法**: `POST`
- **路径**: `/admin/user/upload`
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
