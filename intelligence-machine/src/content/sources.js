export const lectureSources = [
  {
    id: "transformer",
    citation:
      "Vaswani, A., et al. (2017). Attention Is All You Need. Advances in Neural Information Processing Systems 30. arXiv:1706.03762.",
    url: "https://arxiv.org/abs/1706.03762",
    note: "Authoritative metadata, abstract, and PDF reviewed. Section 3.2.1 provides scaled dot-product attention. The lecture does not treat the original encoder–decoder model as identical to every modern LLM.",
    status: "Original paper reviewed",
  },
  {
    id: "hallucination",
    citation:
      "Ji, Z., et al. Survey of Hallucination in Natural Language Generation. arXiv:2202.03629 (first submitted 2022; revised version reviewed). Related ACM DOI: 10.1145/3571730.",
    url: "https://arxiv.org/abs/2202.03629",
    note: "Metadata, abstract, and PDF sections on definitions and terminology reviewed. Distinguishes source inconsistency from unsupported additions; terminology varies by task. No invented claim about educational effect sizes is attributed.",
    status: "Original survey sections reviewed",
  },
  {
    id: "rag",
    citation:
      "Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 2020. arXiv:2005.11401.",
    url: "https://arxiv.org/abs/2005.11401",
    note: "Metadata, abstract, and PDF introduction/method reviewed. Describes parametric plus retrieval-based memory and task-specific evaluation; does not guarantee universally correct retrieved answers.",
    status: "Original paper sections reviewed",
  },
  {
    id: "automation",
    citation:
      "Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias: a systematic review of frequency, effect mediators, and mitigators. Journal of the American Medical Informatics Association. DOI: 10.1136/amiajnl-2011-000089.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3240751/",
    note: "Author/title/year verified against Crossref DOI metadata. Full article access encountered a browser verification page. Educational cases are original illustrations; no effect size or school-specific causal finding is attributed to this review.",
    status: "Metadata verified; full text not reviewed",
  },
  {
    id: "nist",
    citation:
      "Tabassi, E. (2023). Artificial Intelligence Risk Management Framework (AI RMF 1.0). NIST AI 100-1. DOI: 10.6028/NIST.AI.100-1.",
    url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
    note: "Title, author, date, and voluntary rights-preserving risk-management purpose verified through Crossref metadata/abstract. PDF access returned HTTP 403. Used as a further-reading framework, not as a certification or legal standard.",
    status: "Metadata and abstract verified; PDF unavailable",
  },
];
