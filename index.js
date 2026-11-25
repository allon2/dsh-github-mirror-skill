/**
 * GitHub 镜像加速 skill provider。
 *
 * 在 ctx.skills 上注册一个可被模型与用户调用的技能:
 * 当 GitHub 直连慢或超时,按 gh-proxy 兼容规则改写 URL 并探测可用镜像。
 * 零依赖:不 import @deepseek-ai/dsh-skill,rank 常量(600)按其当前定义内联。
 *
 * @module @allon2/dsh-github-mirror-skill
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'github-mirror'
const SKILL_BODY_URL = new URL('./assets/github-mirror-accelerator.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('./assets/', import.meta.url)),
}
const INVOCATION = { modelInvocable: true, userInvocable: true }
const DESCRIPTION =
  'Accelerate GitHub downloads and clones through gh-proxy-compatible mirrors ' +
  '(ghfast.top, gh-proxy.com, hub.gitmirror.com, gitclone.com) when github.com is ' +
  'slow or times out. Use when GitHub release/archive/raw/gist 文件下载慢、git clone 超时,' +
  '或用户要求 GitHub 镜像加速、换源、加速下载。'

const CANDIDATE = {
  name: 'github-mirror-accelerator',
  description: DESCRIPTION,
  whenToUse:
    'Whenever a GitHub URL (github.com, raw.githubusercontent.com, gist.githubusercontent.com) ' +
    'is slow, times out, or a clone/download stalls — before retrying direct access.',
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'custom',
  resourceBase: RESOURCE_BASE,
  // 与 @deepseek-ai/dsh-skill 导出的 BUNDLED_SKILL_RANK 一致。
  rank: 600,
  locator: SKILL_BODY_URL,
}

const provider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate) {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      whenToUse: CANDIDATE.whenToUse,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis 插件名。 */
export const name = 'github-mirror-skill'
/** 依赖的 Service:技能注册表。 */
export const inject = ['skills']

/** 在 ctx.skills 上注册 GitHub 镜像加速 provider。 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
