# @allon2/dsh-github-mirror-skill

DeepSeek Harness 插件:GitHub 镜像加速技能。移植自 Claude Code 社区的 GitHub 加速 skill,改写规则基于 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy)(9k+ star)。

当 GitHub 直连慢或超时时,Agent 会按"探测 → 验证 → 回退"的流程,把 release/archive/raw/gist 下载与 `git clone` 改写到 gh-proxy 兼容镜像(ghfast.top、gh-proxy.com、hub.gitmirror.com、gitclone.com),并校验结果。

## 安装

在 DSH 会话里对插件目录执行 `plugin_manager` 的 `install_bundle`;或在 Web 界面 **插件 → 添加插件** 选择本目录,也可以直接使用本仓库地址。

**是否需要重启:需要。** 安装完成后重启 DeepSeek Harness 才会加载本插件(首次安装会返回 `restart-required`);重启后**新开会话**,`github-mirror-accelerator` 才会出现在技能列表,已开启的会话不会加载。升级或更换插件版本同理,同样需要重启才能加载新模块。

## 结构

- `index.js` — skill provider 插件(零依赖)
- `assets/github-mirror-accelerator.md` — 技能正文(改写规则与工作流)
- `cordis.patch.yml` — bundle 补丁,插入 `github-mirror-skill` 插件行

MIT License。
