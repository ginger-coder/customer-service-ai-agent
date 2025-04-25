# Customer Service AI Agent

这是一个由用户上传 doc 文件至 Pinecone 向量数据库，然后结合 OpenAI 的 API 服务聊天服务的项目。该项目提供了以下接口：

## 接口说明

### 上传接口
- **路径**: `/documents/upload`
- **方法**: `POST`
- **描述**: 上传 doc 文件至 Pinecone 向理数据。

### 聊天接口
- **路径**: `/chat`
- **方法**: `POST`
- **描述**: 提供聊天服务，结合 OpenAI 的 API。

### 手动上传向量接口
- **路径**: `/knowledge/add`
- **方法**: `POST`
- **描述**: 手动上传向量数据至 Pinecone。

### 云向量数据库
- **地址**: https://app.pinecone.io/
- **OPENAI_KEY**: https://platform.openai.com/settings/organization/api-keys


## 使用说明

### 环境要求
- **包管理工具**: `pnpm`
- **Node.js 版本**: `20+`

### 安装依赖
```bash
pnpm install
```

### 启动项目
```bash
pnpm start:dev
```

## 贡献
欢迎提交问题和贡献代码！