# GitHub 镜像加速

一个内置技能,让 Agent 在受限网络环境下加速 GitHub 下载。

## 它做什么

当 GitHub 的 URL 慢或超时时,Agent 会按"探测 → 验证 → 回退"的自愈流程工作,并采用 gh-proxy 前缀式改写规则(来自 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy),9k+ star):

- Release 文件、分支/Tag 源码包
- Blob 页面(自动转 raw)与 `raw.githubusercontent.com` 文件
- Gist raw 文件
- `git clone`,私有仓库可带 token(附安全提示)

## 默认镜像清单

技能按顺序探测镜像,选用最快返回 2xx 的:

1. `https://ghfast.top/`
2. `https://gh-proxy.com/`
3. `https://hub.gitmirror.com/`
4. `https://gitclone.com/`(仅 clone,路径式)

镜像站是第三方公共服务,经常失效;全部失败时技能会如实报告,并建议自行部署 gh-proxy。除非用户明确要求,技能不会修改全局 git 配置或代理设置。

## 安装与生效

- 安装:会话内执行 `plugin_manager` 的 `install_bundle`,或 Web 界面 **插件 → 添加插件**(可用本仓库地址)。
- 是否需要重启:**需要**。安装后重启 DeepSeek Harness 才会加载本插件;重启后**新开会话**,技能才会出现在技能列表(已开启的会话不加载)。升级插件版本同样需要重启。

## 范围

- 技能名:`github-mirror-accelerator`(模型与用户都可调用)
- 无需配置;零依赖;只携带说明文本
