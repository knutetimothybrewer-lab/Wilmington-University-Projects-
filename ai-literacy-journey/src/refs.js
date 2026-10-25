'use strict';
/* =====================================================================
   LECTURE CONTENT (data only). Edit here to change what is taught.
   Nothing in this file touches graphics or animation code.
   [EDIT ME]  Each chapter has: objectives, summary, scenes[].
   Scene types: cinema | concept | lab | quiz | discuss | hub | finale
   Concept fields: def, explain, analogy, mechanism, classroom, misconception, discuss, check
   Lab fields: sim (id in Sims), lab{purpose, steps[], prompt, classroom}
   Notes fields: say, demo, facilitate, misc, follow, caveat, transition
   ===================================================================== */
const REFS={
  vaswani2017:'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30. arXiv:1706.03762',
  bender2021:'Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? Proceedings of FAccT ’21, 610–623. https://doi.org/10.1145/3442188.3445922',
  bender2020:'Bender, E. M., & Koller, A. (2020). Climbing towards NLU: On meaning, form, and understanding in the age of data. Proceedings of ACL 2020, 5185–5198.',
  mitchell2023:'Mitchell, M., & Krakauer, D. C. (2023). The debate over understanding in AI’s large language models. Proceedings of the National Academy of Sciences, 120(13), e2215907120.',
  ji2023:'Ji, Z., Lee, N., Frieske, R., et al. (2023). Survey of hallucination in natural language generation. ACM Computing Surveys, 55(12), Article 248. https://doi.org/10.1145/3571730',
  lewis2020:'Lewis, P., Perez, E., Piktus, A., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems, 33. arXiv:2005.11401',
  holtzman2020:'Holtzman, A., Buys, J., Du, L., Forbes, M., & Choi, Y. (2020). The curious case of neural text degeneration. ICLR 2020. arXiv:1904.09751',
  sennrich2016:'Sennrich, R., Haddow, B., & Birch, A. (2016). Neural machine translation of rare words with subword units. Proceedings of ACL 2016, 1715–1725.',
  mikolov2013:'Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). Efficient estimation of word representations in vector space. arXiv:1301.3781',
  liu2024:'Liu, N. F., Lin, K., Hewitt, J., et al. (2024). Lost in the middle: How language models use long contexts. Transactions of the Association for Computational Linguistics, 12, 157–173.',
  petrov2023:'Petrov, A., La Malfa, E., Torr, P. H. S., & Bibi, A. (2023). Language model tokenizers introduce unfairness between languages. Advances in Neural Information Processing Systems, 36.',
  parasuraman2010:'Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. Human Factors, 52(3), 381–410. https://doi.org/10.1177/0018720810376055',
  skitka1999:'Skitka, L. J., Mosier, K. L., & Burdick, M. (1999). Does automation bias decision-making? International Journal of Human-Computer Studies, 51(5), 991–1006.',
  mosier1998:'Mosier, K. L., Skitka, L. J., Heers, S., & Burdick, M. (1998). Automation bias: Decision making and performance in high-tech cockpits. International Journal of Aviation Psychology, 8(1), 47–63.',
  goddard2012:'Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias: A systematic review of frequency, effect mediators, and mitigators. Journal of the American Medical Informatics Association, 19(1), 121–127.',
  dietvorst2015:'Dietvorst, B. J., Simmons, J. P., & Massey, C. (2015). Algorithm aversion: People erroneously avoid algorithms after seeing them err. Journal of Experimental Psychology: General, 144(1), 114–126.',
  logg2019:'Logg, J. M., Minson, J. A., & Moore, D. A. (2019). Algorithm appreciation: People prefer algorithmic to human judgment. Organizational Behavior and Human Decision Processes, 151, 90–103.',
  obermeyer2019:'Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. Science, 366(6464), 447–453.',
  buolamwini2018:'Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77–91.',
  pashler2008:'Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. Psychological Science in the Public Interest, 9(3), 105–119.',
  mata2023:'Mata v. Avianca, Inc., No. 22-cv-1461 (PKC) (S.D.N.Y. June 22, 2023) (opinion and order on sanctions): attorneys submitted a brief citing cases that a chatbot had fabricated.',
  long2020:'Long, D., & Magerko, B. (2020). What is AI literacy? Competencies and design considerations. Proceedings of CHI ’20. https://doi.org/10.1145/3313831.3376727',
  ng2021:'Ng, D. T. K., Leung, J. K. L., Chu, S. K. W., & Qiao, M. S. (2021). Conceptualizing AI literacy: An exploratory review. Computers and Education: Artificial Intelligence, 2, 100041.',
  miao2023:'Miao, F., & Holmes, W. (2023). Guidance for generative AI in education and research. UNESCO.',
  kasneci2023:'Kasneci, E., Seßler, K., Küchemann, S., et al. (2023). ChatGPT for good? On opportunities and challenges of large language models for education. Learning and Individual Differences, 103, 102274.',
  mitchell1997:'Mitchell, T. M. (1997). Machine Learning. McGraw-Hill.',
  goodfellow2016:'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.',
  jurafsky:'Jurafsky, D., & Martin, J. H. Speech and Language Processing (3rd ed. draft). Stanford University. Freely available online.',
  bjork2011:'Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In Psychology and the Real World (pp. 56–64). Worth.'
};
const REFS_NOTE='Citations were written from the instructor’s knowledge of the literature. Practice what the lecture teaches: confirm each entry (DOI, volume, pages) in a library database before reusing it in publications or assignments.';

const CHAPTERS=[];
