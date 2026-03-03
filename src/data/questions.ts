import { Question } from '../types/grammar';

export const QUESTIONS: Question[] = [
  {
    id: '1',
    sentence: 'The old man ______ son is a doctor lives alone in the countryside.',
    options: ['whose', 'who', 'whom', 'that'],
    correctAnswer: 'whose',
    explanation: {
      rule: 'whose 引导定语从句，在从句中作定语，表示“……的”。这里指“那个老人的儿子”。',
      example: 'I know the girl whose mother is a famous singer.',
      commonMistake: '容易误用 who，但 who 在从句中只能作主语或宾语。'
    },
    difficulty: '中级',
    category: '定语从句'
  },
  {
    id: '2',
    sentence: 'I was so busy that I had no choice but ______ the meeting.',
    options: ['to cancel', 'canceling', 'cancel', 'canceled'],
    correctAnswer: 'to cancel',
    explanation: {
      rule: 'have no choice but to do sth. 是固定搭配，意为“别无选择只能做某事”。',
      example: 'We had no choice but to wait for the rain to stop.',
      commonMistake: '容易受 but 后接不带 to 的不定式干扰，但 have no choice but 必须带 to。'
    },
    difficulty: '中级',
    category: '非谓语动词'
  },
  {
    id: '3',
    sentence: 'The teacher asked the students ______ they had finished the project.',
    options: ['whether', 'that', 'what', 'which'],
    correctAnswer: 'whether',
    explanation: {
      rule: 'whether 引导宾语从句，表示“是否”。that 引导宾语从句时不表示具体意义。',
      example: 'I wonder whether he will come to the party.',
      commonMistake: '在疑问语气的动词（如 ask, wonder）后，通常用 whether 或 if。'
    },
    difficulty: '中级',
    category: '名词性从句'
  },
  {
    id: '4',
    sentence: 'It is such a beautiful day ______ we all want to go out for a walk.',
    options: ['that', 'which', 'as', 'than'],
    correctAnswer: 'that',
    explanation: {
      rule: 'such...that... 引导结果状语从句，意为“如此……以至于……”。注意 such 修饰名词短语。',
      example: 'It was such a cold day that the river froze.',
      commonMistake: '容易与 so...that 混淆，so 修饰形容词或副词。'
    },
    difficulty: '初级',
    category: '状语从句'
  },
  {
    id: '5',
    sentence: 'The problem ______ at the meeting yesterday is very important.',
    options: ['discussed', 'discussing', 'to discuss', 'discuss'],
    correctAnswer: 'discussed',
    explanation: {
      rule: '过去分词（discussed）作后置定语，表示被动和完成。意为“昨天会上讨论的那个问题”。',
      example: 'The bridge built last year is very strong.',
      commonMistake: '误用 discussing，但问题是被讨论的，应用被动形式。'
    },
    difficulty: '高级',
    category: '非谓语动词'
  },
  {
    id: '6',
    sentence: 'I wish I ______ a bird so that I could fly in the sky.',
    options: ['were', 'am', 'was', 'be'],
    correctAnswer: 'were',
    explanation: {
      rule: 'wish 后的宾语从句使用虚拟语气。表示与现在事实相反时，谓语动词用过去式（be 动词通常用 were）。',
      example: 'I wish I knew the answer.',
      commonMistake: '口语中常用 was，但在正式语法和考试中应使用 were。'
    },
    difficulty: '高级',
    category: '名词性从句'
  },
  {
    id: '7',
    sentence: 'This is the very book ______ I have been looking for these days.',
    options: ['that', 'which', 'who', 'whom'],
    correctAnswer: 'that',
    explanation: {
      rule: '当先行词被 the very, the only, the same 等修饰时，定语从句的引导词只能用 that，不能用 which。',
      example: 'This is the only thing that I can do for you.',
      commonMistake: '习惯性使用 which，忽略了 the very 的限制。'
    },
    difficulty: '中级',
    category: '定语从句'
  },
  {
    id: '8',
    sentence: 'Not only ______ interested in football, but also he plays it well.',
    options: ['is he', 'he is', 'does he', 'he does'],
    correctAnswer: 'is he',
    explanation: {
      rule: 'Not only...but also... 连接两个句子时，前一个句子要用部分倒装。',
      example: 'Not only can he speak English, but also he can speak French.',
      commonMistake: '忽略倒装要求，直接使用陈述语序。'
    },
    difficulty: '高级',
    category: '连词'
  },
  {
    id: '9',
    sentence: 'I don\'t know ______ to solve the difficult math problem.',
    options: ['how', 'what', 'which', 'whether'],
    correctAnswer: 'how',
    explanation: {
      rule: '“疑问词 + 不定式”结构在句中作宾语。how 表示方式，意为“如何解决”。',
      example: 'Could you tell me how to get to the station?',
      commonMistake: '误选 what，但 solve 是及物动词，后面已有宾语 problem，故缺状语 how。'
    },
    difficulty: '初级',
    category: '非谓语动词'
  },
  {
    id: '10',
    sentence: '______ you work hard, you will never achieve your goal.',
    options: ['Unless', 'If', 'Since', 'Because'],
    correctAnswer: 'Unless',
    explanation: {
      rule: 'Unless 引导条件状语从句，相当于 if...not，意为“除非，如果不”。',
      example: 'I won\'t go unless you go with me.',
      commonMistake: '逻辑判断错误，误选 if。'
    },
    difficulty: '中级',
    category: '状语从句'
  },
  {
    id: '11',
    sentence: 'The reason ______ he was late was that he missed the bus.',
    options: ['why', 'that', 'because', 'which'],
    correctAnswer: 'why',
    explanation: {
      rule: 'the reason 为先行词，在定语从句中作原因状语，引导词用 why。',
      example: 'That is the reason why I like English.',
      commonMistake: '受中文思维影响误选 because，但定语从句中应用关系副词。'
    },
    difficulty: '中级',
    category: '定语从句'
  },
  {
    id: '12',
    sentence: 'It was in the park ______ I met my primary school teacher.',
    options: ['that', 'where', 'which', 'when'],
    correctAnswer: 'that',
    explanation: {
      rule: '强调句型：It is/was + 被强调部分 + that/who + 其他。本句强调地点状语 in the park。',
      example: 'It was yesterday that I saw him.',
      commonMistake: '看到地点就想选 where，但强调句型固定使用 that。'
    },
    difficulty: '高级',
    category: '名词性从句'
  }
];

