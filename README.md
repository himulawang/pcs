ParaNoidz Configuration System 
===

### 简介

一款数值配置转换工具，可将数值表按需求组合生成结构化JSON文件。

### 特点

- 纯Javascript，基于浏览器和node.js
- 以非关系型数据库Redis存储关系数据
- 基于ParaNoidz I Framework
- 在线联机编辑器，能实时看到其他编辑者的操作，灵感来源于Google Docs

### 服务端环境

- node.js 0.8.x 及以上
- Redis 2.6.x 及以上

### 客户端环境

- Chrome 26 及以上
- 未做其他浏览器兼容性适配

### 配置

./run.js

```javascript
global.I_ABS_PATH = '/home/ila/project/pcs/server/node_modules/i'; // IFramework Path
global.APP_ABS_PATH = '/home/ila/project/pcs/server'; // Server Path
global.STA_ABS_PATH = '/home/ila/project/pcs/client'; // Client Path
```

./server/config/env.js:

```javascript
    HTTP_PORT: 8081,
    REDIS_HOST: '127.0.0.1',
    REDIS_PORT: 6379,
```

### 安装

下载并执行

```bash
node run.js
```

Chrome中输入

```
http://localhost:8081/
```

### 使用说明

1. 建表

2. 插入数据

3. 定义输出模板

4. 链接表关系

5. 预览输出结果

6. 下载和导出到服务器

7. 备份和恢复

### TODO

1. 在线日志操作记录
2. 选择备份与恢复

### Acknowledgement
- node.js: http://nodejs.org/
- Redis: http://redis.io/
- Chrome: https://www.google.com/intl/en/chrome/browser/
- node.js lib
    - express: https://github.com/visionmedia/express
    - hiredis: https://github.com/redis/hiredis
    - node_redis: https://github.com/mranney/node_redis
    - WebSocket-Node: https://github.com/Worlize/WebSocket-Node
    - ParaNoidz I Framework: Will open source soon...
- bootstrap: https://github.com/twitter/bootstrap
- bootstrap-colorpicker: http://www.eyecon.ro/bootstrap-colorpicker
- jquery: http://jquery.com/
- json-formatter: https://github.com/callumlocke/json-formatter
- jade: https://github.com/visionmedia/jade
