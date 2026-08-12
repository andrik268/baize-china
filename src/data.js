export const programs = [
  {
    slug: "chengdu",
    title: "Лагерь в Чэнду",
    meta: "8-16 лет | 9 дней",
    description: "Погружение в семью, язык, культуру и традиции Китая.",
    image: "/assets/chengdu-family.webp",
    cardImage: "/assets/cards/chengdu-family.webp",
    fit: "Культура и первая самостоятельная поездка",
  },
  {
    slug: "yingkou-beijing",
    title: "Инкоу - Пекин",
    meta: "Лето | дети и взрослые",
    description: "Море, языковая практика и Universal Beijing.",
    image: "/assets/hainan-language.webp",
    cardImage: "/assets/cards/hainan-language.webp",
    fit: "Отдых, язык и семейная программа",
  },
  {
    slug: "shenzhen",
    title: "Шэньчжэнь",
    meta: "10-17 лет",
    description: "Научно-технический лагерь «Скоростной дрон» и Гонконг.",
    image: "/assets/shenzhen-drone.webp",
    cardImage: "/assets/cards/shenzhen-drone.webp",
    fit: "Технологии, дроны, робототехника и IT",
  },
  {
    slug: "harbin",
    title: "Харбин",
    meta: "16+",
    description: "Стажировка в Харбинском политехническом университете.",
    image: "/assets/hero-campus.webp",
    cardImage: "/assets/cards/hero-campus.webp",
    fit: "Поступление и знакомство с университетом",
  },
  {
    slug: "hangzhou",
    title: "Ханчжоу",
    meta: "16+ | 3,5 недели",
    description: "Языковая стажировка в одном из образовательных центров Китая.",
    image: "/assets/hero-campus.webp",
    cardImage: "/assets/cards/hero-campus.webp",
    fit: "Языковая практика и университетская среда",
  },
  {
    slug: "hainan",
    title: "Хайнань",
    meta: "12+ | дети и взрослые",
    description: "Китайский язык у моря и программа для всей семьи.",
    image: "/assets/hainan-language.webp",
    cardImage: "/assets/cards/hainan-language.webp",
    fit: "Семья, мягкий старт и оздоровительный отдых",
  },
];

export const quizSteps = [
  {
    id: "who",
    title: "Для кого подбираем поездку?",
    options: [
      "Ребёнок 8-12 лет",
      "Подросток 13-15 лет",
      "Старшеклассник или студент 16+",
      "Едем всей семьёй",
    ],
  },
  {
    id: "goal",
    title: "Какая главная цель поездки?",
    options: [
      "Подтянуть китайский или английский",
      "Отдохнуть: море, парки, экскурсии",
      "Поступление в вуз Китая",
      "Технологии: дроны, робототехника, IT",
      "Погрузиться в культуру: традиции, еда, язык",
    ],
  },
  {
    id: "when",
    title: "Когда планируете поездку?",
    options: [
      "Летние каникулы",
      "Осенние каникулы",
      "Зимние каникулы",
      "Весенние каникулы",
      "Пока присматриваюсь, расскажите обо всех вариантах",
    ],
  },
  {
    id: "experience",
    title: "Ездил ли ребёнок за границу без родителей?",
    options: [
      "Да, уже ездил",
      "Ездил, но только с родителями",
      "Нет, это будет первая поездка",
      "Планируем ехать вместе с ребёнком",
    ],
  },
  {
    id: "priority",
    title: "Что для вас важнее всего при выборе?",
    options: [
      "Безопасность и сопровождение 24/7",
      "Сильная языковая программа",
      "Интересные экскурсии и развлечения",
      "Комфортная цена и условия «всё включено»",
      "Виза и документы под ключ",
    ],
  },
];

export function recommendProgram(answers) {
  const who = answers.who || "";
  const goal = answers.goal || "";
  const when = answers.when || "";

  if (who.includes("семьёй")) return programs.find((item) => item.slug === "hainan");
  if (goal.includes("Технологии")) return programs.find((item) => item.slug === "shenzhen");
  if (goal.includes("Поступление") || who.includes("16+")) {
    return programs.find((item) => item.slug === "harbin");
  }
  if (goal.includes("культуру") || when.includes("Осенние") || when.includes("Весенние")) {
    return programs.find((item) => item.slug === "chengdu");
  }
  return programs.find((item) => item.slug === "yingkou-beijing");
}

export const universitySteps = [
  ["Бесплатная консультация", "Разбираем ваш профиль, цели и бюджет. Предлагаем 3-5 вариантов университетов."],
  ["Подготовка документов", "Собираем пакет по чек-листу вуза, переводим и заверяем."],
  ["Подача заявки", "Регистрируем вас в системе вуза и стипендиальных программах CSC или CIS."],
  ["Получение приглашения", "Контролируем статус заявки и остаёмся на связи."],
  ["Виза и вылет", "Помогаем оформить визу, билеты, встречу и заселение."],
];

export const visaSteps = [
  ["Консультация", "Определяем подходящий тип визы, сроки и стоимость."],
  ["Документы по чек-листу", "Присылаем понятный список и подсказываем, где взять справки."],
  ["Анкета и подача", "Заполняем онлайн-анкету и записываем в визовый центр."],
  ["Контроль результата", "Следим за сроками и передаём паспорт с готовой визой."],
];
