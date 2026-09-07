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
  contact: { zh: "联系", en: "Contact" } satisfies Bilingual,
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
  labelVenue: { zh: "发表状态", en: "Publication status" } satisfies Bilingual,
  labelAuthors: { zh: "作者", en: "Authors" } satisfies Bilingual,
  labelLinks: { zh: "链接", en: "Links" } satisfies Bilingual,
  /** 某条内容缺当前语言版本时的提示 */
  fallbackNote: {
    zh: "本文暂无中文译文，以下为英文原文。",
    en: "An English translation is not yet available. The Chinese original follows.",
  } satisfies Bilingual,
  empty: {
    zh: "暂无已发布内容。",
    en: "No entries published yet.",
  } satisfies Bilingual,
};

export const home = {
  hero: {
    /** 首页大标题，mark 的片段会带下划线 */
    title: {
      zh: [
        { t: "探索" },
        { t: "高效推理", mark: true },
        { t: "，" },
        { t: "构建" },
        { t: "行业智能体", mark: true },
      ],
      en: [
        { t: "Advancing " },
        { t: "efficient inference", mark: true },
        { t: " and " },
        { t: "AI agents", mark: true },
        { t: " for industry" },
      ],
    } satisfies BilingualOf<Segment[]>,
    lead: {
      zh: "研究聚焦大语言模型的推理效率与生成一致性，探索无需修改模型权重的解码加速方法。工程实践面向教育、商业地产与金融，将领域知识、多模态理解与智能体协作融入完整业务流程。",
      en: "Research focuses on efficient language model inference and consistent generation, exploring decoding acceleration without modifying model weights. Applications in education, commercial real estate, and finance integrate domain knowledge, multimodal understanding, and agent collaboration into complete workflows.",
    } satisfies Bilingual,
  },

  /** 首页那张深色卡片 */
  spark: {
    title: {
      zh: "从推理效率，到系统可靠性。",
      en: "Efficient inference. Reliable systems.",
    } satisfies Bilingual,
    lead: {
      zh: "围绕生成过程的并行性、输出一致性与领域知识建模，连接基础研究与行业应用。",
      en: "Connecting research and applications through parallel generation, output consistency, and domain knowledge modeling.",
    } satisfies Bilingual,
    action: { zh: "查看研究", en: "Explore research" } satisfies Bilingual,
    /** 散落在深色卡片四周的问题，对应参考站首页那张"hard questions"图 */
    questions: {
      zh: ["解码效率", "并行生成", "智能体可靠性", "领域知识建模"],
      en: [
        "Decoding efficiency",
        "Parallel generation",
        "Agent reliability",
        "Domain knowledge",
      ],
    } satisfies BilingualOf<string[]>,
  },

  projects: {
    title: { zh: "精选项目", en: "Selected projects" } satisfies Bilingual,
    lead: {
      zh: "面向教育、商业地产与金融的智能体系统，覆盖知识检索、任务协作与多模态内容生成。",
      en: "Agent systems for education, commercial real estate, and finance, spanning retrieval, task coordination, and multimodal content generation.",
    } satisfies Bilingual,
  },

  research: {
    title: { zh: "研究", en: "Research" } satisfies Bilingual,
    lead: {
      zh: "围绕并行解码与推测解码，研究生成一致性约束下的推理加速。",
      en: "Research on parallel and speculative decoding under generation consistency constraints.",
    } satisfies Bilingual,
  },

  journal: {
    title: { zh: "博客", en: "Blog" } satisfies Bilingual,
    lead: {
      zh: "关于智能体工具、科研工作流与技术表达的实践文章。",
      en: "Articles on agent tools, research workflows, and technical communication.",
    } satisfies Bilingual,
  },

  about: {
    title: { zh: "关于", en: "About" } satisfies Bilingual,
    body: {
      zh: [
        "高泽林，专注于 AI Agent、大语言模型应用与推理加速。技术工作涵盖多智能体编排、检索增强生成、领域模型微调及服务部署。",
        "项目围绕教育、商业地产与金融的复杂业务需求展开，将分散的领域资料、专业规则与任务流程组织为可执行、可追溯的智能体系统。",
        "研究关注模型权重保持不变时的生成效率；工程实践关注任务完成度、信息溯源与运行稳定性，通过明确的职责划分、持续评测和系统可观测性支持迭代。",
      ],
      en: [
        "Zelin Gao works on AI agents, language model applications, and inference acceleration. Technical work spans multi-agent orchestration, retrieval-augmented generation, domain fine-tuning, and service deployment.",
        "Projects address complex workflows in education, commercial real estate, and finance, organizing domain materials, professional rules, and task processes into executable, traceable agent systems.",
        "Research examines generation efficiency with model weights held fixed. Engineering work focuses on task completion, source attribution, and operational stability through explicit responsibilities, ongoing evaluation, and observability.",
      ],
    } satisfies BilingualOf<string[]>,

    /** 关于下面那排能力格子 */
    skills: {
      zh: [
        {
          name: "Agent 与 LLM 应用",
          desc: "基于 LangChain / LangGraph 构建多智能体协作流程，结合 ReAct、CoT 与 Self-Reflection 组织规划、执行及检查；支持 Dify、AutoGen 编排与端到端应用开发。",
        },
        {
          name: "RAG 全链路",
          desc: "文档解析（PDF / Word / HTML）、语义切片、向量化（BGE / text-embedding-3）；Milvus 的集合设计与 IVF_FLAT、HNSW 索引调优；稠密 + BM25 混合检索、元数据过滤、Rerank。",
        },
        {
          name: "后端工程",
          desc: "基于 FastAPI / Python 构建 RESTful 与流式接口，结合 Docker、Compose 和 CI/CD 完成服务部署；涵盖微服务设计、运行监控与故障定位。",
        },
        {
          name: "微调与推理加速",
          desc: "面向 Qwen / LLaMA 的 LoRA、QLoRA 与监督微调；基于 vLLM、PagedAttention 和张量并行优化推理服务，结合 Transformer 与注意力机制分析计算开销。",
        },
      ],
      en: [
        {
          name: "Agents & LLM apps",
          desc: "Multi-agent workflows in LangChain / LangGraph, using ReAct, CoT, and Self-Reflection for planning, execution, and review; Dify and AutoGen orchestration and end-to-end application development.",
        },
        {
          name: "Retrieval-augmented generation",
          desc: "Document parsing (PDF / Word / HTML), semantic chunking, embeddings (BGE / text-embedding-3); Milvus collection design and IVF_FLAT / HNSW index tuning; hybrid dense + BM25 retrieval, metadata filtering, reranking.",
        },
        {
          name: "Backend engineering",
          desc: "RESTful and streaming APIs in FastAPI / Python; service deployment with Docker, Compose, and CI/CD; microservice design, monitoring, and fault diagnosis.",
        },
        {
          name: "Fine-tuning & inference",
          desc: "LoRA, QLoRA, and supervised fine-tuning for Qwen and LLaMA; inference serving with vLLM, PagedAttention, and tensor parallelism; computational analysis of Transformers and attention.",
        },
      ],
    } satisfies BilingualOf<{ name: string; desc: string }[]>,
  },

  contact: {
    title: { zh: "研究与项目合作", en: "Research & collaboration" } satisfies Bilingual,
    lead: {
      zh: "欢迎就推理加速、智能体系统与行业应用开展技术交流及合作。",
      en: "For technical discussions and collaboration on inference acceleration, agent systems, and industry applications.",
    } satisfies Bilingual,
  },
};

export const projectsPage = {
  title: { zh: "项目", en: "Projects" } satisfies Bilingual,
  lead: {
    zh: "面向教育、商业地产与金融的复杂业务流程，结合领域知识、多模态理解与多智能体协作，构建覆盖信息获取、任务执行和成果生成的应用系统。",
    en: "Systems for complex workflows in education, commercial real estate, and finance, combining domain knowledge, multimodal understanding, and agent collaboration across information retrieval, task execution, and content generation.",
  } satisfies Bilingual,
};

export const researchPage = {
  title: { zh: "研究", en: "Research" } satisfies Bilingual,
  lead: {
    zh: "研究集中在大语言模型的推理效率，关注并行解码与推测解码中的计算组织、收敛效率和草稿长度选择，探索模型权重不变条件下的生成加速。",
    en: "Research focuses on language model inference efficiency, examining computation, convergence, and draft length selection in parallel and speculative decoding without changing model weights.",
  } satisfies Bilingual,
  /** 研究方向的小格子，对应参考站的 Research teams */
  topics: {
    zh: [
      { name: "并行解码", desc: "研究多位置并行生成的收敛过程及输出一致性。" },
      { name: "扩散锚定", desc: "研究全局草稿与迭代收敛效率之间的关系。" },
      { name: "推测解码", desc: "研究草稿长度、接受率与验证成本之间的权衡。" },
      { name: "服务与调度", desc: "关注批处理、KV 缓存与显存访问对延迟和吞吐的影响。" },
      { name: "评测", desc: "在统一生成条件下评估输出一致性、延迟与资源开销。" },
    ],
    en: [
      { name: "Parallel decoding", desc: "Convergence and output consistency in parallel generation across multiple positions." },
      { name: "Diffusion anchoring", desc: "The relationship between global drafts and iterative convergence." },
      { name: "Speculative decoding", desc: "Trade-offs among draft length, acceptance rate, and verification cost." },
      { name: "Serving & scheduling", desc: "Effects of batching, KV caches, and memory access on latency and throughput." },
      { name: "Evaluation", desc: "Output consistency, latency, and resource costs under matched generation conditions." },
    ],
  } satisfies BilingualOf<{ name: string; desc: string }[]>,
};

export const blogPage = {
  title: { zh: "博客", en: "Blog" } satisfies Bilingual,
  lead: {
    zh: "围绕智能体开发、科研自动化与技术表达，记录工具的适用场景、工作流程及实践经验。文章原文发布于博客园。",
    en: "Articles on agent development, research automation, and technical communication, covering tools, workflows, and practical experience. Original articles are published in Chinese on CNBlogs.",
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
          { label: "关于", href: "#about" },
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
          { label: "About", href: "#about" },
          { label: "Image credits", href: "#credits" },
        ],
      },
    ],
  } satisfies BilingualOf<{ title: string; links: { label: string; href: string }[] }[]>,

  /** 配图版权说明。占位图全部来自芝加哥艺术博物馆的公共领域藏品。 */
  credits: {
    zh: "艺术藏品配图来自芝加哥艺术博物馆公共领域馆藏；博客封面为站点提供的插画。",
    en: "Collection artwork is from the public domain holdings of The Art Institute of Chicago. The blog cover illustration was supplied for this site.",
  } satisfies Bilingual,

  rights: {
    zh: "保留所有权利。",
    en: "All rights reserved.",
  } satisfies Bilingual,
};
