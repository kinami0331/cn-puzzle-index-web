# 中国谜题索引

从给定格式的 csv 数据生成纯静态的谜题索引站。

## 如何贡献？

为了方便非程序员群体协作，目前谜题索引数据使用飞书文档维护，由脚本自动从飞书文档抓取信息并更新数据。因此**不接受**直接更改数据的 Pull Request。

- 如果您有一些较小的改动建议，例如勘误、细化关键词、调整分类等，可以直接开一个新 issue 讨论。
- 如果您有很多的谜题数据希望能加入索引，请联系维护者，直接在共享文档中更新。
- 如果您希望做一些功能上或者 UI 上的改动，直接提 Pull Request 即可，但是建议先联系维护者简单讨论一下。


## 开发

### 网站开发与构建

安装依赖：

```bash
pnpm install
```

运行开发服务器：

```bash
pnpm run dev
```

构建静态网站：

```bash
pnpm run build
```

### 数据更新

更新脚本在 `scripts/update_data_from_feishu.py`，需要安装 `requests` 和 `python-dotenv` 依赖。但是您一般不会需要自行运行此脚本。

更新数据：`python ./scripts/update_data_from_feishu.py`。