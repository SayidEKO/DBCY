# 项目简介
    东本储运项目是基于React、Antd Mobile、redux、axios

## 一、目录结构

```js
├── config-overrides // webpack
├── README.md
├── package.json
├── yarn.lock
├── public
│   ├──  favicon.ico
│   ├──  flexlibe.js // 适配
│   ├──  index.html
│   ├──  manifest.json // 应用的显示名称、图标
│   └──  robots.txt // 爬虫
└── src
    ├── app.js
    ├── index.js
    ├── reportWebVitals.js // 性能
    ├── api
    │   └── api.js // 请求api总文件
    ├── assets
    │   ├── imgs
    │   │   └── cart_empty.png // 为空图片
    │   └── upload
    │       └── avatar.png // 用户头像
    ├── components
    │   └── privateRoute.js // 私有路由
    ├── data
    ├── layout
    │   └── layout.js // 底部导航栏
    ├── store
    │   ├── reducers
    │   │   ├── userReducer.js // 存储用户数据的reducer
    │   │   └── reducer.js // 总reducer
    │   └── store.js
    ├── style // 样式
    │   ├── index.css
    │   └── index.less
    ├── utils // 工具
    └── views
        ├── errorPage.js // 404页面
        ├── home.js // 首页
        ├── category.js // 分类
        └── my.js // 我的页面
```

## 二、快速安装

### 1、clone到本地

### 2、打开终端，`cd react-mobile-app`,切换到项目根目录，在项目根目录运行以下命令

`npm install`，安装所需的依赖

### 3、然后运行`npm start`开启项目

项目默认运行在`http://localhost:8888/`，可自行修改端口

> Windows 上使用 `npm run start-win`