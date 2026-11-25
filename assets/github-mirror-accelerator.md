# GitHub 镜像加速

在直连 `github.com` 慢、超时或被墙的网络环境里,通过 gh-proxy 兼容镜像下载 GitHub 资源。
本技能源自社区验证的规则:改写规则基于 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy)(9k+ star),工作流采用"探测 → 验证 → 回退"的自愈模式。

## 工作流

1. **先试直连**:对目标 URL 发一个短超时(约 3 秒)的探测请求;快就直连,不折腾。
2. **直连失败 → 按清单改写 URL 并逐个探测**,选最快返回 200 的镜像。
3. **执行下载/clone**,完成后校验结果(见下)。
4. **汇报**:告诉用户走了哪个镜像;全部失败时给出自行部署 gh-proxy 的提示。

## URL 改写规则(gh-proxy 前缀式)

在原始 GitHub URL 前拼接镜像前缀,即 `<mirror>/<原始URL>`。例如
`https://ghfast.top/https://github.com/cli/cli/releases/download/v2.40.0/gh_2.40.0_windows_amd64.zip`。

| 资源 | 原始 URL 形式 | 备注 |
|---|---|---|
| Release 文件 | `https://github.com/<owner>/<repo>/releases/download/<tag>/<file>` | 最常用 |
| 分支源码包 | `https://github.com/<owner>/<repo>/archive/refs/heads/<branch>.zip` | `.tar.gz` 同理 |
| Tag 源码包 | `https://github.com/<owner>/<repo>/archive/<tag>.tar.gz` | |
| 页面文件 | `https://github.com/<owner>/<repo>/blob/<ref>/<path>` | 镜像自动转 raw |
| raw 文件 | `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` | |
| Gist raw | `https://gist.githubusercontent.com/<user>/<gist-id>/raw/<file>` | |
| git clone | `git clone <mirror>/https://github.com/<owner>/<repo>.git` | 可叠加 `--depth 1` |

私有仓库 clone(谨慎,凭据会经过镜像):
`git clone https://oauth2:<TOKEN>@<mirror>/https://github.com/<owner>/<repo>.git`
——仅当镜像可信且没有其他办法时使用;优先直连或让用户配置代理。

## 默认镜像清单(按序探测)

| 前缀 | 形式 |
|---|---|
| `https://ghfast.top/` | 前缀式 |
| `https://gh-proxy.com/` | 前缀式 |
| `https://hub.gitmirror.com/` | 前缀式 |
| `https://gitclone.com/github.com/` | 仅 clone(路径式):`git clone https://gitclone.com/github.com/<owner>/<repo>.git` |

镜像站经常失效或限流。**全部失败时**:如实报告,并建议用户用 Cloudflare Workers / Docker 自行部署 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy),得到私有镜像后把它的地址当作清单第一项使用。

## 探测与验证

- **探测**:对镜像改写后的 URL 发 `HEAD` 或 `Range: bytes=0-1023` 请求(可用 `web_fetch` 或 shell 的 `curl -I -m 3` / PowerShell `Invoke-WebRequest -Method Head`),3 秒内 2xx 视为可用;多镜像可用时选响应最快者。
- **文件校验**:状态 2xx;响应不是 HTML 错误页(镜像挂掉常返回 HTML);大小与预期相符;zip 以 `PK` 开头、gzip 以 `1f 8b` 开头。
- **clone 校验**:先 `git ls-remote <镜像URL> HEAD` 应列出一个 ref,再 clone;clone 完检查工作区非空。
- **大文件**:优先单文件 raw 而非整包;clone 一律加 `--depth 1`。

## git 持久加速(可选,须经用户同意)

确认后执行(影响该机器全部 git 操作,务必先告知):

```sh
git config --global url."https://ghfast.top/https://github.com/".insteadOf "https://github.com/"
# 恢复:git config --global --unset url."https://ghfast.top/https://github.com/".insteadOf
```

不要主动改写用户的 git 全局配置、shell 代理环境变量或 DSH 设置;镜像改写仅作用于当次命令,除非用户明确要求持久化。
