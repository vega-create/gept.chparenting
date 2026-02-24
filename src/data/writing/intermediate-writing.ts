// GEPT Intermediate Level (中級) Writing Practice Data
// Target: ~5000 word vocabulary, high school level (15-18 year olds)

export const INTER_WRITING = {
  // ==========================================
  // Sentence Reorder (60 items)
  // Words in CORRECT order; the app shuffles them for practice
  // ==========================================
  sentenceReorder: [
    // --- Conditionals ---
    { parts: ["If", "you", "study", "hard", "enough", ",", "you", "will", "pass", "the", "exam"], zh: "如果你夠努力讀書，你就會通過考試" },
    { parts: ["If", "I", "had", "more", "time", ",", "I", "would", "travel", "around", "the", "world"], zh: "如果我有更多時間，我會環遊世界" },
    { parts: ["Unless", "we", "take", "action", "now", ",", "the", "problem", "will", "get", "worse"], zh: "除非我們現在採取行動，否則問題會更嚴重" },
    { parts: ["If", "it", "rains", "tomorrow", ",", "the", "outdoor", "event", "will", "be", "canceled"], zh: "如果明天下雨，戶外活動將會取消" },
    { parts: ["We", "would", "have", "arrived", "on", "time", "if", "we", "had", "left", "earlier"], zh: "如果我們早點出發，就會準時到達" },

    // --- Relative Clauses ---
    { parts: ["The", "teacher", "who", "taught", "us", "English", "has", "retired", "this", "year"], zh: "教我們英文的那位老師今年退休了" },
    { parts: ["The", "movie", "that", "we", "watched", "last", "night", "was", "incredibly", "exciting"], zh: "我們昨晚看的那部電影非常刺激" },
    { parts: ["The", "city", "where", "I", "grew", "up", "has", "changed", "a", "lot"], zh: "我長大的那座城市已經改變很多了" },
    { parts: ["The", "reason", "why", "she", "left", "the", "company", "is", "still", "unclear"], zh: "她離開公司的原因仍然不清楚" },
    { parts: ["Students", "who", "participate", "in", "club", "activities", "tend", "to", "be", "more", "confident"], zh: "參加社團活動的學生往往更有自信" },

    // --- Passive Voice ---
    { parts: ["English", "is", "spoken", "as", "a", "second", "language", "in", "many", "countries"], zh: "英語在許多國家被當作第二語言使用" },
    { parts: ["The", "new", "bridge", "was", "built", "to", "reduce", "traffic", "congestion"], zh: "這座新橋是為了減少交通壅塞而建造的" },
    { parts: ["The", "concert", "has", "been", "postponed", "due", "to", "the", "bad", "weather"], zh: "音樂會因為天氣不好而延期了" },
    { parts: ["These", "products", "are", "made", "from", "recycled", "materials", "in", "local", "factories"], zh: "這些產品是在當地工廠用回收材料製造的" },
    { parts: ["The", "injured", "passengers", "were", "immediately", "taken", "to", "the", "nearest", "hospital"], zh: "受傷的乘客立刻被送往最近的醫院" },

    // --- Compound Sentences ---
    { parts: ["She", "not", "only", "speaks", "English", "fluently", "but", "also", "writes", "beautifully"], zh: "她不僅英語說得流利，文章也寫得很好" },
    { parts: ["He", "wanted", "to", "go", "abroad", ",", "but", "he", "could", "not", "afford", "it"], zh: "他想出國，但負擔不起費用" },
    { parts: ["You", "can", "either", "take", "the", "bus", "or", "ride", "a", "bicycle", "to", "school"], zh: "你可以搭公車或騎腳踏車去學校" },
    { parts: ["Neither", "the", "students", "nor", "the", "teacher", "was", "satisfied", "with", "the", "result"], zh: "學生和老師都不滿意這個結果" },
    { parts: ["The", "weather", "was", "terrible", ",", "yet", "we", "still", "had", "a", "wonderful", "time"], zh: "天氣很糟，但我們仍然玩得很開心" },

    // --- Subordinate Clauses ---
    { parts: ["Although", "he", "is", "young", ",", "he", "has", "a", "lot", "of", "experience"], zh: "雖然他很年輕，但他有很多經驗" },
    { parts: ["Because", "the", "traffic", "was", "heavy", ",", "we", "missed", "our", "flight"], zh: "因為交通很擁擠，我們錯過了班機" },
    { parts: ["While", "some", "people", "prefer", "cities", ",", "others", "enjoy", "living", "in", "the", "countryside"], zh: "有些人喜歡城市，有些人喜歡住在鄉下" },
    { parts: ["After", "she", "graduated", "from", "college", ",", "she", "started", "her", "own", "business"], zh: "她大學畢業後就自己創業了" },
    { parts: ["Before", "you", "make", "a", "decision", ",", "you", "should", "consider", "all", "the", "options"], zh: "在你做決定之前，你應該考慮所有選項" },

    // --- Phrasal Verbs and Collocations ---
    { parts: ["We", "need", "to", "come", "up", "with", "a", "better", "solution", "to", "this", "problem"], zh: "我們需要想出一個更好的解決方案" },
    { parts: ["She", "decided", "to", "give", "up", "her", "job", "and", "pursue", "her", "dream"], zh: "她決定放棄工作去追求夢想" },
    { parts: ["I", "look", "forward", "to", "hearing", "from", "you", "as", "soon", "as", "possible"], zh: "我期待盡快收到你的回覆" },
    { parts: ["The", "government", "should", "take", "measures", "to", "protect", "the", "environment"], zh: "政府應該採取措施來保護環境" },
    { parts: ["It", "is", "important", "to", "keep", "up", "with", "the", "latest", "technology"], zh: "跟上最新科技是很重要的" },

    // --- Various Intermediate Structures ---
    { parts: ["The", "more", "you", "practice", ",", "the", "better", "you", "will", "become"], zh: "你練習得越多，就會變得越好" },
    { parts: ["It", "took", "me", "three", "hours", "to", "finish", "the", "research", "report"], zh: "我花了三個小時完成研究報告" },
    { parts: ["She", "is", "so", "talented", "that", "everyone", "admires", "her", "musical", "ability"], zh: "她太有天賦了，每個人都欽佩她的音樂才能" },
    { parts: ["Not", "until", "I", "went", "abroad", "did", "I", "realize", "the", "importance", "of", "English"], zh: "直到我出國才了解英語的重要性" },
    { parts: ["There", "is", "no", "doubt", "that", "exercise", "is", "beneficial", "to", "our", "health"], zh: "毫無疑問，運動對我們的健康有益" },
    { parts: ["He", "has", "been", "working", "on", "this", "project", "for", "over", "six", "months"], zh: "他已經在這個專案上工作超過六個月了" },
    { parts: ["The", "book", "that", "my", "teacher", "recommended", "turned", "out", "to", "be", "fascinating"], zh: "老師推薦的那本書結果非常精彩" },
    { parts: ["Despite", "the", "difficulties", ",", "they", "never", "gave", "up", "on", "their", "goal"], zh: "儘管困難重重，他們從未放棄目標" },
    { parts: ["I", "wish", "I", "could", "spend", "more", "time", "with", "my", "family"], zh: "我希望能花更多時間陪家人" },
    { parts: ["Many", "people", "believe", "that", "technology", "has", "made", "our", "lives", "easier"], zh: "許多人相信科技讓我們的生活更便利" },
    { parts: ["The", "museum", "which", "we", "visited", "yesterday", "had", "an", "amazing", "art", "collection"], zh: "我們昨天參觀的博物館有很棒的藝術收藏" },
    { parts: ["It", "is", "widely", "believed", "that", "reading", "can", "broaden", "our", "horizons"], zh: "人們普遍認為閱讀能拓展我們的視野" },
    { parts: ["Having", "finished", "his", "homework", ",", "he", "went", "outside", "to", "play", "basketball"], zh: "做完功課後，他出去打籃球了" },
    { parts: ["The", "temperature", "has", "risen", "significantly", "over", "the", "past", "few", "decades"], zh: "過去幾十年來溫度已經顯著上升" },
    { parts: ["In", "order", "to", "succeed", ",", "you", "must", "be", "willing", "to", "work", "hard"], zh: "為了成功，你必須願意努力工作" },
    { parts: ["She", "suggested", "that", "we", "should", "start", "the", "meeting", "without", "him"], zh: "她建議我們應該不等他就開始開會" },
    { parts: ["By", "the", "time", "we", "arrived", ",", "the", "show", "had", "already", "started"], zh: "在我們到達之前，演出已經開始了" },
    { parts: ["No", "matter", "how", "busy", "you", "are", ",", "you", "should", "exercise", "regularly"], zh: "不管你多忙，你都應該定期運動" },
    { parts: ["The", "pollution", "caused", "by", "factories", "is", "threatening", "our", "drinking", "water"], zh: "工廠造成的污染正威脅著我們的飲用水" },
    { parts: ["What", "surprised", "me", "most", "was", "her", "ability", "to", "speak", "five", "languages"], zh: "最讓我驚訝的是她能說五種語言" },
    { parts: ["They", "have", "decided", "to", "invest", "more", "money", "in", "renewable", "energy"], zh: "他們決定在再生能源方面投入更多資金" },
    { parts: ["He", "apologized", "for", "being", "late", "and", "promised", "it", "would", "not", "happen", "again"], zh: "他為遲到道歉，並承諾不會再發生" },
    { parts: ["It", "is", "essential", "that", "students", "learn", "how", "to", "think", "critically"], zh: "學生學習批判性思考是很重要的" },
    { parts: ["The", "number", "of", "tourists", "visiting", "Taiwan", "has", "increased", "dramatically"], zh: "造訪台灣的觀光客人數已經大幅增加" },
    { parts: ["I", "am", "used", "to", "getting", "up", "early", "because", "of", "my", "morning", "classes"], zh: "因為有早上的課，我已經習慣早起了" },
    { parts: ["She", "asked", "me", "whether", "I", "had", "ever", "been", "to", "Japan", "before"], zh: "她問我是否曾經去過日本" },
    { parts: ["The", "experiment", "proved", "that", "the", "theory", "was", "correct", "after", "all"], zh: "實驗證明那個理論終究是正確的" },
    { parts: ["Had", "I", "known", "about", "the", "sale", ",", "I", "would", "have", "bought", "it"], zh: "如果我早知道有特賣，我就會買了" },
    { parts: ["We", "are", "supposed", "to", "hand", "in", "the", "report", "by", "next", "Friday"], zh: "我們應該在下週五前交報告" },
    { parts: ["The", "more", "books", "you", "read", ",", "the", "more", "knowledge", "you", "gain"], zh: "你讀越多書，就獲得越多知識" },
  ],

  // ==========================================
  // Translation (40 items)
  // Chinese to English translation practice
  // ==========================================
  translation: [
    // --- Travel ---
    { zh: "如果明天天氣好的話，我們可以去海邊。", answer: "If the weather is nice tomorrow, we can go to the beach.", keywords: ["if", "weather", "nice", "tomorrow", "beach"], hint: "if / weather / nice / tomorrow / beach" },
    { zh: "我們計畫暑假去日本旅行兩個星期。", answer: "We plan to travel to Japan for two weeks during summer vacation.", keywords: ["plan", "travel", "Japan", "two weeks", "summer vacation"], hint: "plan / travel / Japan / two weeks / summer vacation" },
    { zh: "你有沒有去過任何國外的著名景點？", answer: "Have you ever been to any famous tourist attractions abroad?", keywords: ["ever", "been to", "famous", "tourist attractions", "abroad"], hint: "ever / been to / famous / tourist attractions / abroad" },
    { zh: "搭火車旅行比搭飛機更能欣賞沿途的風景。", answer: "Traveling by train allows you to enjoy the scenery along the way more than flying.", keywords: ["traveling by train", "enjoy", "scenery", "along the way", "flying"], hint: "traveling by train / enjoy / scenery / along the way / flying" },
    { zh: "這家飯店不但房間舒適，而且服務也很好。", answer: "This hotel not only has comfortable rooms but also provides great service.", keywords: ["not only", "comfortable rooms", "but also", "great service"], hint: "not only / comfortable rooms / but also / great service" },

    // --- Environment ---
    { zh: "全球暖化是我們這個世紀面臨的最大挑戰之一。", answer: "Global warming is one of the biggest challenges we face in this century.", keywords: ["global warming", "one of", "biggest challenges", "face", "century"], hint: "global warming / one of / biggest challenges / face / century" },
    { zh: "我們應該減少使用塑膠製品來保護海洋環境。", answer: "We should reduce the use of plastic products to protect the ocean environment.", keywords: ["reduce", "use of", "plastic products", "protect", "ocean environment"], hint: "reduce / use of / plastic products / protect / ocean environment" },
    { zh: "如果每個人都做好垃圾分類，就能減少很多污染。", answer: "If everyone sorts their garbage properly, a lot of pollution can be reduced.", keywords: ["if", "everyone", "sorts", "garbage", "pollution", "reduced"], hint: "if / everyone / sorts / garbage / pollution / reduced" },
    { zh: "越來越多人選擇騎腳踏車上班以減少碳排放。", answer: "More and more people choose to ride bicycles to work to reduce carbon emissions.", keywords: ["more and more", "choose", "ride bicycles", "reduce", "carbon emissions"], hint: "more and more / choose / ride bicycles / reduce / carbon emissions" },
    { zh: "政府已經通過新的法律來禁止在國家公園內丟棄垃圾。", answer: "The government has passed a new law to ban littering in national parks.", keywords: ["government", "passed", "law", "ban", "littering", "national parks"], hint: "government / passed / law / ban / littering / national parks" },

    // --- Technology ---
    { zh: "科技的快速發展已經改變了我們的日常生活方式。", answer: "The rapid development of technology has changed our daily lifestyle.", keywords: ["rapid development", "technology", "changed", "daily lifestyle"], hint: "rapid development / technology / changed / daily lifestyle" },
    { zh: "許多學生利用網路來查詢資料和學習新技能。", answer: "Many students use the internet to look up information and learn new skills.", keywords: ["students", "use", "internet", "look up", "information", "learn", "skills"], hint: "students / use / internet / look up / information / learn / skills" },
    { zh: "雖然智慧型手機很方便，但過度使用可能會傷害眼睛。", answer: "Although smartphones are convenient, excessive use may damage your eyes.", keywords: ["although", "smartphones", "convenient", "excessive use", "damage", "eyes"], hint: "although / smartphones / convenient / excessive use / damage / eyes" },
    { zh: "人工智慧在未來可能會取代許多目前由人類從事的工作。", answer: "Artificial intelligence may replace many jobs currently done by humans in the future.", keywords: ["artificial intelligence", "replace", "jobs", "currently", "humans", "future"], hint: "artificial intelligence / replace / jobs / currently / humans / future" },
    { zh: "線上學習讓住在偏遠地區的學生也能獲得優質教育資源。", answer: "Online learning allows students living in remote areas to access quality educational resources.", keywords: ["online learning", "allows", "students", "remote areas", "access", "quality", "educational resources"], hint: "online learning / allows / students / remote areas / access / quality / educational resources" },

    // --- Health ---
    { zh: "均衡的飲食和規律的運動是維持健康的關鍵。", answer: "A balanced diet and regular exercise are the keys to maintaining good health.", keywords: ["balanced diet", "regular exercise", "keys to", "maintaining", "health"], hint: "balanced diet / regular exercise / keys to / maintaining / health" },
    { zh: "醫生建議我們每天至少喝八杯水。", answer: "Doctors recommend that we drink at least eight glasses of water every day.", keywords: ["doctors", "recommend", "drink", "at least", "eight glasses", "water", "every day"], hint: "doctors / recommend / drink / at least / eight glasses / water / every day" },
    { zh: "充足的睡眠對青少年的身心發展非常重要。", answer: "Adequate sleep is very important for the physical and mental development of teenagers.", keywords: ["adequate sleep", "important", "physical", "mental", "development", "teenagers"], hint: "adequate sleep / important / physical / mental / development / teenagers" },
    { zh: "壓力太大會導致各種健康問題，包括失眠和頭痛。", answer: "Too much stress can lead to various health problems, including insomnia and headaches.", keywords: ["too much stress", "lead to", "health problems", "including", "insomnia", "headaches"], hint: "too much stress / lead to / health problems / including / insomnia / headaches" },
    { zh: "越來越多年輕人開始重視心理健康的重要性。", answer: "More and more young people are starting to value the importance of mental health.", keywords: ["more and more", "young people", "starting to", "value", "importance", "mental health"], hint: "more and more / young people / starting to / value / importance / mental health" },

    // --- Education ---
    { zh: "老師鼓勵學生們積極參與課堂討論。", answer: "The teacher encourages students to actively participate in class discussions.", keywords: ["teacher", "encourages", "students", "actively", "participate", "class discussions"], hint: "teacher / encourages / students / actively / participate / class discussions" },
    { zh: "學習外語不僅能幫助你找到好工作，還能開拓視野。", answer: "Learning a foreign language can not only help you find a good job but also broaden your horizons.", keywords: ["learning", "foreign language", "not only", "good job", "but also", "broaden", "horizons"], hint: "learning / foreign language / not only / good job / but also / broaden / horizons" },
    { zh: "這所大學以其優秀的工程學系聞名全國。", answer: "This university is famous nationwide for its excellent engineering department.", keywords: ["university", "famous", "nationwide", "excellent", "engineering department"], hint: "university / famous / nationwide / excellent / engineering department" },
    { zh: "批判性思考是學生在學校應該培養的重要能力之一。", answer: "Critical thinking is one of the important abilities students should develop in school.", keywords: ["critical thinking", "one of", "important abilities", "students", "develop", "school"], hint: "critical thinking / one of / important abilities / students / develop / school" },
    { zh: "她努力讀書，希望能考上理想的大學。", answer: "She studies hard, hoping to get into her ideal university.", keywords: ["studies hard", "hoping to", "get into", "ideal", "university"], hint: "studies hard / hoping to / get into / ideal / university" },

    // --- Social Issues ---
    { zh: "志工服務能幫助我們更了解社會上需要幫助的人。", answer: "Volunteer service can help us better understand people in society who need help.", keywords: ["volunteer service", "help", "understand", "people", "society", "need help"], hint: "volunteer service / help / understand / people / society / need help" },
    { zh: "每個人都應該被公平對待，不論他們的背景如何。", answer: "Everyone should be treated fairly regardless of their background.", keywords: ["everyone", "treated fairly", "regardless of", "background"], hint: "everyone / treated fairly / regardless of / background" },
    { zh: "社群媒體的普及使得假新聞更容易被傳播。", answer: "The popularity of social media has made it easier for fake news to spread.", keywords: ["popularity", "social media", "made it easier", "fake news", "spread"], hint: "popularity / social media / made it easier / fake news / spread" },
    { zh: "隨著人口老化，照顧老年人已經成為一個重要議題。", answer: "With an aging population, caring for the elderly has become an important issue.", keywords: ["aging population", "caring for", "elderly", "become", "important issue"], hint: "aging population / caring for / elderly / become / important issue" },
    { zh: "貧富差距的擴大是許多國家正在面對的嚴重問題。", answer: "The widening gap between the rich and the poor is a serious problem many countries are facing.", keywords: ["widening gap", "rich", "poor", "serious problem", "countries", "facing"], hint: "widening gap / rich / poor / serious problem / countries / facing" },

    // --- Culture & Lifestyle ---
    { zh: "台灣的夜市文化吸引了來自世界各地的觀光客。", answer: "Taiwan's night market culture attracts tourists from all over the world.", keywords: ["night market culture", "attracts", "tourists", "all over the world"], hint: "night market culture / attracts / tourists / all over the world" },
    { zh: "閱讀小說可以幫助我們培養想像力和同理心。", answer: "Reading novels can help us develop imagination and empathy.", keywords: ["reading novels", "help", "develop", "imagination", "empathy"], hint: "reading novels / help / develop / imagination / empathy" },
    { zh: "比起在家看電視，我更喜歡和朋友出去運動。", answer: "Compared to watching TV at home, I prefer going out to exercise with friends.", keywords: ["compared to", "watching TV", "prefer", "going out", "exercise", "friends"], hint: "compared to / watching TV / prefer / going out / exercise / friends" },
    { zh: "學習尊重不同的文化是成為國際公民的第一步。", answer: "Learning to respect different cultures is the first step to becoming a global citizen.", keywords: ["learning to", "respect", "different cultures", "first step", "global citizen"], hint: "learning to / respect / different cultures / first step / global citizen" },
    { zh: "在台灣，中秋節是家人團聚和賞月的重要節日。", answer: "In Taiwan, the Mid-Autumn Festival is an important holiday for family reunions and moon gazing.", keywords: ["Mid-Autumn Festival", "important holiday", "family reunions", "moon gazing"], hint: "Mid-Autumn Festival / important holiday / family reunions / moon gazing" },

    // --- Daily Life & Personal Growth ---
    { zh: "養成良好的時間管理習慣能讓你的生活更有效率。", answer: "Developing good time management habits can make your life more efficient.", keywords: ["developing", "time management", "habits", "make", "life", "efficient"], hint: "developing / time management / habits / make / life / efficient" },
    { zh: "他建議我在做重大決定之前，先和家人商量。", answer: "He suggested that I discuss it with my family before making a major decision.", keywords: ["suggested", "discuss", "family", "before", "making", "major decision"], hint: "suggested / discuss / family / before / making / major decision" },
    { zh: "成功不是一夜之間就能達到的，需要長期的努力。", answer: "Success cannot be achieved overnight; it requires long-term effort.", keywords: ["success", "achieved", "overnight", "requires", "long-term effort"], hint: "success / achieved / overnight / requires / long-term effort" },
    { zh: "我很感謝父母一直以來的支持和鼓勵。", answer: "I am very grateful for my parents' support and encouragement all along.", keywords: ["grateful for", "parents", "support", "encouragement", "all along"], hint: "grateful for / parents / support / encouragement / all along" },
    { zh: "面對失敗時，保持正面的態度是非常重要的。", answer: "It is very important to maintain a positive attitude when facing failure.", keywords: ["important", "maintain", "positive attitude", "facing", "failure"], hint: "important / maintain / positive attitude / facing / failure" },
  ],

  // ==========================================
  // Paragraph Order (20 items)
  // Sentences in CORRECT order forming a coherent paragraph
  // ==========================================
  paragraphOrder: [
    // --- Environment ---
    {
      title: "The Benefits of Reading",
      sentences: [
        "Reading is one of the most valuable habits a person can develop.",
        "It helps expand our vocabulary and improve our writing skills.",
        "Moreover, reading different genres exposes us to diverse perspectives and cultures.",
        "Studies have also shown that regular reading can reduce stress and improve mental health.",
        "Therefore, everyone should try to read at least thirty minutes a day.",
      ],
      zh: "閱讀的好處",
    },
    {
      title: "Reducing Plastic Waste",
      sentences: [
        "Plastic pollution has become one of the most serious environmental problems worldwide.",
        "Every year, millions of tons of plastic waste end up in the ocean, harming marine life.",
        "To address this issue, many countries have started to ban single-use plastic bags and straws.",
        "Individuals can also make a difference by using reusable bags, bottles, and containers.",
        "If we all work together, we can significantly reduce the amount of plastic waste.",
      ],
      zh: "減少塑膠垃圾",
    },
    {
      title: "Why We Should Protect Forests",
      sentences: [
        "Forests play a vital role in maintaining the balance of our ecosystem.",
        "They absorb carbon dioxide and release oxygen, helping to slow down climate change.",
        "In addition, forests are home to countless species of plants and animals.",
        "However, deforestation is destroying these important habitats at an alarming rate.",
        "We must take immediate action to protect and restore forests around the world.",
      ],
      zh: "為什麼要保護森林",
    },
    {
      title: "Saving Water",
      sentences: [
        "Water is one of the most precious natural resources on Earth.",
        "Although water covers about seventy percent of our planet, only a small portion is drinkable.",
        "As the population continues to grow, the demand for clean water is increasing rapidly.",
        "Simple actions like turning off the tap while brushing your teeth can help save water.",
        "Everyone has a responsibility to use water wisely and protect this essential resource.",
      ],
      zh: "節約用水",
    },

    // --- Technology ---
    {
      title: "The Rise of Online Learning",
      sentences: [
        "Online learning has grown rapidly in recent years, especially after the global pandemic.",
        "Students can now access courses from top universities around the world without leaving home.",
        "This type of learning offers flexibility, allowing people to study at their own pace.",
        "However, online learning also has some drawbacks, such as a lack of face-to-face interaction.",
        "Despite these challenges, online learning will continue to play an important role in education.",
      ],
      zh: "線上學習的興起",
    },
    {
      title: "How Smartphones Changed Communication",
      sentences: [
        "Smartphones have completely transformed the way people communicate with each other.",
        "With messaging apps and social media, we can instantly connect with anyone in the world.",
        "Video calls have also made it possible to see friends and family no matter how far away they are.",
        "On the other hand, some people worry that we spend too much time on our phones and lose real human connections.",
        "Finding a balance between digital and face-to-face communication is important in the modern age.",
      ],
      zh: "智慧型手機如何改變溝通方式",
    },
    {
      title: "Artificial Intelligence in Daily Life",
      sentences: [
        "Artificial intelligence is no longer just a concept from science fiction movies.",
        "We interact with AI every day through voice assistants, recommendation systems, and navigation apps.",
        "AI technology is also being used in healthcare to help doctors diagnose diseases more accurately.",
        "While AI brings many benefits, there are also concerns about job losses and privacy issues.",
        "As AI continues to develop, society will need to find ways to use it responsibly.",
      ],
      zh: "日常生活中的人工智慧",
    },

    // --- Health ---
    {
      title: "The Importance of Sleep",
      sentences: [
        "Getting enough sleep is essential for both physical and mental health.",
        "During sleep, our bodies repair themselves and our brains process the information from the day.",
        "Studies show that teenagers need at least eight to ten hours of sleep each night.",
        "Unfortunately, many students stay up late studying or using their phones, leading to sleep deprivation.",
        "Establishing a regular bedtime routine can help improve sleep quality and overall well-being.",
      ],
      zh: "睡眠的重要性",
    },
    {
      title: "Benefits of Regular Exercise",
      sentences: [
        "Regular exercise provides numerous benefits for both the body and the mind.",
        "Physical activity strengthens the heart, builds muscle, and improves flexibility.",
        "Exercise also releases chemicals in the brain that help reduce stress and boost mood.",
        "Experts recommend that teenagers get at least sixty minutes of physical activity every day.",
        "Whether it is jogging, swimming, or playing team sports, any form of exercise is better than none.",
      ],
      zh: "規律運動的好處",
    },
    {
      title: "Healthy Eating Habits",
      sentences: [
        "A healthy diet is the foundation of a strong and active body.",
        "Eating a variety of fruits, vegetables, whole grains, and lean proteins provides essential nutrients.",
        "It is also important to limit the intake of sugary drinks, fast food, and processed snacks.",
        "Skipping meals, especially breakfast, can lead to low energy and poor concentration in class.",
        "By making small changes to our eating habits, we can greatly improve our long-term health.",
      ],
      zh: "健康的飲食習慣",
    },

    // --- Education ---
    {
      title: "Why Learning a Second Language Matters",
      sentences: [
        "Learning a second language is one of the best investments a person can make.",
        "It not only opens up more career opportunities but also helps you understand other cultures.",
        "Research shows that bilingual people tend to have better memory and problem-solving skills.",
        "In today's globalized world, being able to communicate in more than one language is a valuable asset.",
        "Starting to learn a second language early can make the process much easier and more natural.",
      ],
      zh: "為什麼學第二語言很重要",
    },
    {
      title: "The Value of Teamwork",
      sentences: [
        "Teamwork is an essential skill that students need to develop for both school and future careers.",
        "When people work together, they can combine their strengths and achieve more than they could alone.",
        "Effective teamwork requires good communication, mutual respect, and a willingness to compromise.",
        "Group projects in school provide excellent opportunities to practice these important skills.",
        "Learning to be a good team player now will prepare you for success in the workplace later.",
      ],
      zh: "團隊合作的價值",
    },

    // --- Culture ---
    {
      title: "The Importance of Preserving Cultural Heritage",
      sentences: [
        "Cultural heritage includes the traditions, customs, and historical sites passed down through generations.",
        "These cultural treasures help us understand our history and shape our identity as a society.",
        "Unfortunately, many traditional practices are disappearing as the world becomes more modernized.",
        "Governments and communities should work together to document and protect cultural heritage.",
        "By preserving our cultural roots, we can ensure that future generations appreciate their rich history.",
      ],
      zh: "保存文化遺產的重要性",
    },
    {
      title: "Festivals Around the World",
      sentences: [
        "Every culture has its own unique festivals that reflect its values and traditions.",
        "In Taiwan, the Lunar New Year is the most important festival, when families gather for reunion dinners.",
        "Western countries celebrate holidays like Christmas and Thanksgiving with special meals and customs.",
        "Experiencing different festivals is a wonderful way to learn about and appreciate other cultures.",
        "No matter where we come from, festivals bring people together and create lasting memories.",
      ],
      zh: "世界各地的節慶",
    },

    // --- Travel ---
    {
      title: "The Benefits of Traveling",
      sentences: [
        "Traveling is one of the best ways to broaden your horizons and gain new experiences.",
        "When you visit a new place, you get to try different foods, hear different languages, and see beautiful scenery.",
        "Traveling also teaches you important life skills such as independence and problem-solving.",
        "Meeting people from different backgrounds helps you become more open-minded and tolerant.",
        "Whether you travel near or far, every trip has something valuable to offer.",
      ],
      zh: "旅行的好處",
    },
    {
      title: "Planning a Trip Abroad",
      sentences: [
        "Planning a trip abroad requires careful preparation to ensure a smooth and enjoyable experience.",
        "First, you should research your destination, including the weather, culture, and must-see attractions.",
        "Next, you need to arrange your passport, visa, and travel insurance well in advance.",
        "It is also a good idea to learn some basic phrases in the local language before you go.",
        "With proper planning, traveling abroad can be one of the most rewarding experiences of your life.",
      ],
      zh: "規劃出國旅行",
    },

    // --- Social & Personal ---
    {
      title: "Time Management for Students",
      sentences: [
        "Good time management is a skill that every student needs to succeed in school.",
        "The first step is to make a schedule that includes time for studying, activities, and rest.",
        "It is important to prioritize tasks and focus on the most urgent ones first.",
        "Avoiding distractions, such as social media and unnecessary phone use, can help you stay focused.",
        "Students who manage their time well tend to feel less stressed and perform better academically.",
      ],
      zh: "學生的時間管理",
    },
    {
      title: "The Power of Kindness",
      sentences: [
        "A simple act of kindness can make a big difference in someone's day.",
        "Holding the door for a stranger, helping a classmate with homework, or giving a sincere compliment are all examples of kindness.",
        "Research shows that being kind to others not only makes them happy but also improves our own well-being.",
        "When one person is kind, it often inspires others to do the same, creating a chain reaction of positivity.",
        "In a world that can sometimes feel harsh, choosing kindness is one of the most powerful things we can do.",
      ],
      zh: "善良的力量",
    },
    {
      title: "Social Media and Teenagers",
      sentences: [
        "Social media has become an inseparable part of most teenagers' lives.",
        "Platforms like Instagram, TikTok, and YouTube allow young people to express themselves and connect with others.",
        "However, spending too much time on social media can lead to anxiety, low self-esteem, and cyberbullying.",
        "Parents and schools should educate teenagers about responsible social media use and online safety.",
        "By setting healthy boundaries, teenagers can enjoy the benefits of social media without the negative effects.",
      ],
      zh: "社群媒體與青少年",
    },
    {
      title: "The Importance of Volunteering",
      sentences: [
        "Volunteering is a meaningful way to give back to the community and help those in need.",
        "Through volunteer work, we can develop valuable skills such as leadership, communication, and empathy.",
        "Many organizations rely on volunteers to carry out their missions, from food banks to animal shelters.",
        "Volunteering also looks impressive on college applications and resumes, showing a commitment to service.",
        "Even a few hours of volunteer work each month can make a significant impact on both the community and the volunteer.",
      ],
      zh: "志工服務的重要性",
    },
  ],

  // ==========================================
  // Guided Writing (15 items)
  // Writing prompts with vocabulary and sample answers
  // ==========================================
  guidedWriting: [
    {
      topic: "The Impact of Social Media",
      zh: "社群媒體的影響",
      prompts: [
        "How has social media changed the way people communicate?",
        "What are some advantages and disadvantages of social media?",
        "How do you use social media in your daily life?",
      ],
      vocabulary: ["communication", "connect", "influence", "privacy", "information", "platform", "interaction"],
      sampleAnswer: "Social media has dramatically changed the way people communicate. Platforms like Instagram and LINE allow us to stay connected with friends and family regardless of distance. However, social media also has its drawbacks. Many people spend too much time scrolling through their feeds, which can lead to decreased productivity and even feelings of anxiety. Personally, I use social media mainly to keep in touch with my classmates and share interesting articles. I believe it is important to use social media wisely and set limits on screen time.",
      minWords: 50,
    },
    {
      topic: "My Ideal Career",
      zh: "我理想的職業",
      prompts: [
        "What career do you want to pursue in the future?",
        "Why does this career interest you?",
        "What skills or qualifications do you need for this career?",
        "What steps will you take to achieve this goal?",
      ],
      vocabulary: ["career", "pursue", "qualification", "passion", "opportunity", "experience", "achievement"],
      sampleAnswer: "In the future, I would like to become a software engineer. I have always been fascinated by how technology can solve real-world problems. This career interests me because it combines creativity with logical thinking, and there is always something new to learn. To become a software engineer, I need to study computer science at university and develop strong programming skills. I am currently learning Python and JavaScript on my own. I also plan to participate in coding competitions and internship programs during college to gain practical experience. I believe that with hard work and dedication, I can achieve my dream.",
      minWords: 50,
    },
    {
      topic: "The Importance of Environmental Protection",
      zh: "環境保護的重要性",
      prompts: [
        "What are the major environmental problems we face today?",
        "How do these problems affect our daily lives?",
        "What can individuals do to help protect the environment?",
      ],
      vocabulary: ["pollution", "climate change", "recycle", "sustainable", "renewable energy", "ecosystem"],
      sampleAnswer: "Environmental protection is one of the most pressing issues of our time. Today, we face serious problems such as air pollution, ocean pollution, and climate change. These issues directly affect our health, food supply, and quality of life. For example, air pollution in cities causes respiratory diseases, and rising sea levels threaten coastal communities. However, individuals can make a difference by taking simple actions. We can reduce waste by recycling and using reusable bags. We can save energy by turning off lights and using public transportation. If everyone contributes a little, we can create a cleaner and more sustainable world for future generations.",
      minWords: 50,
    },
    {
      topic: "A Memorable Travel Experience",
      zh: "一次難忘的旅行經驗",
      prompts: [
        "Where did you go and when?",
        "What did you do and see during the trip?",
        "What made this trip special or memorable?",
        "What did you learn from this experience?",
      ],
      vocabulary: ["destination", "explore", "scenery", "adventure", "culture", "memorable", "experience"],
      sampleAnswer: "Last summer, my family and I took a trip to Hualien, a beautiful city on the east coast of Taiwan. We spent four days exploring the stunning Taroko Gorge, where the towering marble cliffs and crystal-clear river left us speechless. We also visited a local indigenous village and learned about the traditions and culture of the Truku people. What made this trip especially memorable was watching the sunrise from Qixingtan Beach on our last morning. The sky turned from purple to orange, and it was one of the most beautiful sights I have ever seen. This experience taught me to appreciate the natural beauty of Taiwan and the importance of preserving it.",
      minWords: 50,
    },
    {
      topic: "Should Students Have Part-Time Jobs?",
      zh: "學生是否應該打工？",
      prompts: [
        "What are the advantages of having a part-time job as a student?",
        "What are the possible disadvantages?",
        "What is your personal opinion on this issue?",
      ],
      vocabulary: ["part-time job", "responsibility", "income", "time management", "valuable", "balance", "independence"],
      sampleAnswer: "Whether students should have part-time jobs is a debatable topic. On one hand, having a part-time job can teach students important life skills such as time management, responsibility, and communication. It also gives them a chance to earn their own money and become more independent. On the other hand, working too many hours can take time away from studying and extracurricular activities. Students may feel exhausted and their grades might suffer as a result. In my opinion, having a part-time job can be beneficial as long as students find a good balance between work and school. It is important to prioritize academics while still gaining real-world experience.",
      minWords: 50,
    },
    {
      topic: "The Benefits of Exercise",
      zh: "運動的好處",
      prompts: [
        "What types of exercise do you enjoy?",
        "How does exercise benefit your physical health?",
        "How does exercise benefit your mental health?",
      ],
      vocabulary: ["physical fitness", "mental health", "stress relief", "endurance", "strength", "habit", "well-being"],
      sampleAnswer: "Exercise plays an essential role in maintaining both physical and mental health. Personally, I enjoy playing basketball and jogging in the park after school. Physical activity helps me stay in good shape by strengthening my muscles and improving my endurance. It also keeps my heart healthy and helps me maintain a proper weight. Beyond physical benefits, exercise is a great way to relieve stress. After a long day of studying, going for a run helps me clear my mind and feel refreshed. Research has shown that regular exercise releases chemicals in the brain that improve mood and reduce anxiety. I strongly believe that everyone should make exercise a daily habit for a healthier and happier life.",
      minWords: 50,
    },
    {
      topic: "My Favorite Book or Movie",
      zh: "我最喜歡的書或電影",
      prompts: [
        "What is your favorite book or movie and what is it about?",
        "Why do you like it so much?",
        "What lessons or messages did you take from it?",
        "Would you recommend it to others?",
      ],
      vocabulary: ["plot", "character", "theme", "inspiring", "recommend", "impression", "genre"],
      sampleAnswer: "My favorite movie is The Shawshank Redemption, a drama about a man named Andy who is wrongfully sent to prison. Despite the terrible conditions, Andy never loses hope and continues to find ways to make life better for himself and the other prisoners. What I love most about this movie is its powerful message about hope and perseverance. It shows that no matter how difficult your situation is, you should never give up. The friendship between Andy and Red is deeply touching and reminds us of the importance of human connection. I would highly recommend this movie to anyone because it inspires you to stay strong and believe that good things can happen even in the darkest times.",
      minWords: 50,
    },
    {
      topic: "Online Learning vs. Classroom Learning",
      zh: "線上學習與教室學習的比較",
      prompts: [
        "What are the advantages of online learning?",
        "What are the advantages of traditional classroom learning?",
        "Which method do you prefer and why?",
      ],
      vocabulary: ["flexibility", "interaction", "self-discipline", "convenient", "engagement", "collaboration", "effective"],
      sampleAnswer: "Both online learning and classroom learning have their own advantages. Online learning offers great flexibility, allowing students to study at their own pace and from the comfort of their homes. It is especially helpful for students who live far from schools or have busy schedules. However, traditional classroom learning provides more opportunities for direct interaction with teachers and classmates. Students can ask questions immediately and participate in group discussions, which makes learning more engaging. Personally, I prefer a combination of both methods. I enjoy the convenience of watching online lectures, but I also value the social aspect of being in a classroom. I believe the best approach is to use online tools to supplement traditional education.",
      minWords: 50,
    },
    {
      topic: "The Role of Music in Our Lives",
      zh: "音樂在我們生活中的角色",
      prompts: [
        "What kind of music do you listen to?",
        "How does music affect your mood and emotions?",
        "Do you think music education is important? Why or why not?",
      ],
      vocabulary: ["melody", "rhythm", "emotion", "inspiration", "creativity", "performance", "genre"],
      sampleAnswer: "Music plays a significant role in my daily life. I listen to a variety of genres, including pop, rock, and classical music, depending on my mood. When I feel stressed after exams, listening to soft piano music helps me relax and calm down. On the other hand, upbeat pop songs give me energy when I exercise or do chores. I strongly believe that music education is important for young people. Learning to play an instrument or sing in a choir develops discipline, creativity, and teamwork skills. Moreover, music allows people to express emotions that are sometimes difficult to put into words. Whether we are listening or performing, music has the power to bring people together and enrich our lives in countless ways.",
      minWords: 50,
    },
    {
      topic: "How to Reduce Stress",
      zh: "如何減輕壓力",
      prompts: [
        "What are the common causes of stress for students?",
        "What methods do you use to deal with stress?",
        "What advice would you give to someone who is feeling stressed?",
      ],
      vocabulary: ["pressure", "anxiety", "relaxation", "cope", "mental health", "balance", "support"],
      sampleAnswer: "Stress is a common problem for students, especially during exam season. The pressure to get good grades, combined with heavy homework loads and high expectations from parents, can make students feel overwhelmed. Personally, I cope with stress by exercising regularly and talking to friends about my worries. Going for a walk or listening to music also helps me clear my mind. For anyone who is feeling stressed, I would suggest taking short breaks while studying and not trying to do everything at once. It is important to get enough sleep and maintain a healthy lifestyle. Talking to a trusted friend, family member, or school counselor can also be very helpful. Remember that it is okay to ask for help when you need it.",
      minWords: 50,
    },
    {
      topic: "The Importance of Learning English",
      zh: "學習英語的重要性",
      prompts: [
        "Why is English important in today's world?",
        "How do you practice and improve your English?",
        "What challenges do you face when learning English?",
      ],
      vocabulary: ["global language", "communication", "fluency", "vocabulary", "practice", "opportunity", "confidence"],
      sampleAnswer: "English is one of the most widely spoken languages in the world and has become essential for international communication. Whether we are traveling, doing business, or accessing information online, English is often the common language people use. I practice my English by reading English articles, watching movies with English subtitles, and speaking with my classmates during English class. One of the biggest challenges I face is expanding my vocabulary and using correct grammar in writing. Sometimes I feel embarrassed about making mistakes when speaking. However, I have learned that making mistakes is a natural part of the learning process. I believe that with consistent practice and a positive attitude, anyone can improve their English skills and gain more confidence.",
      minWords: 50,
    },
    {
      topic: "Volunteering and Community Service",
      zh: "志工服務與社區服務",
      prompts: [
        "Have you ever done any volunteer work?",
        "What are the benefits of volunteering for both the community and the volunteer?",
        "Why should more young people get involved in volunteer work?",
      ],
      vocabulary: ["volunteer", "community", "contribute", "compassion", "teamwork", "responsibility", "impact"],
      sampleAnswer: "Last year, I volunteered at a local animal shelter on weekends for three months. My main job was to help feed the animals and keep their living spaces clean. Although the work was tiring, it was also incredibly rewarding. Volunteering benefits the community by providing help to those who need it most. At the same time, it helps volunteers develop important skills such as teamwork, responsibility, and compassion. I believe more young people should get involved in volunteer work because it allows us to make a positive impact on society while also learning about ourselves. It opens our eyes to the challenges others face and teaches us to be grateful for what we have. Volunteering is truly a win-win experience for everyone involved.",
      minWords: 50,
    },
    {
      topic: "Living in the City vs. the Countryside",
      zh: "住在城市與鄉下的比較",
      prompts: [
        "What are the advantages and disadvantages of living in a city?",
        "What are the advantages and disadvantages of living in the countryside?",
        "Where would you prefer to live and why?",
      ],
      vocabulary: ["convenient", "transportation", "peaceful", "opportunity", "pollution", "nature", "lifestyle"],
      sampleAnswer: "Living in the city and the countryside each has its own advantages and disadvantages. City life is convenient because there are many shops, restaurants, and entertainment options nearby. Public transportation is well-developed, and there are more job and educational opportunities. However, cities often suffer from air pollution, noise, and heavy traffic. In contrast, the countryside offers a peaceful and relaxing environment surrounded by nature. The air is cleaner, and the pace of life is slower. The downside is that there are fewer schools, hospitals, and job opportunities in rural areas. Personally, I would prefer to live in a city during my younger years for career and educational purposes, and then move to the countryside after retirement to enjoy a quieter lifestyle.",
      minWords: 50,
    },
    {
      topic: "Technology and Education",
      zh: "科技與教育",
      prompts: [
        "How has technology changed the way students learn?",
        "What are the benefits of using technology in the classroom?",
        "Are there any risks or drawbacks of relying too much on technology for learning?",
      ],
      vocabulary: ["digital", "innovative", "access", "distraction", "resource", "efficient", "interactive"],
      sampleAnswer: "Technology has transformed education in many exciting ways. Students now have access to a vast amount of information through the internet, making research faster and easier than ever before. Digital tools such as educational apps, interactive videos, and online quizzes make learning more engaging and fun. Teachers can also use technology to create innovative lesson plans and provide immediate feedback to students. However, there are some risks to relying too heavily on technology. Students may become distracted by social media or games during class. Additionally, too much screen time can cause eye strain and reduce physical activity. I believe technology should be used as a tool to enhance learning, not replace traditional teaching methods. When used wisely, technology can help students learn more efficiently and prepare them for the digital world.",
      minWords: 50,
    },
    {
      topic: "My Goals for the Future",
      zh: "我對未來的目標",
      prompts: [
        "What are your short-term and long-term goals?",
        "What motivates you to work toward these goals?",
        "What obstacles might you face, and how will you overcome them?",
        "How do you plan to make a positive impact on society?",
      ],
      vocabulary: ["ambition", "determination", "obstacle", "motivation", "accomplish", "contribute", "perseverance"],
      sampleAnswer: "I have both short-term and long-term goals that guide my daily decisions. In the short term, I want to improve my English proficiency and score well on the GEPT intermediate test. My long-term goal is to study abroad and eventually work in the field of international business. What motivates me is the desire to broaden my horizons and experience different cultures. I know that achieving these goals will not be easy. I might face financial difficulties and the challenge of adapting to a new environment. However, I plan to overcome these obstacles through hard work, careful planning, and seeking help from my family and mentors. Ultimately, I hope to use my knowledge and experience to contribute to society by helping promote cultural exchange and understanding between countries.",
      minWords: 50,
    },
  ],
};
