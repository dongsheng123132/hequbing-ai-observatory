/**
 * 站点首页渲染。
 *
 * 首页只做三件事：告诉访客这个站在干什么、有哪些榜、以及为什么这些数字可以信。
 * 不堆砌装饰 —— 榜单本身是内容，首页是目录。
 */
import { STYLE } from './render.js';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * @param {object} p
 * @param {Array<{title:string, href:string, category?:string, sampleCount:number,
 *   entityCount:number, engines:string[], regions:string[], isSynthetic:boolean,
 *   leaders:string[]}>} p.boards
 */
export function renderSiteIndex({ siteName, brand, tagline, boards, generatedAt, methodologyVersion, cadence, basePath }) {
  const anySynthetic = boards.some((b) => b.isSynthetic);
  const cards = boards
    .map(
      (b) => `<a class="board" href="${esc(b.href)}">
  <h3>${esc(b.title)}${b.issue ? ` · ${esc(b.issue)}` : ''}</h3>
  <p>${b.status === 'planned' ? '待采样，尚未发布名次' : b.status === 'collecting' ? '首期采样中，尚未发布名次' : b.leaders.length ? `AI 提及最多：${esc(b.leaders.join('、'))}` : '暂无数据'}</p>
  <div class="meta">
    ${['planned', 'collecting'].includes(b.status) ? '查看调查范围、固定题库与自查方式' : `<b>${b.sampleCount}</b> 条样本 · <b>${b.entityCount}</b> 个候选 · ${b.engines.length} 个 AI 通道`}
    ${b.isSynthetic ? ' · <span style="color:#b8860b">演示数据</span>' : ''}
  </div>
</a>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
${basePath ? `<base href="${esc(basePath)}">` : ''}
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(siteName)} — ${esc(tagline)}</title>
<meta name="description" content="贺去病行业 AI 品牌认知调查：菲律宾专线物流、电源线工厂的同题观察、公开方法与企业 GEO 自查。">
<style>${STYLE}</style>
</head>
<body>
<header>
  <div class="wrap">
    <p class="brand">${esc(brand)}</p>
    <p><a href="https://www.hequbing.com/observe/">开放企业资料与贡献入口 →</a></p>
    <h1>${esc(siteName)}</h1>
    <p class="sub">${esc(tagline)}</p>
    ${cadence ? `<p>${esc(cadence)}</p>` : ''}
  </div>
</header>

<div class="wrap">
${
  anySynthetic
    ? `<div class="warn"><b>本站当前包含演示数据。</b>带"演示数据"标记的榜单由程序合成的模拟回答生成，
用于验证统计口径与页面形态，<b>不是真实测评结果，禁止对外引用</b>。</div>`
    : ''
}
  <div class="notice">
    <b>本榜不卖名次。</b>所有排名由公开方法论的实测回答生成：原始回答全量存档，评分公式公开，
    任何人拿到同样数据都能复算出同样名次。两个实体的置信区间重叠时，我们只报并列，不宣称优劣。
  </div>

  <div class="card">
    <h2>榜单</h2>
    <div class="boards">
${cards}
    </div>
  </div>

  <div class="card" id="self-check">
    <h2>我的公司有没有被 AI 提到？</h2>
    <p>先用独立新会话回答本行业固定题库，保存实际回答；再提供公司名称与官网，核对同题同行差异，避免先介绍公司影响自然提及。</p>
    <p><a href="https://github.com/dongsheng123132/hequbing-ai-observatory/releases/latest">下载「贺去病 · GEO 品牌认知自查」Skill</a>，或<a href="https://github.com/dongsheng123132/hequbing-ai-observatory/blob/main/skills/hequbing-industry-survey/SKILL.md">查看使用方法</a>。一次自查只代表实际测试的渠道，不改变已冻结的公开榜单。</p>
    <p><a href="https://www.hequbing.com/about.html?source=recognition-index#contact">带着公司与问题申请诊断 →</a></p>
  </div>

  <div class="card">
    <h2>这些数字为什么可以信</h2>
    <ul class="kv">
      <li><b>排序依据是成对击败率，不是绝对分。</b>成对比较在同一条回答内部完成，
        提供相同回答条件下的比较；题库选择与模型偏好仍会影响结果。</li>
      <li><b>不确定的地方就说不知道。</b>名次带 95% 置信区间；区间重叠时只报并列区间，
        不硬排名次。样本不足时明确标注"不得对外发布"。</li>
      <li><b>小样本会被打折。</b>3 次采样全都提到，也只能报 55.6% 的可见度下界，而不是 100%。</li>
      <li><b>结果可复算。</b>每个榜单都标注方法论版本与指纹；权重、空值策略、显著性水平任一变动，
        指纹即变，历史榜单不会与新榜单混为一谈。</li>
      <li><b>原始回答可回溯。</b>每条结论都对应一条未经修改的 AI 回答及其采样参数
        （通道、模型版本、地域、时间戳）。</li>
      <li><b>换一种问法带来的差异，我们单独统计。</b>同一个意图下用多种措辞提问，
        把"换个说法答案就变"的不确定性算进稳定性指标，而不是藏起来。</li>
    </ul>
  </div>

  <div class="card">
    <h2>我们不做什么</h2>
    <ul class="kv">
      <li>不售卖名次、不售卖上榜、不售卖置顶，也不接受任何形式的"合作费换入选"。</li>
      <li>不提供排名保证。诊断与修复服务只做信息补齐与口径统一，名次由 AI 依据公开信息自行决定。</li>
      <li>不对机构作主观评价。页面上出现的每一条判断，都限定为"AI 在某个问题上如此回答"。</li>
    </ul>
  </div>

  <footer>
    生成日期 ${esc(generatedAt)}｜${esc(siteName)}｜方法论版本 ${esc(methodologyVersion)}
  </footer>
</div>
</body>
</html>`;
}

/** 只公布调查计划；不读取样本或计算名次。 */
export function renderPendingBoard({ title, brand, siteName, issue, reason, market, cadence, prompts, candidateReview, status }) {
  const statusText = status === 'planned' ? '待采样，尚未发布名次' : '首期采样中，尚未发布名次';
  const candidateCard = candidateReview ? `<div class="card"><h2>候选核对清单 · ${candidateReview.entities.length} 家</h2>
<p>${esc(candidateReview.scope)}</p><p>${esc(candidateReview.evidenceBoundary)}</p>
<ul>${candidateReview.entities.map(e => `<li><p><b>${esc(e.name)}</b>${e.affiliation === '发起人关联企业' ? ' · 发起人关联企业' : ''}</p>
<p>${e.sources.filter(s => /^https?:\/\//i.test(s.url)).map(s => `<a href="${esc(s.url)}" rel="noopener noreferrer">官网来源</a>：${esc(s.supports)}`).join('；')}</p>
<small>待核对：${esc(e.pending.join('；'))}</small></li>`).join('')}</ul>
<p>核对日期：${esc(candidateReview.updatedAt)}。以上为研究候选，列出顺序不表示名次。</p></div>` : '';
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · ${esc(issue)} — ${esc(brand)}</title>
<meta name="description" content="${esc(title)}的调查范围与固定题库。${statusText}；支持企业 AI 认知自查与资料纠错。">
<style>${STYLE}</style></head><body>
<header><div class="wrap"><p class="brand">${esc(brand)} · ${esc(siteName)}</p>
<h1>${esc(title)}</h1><p>${esc(issue)} · ${esc(market)}</p>
<p><a href="../index.html">← 全部榜单</a> · <a href="../methodology.html">方法论</a></p></div></header>
<main class="wrap"><div class="notice"><b>${statusText}。</b><p>${esc(reason)}</p>
<p>${esc(cadence)}</p><p>此页公布调查范围与题库，不是已经完成的行业排名。候选范围及正式样本数待核验。</p></div>
${candidateCard}
<div class="card"><h2>本期固定问题</h2><ol>${prompts.map(p => `<li><p>${esc(p.text)}</p><small>${p.purpose === 'ranking' ? '观察候选企业提及' : '观察采购方法，不进入提及率分母'}</small></li>`).join('')}</ol></div>
<div class="card"><h2>先查自己的公司</h2><p>请你的 AI 对固定问题收集独立真实回答，记录模型、时间与联网状态；再提供公司名称和官网，核对提及与同业差异。</p>
<p>资料不足时保留未知。自选问题的结果不自动并入公开榜。需要人工核验或代跑时，可带着资料申请诊断。</p>
<p><a href="https://www.hequbing.com/about.html?source=${encodeURIComponent(issue + '-' + title)}#contact">申请企业诊断 →</a> · <a href="https://www.hequbing.com/observe/">补充企业资料 →</a></p></div>
<footer>观察 AI 回答不等于评定产品或服务质量；收费与赞助不决定名次。</footer></main></body></html>`;
}

/**
 * 方法论页。
 * "方法论公开"是这套榜单能不能立住的前提 —— 所以它必须是一页真实存在的公开文档，
 * 而不是一句口号。
 */
export function renderMethodologyPage({ siteName, brand, generatedAt, methodologyVersion, fingerprint, weights, alpha, minN }) {
  const w = Object.entries(weights ?? {})
    .map(([k, v]) => `<li><code>${esc(k)}</code> ${(v * 100).toFixed(0)}%</li>`)
    .join('\n');
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>方法论 — ${esc(siteName)}</title>
<style>${STYLE}</style>
</head>
<body>
<header>
  <div class="wrap">
    <p class="brand">${esc(brand)}</p>
    <h1>评分方法论</h1>
    <p class="sub">公开计算口径；完整复算还需要对应原始回答、实体表与参数，摘要数据不能替代它们。</p>
    <p class="nav"><a href="index.html">← 全部榜单</a></p>
  </div>
</header>

<div class="wrap">
  <div class="card">
    <h2>一、排序依据：成对击败率</h2>
    <p>榜单名次<b>不是</b>由综合分排出来的，而是由成对击败率排出来的：</p>
    <ul class="kv">
      <li><code>A 对 B 的击败率 = 100 × (A 被提及而 B 未被提及的回答数) ÷ (至少一方被提及的回答数)</code></li>
      <li>分母为 0（双方都没出现）时记 <code>null</code>，不记 0。</li>
      <li>某实体的名次依据是它对其余每一个实体的击败率的平均值。</li>
    </ul>
    <p class="note">为什么不用绝对分：成对比较在<b>同一条回答内部</b>完成配对，
    让两家企业面对相同回答条件；题库、模型和时间窗的选择仍会影响结论，不能据此宣称消除了系统性偏差。</p>
  </div>

  <div class="card">
    <h2>二、综合分（ARS）只用于展示</h2>
    <p>综合分按下列权重加权合成，仅用于展示与趋势追踪，<b>不参与名次判定</b>：</p>
    <ul class="kv">${w}</ul>
    <p class="note">权重是先验设定、公开、可被榜单配置覆盖，但<b>不做数据拟合</b>。
    拟合出来的权重会被合理质疑成"为某个品牌调参"。</p>
  </div>

  <div class="card">
    <h2>三、不确定性怎么处理</h2>
    <ul class="kv">
      <li><b>置信区间：</b>对回答做有放回重采样（Bootstrap），得到击败率的 95% 置信区间。</li>
      <li><b>并列带：</b>置信区间重叠的名次合并报告为区间（如"第 5–8 名"），不得宣称彼此优劣。</li>
      <li><b>小样本惩罚（CAV）：</b>衡量"被提及的比例"时使用 Jeffreys 后验下界，
        样本越小报得越低。3 次采样全都提到，下界也只有 55.6%，而不是 100%。</li>
      <li><b>改写轴：</b>同一意图下用多种措辞提问，稳定性按意图分组统计，
        把"换个说法答案就变"的不确定性算进去。</li>
      <li><b>显著性水平 α = ${esc(alpha)}，最小可发布样本量 N = ${esc(minN)}。</b>
        样本量不足时，页面会明确标注"不得对外发布"。</li>
    </ul>
  </div>

  <div class="card">
    <h2>四、空值与失败的处理</h2>
    <ul class="kv">
      <li><b>未被提及记 0</b>——确实零次提及，不是数据缺失。</li>
      <li><b>采样失败的回答被剔除出分母</b>，绝不算作品牌缺席。
      把"请求失败"和"AI 没提到"混为一谈会直接毁掉排名。</li>
      <li><b>分母为 0 记 null</b>，不记 0：没测过不等于表现差。</li>
      <li><b>未被提及时情感分记 0</b>，不能把"中性"映射成 0.5 白送分。</li>
      <li><b>免责声明段落里的品牌名被剔除</b>，那不是推荐。</li>
    </ul>
  </div>

  <div class="card">
    <h2>五、为什么只统计"要求推荐"类问题</h2>
    <p>实测发现一个必须处理的现象：<b>AI 在"哪家好 / 哪个好"这类问题上会给出机构名单，
    而在"怎么办 / 有没有必要 / 找哪家"这类问题上，常常一条机构名都不给</b>
    （实测 25 条回答里 18 条零提及，且零提及全部集中在后者）。</p>
    <p>如果两类问题混在同一个分母里，<b>"AI 在这个问题上根本不推荐任何人"会被误算成
    "这些机构认知度低"</b>——这是一个会直接歪曲结论的错误。</p>
    <ul class="kv">
      <li><b>进入排名的</b>：问题本身要求推荐或对比（标注 <code>purpose: ranking</code>）。</li>
      <li><b>不进入排名的</b>：问题是在问方法论或判断标准（<code>purpose: behavior</code>）。
        它们单独记录 AI 的行为——<b>"AI 在这类问题上拒绝点名"本身就是结论</b>。</li>
      <li>同一批数据，用全部问题算出来的提及率会显著低于只用推荐类问题算出来的，
        页面上标注的是后者，并注明样本量。</li>
    </ul>
  </div>

  <div class="card">
    <h2>六、可复算性</h2>
    <ul class="kv">
      <li>每个榜单标注<b>方法论版本</b>与<b>指纹</b>。权重、归一化锚点、空值策略、显著性水平
        任一变动，指纹即变，历史榜单不会与新榜单混为一谈。</li>
      <li>当前版本：<code>${esc(methodologyVersion)}</code>，指纹 <code>${esc(fingerprint ?? '见各榜单页')}</code>。</li>
      <li>所有随机过程使用固定种子（<code>mulberry32</code>），同输入必然同输出；
        引擎中禁用 <code>Math.random()</code>。</li>
      <li>原始回答全量存档，带通道、模型版本、地域、语言、时间戳与采样参数。</li>
    </ul>
  </div>

  <div class="card">
    <h2>七、已知局限</h2>
    <ul class="kv">
      <li><b>解析器是规则式的。</b>能识别编号列表、Markdown 表格、项目符号、中英混排与繁简写法；
        对纯段落叙述，会标记为"低顺序置信度"，因为那种写法里"先提到"不等于"更推荐"。</li>
      <li><b>引用信源归因尚未实现。</b>当前只统计"提到了哪个实体"，还统计不了"引用了谁的话"。</li>
      <li><b>幻觉判定依赖人工标注。</b>每个实体需要一份事实基准才能自动判定 AI 是否说错。</li>
      <li><b>分组视图样本量较小</b>，分通道/分地域对比用 ARS 排序，仅作观察参考，不参与名次判定。</li>
    </ul>
  </div>

  <div class="card">
    <h2>八、我们不做什么</h2>
    <ul class="kv">
      <li>不售卖名次、上榜、置顶，也不接受任何形式的"合作费换入选"。</li>
      <li>不对机构作主观评价：页面上的每条判断都限定为"AI 在某个问题上如此回答"。</li>
      <li>不承诺任何排名变化。诊断与修复服务只做信息补齐与口径统一。</li>
    </ul>
  </div>

  <footer>生成日期 ${esc(generatedAt)}｜方法论版本 ${esc(methodologyVersion)}</footer>
</div>
</body>
</html>`;
}
