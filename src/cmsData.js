export const CMS_STORAGE_KEY = "baize-cms-data-v1";
export const CMS_SESSION_KEY = "baize-cms-session-v1";
export const ADMIN_LOGIN = "admin@site.local";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

import { programs, quizSteps, faqGroups, universitySteps, universityGroups, visaSteps } from "./data.js";

const image = (path, alt = "") => ({ path, alt });
const mapProgram = (program) => ({ ...program, image: image(program.image, program.title), cardImage: image(program.cardImage, program.title) });

const defaultBlocks = [
  {
    id: "header", type: "header", title: "Шапка сайта", isActive: true,
    content: {
      brand: "Бай Цзэ", tagline: "Учеба и каникулы в Китае", phone: "+7 (903) 450-54-43", phoneHref: "tel:+79034505443",
      navigation: ["Университеты", "Визы", "Каникулы", "Сопровождение", "Курсы", "О нас"], buttonText: "Подобрать программу",
    },
  },
  {
    id: "hero", type: "hero", title: "Первый экран", isActive: true,
    content: {
      eyebrow: "Бай Цзэ", title: "Учеба и каникулы в Китае", lead: "Открываем Китай для вас и ваших детей",
      services: ["Помогаем выбрать вуз и получить грант", "Организуем каникулы мечты с погружением в язык, культуру и технологии будущего"],
      primaryButton: "Смотреть программы", secondaryButton: "Подобрать за 1 минуту",
      image: image("/assets/hero-campus.webp", "Подростки с куратором на современном кампусе в Китае"),
      noteTitle: "С 2008 года", noteText: "помогаем учиться за границей",
    },
  },
  {
    id: "why", type: "why", title: "Почему Китай", isActive: true,
    content: {
      title: "Почему Китай?", lead: "Страна, где современное образование встречается с языком, культурой и безопасной самостоятельностью.",
      items: [
        { title: "Образование мирового уровня", text: "Китайские вузы - лидеры международных рейтингов. Дипломы признаются во всём мире." },
        { title: "Умный бюджет", text: "Доступные цены на обучение и проживание. Возможность получить стипендии и гранты." },
        { title: "Китайский язык из первоисточника", text: "Ваш ребёнок будет говорить на языке будущего, а не просто учить его по учебникам." },
        { title: "Безопасность и яркие впечатления", text: "Безопасная страна, великая культура, невероятная кухня и друзья со всего света." },
      ],
    },
  },
  {
    id: "studyAbroad", type: "studyAbroad", title: "Поступление", isActive: true,
    content: {
      title: "Хочу учиться за границей", lead: "Поступление в Китай - большой шаг для всей семьи. Мы помогаем превратить тревогу и вопросы в понятный план.",
      fears: [
        { title: "Не знаем, с чего начать", text: "Разложим поступление по шагам и объясним, какие решения нужны сейчас." },
        { title: "Боимся ошибиться с вузом", text: "Сравним города, программы, бюджет и требования, чтобы выбор был осознанным." },
        { title: "Переживаем за ребёнка", text: "Расскажем про кампус, быт, связь с куратором и поддержку на каждом этапе." },
        { title: "Не понимаем, как всё оплатить", text: "Подскажем варианты грантов, стипендий и планирования расходов." },
      ],
      ctaTitle: "Даже если сейчас не понятно, где учиться и как всё организовать - это нормально",
      ctaText: "Запишитесь на бесплатную консультацию и получите персональный пошаговый план поступления.",
      ctaButton: "Записаться на бесплатную консультацию",
    },
  },
  {
    id: "universities", type: "universities", title: "Университеты", isActive: true,
    content: { eyebrow: "Поступление в Китай", title: "Университеты Китая", paragraphs: ["Мечтаете изучать китайский язык и культуру, инженерию, журналистику, науки и технологии, медицину или любой другой предмет - в китайских университетах вы обязательно найдете подходящую программу!", "В мировой рейтинг QS World University Rankings вошел 71 университет Китая. Таким образом, в национальный топ-10 вошли не только лучшие, но и самые популярные среди иностранных студентов вузы Китая."], image: image("/assets/hero-campus.webp", "Студенты на территории китайского университета"), groups: universityGroups },
  },
  {
    id: "university", type: "detail", title: "Поступление в вуз", isActive: true,
    content: { title: "Китай: образовательный хаб XXI века", intro: "Подготовим к HSK, подберём университет, поможем получить грант и студенческую визу.", description: "Вам не нужно искать университет на китайском сайте и разбираться в требованиях в одиночку. Мы берём процесс поступления на себя.", button: "Записаться на консультацию", image: image("/assets/hero-campus.webp", "Кампус китайского университета"), steps: universitySteps, included: ["Персональный куратор", "Подача в 3-5 университетов", "Подготовка документов", "Помощь с грантом", "Студенческая виза", "Встреча и адаптация"] },
  },
  {
    id: "about", type: "about", title: "О компании", isActive: true,
    content: { number: "2008", title: "Study@Holidays. Бай Цзэ", lead: "Почти тысяча студентов уже отправились с нами на учебу за границу или в языковые лагеря.", paragraphs: ["У нас есть программы под разные цели, возраст и бюджет. Бай Цзэ отвечает за азиатское направление: Китай.", "Расскажем, как поступить в топ-университет, выучить первые иероглифы или провести каникулы от лепки пельменей до диалогов на китайском."], button: "Записаться на консультацию" },
  },
  {
    id: "faq", type: "faq", title: "Вопросы и ответы", isActive: true,
    content: { title: "Обучение в Китае: главные вопросы родителей и студентов", lead: "Собрали ответы о языке, выборе города, документах, кампусе и перспективах после выпуска.", groups: faqGroups },
  },
  {
    id: "visa", type: "detail", title: "Визы", isActive: true,
    content: { title: "Пока вы собираете чемоданы, мы открываем визу", intro: "Полное визовое сопровождение для детей и взрослых: от анкеты до паспорта с визой.", description: "Оформляем учебные краткосрочные и долгосрочные визы, а также деловые визы для поездок и стажировок.", button: "Консультация по визе", image: image("/assets/airport-support.webp", "Куратор сопровождает подростков в аэропорту"), steps: visaSteps, included: ["Проверка документов", "Заполнение анкеты", "Медицинская страховка", "Запись в визовый центр", "Контроль сроков", "Передача паспорта"] },
  },
  {
    id: "programs", type: "programs", title: "Каникулы", isActive: true,
    content: { title: "Каникулы в Китае. Выбери своё приключение", lead: "Язык, море, технологии и культура. Подберём программу под возраст, цели и самостоятельность ребёнка.", programs: programs.map(mapProgram) },
  },
  {
    id: "safety", type: "safety", title: "Сопровождение", isActive: true,
    content: { title: "Мы летим вместе с вами", text: "Вам не придётся переживать за ребёнка в аэропорту или чужой стране. Кураторы сопровождают группу от вылета из Краснодара или Москвы до возвращения домой.", image: image("/assets/airport-support.webp", "Куратор сопровождает подростков в аэропорту"), points: ["Встреча и проводы", "24/7 связь с родителями", "Медицинская страховка", "Проверенное питание"], linkText: "Задать вопрос о безопасности" },
  },
  {
    id: "language", type: "language", title: "Курсы", isActive: true,
    content: { title: "Заговорить по-китайски уверенно", lead: "Курсы для детей и взрослых, онлайн и офлайн. От первого иероглифа до HSK-6.", image: image("/assets/hainan-language.webp", "Занятие китайским языком у моря"), badgeTitle: "Наша суперсила", badgeText: "Практика языка в реальной среде", features: [{ title: "Индивидуально", text: "Программа под цели и уровень ученика." }, { title: "В группе", text: "Живая практика в комфортной атмосфере." }, { title: "С носителем", text: "Больше речи и правильного произношения." }, { title: "Подготовка к HSK", text: "Системный маршрут до экзамена." }], statement: "Учить китайский в классе хорошо. Заговорить на нём в Пекине бесценно!", button: "Записаться на пробный урок" },
  },
  {
    id: "reviews", type: "reviews", title: "Отзывы", isActive: true,
    content: { title: "Отзывы", lead: "Мы добавим сюда реальные истории семей после согласования публикации. Для нас важно показывать живой опыт, а не собирать отзывы без разрешения.", emptyTitle: "Ваш отзыв может быть здесь", emptyText: "Расскажите, какой маршрут вы рассматриваете. Мы покажем подходящие истории родителей и студентов.", button: "Запросить примеры", linkText: "Смотреть новости во ВКонтакте" },
  },
  {
    id: "cases", type: "cases", title: "Кейсы", isActive: true,
    content: { title: "Кейсы", lead: "Добавим сюда реальные скриншоты, видео и истории семей после согласования публикации.", items: [{ title: "Поступление в вуз", text: "Здесь разместим скриншот или видео отзыва семьи после согласования публикации.", image: image("/assets/hero-campus.webp", "Кампус китайского университета") }, { title: "Каникулы в Китае", text: "Здесь разместим историю поездки, фото и видео группы с разрешения участников.", image: image("/assets/chengdu-family.webp", "Семья на каникулах в Китае") }, { title: "Китайский язык", text: "Здесь разместим отзыв ученика о занятиях и прогрессе в китайском языке.", image: image("/assets/hainan-language.webp", "Занятие китайским языком") }] },
  },
  {
    id: "quiz", type: "quiz", title: "Персональный подбор", isActive: true,
    content: { eyebrow: "Персональный подбор", title: "Не знаете, с чего начать?", lead: "Ответьте на 5 вопросов. Мы предложим программу под возраст и цели ребёнка.", button: "Подобрать программу", steps: quizSteps },
  },
  {
    id: "contacts", type: "contacts", title: "Контакты", isActive: true,
    content: { title: "Приходите на бесплатную консультацию", address: "Краснодар, ул. Красная 160, 3-й этаж, офис 307", phone: "+7 (903) 450-54-43", secondPhone: "+7 (995) 321-84-01", email: "kubancenter@mail.ru", button: "Записаться", mapEmbed: "https://yandex.ru/map-widget/v1/?ll=38.976454%2C45.039808&mode=search&ol=geo&pt=38.976454%2C45.039808%2Cpm2rdm&z=16&lang=ru_RU", mapLink: "https://yandex.ru/maps/?text=Краснодар%2C%20Красная%20160", socials: [{ label: "WhatsApp", href: "https://wa.me/qr/NL4IWGGHHW3HL1", icon: "whatsapp" }, { label: "Telegram", href: "https://t.me/chinainsummer", icon: "telegram" }, { label: "MAX", href: "https://max.ru/u/f9LHodD0cOIIDx6pG5WILnOJudHFpeJU2O83YpgmMthMi0cPQNv2JWO20gM", icon: "max" }, { label: "ВКонтакте", href: "https://vk.ru/study.holidays", icon: "vk" }] },
  },
  {
    id: "footer", type: "footer", title: "Подвал", isActive: true,
    content: { text: "Учеба, языковые программы и каникулы в Китае с полным сопровождением.", copyright: "© 2026 Бай Цзэ", address: "Краснодар, ул. Красная 160", legalName: "ИП Лазаренко Наталья Леонидовна", inn: "ИНН 231009681142" },
  },
];

export const defaultCmsData = {
  site: { id: "site-baize", name: "Бай Цзэ | Учеба и каникулы в Китае", domain: "china-baize.ru" },
  page: { id: "home", siteId: "site-baize", title: "Главная", slug: "/", seoTitle: "Бай Цзэ | Учеба и каникулы в Китае", seoDescription: "Поступление в китайские университеты, языковые курсы и каникулы в Китае с полным сопровождением.", blocks: defaultBlocks },
  posts: [],
};

export function cloneCmsData(data = defaultCmsData) { return JSON.parse(JSON.stringify(data)); }

function mergeValue(base, override) {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || Array.isArray(override)) return override;
  if (typeof base === "object" && base && typeof override === "object" && override) {
    return Object.keys({ ...base, ...override }).reduce((result, key) => { result[key] = mergeValue(base[key], override[key]); return result; }, {});
  }
  return override;
}

export function mergeCmsData(remote) {
  const fallback = cloneCmsData(defaultCmsData);
  if (!remote || remote.site?.id !== fallback.site.id || !remote.page?.blocks) return fallback;
  const remoteBlocks = new Map(remote.page.blocks.map((block) => [block.id, block]));
  fallback.site = mergeValue(fallback.site, remote.site);
  fallback.page = mergeValue(fallback.page, remote.page);
  fallback.page.blocks = fallback.page.blocks.map((block) => remoteBlocks.has(block.id) ? mergeValue(block, remoteBlocks.get(block.id)) : block);
  return fallback;
}

export function getBlock(data, id) { return data?.page?.blocks?.find((block) => block.id === id) || defaultCmsData.page.blocks.find((block) => block.id === id); }
