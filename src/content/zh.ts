import type { SiteContent } from './types';

export const zh = {
  locale: 'zh',
  meta: {
    title: 'Vittorio Cai — 业务、数据与应用 AI',
    description: 'TUM MMDT 学生，财务背景出身，用数据分析与 AI 解决真实业务问题。',
  },
  nav: {
    work: '项目',
    profile: '关于我',
    experience: '经历',
    contact: '联系',
    menu: '菜单',
  },
  hero: {
    eyebrow: 'TUM MMDT · 德国海尔布隆',
    lines: ['理解业务。', '尊重数据。', '让 AI 真正有用。'],
    summary:
      '我有财务管理背景，目前在 TUM 攻读 Management and Digital Technology。我把业务问题与数据分析、机器学习和软件开发连接起来，并将结果做成真正可以使用的工具。',
    availabilityLabel: '目前',
    availability:
      '正在寻找德国的 Working Student（每周最多 20 小时）与实习机会。',
    focusLabel: '方向',
    focus: ['数据与商业智能', '供应链分析', '应用 AI'],
  },
  actions: {
    viewProjects: '查看项目',
    cv: '下载英文 CV',
    demo: '在线演示',
    source: 'GitHub',
    caseStudy: '项目详情',
    email: '发送邮件',
  },
  sections: {
    work: '代表项目',
    profile: '个人背景与教育',
    experience: '实践经历',
    skills: '技能与语言',
    languages: '语言',
    contact: '联系我',
    contribution: '我的贡献',
  },
  visuals: {
    jobAgentStages: [
      '公开 ATS 数据源',
      '语言要求判断',
      '岗位优先级摘要',
    ],
  },
  projects: [
    {
      id: 'patentpath',
      kicker: '重点项目 · TUM × Fuyao',
      title: 'PatentPATH',
      summary:
        '一个 AI 辅助的专利分析产品，可将设计描述转化为专利重叠风险报告。',
      contribution:
        '负责前端开发，以及 PostgreSQL/pgvector 数据库的设计与实现。',
      details: [
        '存储结构化专利语料与 Embeddings，支持语义搜索。',
        '面向用户设计工作流，让非技术人员可以据此做出判断。',
      ],
      tags: ['Frontend', 'PostgreSQL', 'pgvector'],
      actions: {
        demo: 'https://new-patent-path.vercel.app',
        caseStudy: true,
      },
    },
    {
      id: 'english-job-agent',
      kicker: '开源项目',
      title: 'English Job Agent for Germany',
      summary:
        '寻找并排序对英语求职者友好的学生岗位，识别隐藏的德语要求，并生成每日摘要。',
      details: [
        '采集公开 ATS 数据源，并进行跨来源去重。',
        '通过 LLM 提供判断依据与风险提示，同时设置运行预算上限。',
      ],
      tags: ['Python', 'LLM', 'GitHub Actions'],
      actions: {
        source:
          'https://github.com/VittorioCai/english-job-agent-germany',
        caseStudy: true,
      },
    },
    {
      id: 'news-sentiment',
      kicker: 'TUM Campus Challenge',
      title: 'LLM News-Sentiment & Portfolio Study',
      summary: '一项涵盖约 59,000 个 firm-day 观测值的受控 Prompt 实验。',
      contribution:
        '共同完成新闻数据获取、firm-day 面板构建与数据合并流程。',
      details: [
        '通过受控实验设计比较不同 Prompt 条件。',
        '使用 Fama-French 因子验证投资组合结果。',
      ],
      tags: ['Python', '实验设计', '实证金融'],
      actions: {},
    },
    {
      id: 'water-quality',
      kicker: '机器学习',
      title: 'Water Quality Prediction',
      summary: '针对类别不平衡的水质预测问题，对六种模型进行基准比较。',
      contribution:
        '负责 SVM 和 AdaBoost 的实现与调优，并参与跨模型评估。',
      details: [
        '采用分层 k-fold 交叉验证。',
        '使用 F1、PR-AUC 和 ROC-AUC 比较各模型。',
      ],
      tags: ['scikit-learn', 'SVM', 'AdaBoost'],
      actions: {},
    },
  ],
  profile:
    '我本科主修财务管理，目前在 TUM 学习 Management and Digital Technology——这个组合让我既能读懂业务数字、质疑数字，也能把分析落地成软件。',
  education: [
    {
      school: '慕尼黑工业大学（TUM）',
      degree: '管理与数字技术硕士（M.Sc.）',
      period: '2025–至今',
      location: '海尔布隆',
    },
    {
      school: '温州大学',
      degree: '财务管理学士（B.A.）',
      period: '2021–2025',
      location: '温州',
    },
  ],
  experience: [
    {
      organization: '瑞安市商务局',
      role: '财务实习生',
      period: '2024–2025',
      bullets: [
        '为 50+ 家企业制作数据看板。',
        '通过财务分析识别出两项成本低效问题。',
      ],
    },
    {
      organization: '瑞安市通艳刺绣有限公司',
      role: '会计实习生',
      period: '2024',
      bullets: [
        '实现工资计算自动化，每月节省 10+ 小时。',
        '为采购业务搭建跟踪数据库。',
      ],
    },
  ],
  skillGroups: [
    {
      title: '数据',
      items: ['Python', 'SQL', 'PostgreSQL', 'R', 'SPSS', 'Excel/VBA'],
    },
    {
      title: '机器学习与产品',
      items: [
        'scikit-learn',
        'PyTorch（学习中）',
        'pgvector',
        'Git/GitHub',
      ],
    },
    {
      title: '报告与可视化',
      items: ['交互式数据看板', 'Matplotlib', 'Microsoft 365'],
    },
  ],
  languages: ['中文（普通话）· 母语', '英语 · C1', '德语 · A1（持续学习中）'],
  caseStudies: {
    patentpath: {
      outcome: '将专利分析转化为非技术用户可以据此采取行动的工作流。',
      problem:
        '面对大规模 HUD 挡风玻璃专利语料，用户难以根据新的设计描述判断潜在的专利重叠风险。',
      responsibility:
        '在团队项目中，我明确负责 Web 前端，以及 PostgreSQL/pgvector 数据库的设计与实现。',
      build: [
        '整理专利文本与 Embeddings，用于语义检索。',
        '开发从设计输入到专利重叠风险报告的界面。',
        '为技术复杂的分析设计清晰的用户流程。',
      ],
      evidence: [
        '公开的在线演示。',
        '通过 TUM GenAI Project 与 Fuyao 合作完成的团队项目。',
      ],
    },
    'english-job-agent': {
      outcome: '每天生成岗位候选清单，减少重复的人工搜索。',
      problem: '英文职位描述中仍可能隐藏对德语能力的要求。',
      responsibility:
        '我开发并持续维护这套开源流程，以及基于 GitHub Actions 的自动运行。',
      build: [
        '从公开 ATS 数据源采集职位。',
        '结合规则与 LLM 判断识别语言要求。',
        '对结果去重，并发送附带判断依据的每日摘要。',
      ],
      evidence: [
        '采用 MIT 许可证的公开代码仓库。',
        '自动化测试与每日 GitHub Actions 运行。',
      ],
    },
  },
  caseStudyLabels: {
    problem: '问题',
    responsibility: '我的职责',
    build: '实现内容',
    evidence: '依据与结果',
    backToWork: '返回代表项目',
    nextProject: '下一个项目',
  },
  footer: '构建于海尔布隆，以清晰为设计原则。',
} satisfies SiteContent;
