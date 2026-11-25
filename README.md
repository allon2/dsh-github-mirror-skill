# @allon2/dsh-github-mirror-skill

DeepSeek Harness 插件:GitHub 镜像加速技能。移植自 Claude Code 社区的 GitHub 加速 skill,改写规则基于 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy)(9k+ star)。

当 GitHub 直连慢或超时时,Agent 会按"探测 → 验证 → 回退"的流程,把 release/archive/raw/gist 下载与 `git clone` 改写到 gh-proxy 兼容镜像(ghfast.top、gh-proxy.com、hub.gitmirror.com、gitclone.com),并校验结果。

## 安装

在 DSH 会话里对插件目录执行 `plugin_manager` 的 `install_bundle`;或在 Web 界面 **插件 → 添加插件** 选择本目录。

## 结构

- `index.js` — skill provider 插件(零依赖)
- `assets/github-mirror-accelerator.md` — 技能正文(改写规则与工作流)
- `cordis.patch.yml` — bundle 补丁,插入 `github-mirror-skill` 插件行

MIT License。
