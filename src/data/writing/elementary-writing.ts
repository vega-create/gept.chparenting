// GEPT Elementary Writing Practice Data
// Level: 初級 (~2000 words, 國中程度)

export const ELEM_WRITING = {
  // ============================================================
  // Sentence Reorder (60 items)
  // Words in CORRECT order; UI will shuffle them for the student
  // ============================================================
  sentenceReorder: [
    // --- Daily Life ---
    { parts: ["I", "like", "to", "play", "basketball"], zh: "我喜歡打籃球" },
    { parts: ["She", "goes", "to", "school", "by", "bus"], zh: "她搭公車去上學" },
    { parts: ["We", "eat", "lunch", "at", "twelve", "o'clock"], zh: "我們十二點吃午餐" },
    { parts: ["He", "brushes", "his", "teeth", "every", "morning"], zh: "他每天早上刷牙" },
    { parts: ["My", "mother", "cooks", "dinner", "for", "us"], zh: "我媽媽為我們煮晚餐" },
    { parts: ["I", "take", "a", "shower", "before", "bed"], zh: "我睡前洗澡" },
    { parts: ["They", "walk", "to", "the", "park", "together"], zh: "他們一起走路去公園" },
    { parts: ["She", "wakes", "up", "at", "seven", "every", "day"], zh: "她每天七點起床" },
    { parts: ["I", "do", "my", "homework", "after", "dinner"], zh: "我晚餐後做功課" },
    { parts: ["He", "watches", "TV", "on", "the", "sofa"], zh: "他在沙發上看電視" },

    // --- School ---
    { parts: ["The", "teacher", "is", "very", "nice"], zh: "老師人很好" },
    { parts: ["We", "have", "math", "class", "on", "Monday"], zh: "我們星期一有數學課" },
    { parts: ["My", "favorite", "subject", "is", "English"], zh: "我最喜歡的科目是英文" },
    { parts: ["There", "are", "thirty", "students", "in", "my", "class"], zh: "我的班上有三十個學生" },
    { parts: ["She", "reads", "books", "in", "the", "library"], zh: "她在圖書館看書" },
    { parts: ["The", "students", "study", "hard", "for", "the", "test"], zh: "學生們為了考試努力讀書" },
    { parts: ["I", "bring", "my", "lunch", "to", "school"], zh: "我帶午餐去學校" },
    { parts: ["He", "sits", "next", "to", "me", "in", "class"], zh: "他在班上坐在我旁邊" },
    { parts: ["We", "play", "soccer", "after", "school"], zh: "我們放學後踢足球" },
    { parts: ["Our", "school", "has", "a", "big", "playground"], zh: "我們學校有一個大操場" },

    // --- Family ---
    { parts: ["My", "father", "works", "in", "an", "office"], zh: "我爸爸在辦公室工作" },
    { parts: ["I", "have", "one", "brother", "and", "one", "sister"], zh: "我有一個哥哥和一個姊姊" },
    { parts: ["My", "grandmother", "lives", "in", "the", "country"], zh: "我奶奶住在鄉下" },
    { parts: ["We", "visit", "our", "grandparents", "on", "weekends"], zh: "我們週末去看祖父母" },
    { parts: ["My", "sister", "is", "taller", "than", "me"], zh: "我姊姊比我高" },
    { parts: ["Dad", "drives", "us", "to", "school", "every", "day"], zh: "爸爸每天開車送我們去學校" },
    { parts: ["My", "family", "has", "dinner", "together", "every", "night"], zh: "我們家每天晚上一起吃晚餐" },
    { parts: ["My", "mom", "makes", "the", "best", "cake"], zh: "我媽媽做最好吃的蛋糕" },

    // --- Hobbies ---
    { parts: ["I", "enjoy", "listening", "to", "music"], zh: "我喜歡聽音樂" },
    { parts: ["She", "likes", "to", "draw", "pictures"], zh: "她喜歡畫圖" },
    { parts: ["He", "plays", "the", "piano", "every", "day"], zh: "他每天彈鋼琴" },
    { parts: ["We", "go", "swimming", "in", "the", "summer"], zh: "我們夏天去游泳" },
    { parts: ["They", "ride", "bikes", "in", "the", "park"], zh: "他們在公園裡騎腳踏車" },
    { parts: ["I", "like", "to", "take", "photos"], zh: "我喜歡拍照" },
    { parts: ["She", "collects", "stamps", "from", "different", "countries"], zh: "她收集不同國家的郵票" },
    { parts: ["He", "enjoys", "playing", "video", "games"], zh: "他喜歡玩電動遊戲" },

    // --- Food ---
    { parts: ["I", "want", "a", "glass", "of", "juice"], zh: "我想要一杯果汁" },
    { parts: ["She", "eats", "an", "apple", "every", "day"], zh: "她每天吃一顆蘋果" },
    { parts: ["We", "had", "pizza", "for", "lunch", "today"], zh: "我們今天午餐吃披薩" },
    { parts: ["He", "does", "not", "like", "vegetables"], zh: "他不喜歡蔬菜" },
    { parts: ["My", "favorite", "food", "is", "fried", "chicken"], zh: "我最喜歡的食物是炸雞" },
    { parts: ["Would", "you", "like", "some", "tea"], zh: "你想喝一些茶嗎" },
    { parts: ["The", "cake", "looks", "really", "delicious"], zh: "那個蛋糕看起來很好吃" },
    { parts: ["I", "am", "hungry", "and", "want", "some", "noodles"], zh: "我很餓，想吃一些麵" },

    // --- Weather ---
    { parts: ["It", "is", "sunny", "and", "warm", "today"], zh: "今天天氣晴朗又溫暖" },
    { parts: ["It", "rains", "a", "lot", "in", "spring"], zh: "春天常常下雨" },
    { parts: ["The", "weather", "is", "very", "cold", "today"], zh: "今天天氣很冷" },
    { parts: ["We", "cannot", "go", "outside", "because", "it", "is", "raining"], zh: "我們不能出去因為在下雨" },
    { parts: ["I", "like", "to", "play", "in", "the", "snow"], zh: "我喜歡在雪中玩" },
    { parts: ["She", "always", "brings", "an", "umbrella"], zh: "她總是帶雨傘" },

    // --- Animals ---
    { parts: ["I", "have", "a", "cute", "little", "dog"], zh: "我有一隻可愛的小狗" },
    { parts: ["The", "cat", "is", "sleeping", "on", "the", "chair"], zh: "貓咪在椅子上睡覺" },
    { parts: ["Birds", "sing", "in", "the", "trees", "every", "morning"], zh: "鳥兒每天早上在樹上唱歌" },
    { parts: ["He", "wants", "to", "have", "a", "pet", "rabbit"], zh: "他想要養一隻寵物兔子" },
    { parts: ["The", "fish", "are", "swimming", "in", "the", "pond"], zh: "魚兒在池塘裡游泳" },
    { parts: ["My", "dog", "likes", "to", "run", "in", "the", "park"], zh: "我的狗喜歡在公園跑步" },
    { parts: ["We", "saw", "many", "animals", "at", "the", "zoo"], zh: "我們在動物園看到很多動物" },
    { parts: ["Her", "hamster", "is", "small", "and", "brown"], zh: "她的倉鼠又小又棕色" },

    // --- Mixed / Other ---
    { parts: ["Can", "you", "help", "me", "with", "this"], zh: "你可以幫我嗎" },
    { parts: ["I", "am", "going", "to", "the", "store"], zh: "我要去商店" },
  ],

  // ============================================================
  // Translation (40 items)
  // Chinese -> English; keywords and hint assist the learner
  // ============================================================
  translation: [
    // --- Daily Life ---
    { zh: "她每天走路去上學。", answer: "She walks to school every day.", keywords: ["walks", "school", "every day"], hint: "walks / school / every day" },
    { zh: "我早上七點起床。", answer: "I get up at seven in the morning.", keywords: ["get up", "seven", "morning"], hint: "get up / seven / morning" },
    { zh: "他們在公園裡跑步。", answer: "They run in the park.", keywords: ["run", "park"], hint: "run / park" },
    { zh: "我媽媽正在煮晚餐。", answer: "My mother is cooking dinner.", keywords: ["mother", "cooking", "dinner"], hint: "mother / cooking / dinner" },
    { zh: "請打開窗戶。", answer: "Please open the window.", keywords: ["please", "open", "window"], hint: "please / open / window" },
    { zh: "我每天晚上九點睡覺。", answer: "I go to bed at nine every night.", keywords: ["go to bed", "nine", "every night"], hint: "go to bed / nine / every night" },
    { zh: "他正在洗手。", answer: "He is washing his hands.", keywords: ["washing", "hands"], hint: "washing / hands" },
    { zh: "我們需要去超市買東西。", answer: "We need to go to the supermarket to buy things.", keywords: ["need", "supermarket", "buy"], hint: "need / supermarket / buy" },

    // --- School ---
    { zh: "今天有英文考試。", answer: "There is an English test today.", keywords: ["English test", "today"], hint: "English test / today" },
    { zh: "我最喜歡的科目是數學。", answer: "My favorite subject is math.", keywords: ["favorite", "subject", "math"], hint: "favorite / subject / math" },
    { zh: "老師正在教我們新的單字。", answer: "The teacher is teaching us new words.", keywords: ["teacher", "teaching", "new words"], hint: "teacher / teaching / new words" },
    { zh: "我把書忘在學校了。", answer: "I left my book at school.", keywords: ["left", "book", "school"], hint: "left / book / school" },
    { zh: "請翻開課本第十頁。", answer: "Please turn to page ten of the textbook.", keywords: ["turn to", "page ten", "textbook"], hint: "turn to / page ten / textbook" },
    { zh: "我們班有三十個學生。", answer: "There are thirty students in our class.", keywords: ["thirty", "students", "class"], hint: "thirty / students / class" },

    // --- Family ---
    { zh: "我爸爸在銀行工作。", answer: "My father works at a bank.", keywords: ["father", "works", "bank"], hint: "father / works / bank" },
    { zh: "她有兩個弟弟。", answer: "She has two younger brothers.", keywords: ["has", "two", "younger brothers"], hint: "has / two / younger brothers" },
    { zh: "我的祖父母住在台南。", answer: "My grandparents live in Tainan.", keywords: ["grandparents", "live", "Tainan"], hint: "grandparents / live / Tainan" },
    { zh: "我哥哥比我高很多。", answer: "My brother is much taller than me.", keywords: ["brother", "much taller", "than me"], hint: "brother / much taller / than me" },
    { zh: "我們全家週末一起去爬山。", answer: "Our whole family goes hiking together on weekends.", keywords: ["whole family", "hiking", "weekends"], hint: "whole family / hiking / weekends" },

    // --- Hobbies ---
    { zh: "我喜歡在週末看電影。", answer: "I like to watch movies on weekends.", keywords: ["like", "watch movies", "weekends"], hint: "like / watch movies / weekends" },
    { zh: "她每天練習彈鋼琴。", answer: "She practices playing the piano every day.", keywords: ["practices", "piano", "every day"], hint: "practices / piano / every day" },
    { zh: "他放學後打棒球。", answer: "He plays baseball after school.", keywords: ["plays", "baseball", "after school"], hint: "plays / baseball / after school" },
    { zh: "我的嗜好是集郵。", answer: "My hobby is collecting stamps.", keywords: ["hobby", "collecting", "stamps"], hint: "hobby / collecting / stamps" },

    // --- Food ---
    { zh: "我想要一杯牛奶。", answer: "I want a glass of milk.", keywords: ["want", "glass", "milk"], hint: "want / glass / milk" },
    { zh: "這個蘋果很甜。", answer: "This apple is very sweet.", keywords: ["apple", "very", "sweet"], hint: "apple / very / sweet" },
    { zh: "午餐我們吃了炒飯。", answer: "We had fried rice for lunch.", keywords: ["had", "fried rice", "lunch"], hint: "had / fried rice / lunch" },
    { zh: "她不喜歡吃辣的食物。", answer: "She does not like to eat spicy food.", keywords: ["does not like", "eat", "spicy food"], hint: "does not like / eat / spicy food" },
    { zh: "你想喝什麼飲料？", answer: "What drink would you like?", keywords: ["what", "drink", "would you like"], hint: "what / drink / would you like" },

    // --- Weather ---
    { zh: "今天天氣很熱。", answer: "It is very hot today.", keywords: ["very hot", "today"], hint: "very hot / today" },
    { zh: "明天會下雨。", answer: "It will rain tomorrow.", keywords: ["will", "rain", "tomorrow"], hint: "will / rain / tomorrow" },
    { zh: "冬天的時候常常很冷。", answer: "It is often cold in winter.", keywords: ["often", "cold", "winter"], hint: "often / cold / winter" },
    { zh: "記得帶雨傘出門。", answer: "Remember to bring an umbrella when you go out.", keywords: ["remember", "bring", "umbrella"], hint: "remember / bring / umbrella" },

    // --- Animals ---
    { zh: "我的狗很喜歡玩球。", answer: "My dog really likes to play with balls.", keywords: ["dog", "likes", "play", "balls"], hint: "dog / likes / play / balls" },
    { zh: "那隻貓正在桌子下面睡覺。", answer: "That cat is sleeping under the table.", keywords: ["cat", "sleeping", "under", "table"], hint: "cat / sleeping / under / table" },
    { zh: "我在動物園看到一隻大象。", answer: "I saw an elephant at the zoo.", keywords: ["saw", "elephant", "zoo"], hint: "saw / elephant / zoo" },

    // --- Other ---
    { zh: "請問洗手間在哪裡？", answer: "Excuse me, where is the restroom?", keywords: ["excuse me", "where", "restroom"], hint: "excuse me / where / restroom" },
    { zh: "我的生日是三月五號。", answer: "My birthday is on March fifth.", keywords: ["birthday", "March", "fifth"], hint: "birthday / March / fifth" },
    { zh: "這件衣服多少錢？", answer: "How much is this piece of clothing?", keywords: ["how much", "piece", "clothing"], hint: "how much / piece / clothing" },
    { zh: "你可以說慢一點嗎？", answer: "Can you speak more slowly?", keywords: ["can", "speak", "more slowly"], hint: "can / speak / more slowly" },
    { zh: "圖書館在學校旁邊。", answer: "The library is next to the school.", keywords: ["library", "next to", "school"], hint: "library / next to / school" },
  ],

  // ============================================================
  // Paragraph Order (20 items)
  // Sentences in CORRECT order; UI will shuffle for the student
  // ============================================================
  paragraphOrder: [
    {
      title: "My Morning Routine",
      sentences: [
        "I wake up at six o'clock every morning.",
        "I brush my teeth and wash my face.",
        "Then I eat breakfast with my family.",
        "After breakfast, I go to school by bus."
      ],
      zh: "我的早晨日常"
    },
    {
      title: "My Pet Dog",
      sentences: [
        "I have a dog named Lucky.",
        "Lucky is white and very friendly.",
        "I walk him in the park every afternoon.",
        "He likes to run and play with other dogs.",
        "Lucky is my best friend."
      ],
      zh: "我的寵物狗"
    },
    {
      title: "A Day at School",
      sentences: [
        "I arrive at school at seven thirty.",
        "First, we have a morning meeting in our classroom.",
        "Then we have four classes before lunch.",
        "After lunch, we play on the playground.",
        "School ends at four o'clock."
      ],
      zh: "學校的一天"
    },
    {
      title: "My Family",
      sentences: [
        "There are five people in my family.",
        "My parents both work in the city.",
        "My older sister is a college student.",
        "My younger brother is in elementary school.",
        "We all love spending time together."
      ],
      zh: "我的家庭"
    },
    {
      title: "Going to the Night Market",
      sentences: [
        "Last Saturday, my family went to the night market.",
        "There were many food stands and game stalls.",
        "I ate stinky tofu and bubble tea.",
        "My brother played a balloon game and won a prize.",
        "We had a wonderful time and went home at ten."
      ],
      zh: "去夜市"
    },
    {
      title: "My Favorite Season",
      sentences: [
        "My favorite season is summer.",
        "In summer, the weather is hot and sunny.",
        "I can go swimming with my friends.",
        "We also eat a lot of ice cream.",
        "I love summer vacation the most."
      ],
      zh: "我最喜歡的季節"
    },
    {
      title: "A Birthday Party",
      sentences: [
        "Yesterday was my friend Amy's birthday.",
        "We went to her house after school.",
        "Her mother made a big chocolate cake.",
        "We sang happy birthday and gave her presents.",
        "It was a very fun party."
      ],
      zh: "生日派對"
    },
    {
      title: "My Bedroom",
      sentences: [
        "My bedroom is small but comfortable.",
        "There is a bed, a desk, and a bookshelf.",
        "I keep my books and toys on the shelf.",
        "The walls are painted light blue.",
        "I like to read in my room before I sleep."
      ],
      zh: "我的房間"
    },
    {
      title: "Going to the Library",
      sentences: [
        "I go to the library every Wednesday after school.",
        "The library is quiet and has many books.",
        "I usually borrow two or three books each time.",
        "I like to read stories about animals and adventures.",
        "Reading helps me learn new words."
      ],
      zh: "去圖書館"
    },
    {
      title: "A Rainy Day",
      sentences: [
        "This morning, it started to rain heavily.",
        "I forgot to bring my umbrella to school.",
        "My classmate shared her umbrella with me.",
        "We walked home together in the rain.",
        "I was glad to have such a kind friend."
      ],
      zh: "雨天"
    },
    {
      title: "My Weekend",
      sentences: [
        "On Saturday morning, I sleep until nine o'clock.",
        "After breakfast, I do my homework first.",
        "In the afternoon, I play basketball with my friends.",
        "On Sunday, my family goes out for dinner.",
        "I enjoy my weekends very much."
      ],
      zh: "我的週末"
    },
    {
      title: "Going Shopping",
      sentences: [
        "My mother and I went shopping last Sunday.",
        "We went to a big department store downtown.",
        "I tried on a new pair of shoes.",
        "My mother bought me a blue jacket.",
        "We also had lunch at a restaurant in the mall."
      ],
      zh: "去逛街"
    },
    {
      title: "My Best Friend",
      sentences: [
        "My best friend's name is David.",
        "We have been friends since first grade.",
        "We like to play computer games together.",
        "He is very good at math and always helps me.",
        "I hope we will be friends forever."
      ],
      zh: "我最好的朋友"
    },
    {
      title: "Visiting Grandparents",
      sentences: [
        "Every Chinese New Year, we visit our grandparents.",
        "They live in a small town in southern Taiwan.",
        "Grandma always cooks many delicious dishes for us.",
        "We get red envelopes and set off firecrackers.",
        "It is my favorite holiday of the year."
      ],
      zh: "拜訪祖父母"
    },
    {
      title: "Learning to Cook",
      sentences: [
        "Last weekend, I learned to cook fried rice.",
        "My mother taught me step by step.",
        "First, I cracked the eggs into a bowl.",
        "Then I put oil in the pan and added rice and vegetables.",
        "The fried rice tasted really good."
      ],
      zh: "學做菜"
    },
    {
      title: "A School Trip",
      sentences: [
        "Our class went on a trip to the science museum.",
        "We took a bus from school in the morning.",
        "There were many interesting things to see inside.",
        "I liked the dinosaur exhibit the most.",
        "We took many photos and had a great day."
      ],
      zh: "校外教學"
    },
    {
      title: "Exercise and Health",
      sentences: [
        "Exercise is very important for our health.",
        "I try to exercise at least three times a week.",
        "Sometimes I jog around the school track.",
        "Other times I play badminton with my classmates.",
        "After exercising, I always feel happy and strong."
      ],
      zh: "運動與健康"
    },
    {
      title: "A Hot Summer Day",
      sentences: [
        "It was very hot yesterday afternoon.",
        "My friends and I decided to go to the swimming pool.",
        "The water was cool and refreshing.",
        "We swam and played in the water for two hours.",
        "After swimming, we ate watermelon together."
      ],
      zh: "炎熱的夏天"
    },
    {
      title: "Helping at Home",
      sentences: [
        "I always help my parents at home.",
        "After dinner, I wash the dishes.",
        "On weekends, I clean my room and take out the trash.",
        "Sometimes I help my dad wash the car.",
        "My parents are happy when I help them."
      ],
      zh: "幫忙做家事"
    },
    {
      title: "The New Student",
      sentences: [
        "A new student joined our class today.",
        "Her name is Lily and she comes from Kaohsiung.",
        "The teacher asked us to be friendly to her.",
        "I showed her around the school at lunchtime.",
        "Now she sits next to me and we are good friends."
      ],
      zh: "新同學"
    },
  ],

  // ============================================================
  // Guided Writing (15 items)
  // Writing prompts with guiding questions, vocabulary, and sample answer
  // ============================================================
  guidedWriting: [
    {
      topic: "My Best Friend",
      zh: "我最好的朋友",
      prompts: [
        "Who is your best friend?",
        "How did you meet?",
        "What do you like to do together?",
        "Why is he or she special to you?"
      ],
      vocabulary: ["friend", "meet", "together", "like", "play", "kind", "funny"],
      sampleAnswer: "My best friend is Lisa. We met in school two years ago. We like to play basketball together after school. She is very kind and funny. She always makes me laugh when I am sad. I am happy to have her as my friend.",
      minWords: 30
    },
    {
      topic: "My Favorite Food",
      zh: "我最喜歡的食物",
      prompts: [
        "What is your favorite food?",
        "How does it taste?",
        "When do you usually eat it?",
        "Who makes it for you?"
      ],
      vocabulary: ["favorite", "delicious", "taste", "cook", "eat", "restaurant"],
      sampleAnswer: "My favorite food is beef noodle soup. It tastes salty and delicious. I usually eat it on weekends. My grandmother makes the best beef noodle soup. She uses fresh vegetables and soft noodles. Every time I eat it, I feel warm and happy.",
      minWords: 30
    },
    {
      topic: "My School",
      zh: "我的學校",
      prompts: [
        "What is the name of your school?",
        "What does your school look like?",
        "What is your favorite place in school?",
        "What do you enjoy most about school?"
      ],
      vocabulary: ["school", "classroom", "playground", "teacher", "student", "study", "building"],
      sampleAnswer: "My school is called Mingde Junior High School. It has many buildings and a big playground. My favorite place is the library because it is quiet and has many interesting books. I enjoy being with my classmates the most. We study together and have fun at lunch time.",
      minWords: 30
    },
    {
      topic: "My Weekend",
      zh: "我的週末",
      prompts: [
        "What do you usually do on Saturday?",
        "What do you do on Sunday?",
        "Do you go out or stay at home?",
        "Who do you spend time with?"
      ],
      vocabulary: ["weekend", "Saturday", "Sunday", "relax", "family", "friends", "enjoy"],
      sampleAnswer: "On Saturday morning, I usually sleep late. After lunch, I play basketball with my friends in the park. On Sunday, I do my homework in the morning. In the afternoon, my family goes out for dinner together. I really enjoy my weekends because I can relax and have fun.",
      minWords: 30
    },
    {
      topic: "My Favorite Animal",
      zh: "我最喜歡的動物",
      prompts: [
        "What is your favorite animal?",
        "What does it look like?",
        "Why do you like it?",
        "Do you have one as a pet?"
      ],
      vocabulary: ["animal", "cute", "friendly", "pet", "fur", "feed", "take care of"],
      sampleAnswer: "My favorite animal is the dog. Dogs are friendly and loyal. They have soft fur and cute eyes. I have a dog at home. His name is Mochi and he is brown and white. I feed him every day and take him for walks. He always makes me happy when I come home.",
      minWords: 30
    },
    {
      topic: "A Happy Memory",
      zh: "一段快樂的回憶",
      prompts: [
        "When did this happen?",
        "Where were you?",
        "What happened?",
        "Why was it a happy memory?"
      ],
      vocabulary: ["remember", "happy", "excited", "together", "special", "wonderful"],
      sampleAnswer: "I remember a happy day last summer. My family went to the beach together. We played in the water and built sandcastles. My dad taught me how to swim in the sea. We ate ice cream and watched the sunset. It was a wonderful day and I will never forget it.",
      minWords: 30
    },
    {
      topic: "My Dream Job",
      zh: "我的夢想職業",
      prompts: [
        "What do you want to be in the future?",
        "Why do you want this job?",
        "What do you need to learn?",
        "How will you work toward your dream?"
      ],
      vocabulary: ["dream", "future", "become", "study", "hard", "help", "important"],
      sampleAnswer: "I want to be a doctor in the future. I want to help sick people get better. To become a doctor, I need to study science and math very hard. I also need to be kind and patient. I will study hard in school every day to make my dream come true.",
      minWords: 30
    },
    {
      topic: "My Hometown",
      zh: "我的家鄉",
      prompts: [
        "Where is your hometown?",
        "What is special about it?",
        "What can people do there?",
        "Do you like living there?"
      ],
      vocabulary: ["hometown", "beautiful", "famous", "temple", "mountain", "people", "live"],
      sampleAnswer: "My hometown is Taichung. It is a big and beautiful city. Taichung is famous for its night markets and bubble tea. There are many parks and temples to visit. People can also go to the science museum. I like living in Taichung because there is always something fun to do.",
      minWords: 30
    },
    {
      topic: "An Unforgettable Trip",
      zh: "一次難忘的旅行",
      prompts: [
        "Where did you go?",
        "Who did you go with?",
        "What did you do there?",
        "What did you like most about the trip?"
      ],
      vocabulary: ["trip", "travel", "visit", "beautiful", "exciting", "scenery", "fun"],
      sampleAnswer: "Last winter vacation, my family took a trip to Hualien. We visited Taroko Gorge and saw beautiful mountains and rivers. We also went to the night market and tried many local foods. I liked the scenery the most because it was so beautiful. I hope I can go there again someday.",
      minWords: 30
    },
    {
      topic: "My Daily Routine",
      zh: "我的日常作息",
      prompts: [
        "What time do you wake up?",
        "What do you do in the morning?",
        "What do you do after school?",
        "What time do you go to bed?"
      ],
      vocabulary: ["wake up", "breakfast", "school", "homework", "dinner", "sleep"],
      sampleAnswer: "I wake up at six thirty every morning. I eat breakfast and then go to school by bus. After school, I go home and do my homework first. Then I have dinner with my family at seven. After dinner, I read books or watch TV. I go to bed at ten o'clock every night.",
      minWords: 30
    },
    {
      topic: "My Favorite Sport",
      zh: "我最喜歡的運動",
      prompts: [
        "What sport do you like most?",
        "How often do you play it?",
        "Who do you play with?",
        "Why do you enjoy this sport?"
      ],
      vocabulary: ["sport", "play", "team", "practice", "win", "exercise", "healthy"],
      sampleAnswer: "My favorite sport is basketball. I play it three times a week after school. I play with my classmates on the school court. We practice shooting and passing together. I enjoy basketball because it is exciting and keeps me healthy. I hope to join the school basketball team someday.",
      minWords: 30
    },
    {
      topic: "A Person I Admire",
      zh: "我敬佩的一個人",
      prompts: [
        "Who do you admire?",
        "What does this person do?",
        "What makes this person special?",
        "What have you learned from this person?"
      ],
      vocabulary: ["admire", "brave", "hardworking", "kind", "learn", "respect"],
      sampleAnswer: "The person I admire most is my mother. She works very hard every day to take care of our family. She cooks for us and helps me with my homework. She is always kind and patient, even when she is tired. I have learned from her that we should never give up. I love and respect my mother very much.",
      minWords: 30
    },
    {
      topic: "If I Had a Superpower",
      zh: "如果我有超能力",
      prompts: [
        "What superpower would you want?",
        "Why would you choose this power?",
        "What would you do with it?",
        "How would it change your life?"
      ],
      vocabulary: ["superpower", "fly", "invisible", "strong", "help", "world", "wish"],
      sampleAnswer: "If I had a superpower, I would want to fly. I choose this power because I love looking at the sky. If I could fly, I would travel to many countries without taking an airplane. I would also fly to school every day so I would never be late. It would make my life very exciting and fun.",
      minWords: 30
    },
    {
      topic: "My Favorite Holiday",
      zh: "我最喜歡的節日",
      prompts: [
        "What is your favorite holiday?",
        "When is this holiday?",
        "How do you celebrate it?",
        "Why do you like it?"
      ],
      vocabulary: ["holiday", "celebrate", "family", "gift", "special", "tradition", "happy"],
      sampleAnswer: "My favorite holiday is Chinese New Year. It is in January or February. My family gets together at my grandparents' house. We eat a big dinner and watch fireworks at night. The children get red envelopes with money inside. I like Chinese New Year because everyone is happy and we can be together as a family.",
      minWords: 30
    },
    {
      topic: "How I Use Technology",
      zh: "我如何使用科技",
      prompts: [
        "What technology do you use every day?",
        "What do you use it for?",
        "Does technology help you learn?",
        "Should students use technology more or less?"
      ],
      vocabulary: ["technology", "computer", "phone", "internet", "learn", "search", "useful"],
      sampleAnswer: "I use a computer and a phone every day. I use the computer to do homework and search for information on the internet. I also use my phone to talk to my friends and listen to English songs. Technology helps me learn new things and practice English. I think students should use technology wisely and not spend too much time playing games.",
      minWords: 30
    },
  ],
};
