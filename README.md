<div align="center">
  <h1>Information Retrieval - Project and Quick Reference Notes</h1>
  
  <p>
    Repository to maintain group project and notes from NTU's CZ4034 course - Information Retrieval
  </p>
  
  
<!-- Badges -->
<p>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/aish21/CZ4034-Information-Retrieval" alt="last commit" />
  </a>
  <a href="https://github.com/aish21/VirtualEYE-FYP/stargazers/">
    <img src="https://img.shields.io/github/stars/aish21/CZ4034-Information-Retrieval" alt="stars" />
  </a>
  <a href="https://github.com/aish21/VirtualEYE-FYP/issues/">
    <img src="https://img.shields.io/github/issues/aish21/CZ4034-Information-Retrieval" alt="open issues" />
  </a>
</p>
</div>

<!-- Table of Contents -->
# :star2: Table of Contents

- [Lecture 1: INTRODUCTION](#introduction)
- [Lecture 2: BOOLEAN RETRIEVAL](#boolean-retrieval)
- [Lecture 3: TOLERANT RETRIEVAL](#tolerant-retrieval)  
- [Lecture 4: RANKED RETRIEVAL](#ranked-retrieval)
- [Lecture 5: EFFICIENT RETRIEVAL](#efficient-retrieval)
- [Lecture 6: ENHANCED RETRIEVAL](#enhanced-retrieval)
- [Lecture 7: CLASSIFICATION](#classification)
- [Lecture 8: CLUSTERING](#clustering)
- [Lecture 8: WEB SEARCH](#web-search)

## INTRODUCTION
* Information retrieval is the process of retrieving information as a response to user queries and presenting the results in a human readable form. In involves ranking and query optimization. 
* Information Extraction is the process of extracting structured information from unstructured data. Goal is to extract relevant data, relationships.
* Collected Intelligence - Process of gathering and aggregating data, information, or knowledge from multiple sources or channels
* Collective Intelligence -  Refers to the intelligence or knowledge that emerges from the collective efforts, interactions, or contributions of a group of individuals or entities. It is the idea that groups or crowds can exhibit intelligence or problem-solving abilities that are greater than the sum of their individual members (the goal for semantic web)
* Learning: Symbolic AI (top down - knowledge driven, use data structures), Sub-Symbolic AI (bottom up - data driven, uses NNs)
* ML issues: Dependency (need lot of training data), Consistency (different training methods lead to different results), Reproducibility (very difficult to reproduce results), Transparency (cannot understand reasoning - black box approach)
* Symbol grounding - semantic relationships in text but not in meanings
* Syntactic - 
- Microtext - very short or compact text snippets that are typically characterized by their brevity and concise nature (texting slang)
- Sentence boundary disambiguation, POS Tagging, Text Chunking, Lemmatization
* Semantics: Word sense disambiguation, concept extraction, NER, Subjectivity detection
* Pragmatics: Sarcasm, Higher level NLP tasks
* Document Representations: One hot (presence), TF-IDF weighting (frequency), word embeddings (context - semantic)
 
## BOOLEAN RETRIEVAL
* Structured data (can be represented in tables), vs Unstructured data (web pages)
* Term Document Incidence Matrix: One hot encoding, words represent dimensions, encodes presence of word in document - Boolean queries - simple, easy to build, precise response but sparse, need expert understanding of system to make query, not ranked
* Inverted Index - Data Structure, that, for each term t, stores the list of all documents that contain t - postings list with docID and df, continuous run on disk, linked list in memory - tradeoff in size and ease of insertion
* Construction - Documents, tokenizer (create tokens from sentences), normalisation (Convert inflectional form of the word to base form from thesaurus understanding, maintains POS) , stemming (crude affix chopping to convert to root form based on rules, but POS not maintained, stopwords removal
* Token Sequence, sort by terms, then by doc ID, postings
* AND: Merge two postings, O(x+y) operations when sorted by docID, heuristic - IN ORDER OF INCREASING DOC FREQ (which is why we keep note of df). OR is adding
* Biword indexes - an extension to regular indexes, but instead we have biwords - index blowup, for phrase Queries
* Positional index - store the positions as well - 2x4 times larger, 35-50% of original volume, skip pointers for faster processing
* Compression - disk space, money, more stuff in memory, faster, decompression algos are faster
* Dict - small to be kept in main memory,memory footprint, search time, embedded systems; postings - in memory
* Lossy - data loss, case folding, stemming, stopwords
* Lossless - preserved info
* Heap's Law: M = kT^b, M = dict size, T is # tokens in collection. log-log plot M vs T is 0.5 - empirical
* Zipf's Law - The ith most frequent term is proportional to 1/i. collection frequency is proportional to normalizing constant(k)/i - identify stop words
* Dictionary - Fixed Width < Dictionary as a string < Blocking (store pointers to every kth term string, need 1 extra byte) < Front Coding - sorted words with common prefix stored and represented, not needed when you stem.
* To compress postings - store differences in DocIDs

## TOLERANT RETRIEVAL
* Token: instance of a sequence of characters - issues with names, numbers, meta-data, language
* Good IR does not remove stopwords these days because they are needed for processing phrase queries, relational queries, query expansion
* Stemming (changes polarity of word, porter's algo) and Lemmatization (improves concept extraction) are normalization techniques along with casefolding, thesaurus (handle synonyms? different spellings?), microtext
* Wild card queries - search queries that contain a special character or symbol that serves as a placeholder for one or more characters in a search term. Wildcard queries allow users to perform more flexible and expansive searches, as the wildcard character can represent any character or group of characters, allowing for partial matches or pattern-based searches.
* Binary tree lexicon - retrieve words in range mon <= w < moo when query is mon*, for *mon - additional B tree for terms backwards
* To handle more wild card - transform to permuterm index so that * at the end
* the terms in a text are transformed by rotating their characters to create different permutations, which are then used as keys in the index
* X: X$, X*: $X*, *X: X$ *, * X *: X *, X*Y: Y$X *
* Spell correction - correct documents (domain knowledge) or user queries (return alternative queries, fix doc-Q mapping) - isolated word or context based
* Spell correction is based on syntax, probability and preference
* Isolated: Standard Lexicon or lexicon of indexed corpus
* Edit Distance - given two strings S1 and S2, the minimum number of operations to convert one to another - character level. Keep a lookout for Sub cost, dynamic programming but cant do for all dict terms - slow and expensive
*  n-gram overlap - n grams in the query and lexicon, see matching n-grams in the 2, thresholding
* To normalize this - Jaccard coefficient - Measure of overlap , similarity of two sets - |X int Y| / |X U Y| - between 0 and 1, don't have to be the same size
* Jaccard Distance = 1 - J
* Context Sensitive Spell correction - surrounding text, retrieve dict terms close to each Q term & try all possible phrases with one word fixed at a time - HIT based (suggest lost of HITs)
* Or use POS Tags to generalise, byword conjunction 
* Spell correction is expensive, may lead to wrong norm, too many alternatives
* Soundex: phonetic equivalent, token -> 4 char reduced form
* Keep first letter, a,e,i,o,u,w,h,y > 0, map letters to num, remove pairs of consecutive digits, remove all 0s and pad with trailing 0s - OK for high recall tasks, not much for IR

## RANKED RETRIEVAL
*  Boolean - feast or famine results, instead return an ordering over the top documents in the collection wrt to a query
* Premise - working of ranking algorithm
* Score measures how well document and query match
* Cannot use Jaccard as it does not consider document frequency
* use Term document count matrix - measure frequency of terms instead of presence
* Bag of words model - vector representation, does not consider order, loss of positional information
* TERM FREQUENCY - Number of times a term occurs in a document
* Relevance does not increase proportionally with tf - 1+ log(tf), 0 when tf is 0
* Rare terms are more informative - idf - measure of rarity - log(Num documents/df)
* idf has no effect on ranking one term queries
* Collection frequency - number of occurrences of a term in a collection
* weight = tf * idf -> increases with frequency in doc and rarity of terms
* SMART notation - ddd.qqq, different weighting techniques. Final score is Wd * Wq, which is then used for ranking docs
* Documents as vectors - terms are axes and documents/queries are the vectors/points
* proximity is the similarity/closeness of Document and Q vectors - to rank docs and get away from Boolean model
* Euclid - not good, large for vectors with diff lengths (despite similar distribution)
* Angle - cosine - decreasing order of the angle or increasing order of cosine (monotonically decreasing fn between 0 and 180)
* Length Normalization - dividing vector components by its length (L2norm) - unit vector
* Vector space ranking - Represent Q as weighted tf-idf vector, represent each doc the same way as well, compute cosine similarity between docs and Q, rank docs wrt Q by score, return top k
* LIMITATIONS: does not tell us what is what - no semantic network/knowledge

## EFFICIENT RETRIEVAL
* To reduce vector dimensionality - feature selection (process of selecting a subset of relevant features or variables from a larger set of features in a dataset), TSVD (factorise the matric, discard singular values - top of diagonal is most relevant, rebuild), random projections - relative angles preserved
* Optimised cosine - top k cosine values - not efficient if we have to recompute for every new query with all docs - KNN for a query vector - not possible in higher dimensions, but ok for shorter queries
* unweighted - occur only once, no need to normalise query vector
- Index Elim - only consider docs with at least one query term - high idf Q terms, docs with many query terms - soft conjunction (in a postings list you would only compute for common docIDs)
- Champion Lists / Fancy list / top docs - for each dictionary term t, calc r docs of highest weight in t's postings - r chosen at index build time, r < k. at query time, only compute scores for docs in champion list for the query term - merge and pick top k scoring docs
* Relevance (cosine) + Authority (Q independent - pagerank, follower count, citations)
* g(d) - auth score betwixt 0 and 1
* net score = g(d) + cosine - seek top k by net score - combine with champion lists
* For each term - two postings - high and low. only go to low when docs < K.
* Cluster Pruning - preprocessing - pick sqrt( N ) at random as leaders (fast and reflect distribution), for other docs precompute nearest leader (likely sqrtN followers for each leader)
* Cluster pruning - Now with Query, find nearest leader -seek K nearest docs among L's followers
* Metadata - Author, title, date,etc - field or parametric index - postings for each field value.
* Zone - regions with arbitrary amount of text - build inverted index for zones as well
* Tiered Indexes - hierarchy of lists - inverted index broken into tiers of decreasing importance
* Aggregate scores - combine all scores
* Query Parsers: Run as phrase query, if <k contain Q, run biword of phrase. If still <k - run vector space ranking

## ENHANCED RETRIEVAL
* Measure relevance of results - benchmark document collection, suite of queries and assessing Relevant or NR for each Q and Doc
* Relevance assessed relative to user need 
* Unranked: Precision and Recall. Precision = relevant | ret, Recall = ret | relevant
* Conservatism - High P, low R; Liberalism - Low P, High R
* Accuracy - fraction of classification that are correct - not useful for IR
* Recall is Non decreasing for num of docs - as P decreases, recall or num docs increases - empirical
* balanced f1 - use p and r
* Ranked - Binary and multiple levels
- Binary - precision @ K - Get top K results, compute fraction of relevant results from the K obtained, ignore anything lower than K. same for Recall @ K
- Binary - Mean Average Precision - Average of Precision @ K for each value of K - If a relevant doc is never retrieved, P is 0 for that doc - macro averaging- each Q counts equally - requires relevance judgement
-  Binary - Mean Reciprocal Rank (MRR) - Rank, K of the first relevant doc, its reciprocal (1/K) - mean of all the 1/Ks across queries 
-  DCG - assumptions: highly relevant > marginally relevant, lower the rank of relevant doc, less useful it is for the user
- uses graded relevance - gain, which is accumulated, discounted at lower ranks (1/logRANK) - rank1 + rank2/log(rank2) + rank3/log(rank3)
- emphasis on retrieving highly relevant docs
- DCG = rel1 + sum(i = 2 to rank p) rel(i)/log2(i)
- nDCG - normalised at rank n = DCG/IDCG -> useful for contrasting queries with varying number of relevant results
* Non-Relevance based measures - 
- A/B testing - test a single innovation, divert a small proportion of traffic to the new system - eval automatic measure like clickthrough rate - less powerful but easier to undersrtand
* Rank based requires humans - expensive, slow, inconsistent, not representative
* Interjudge - P(e) - prob that judges agree by chance - P(NR)^2 + P(R)^2; Kappa = P(a) - P(e) / (1 - P(e)), P(a) is when judges agree. 1 for total agreement and 0 for chance agreement - get rid with relevance feedback. 
* Relevance feedback - user feedback on relevance of docs in initial set of results - mark results as R or NR - system computes better representation based on feedback- iterate
- ASSUMPTIONS - user has sufficient knowledge of initial query, relevance prototypes are well behaved - similar term distribution (violation - R docs are multimodal class)
* Rocchio Algo - uses vector space model to a relevance feedback query - but we don't know the truly relevant docs - separate docs marked R and NR - max qOPT
- instead use set of KNOWN R and NR docs - qm modified query vector - moves towards R docs and away from NR docs
* Positive feedback better - need higher beta and gamma =0 and generally beta is greater
* improve recall -> modify query based on relevance feedback
* Problems - long queries are inefficient, users don't like to give feedback, not the best use of user's time - revise query. Emperically, one round of relevance feedback is v useful - Q0 to computer precision and recall graphs, qm to do the same with residual collection of docs
* PSEUDO-RELEVANCE - Retrieve ranked list of hits for the user's query, assume top k are relevant, do relevance feedback - avg performance, can go horribly wrong
* Q Expansion - user gives additional input on WORDS OR PHRASES (Not docs like in relevance feedback)
local - analysis of docs in result set
- Thesaurus (global) - for each term, expand query w synonyms and related words, enlarge search result, correct search query, resolve ambiguity
- Auto Thesaurus Gen (global) - similarity between words - lexical and semantic (stats vs grammar), pattern matching, co-occurrence
issues - quality of associations, term ambiguity vs stats correlation

## CLASSIFICATION
* Standing Q: for real time, rerun Qs periodically - monitoring
* Supervised - need labelled data for training, The goal is to learn mapping inputs to labelled outputs so that the trained model can make predictions on new, unseen data, Affected by quality and quantity of training data
* Unsupervisied - Algorithms learn from unlabelled data, The goal is to identify patterns within the data, Does not require labelled data - flexible
* Classification Methods - Manual (expensive, done by experts, time consuming, better for smaller use case), automatic (Rule based - Accuracy is often very high if a rule has been carefully refined over time by a subject expert and building and maintaining these rules is expensive, supervised, unsupervised)
* Classification Framework - Train Data, Feature extraction and selection, algo, classifier, test data
* NB CLASSIFIER - 
- TRAIN - O(|D|Lave + |C||V|) TEST - O(|C| Lt) 
- Conditional independence assumption - Features are conditionally independent,  feature distributions for each class follow a specific probability distribution, such as Gaussian (for continuous features) or multinomial (for discrete features)
- Low Variance, High Bias
- Smoothing to avoid overfitting
- Pros: Simple, scalable, Fast, No curse of dimensionality
- Cons: Assumptions may not hold, can overfit on data, struggle with features with high dependencies, no semantic understanding 
* FEATURE SELECTION - 
- improve generalization, avoid overfitting and eliminate noisy features
- Are we confident that the value of one cat var is assoc with the val of another? Chi-Sq
- whether there is a significant difference between the expected and observed frequencies in one or more cats.
- if calc val > given, null hypothesis is rejected - implies that expected and observed counts are not similar
* KNN - 
- define k neighbourhood N as knn of doc d
- count number of docs i in N that belong to class c, P(C | D) = i/k
- choose max prob
- High Var, low bias
- case based, mem based, lazy learning
- no need for feature selection, scalable, classes influence, no training, expensive at test, more acc than NB
* SVM - 
- Non-linear problem
- mapped to higher dimensional feature space
- max the margin (2/w) around the separating hyperplanes - decision fn specified by support vectors - examples closest to hyperplanes/decision boundaries
* Evaluation - 
- F1
- Macroavg - simple avg
- Micro avg - effective measure on pooled contingency table (Acc, Prec, Recall, F1)
- K-fold - averaging results over multiple training and test splits of the overall data
* how to protect against concept drift - categories change over time
* Deep learning - semantics and sentence structure 
* Word embeddings - vectors to capture semantic meaning of words - linguistic
* co-occurrence vs probability
* Windowed system (sliding over words) - use surrounding words - syntactic and semantic information - word2vec
* CNN - vectors for each phrase, pooling max layers, narrow (beginning and end) or wide
* RNN - sequence of words, LSTM, memory of surrounding words, forget gate, struggle with large sequence, hard to train (exploding gradient), hard to parallelize
* Attention - enhances important parts of input data
* GANs - generate new data
* Capsule Networks - learn hierarchical relationships between consecutive layers and improve generalization
* Transformers - parallelized, positional encodings, attention, self-attention but statistical do not model meaning

## CLUSTERING
* Grouping a set of objects into classes of similar objects
* unsupervised
* classes not pre-defined
* Flat algos - K means, hierarchical  - HAC and divisive (binary)
* Hard - each doc in one cluster only common and easier, soft - more than one cluster
* documents as vectors
* Select K random docs as seed, repeat until convergence - for each doc, assign it to a cluster and calc dist, for each cluster update seed to new centroid
* goodness measure of cluster -  sum of squared distances from cluster centroid
sum of the goodness - monotonically decreases 
* Time complex  - O(IKNM), I iterations, K clusters, M dimensions of vector
* select seed using heuristic
* Tradeoff between having more clusters and having too many
* clustering value (determine where k should be) = # docs * B (cos sim to centroid for each doc) - K clusters * cost of cluster
* Hierarchical - recursive, binary, dendrogram, no need to assume num of clusters
- HAC - each doc a cluster, each step merge the closest pair until only one cluster is left using proximity matrix
* HOW TO UPDATE PROXIMITY MATRIX?
- Single Link - Most similar (min dist) - long, thin clusters, chaining issue, straggly 
- Complete link - tighter spherical clusters - least similar
- Centroid - use the cluster
- Avg-link - inter-similar, intrasimilar
- Good Clustering - high intra-call similarity and low inter-class similarity
- External criteria for quality - use labelled data (compare with ground truth
- Purity - ratio of dominant class in cluster wi and the size of wi (all classes)
- Rand Index (same diff clusters vs same diff clusters in ground truth) - tp + tn / sum of all
* Issues with clustering - labelling, need a representative label for each cluster
- Discriminative - To label cluster w, compare it with all other clusters, find terms that distinguish w from the other clusters (mutual info, ch-square, freq)
- Non-Disc - Select terms only from information from the cluster - terms with high weights in the centroid - sometimes select frequent terms that do not distinguish clusters
* Alternatives - doc title, AI, topic modeling (discover abstract topics)

## WEB SEARCH
* Web: uncoordinated, chaotic, search a key enabler, large
* History: Knowledge Repo, GOTO (revenue-based), and GOOGLE (relevance based ads)
* Top level domains - extensions to categorize website by type, location
* Google - ads ranking, auction based, only charged when user clicks ad, separate ad from real results
* Alternative to ads - SEO - Tuning webpages to rank highly in the algorithmic search results for certain keywords. Done via tf-idf, keyword stuffing (repeated terms indexed by crawlers, hidden in diff colour text on page) use meta-tags - serve fake pages to search engine spider (bot)
* SPAM PREVENTION - Quality signals (votes from authors and users), policing URL submissions, limits on meta-tags, robust link analysis, spam recognition by ML
* Trust on the web - propaganda, misinformation, clickbait, sponsored content, conspiracy theory
* User needs - Navigational, informational, transactional, gray areas 
* EVALUATION - relevance, result validity, precision, UI-UX, trust, deal with weird queries
* Web is infinite - (xA = yB)
- Random URL from A and B
- check if A c B
- Strong Query - check whether engine B has doc D - use 8 low freq words as AND query to B, check if D is in result set
- Problem - duplicates - fingerprinting (exact match via fingerprinting), near duplication - similarity using shingles (n grams - set of shingles with size of intersection / size of union) and thresholding
* WEB CRAWLING STEPS - 
1. Pick a seed URL
2. Use DNS to resolve IP and fetch contents
3. Parse the URLs using normalization 
4. Check for duplicates using fingerprinting and shingles
5. based on ROBOTS.txt, fitler URL and decide whether to crawl (don't fetch again and again, cache)
6. Resultant URLs de-duplicated and added to URL Frontier
7. Repeat from Step 2
* Crawlers must - be polite (explicit - crawl allowed pages, respect robots.txt, be robust from malicious behaviour; implicit - don't visit a page too often)
* Distribute crawler - multiple crawl threads, hash used for partition (host splitter)
* Web is a directed graph - A hyperlink is a quality signal (a -> B means B has high quality content), anchor text describes content of page youre going to
- Text of B + Anchor text of B (better description of page's content) > text of B
- Google Bomb - bad results due to maliciously manipulated anchor text
* Exploit Authority - Counteraction (assume content from a legit website is trustworthy) - weight depends on node's authority
* Query independent ordering - undirected (# inlinks + # outlinks), directed - # inlinks
* Page Rank - for all set of pages that point to C, sum over the PR of pages / links outgoing from that page. it is iterative
- Random walk - start at random page, at each step got out of current page along outgoing links (with equal probabilities), but real surfers are not random
- Long-term visit rate - pages visited more often in the random walk are more important - use markov chains
- if there is a hyperlink, then put 1 in matrix, divide each 1 by the number of 1s in the row, multiply by (1-teleporting rate), add teleporting rate/N (number of pages/states)
- for LTVR to hold, web graph must not have dead ends. At deadend, jump to random webpage with prob 1/N - At a non dead end, the prob of jumping to random web page is 0.1 - teleportation rate (to each with 0.1/N)
- Still need Markov chains to be ergodic - irreducibility (path from any page to any other page), aperiodicity (pages cannot be partitioned such that the random walker visits the partitions sequentially) - teleporting makes it ergodic, unique LTVR for each state - does not matter where we start from
- Issues - Real surfers are not random, produces bad results
* HITS - Hyperlink induced Topic Search
- two different types of relevance - hubs (good list of links to pages - good one links to many auths), auth (direct answer to information needed - good one has links from many hubs) - page rank does not make distinction between the 2
- Regular web search - root set of results, find all the hubs and auths, base set - larger set, then hubs and auth for base (convergence)
- init for all pages H and A as 1 - iteratively update all -> output pages with highest hub and auth scores, therefore 2 ranked lists
- PR - precomputed
- HITS - at query time, expensive
- Eigenproblem formalization and set of pages to apply this to
- Good hub = good auth
