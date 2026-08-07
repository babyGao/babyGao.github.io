/**
 * 全站文案。改字只改这个文件，页面代码不用碰。
 *
 * 每处都是 { zh: "中文", en: "English" }，两种语言都要填。
 * 标了 TODO 的是必须换成你自己信息的占位内容。
 */

import type { Bilingual, BilingualOf } from "../lib/i18n";

/** 大标题里被下划线强调的片段，mark 为 true 的会画一条粗下划线 */
export type Segment = { t: string; mark?: boolean };

export const identity = {
  name: { zh: "高泽林", en: "Zelin Gao" } satisfies Bilingual,
  /** 导航栏左上角的字号标，点它回首页 */
  brand: { zh: "高泽林的小屋", en: "ZELIN'S PLACE" } satisfies Bilingual,
  role: {
    zh: "AI Agent 与 LLM 应用 · RAG 全链路 · 推理加速",
    en: "AI Agents & LLM Apps · RAG · Inference Acceleration",
  } satisfies Bilingual,
  location: { zh: "中国", en: "China" } satisfies Bilingual,
  email: "gzl@teasera.ai",
  /** TODO: 换成你自己的主页地址 */
  links: [
    { label: { zh: "GitHub", en: "GitHub" }, url: "https://github.com/your-handle" },
    { label: { zh: "Google Scholar", en: "Google Scholar" }, url: "https://scholar.google.com/citations?user=YOUR_ID" },
    { label: { zh: "X", en: "X" }, url: "https://x.com/your-handle" },
  ],
};

/** 导航、按钮这类零碎字眼 */
export const ui = {
  navProjects: { zh: "项目", en: "Projects" } satisfies Bilingual,
  navResearch: { zh: "研究", en: "Research" } satisfies Bilingual,
  navBlog: { zh: "博客", en: "Blog" } satisfies Bilingual,
  navAbout: { zh: "关于", en: "About" } satisfies Bilingual,
  contact: { zh: "联系我们", en: "Get in touch" } satisfies Bilingual,
  readMore: { zh: "阅读全文", en: "Read more" } satisfies Bilingual,
  projectDetail: { zh: "项目详情", en: "Project details" } satisfies Bilingual,
  paperDetail: { zh: "论文详情", en: "Paper details" } satisfies Bilingual,
  viewAll: { zh: "查看全部", en: "View all" } satisfies Bilingual,
  backTo: { zh: "返回", en: "Back to" } satisfies Bilingual,
  prev: { zh: "上一篇", en: "Previous" } satisfies Bilingual,
  next: { zh: "下一篇", en: "Next" } satisfies Bilingual,
  minutes: { zh: "分钟阅读", en: "min read" } satisfies Bilingual,
  labelDate: { zh: "日期", en: "Date" } satisfies Bilingual,
  labelCategory: { zh: "分类", en: "Category" } satisfies Bilingual,
  labelRole: { zh: "角色", en: "Role" } satisfies Bilingual,
  labelYear: { zh: "年份", en: "Year" } satisfies Bilingual,
  labelStatus: { zh: "状态", en: "Status" } satisfies Bilingual,
  labelVenue: { zh: "发表于", en: "Venue" } satisfies Bilingual,
  labelAuthors: { zh: "作者", en: "Authors" } satisfies Bilingual,
  labelLinks: { zh: "链接", en: "Links" } satisfies Bilingual,
  /** 某条内容缺当前语言版本时的提示 */
  fallbackNote: {
    zh: "这篇暂时只有英文版，下面显示的是原文。",
    en: "This one is only written in Chinese for now — the original is shown below.",
  } satisfies Bilingual,
  empty: {
    zh: "这里还空着，很快就会有内容。",
    en: "Nothing here yet — content is on the way.",
  } satisfies Bilingual,
};

export const home = {
  hero: {
    /** 首页大标题，mark 的片段会带下划线 */
    title: {
      zh: [
        { t: "把大模型" },
        { t: "算得更快", mark: true },
        { t: "，" },
        { t: "也把智能体" },
        { t: "真正用起来", mark: true },
      ],
      en: [
        { t: "AI " },
        { t: "research", mark: true },
        { t: " and " },
        { t: "agents", mark: true },
        { t: " that earn their place in real work" },
      ],
    } satisfies BilingualOf<Segment[]>,
    lead: {
      zh: "我做两件事：一是把智能体送进教育、商业地产和金融的日常工作里，让它真的替人干活，而不是演示；二是把大模型的解码过程做快，让同样的算力吐出更多的字。",
      en: "Two things: putting agents into everyday work across education, commercial real estate, and finance — doing the job, not demoing it; and making decoding faster so the same compute produces more tokens.",
    } satisfies Bilingual,
  },

  /** 首页那张深色卡片 */
  spark: {
    title: {
      zh: "难的问题，才值得做。",
      en: "The hard questions are the ones worth doing.",
    } satisfies Bilingual,
    lead: {
      zh: "推理为什么慢、智能体为什么不可靠、垂直领域的知识该怎么进模型——这些是我一直在啃的问题。",
      en: "Why inference is slow, why agents are unreliable, how domain knowledge actually gets into a model — these are the problems I keep working on.",
    } satisfies Bilingual,
    action: { zh: "看看我的研究", en: "See the research" } satisfies Bilingual,
    /** 散落在深色卡片四周的问题，对应参考站首页那张"hard questions"图 */
    questions: {
      zh: ["解码为什么慢？", "并行能走多远？", "智能体凭什么可靠？", "领域知识怎么进模型？"],
      en: [
        "Why is decoding slow?",
        "How far does parallelism go?",
        "What makes an agent reliable?",
        "How does domain knowledge get in?",
      ],
    } satisfies BilingualOf<string[]>,
  },

  projects: {
    title: { zh: "最近的项目", en: "Recent projects" } satisfies Bilingual,
    lead: {
      zh: "教育、商业地产、金融，三套已经跑通业务闭环的系统。",
      en: "Education, commercial real estate, finance — three systems with a working end-to-end loop.",
    } satisfies Bilingual,
  },

  research: {
    title: { zh: "研究", en: "Research" } satisfies Bilingual,
    lead: {
      zh: "围绕解码加速的一些工作，方向是在不改动模型权重的前提下把生成速度提上去。",
      en: "Work on decoding acceleration — getting more speed without touching model weights.",
    } satisfies Bilingual,
  },

  journal: {
    title: { zh: "博客", en: "Blog" } satisfies Bilingual,
    lead: {
      zh: "读论文、写代码、踩坑之后的一些笔记。",
      en: "Notes from reading papers, writing code, and hitting walls.",
    } satisfies Bilingual,
  },

  about: {
    title: { zh: "关于我", en: "About" } satisfies Bilingual,
    body: {
      zh: [
        "我做 AI Agent 和大模型应用的落地：从多智能体编排、RAG 全链路，到微调与推理加速，一条链上的活都干，也都自己部署上线过。",
        "目前三个项目分别落在教育、商业地产和金融——领域差得很远，但要解决的是同一类问题：把一个行业里那些靠人的经验、口径和判断，拆开来重新装进模型能稳定执行的形状里。",
        "做下来最一致的经验是：模型擅长理解和转述，不擅长需要保证的事。所以真正的工程量不在提示词，在于把哪些事交给模型、哪些事必须交给代码，以及模型出错时我有没有办法发现。",
      ],
      en: [
        "I ship AI agents and LLM applications end to end — multi-agent orchestration, the full RAG pipeline, fine-tuning and inference acceleration — and I deploy and operate what I build.",
        "My three current projects sit in education, commercial real estate, and finance. The domains are far apart, but the problem is the same one: taking the experience, vocabulary, and judgment calls locked in an industry and rebuilding them into something a model can execute reliably.",
        "The most consistent lesson: models are good at understanding and restating, and bad at things that need a guarantee. So the real engineering isn't in the prompt — it's deciding what goes to the model, what must stay in code, and whether I'll find out when the model gets it wrong.",
      ],
    } satisfies BilingualOf<string[]>,

    /** 关于下面那排能力格子 */
    skills: {
      zh: [
        {
          name: "Agent 与 LLM 应用",
          desc: "用 LangChain / LangGraph 搭多智能体协作拓扑（规划-执行-反思三层），设计 ReAct、CoT、Self-Reflection 等提示范式；也用 Dify、AutoGen 做快速编排。端到端的 Agent 工作流设计与落地。",
        },
        {
          name: "RAG 全链路",
          desc: "文档解析（PDF / Word / HTML）、语义切片、向量化（BGE / text-embedding-3）；Milvus 的集合设计与 IVF_FLAT、HNSW 索引调优；稠密 + BM25 混合检索、元数据过滤、Rerank。",
        },
        {
          name: "后端工程",
          desc: "FastAPI / Python 构建 RESTful 与流式接口；Docker 容器化与 Compose 服务编排；Git 与 CI/CD；微服务架构设计，项目独立部署与线上排障。",
        },
        {
          name: "微调与推理加速",
          desc: "LoRA / QLoRA 高效微调，在 Qwen / LLaMA 系列上的 SFT 实战；vLLM 推理加速，PagedAttention 与张量并行的分布式方案；理解 Transformer 与注意力机制的底层实现。",
        },
      ],
      en: [
        {
          name: "Agents & LLM apps",
          desc: "Multi-agent topologies in LangChain / LangGraph (plan–execute–reflect); ReAct, CoT, and Self-Reflection prompting patterns; Dify and AutoGen for quick orchestration. End-to-end agent workflow design and delivery.",
        },
        {
          name: "The full RAG pipeline",
          desc: "Document parsing (PDF / Word / HTML), semantic chunking, embeddings (BGE / text-embedding-3); Milvus collection design and IVF_FLAT / HNSW index tuning; hybrid dense + BM25 retrieval, metadata filtering, reranking.",
        },
        {
          name: "Backend engineering",
          desc: "RESTful and streaming APIs in FastAPI / Python; Docker and Compose; Git and CI/CD; microservice design, independent deployment, and production debugging.",
        },
        {
          name: "Fine-tuning & inference",
          desc: "LoRA / QLoRA fine-tuning with hands-on SFT across Qwen and LLaMA; vLLM serving, PagedAttention and tensor parallelism; working knowledge of Transformer internals and attention.",
        },
      ],
    } satisfies BilingualOf<{ name: string; desc: string }[]>,
  },

  contact: {
    title: { zh: "聊聊？", en: "Let's talk" } satisfies Bilingual,
    lead: {
      zh: "研究合作、智能体落地，或者只是想聊聊某篇论文，都可以直接写信。",
      en: "Research collaboration, shipping an agent, or just talking through a paper — email is fine.",
    } satisfies Bilingual,
  },
};

export const projectsPage = {
  title: { zh: "项目", en: "Projects" } satisfies Bilingual,
  lead: {
    zh: "把一个行业的流程、口径和判断标准拆开，重新装进模型能稳定执行的形状里。下面三个分别落在教育、商业地产和金融。",
    en: "Taking an industry's workflow, vocabulary, and judgment calls apart and rebuilding them into something a model can execute reliably. These three sit in education, commercial real estate, and finance.",
  } satisfies Bilingual,
};

export const researchPage = {
  title: { zh: "研究", en: "Research" } satisfies Bilingual,
  lead: {
    zh: "我的研究集中在大模型的推理效率上：在不动权重、不掉精度的前提下，让生成过程跑得更快。",
    en: "My research is about inference efficiency: making generation faster without touching weights or giving up output quality.",
  } satisfies Bilingual,
  /** 研究方向的小格子，对应参考站的 Research teams */
  topics: {
    zh: [
      { name: "并行解码", desc: "让模型一步吐出多个 token，同时保证结果与逐字生成严格一致。" },
      { name: "扩散锚定", desc: "用扩散式的全局草稿给自回归解码提供锚点，缩短收敛所需的迭代轮数。" },
      { name: "推测解码", desc: "小模型起草、大模型验证，研究草稿质量和接受率之间的权衡。" },
      { name: "服务与调度", desc: "批处理、KV 缓存和显存布局——真实吞吐往往卡在这些地方。" },
      { name: "评测", desc: "加速方法到底有没有掉质量，需要一套不糊弄自己的测法。" },
    ],
    en: [
      { name: "Parallel decoding", desc: "Emitting several tokens per step while staying strictly identical to token-by-token generation." },
      { name: "Diffusion anchoring", desc: "Using a diffusion-style global draft to anchor autoregressive decoding and cut the iterations needed to converge." },
      { name: "Speculative decoding", desc: "Small model drafts, large model verifies — the trade-off between draft quality and acceptance rate." },
      { name: "Serving & scheduling", desc: "Batching, KV cache, memory layout — where real throughput actually gets stuck." },
      { name: "Evaluation", desc: "Whether an acceleration method quietly costs quality, measured in a way that doesn't fool you." },
    ],
  } satisfies BilingualOf<{ name: string; desc: string }[]>,
};

export const blogPage = {
  title: { zh: "博客", en: "Blog" } satisfies Bilingual,
  lead: {
    zh: "读论文、写代码、踩坑之后的一些笔记。写得比论文随意，比推文完整。",
    en: "Notes from reading papers, writing code, and hitting walls — looser than a paper, longer than a tweet.",
  } satisfies Bilingual,
};

export const footer = {
  /** 页脚的链接分组，站内地址不带语言前缀 */
  columns: {
    zh: [
      {
        title: "内容",
        links: [
          { label: "项目", href: "projects" },
          { label: "研究", href: "research" },
          { label: "博客", href: "blog" },
        ],
      },
      {
        title: "关于",
        links: [
          { label: "关于我", href: "#about" },
          { label: "配图来源", href: "#credits" },
        ],
      },
    ],
    en: [
      {
        title: "Content",
        links: [
          { label: "Projects", href: "projects" },
          { label: "Research", href: "research" },
          { label: "Blog", href: "blog" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "About me", href: "#about" },
          { label: "Image credits", href: "#credits" },
        ],
      },
    ],
  } satisfies BilingualOf<{ title: string; links: { label: string; href: string }[] }[]>,

  /** 配图版权说明。占位图全部来自芝加哥艺术博物馆的公共领域藏品。 */
  credits: {
    zh: "站内占位配图来自芝加哥艺术博物馆（The Art Institute of Chicago）公共领域藏品。",
    en: "Placeholder artwork is from the public domain collection of The Art Institute of Chicago.",
  } satisfies Bilingual,

  rights: {
    zh: "保留所有权利。",
    en: "All rights reserved.",
  } satisfies Bilingual,
};
