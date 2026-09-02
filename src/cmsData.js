export const CMS_STORAGE_KEY = "baize-cms-data-v1";
export const CMS_SESSION_KEY = "baize-cms-session-v1";
export const ADMIN_LOGIN = "admin@site.local";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

import { programs, programDetails, quizSteps, faqGroups, universitySteps, universityGroups, visaSteps, yingkouGallery } from "./data.js";

const image = (path, alt = "") => ({ kind: "image", path, alt });
const video = (path, label = "") => ({ kind: "video", path, label });
const mediaGallery = (items) => items.map((item) => image(item.src || item.path, item.alt || ""));
const mapProgram = (program) => ({
  ...program,
  image: image(program.image, program.title),
  cardImage: image(program.cardImage, program.title),
  gallery: mediaGallery(program.gallery || (program.slug === "yingkou-beijing" ? yingkouGallery : [{ src: program.image, alt: program.title }])),
  details: program.details || [],
  isActive: true,
});

const defaultBlocks = [
  {
    id: "header", type: "header", title: "Шапка сайта", isActive: true,
    content: {
      brand: "Бай Цзэ", tagline: "Учеба и каникулы в Китае", phone: "+7 (903) 450-54-43", phoneHref: "tel:+79034505443", brandHref: "#top", logo: image("", "Логотип Бай Цзэ"),
      navigation: ["Университеты", "Визы", "Каникулы", "Сопровождение", "Курсы", "О нас"], navigationHrefs: { "Университеты": "#universities", "Визы": "#visa", "Каникулы": "#programs", "Сопровождение": "#safety", "Курсы": "#language", "О нас": "#about" }, buttonText: "Подобрать программу",
    },
  },
  {
    id: "hero", type: "hero", title: "Первый экран", isActive: true,
    content: {
      eyebrow: "Бай Цзэ", title: "Учеба и каникулы в Китае", lead: "Открываем Китай для вас и ваших детей",
      services: ["Помогаем выбрать вуз и получить грант", "Организуем каникулы мечты с погружением в язык, культуру и технологии будущего"],
      primaryButton: "Смотреть программы", primaryButtonHref: "#programs", secondaryButton: "Подобрать за 1 минуту",
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
    content: { title: "Китай: образовательный хаб XXI века", intro: "Подготовим к HSK, подберём университет, поможем получить грант и студенческую визу.", description: "Вам не нужно искать университет на китайском сайте и разбираться в требованиях в одиночку. Мы берём процесс поступления на себя.", button: "Записаться на консультацию", image: image("/assets/hero-campus.webp", "Кампус китайского университета"), panelTitle: "Как мы работаем", includedTitle: "Что входит в услугу", steps: universitySteps, included: ["Персональный куратор", "Подача в 3-5 университетов", "Подготовка документов", "Помощь с грантом", "Студенческая виза", "Встреча и адаптация"] },
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
    content: { title: "Пока вы собираете чемоданы, мы открываем визу", intro: "Полное визовое сопровождение для детей и взрослых: от анкеты до паспорта с визой.", description: "Оформляем учебные краткосрочные и долгосрочные визы, а также деловые визы для поездок и стажировок.", button: "Консультация по визе", image: image("/assets/airport-support.webp", "Куратор сопровождает подростков в аэропорту"), panelTitle: "Как мы работаем", includedTitle: "Что входит в услугу", steps: visaSteps, included: ["Проверка документов", "Заполнение анкеты", "Медицинская страховка", "Запись в визовый центр", "Контроль сроков", "Передача паспорта"] },
  },
  {
    id: "programs", type: "programs", title: "Каникулы", isActive: true,
    content: { title: "Каникулы в Китае. Выбери своё приключение", lead: "Язык, море, технологии и культура. Подберём программу под возраст, цели и самостоятельность ребёнка.", programs: programs.map(mapProgram) },
  },
  {
    id: "safety", type: "safety", title: "Сопровождение", isActive: true,
    content: { title: "Мы летим вместе с вами", text: "Вам не придётся переживать за ребёнка в аэропорту или чужой стране. Кураторы сопровождают группу от вылета из Краснодара или Москвы до возвращения домой.", image: image("/assets/airport-support.webp", "Куратор сопровождает подростков в аэропорту"), badge: "Группа под присмотром", points: ["Встреча и проводы", "24/7 связь с родителями", "Медицинская страховка", "Проверенное питание"], linkText: "Задать вопрос о безопасности", linkHref: "#contacts" },
  },
  {
    id: "language", type: "language", title: "Курсы", isActive: true,
    content: { title: "Заговорить по-китайски уверенно", lead: "Курсы для детей и взрослых, онлайн и офлайн. От первого иероглифа до HSK-6.", image: image("/assets/hainan-language.webp", "Занятие китайским языком у моря"), badgeTitle: "Наша суперсила", badgeText: "Практика языка в реальной среде", features: [{ title: "Индивидуально", text: "Программа под цели и уровень ученика." }, { title: "В группе", text: "Живая практика в комфортной атмосфере." }, { title: "С носителем", text: "Больше речи и правильного произношения." }, { title: "Подготовка к HSK", text: "Системный маршрут до экзамена." }], statement: "Учить китайский в классе хорошо. Заговорить на нём в Пекине бесценно!", button: "Записаться на пробный урок" },
  },
  {
    id: "reviews", type: "reviews", title: "Отзывы", isActive: true,
    content: {
      title: "Отзывы", lead: "Личные впечатления участников о поездках, обучении и поддержке Бай Цзэ.", reviewButton: "Оставить отзыв",
      items: [
        { title: "Отзыв участника", text: "Личная история о поездке и впечатлениях от программы.", video: video("/assets/videos/18216269384312.mp4", "Видео-отзыв участника"), isActive: true },
        { title: "Отзыв семьи", text: "Что особенно понравилось родителям и студентам.", video: video("/assets/videos/18216273709688.mp4", "Видео-отзыв семьи"), isActive: true },
        { title: "Опыт обучения", text: "Реальный отзыв о поддержке и результатах программы.", video: video("/assets/videos/18216283802232.mp4", "Видео об опыте обучения"), isActive: true },
      ],
    },
  },
  {
    id: "cases", type: "cases", title: "Кейсы", isActive: true,
    content: {
      title: "Кейсы", lead: "Добавим сюда реальные скриншоты, видео и истории семей после согласования публикации.",
      items: [
        { title: "Поступление в вуз", text: "Реальная история поступления в китайский вуз.", video: video("/assets/videos/18335854955128.mp4", "Видео о поступлении в вуз"), image: image("/assets/hero-campus.webp", "Кампус китайского университета"), isActive: true },
        { title: "Каникулы в Китае", text: "Одно из любимых занятий на программе - фотосессия в национальных костюмах.", video: video("/assets/videos/8526131038840.mp4", "Видео о каникулах в Китае"), image: image("/assets/chengdu-family.webp", "Семья на каникулах в Китае"), isActive: true },
        { title: "Китайский язык", text: "«Дети все такие умные, хорошенькие...», - преподаватель китайского языка поделилась впечатлениями об участии в нашем летнем лагере.", video: video("/assets/videos/18216247233144.mp4", "Видео о китайском языке"), image: image("/assets/hainan-language.webp", "Занятие китайским языком"), isActive: true },
        { title: "Поддержка на каждом шаге", text: "Куратор рядом до, во время и после поездки.", video: video("/assets/videos/18216256932472.mp4", "Видео о сопровождении"), image: image("/assets/airport-support.webp", "Поддержка участников"), isActive: true },
        { title: "Новый опыт в Китае", text: "Еще одна реальная история участника программы Бай Цзэ.", video: video("/assets/videos/18216264469112.mp4", "Видео участника программы"), image: image("/assets/hero-campus.webp", "Участники программы"), isActive: true },
      ],
    },
  },
  {
    id: "quiz", type: "quiz", title: "Персональный подбор", isActive: true,
    content: { eyebrow: "Персональный подбор", title: "Не знаете, с чего начать?", lead: "Ответьте на 5 вопросов. Мы предложим программу под возраст и цели ребёнка.", button: "Подобрать программу", minuteText: "1 минута", privacyText: "Ваши данные защищены", steps: quizSteps, resultTitle: "Подборка формируется", resultText: "Менеджер напишет вам в рабочее время и пришлёт варианты с актуальными датами и стоимостью.", resultButton: "Готово", nameLabel: "Ваше имя", phoneLabel: "Телефон", consentLabel: "Нажимая на кнопку, я даю согласие на обработку персональных данных и соглашаюсь с Политикой конфиденциальности.", submitLabel: "Получить подбор программ" },
  },
  {
    id: "contacts", type: "contacts", title: "Контакты", isActive: true,
    content: { title: "Приходите на бесплатную консультацию", address: "Краснодар, ул. Красная 160, 3-й этаж, офис 307", phone: "+7 (903) 450-54-43", phoneHref: "tel:+79034505443", secondPhone: "+7 (995) 321-84-01", secondPhoneHref: "tel:+79953218401", email: "kubancenter@mail.ru", emailHref: "mailto:kubancenter@mail.ru", button: "Записаться", mapEmbed: "https://yandex.ru/map-widget/v1/?ll=38.976454%2C45.039808&mode=search&ol=geo&pt=38.976454%2C45.039808%2Cpm2rdm&z=16&lang=ru_RU", mapLink: "https://yandex.ru/maps/?text=Краснодар%2C%20Красная%20160", socials: [{ label: "WhatsApp", href: "https://wa.me/qr/NL4IWGGHHW3HL1", icon: "whatsapp" }, { label: "Telegram", href: "https://t.me/chinainsummer", icon: "telegram" }, { label: "MAX", href: "https://max.ru/u/f9LHodD0cOIIDx6pG5WILnOJudHFpeJU2O83YpgmMthMi0cPQNv2JWO20gM", icon: "max" }, { label: "ВКонтакте", href: "https://vk.ru/study.holidays", icon: "vk" }], maxChannelLabel: "Канал MAX", maxChannelHref: "https://max.ru/join/_iffpxt8pk9Rf29rOX1swElr4iSKT22FMtNA6yUC_NE" },
  },
  {
    id: "footer", type: "footer", title: "Подвал", isActive: true,
    content: { text: "Учеба, языковые программы и каникулы в Китае с полным сопровождением.", directionsTitle: "Направления", contactsTitle: "Связаться", documentsTitle: "Документы", privacyLabel: "Политика ПДн", offerLabel: "Публичная оферта", links: [{ label: "Университеты", href: "#universities" }, { label: "Как поступить", href: "#university" }, { label: "Визы", href: "#visa" }, { label: "Каникулы", href: "#programs" }, { label: "Сопровождение", href: "#safety" }, { label: "Китайский язык", href: "#language" }], copyright: "© 2026 Бай Цзэ", address: "Краснодар, ул. Красная 160", legalName: "ИП Лазаренко Наталья Леонидовна", inn: "ИНН 231009681142", ogrn: "ОГРН: уточняется" },
  },
  {
    id: "forms", type: "forms", title: "Формы и системные тексты", isActive: true,
    content: {
      leadIntro: "Оставьте контакты. Первая консультация бесплатна.", nameLabel: "Ваше имя", phoneLabel: "Телефон", goalLabel: "Направление", goalPlaceholder: "Выберите направление", consentLabel: "Нажимая на кнопку, я даю согласие на обработку персональных данных и соглашаюсь с Политикой конфиденциальности.", validationError: "Заполните имя, телефон и подтвердите согласие на обработку данных.", submitLabel: "Отправить заявку", loadingLabel: "Отправляем...", successTitle: "Спасибо!", successText: "Заявка подготовлена. Менеджер свяжется с вами в рабочее время.", successButton: "Готово",
      reviewTitle: "Оставить отзыв", reviewIntro: "Расскажите, как прошла поездка или обучение. Отзыв появится на сайте после проверки менеджером.", reviewNameLabel: "Ваше имя", reviewContactLabel: "Телефон или email (необязательно)", reviewProgramLabel: "Программа", reviewProgramPlaceholder: "Выберите программу", reviewRatingLabel: "Оценка", reviewTextLabel: "Ваш отзыв", reviewConsentLabel: "Нажимая на кнопку, я даю согласие на обработку персональных данных и соглашаюсь с Политикой конфиденциальности.", reviewValidationError: "Заполните имя, отзыв и подтвердите согласие на публикацию.", reviewSubmitLabel: "Отправить отзыв", reviewSuccessTitle: "Спасибо за отзыв!", reviewSuccessText: "Отзыв отправлен на проверку и появится на сайте после согласования.",
    },
  },
  {
    id: "legal", type: "legal", title: "Юридические документы", isActive: true,
    content: {
      privacyTitle: "Политика обработки персональных данных", offerTitle: "Публичная оферта", notice: "Редакция от 12 августа 2026 года. Черновик для юридической проверки.",
      privacySections: [
        { title: "1. Оператор и общие положения", text: "Оператор: ИП Лазаренко Наталья Леонидовна, ИНН 231009681142, бренд «Бай Цзэ». Контакт для обращений: china@baize.ru. Политика применяется к данным, полученным через формы сайта, телефон, электронную почту и мессенджеры." },
        { title: "2. Какие данные обрабатываются", text: "Имя, номер телефона, адрес электронной почты, выбранное направление, ответы квиза, источник обращения и технические данные, необходимые для работы сайта. Данные о здоровье, документах и несовершеннолетних не должны передаваться через общую форму." },
        { title: "3. Цели и основания", text: "Ответ на обращение, подбор программы, подготовка консультации, исполнение договора и выполнение требований закона. Обработка на основании согласия прекращается после его отзыва, если иное хранение не требуется законом или договором." },
        { title: "4. Передача и хранение", text: "Данные могут передаваться подрядчикам по CRM, хостингу и связи только в необходимом объёме и при наличии договорных мер защиты. До подключения этих систем их точный перечень и сроки хранения необходимо утвердить." },
        { title: "5. Права пользователя", text: "Пользователь вправе запросить сведения об обработке, уточнение, блокирование или удаление данных, а также отозвать согласие, направив письмо оператору." },
      ],
      offerSections: [
        { title: "1. Статус документа", text: "Эта страница содержит предварительные условия оказания консультационных и сопроводительных услуг. Конкретная программа, цена, сроки, состав услуг и правила возврата фиксируются в индивидуальном договоре или счёте до оплаты." },
        { title: "2. Исполнитель", text: "ИП Лазаренко Наталья Леонидовна, ИНН 231009681142, бренд «Бай Цзэ», Краснодар, ул. Красная 160, офис 307." },
        { title: "3. Предмет", text: "Исполнитель оказывает услуги по подбору зарубежных образовательных и каникулярных программ, информационному, документальному и визовому сопровождению в согласованном объёме." },
        { title: "4. Цена и заключение договора", text: "Размещение заявки не создаёт обязанности по оплате. Договор считается заключённым после согласования существенных условий и совершения заказчиком предусмотренного платежа." },
        { title: "5. Ответственность", text: "Исполнитель отвечает за собственные обязательства в согласованном объёме. Решения вузов, консульств, перевозчиков и принимающих организаций находятся вне прямого контроля исполнителя, если иное прямо не зафиксировано договором." },
        { title: "6. Возвраты и споры", text: "Условия отказа, возврата и расчёта фактически понесённых расходов определяются индивидуальным договором и применимым законодательством РФ." },
      ],
    },
  },
];

export const defaultCmsData = {
  site: { id: "site-baize", name: "Бай Цзэ | Учеба и каникулы в Китае", domain: "china-baize.ru" },
  page: { id: "home", siteId: "site-baize", title: "Главная", slug: "/", seoTitle: "Учеба и каникулы в Китае | Бай Цзэ: поступление", seoDescription: "Учеба и каникулы в Китае с Бай Цзэ. Помогаем с поступлением в вузы, оформлением виз и грантов. Полное сопровождение из России.", blocks: defaultBlocks },
  // Initial publications make the new news section useful immediately. They
  // are ordinary CMS records, so an administrator can edit, hide or replace
  // every title, date, description and cover from the News section.
  posts: [
    {
      id: "news-grants-china",
      title: "Как получить грант на обучение в Китае",
      description: "Разбираем основные требования, сроки и шаги подачи документов вместе с куратором.",
      coverImage: "/assets/hero-campus.webp",
      authorName: "Бай Цзэ",
      authorImage: "",
      seoKeywords: "грант обучение в Китае, поступление",
      isPublished: true,
      sortOrder: 10,
      publishedAt: "2026-08-18",
      updatedAt: "",
      body: [],
    },
    {
      id: "news-chengdu-autumn",
      title: "Осенние каникулы в Чэнду: набор открыт",
      description: "9 дней языка, культуры и путешествий для детей 8–16 лет — с заботой о каждом участнике.",
      coverImage: "/assets/chengdu-family.webp",
      authorName: "Бай Цзэ",
      authorImage: "",
      seoKeywords: "каникулы в Чэнду, языковой лагерь",
      isPublished: true,
      sortOrder: 20,
      publishedAt: "2026-08-10",
      updatedAt: "",
      body: [],
    },
    {
      id: "news-hsk-plan",
      title: "HSK без стресса: план подготовки на 90 дней",
      description: "Понятный маршрут от первых иероглифов до уверенной сдачи экзамена с практикой живой речи.",
      coverImage: "/assets/hainan-language.webp",
      authorName: "Бай Цзэ",
      authorImage: "",
      seoKeywords: "HSK, китайский язык, подготовка",
      isPublished: true,
      sortOrder: 30,
      publishedAt: "2026-08-03",
      updatedAt: "",
      body: [],
    },
  ],
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

function mergeCollection(defaultItems, remoteItems) {
  if (!Array.isArray(remoteItems)) return defaultItems;
  return remoteItems.map((item, index) => (
    item && typeof item === "object" && !Array.isArray(item)
      ? mergeValue(defaultItems[index] || {}, item)
      : item
  ));
}

function normalizeMediaItem(item, fallbackAlt = "") {
  if (typeof item === "string") return image(item, fallbackAlt);
  if (!item || typeof item !== "object") return item;
  if (item.src && !item.path) return { ...item, kind: item.kind || "image", path: item.src, alt: item.alt || fallbackAlt };
  if (item.path) return { ...item, kind: item.kind || "image", alt: item.alt || fallbackAlt };
  return item;
}

function normalizeProgram(program) {
  if (!program || typeof program !== "object") return program;
  const fallbackGallery = program.slug === "yingkou-beijing" ? yingkouGallery : [];
  const gallery = Array.isArray(program.gallery) && program.gallery.length
    ? program.gallery
    : fallbackGallery;
  const details = Array.isArray(program.details) && program.details.length
    ? program.details
    : (programDetails[program.slug] || []);
  const normalizedCardImage = normalizeMediaItem(program.cardImage, program.title || "");
  const legacyYingkouPreviews = [
    "/assets/cards/hainan-language.webp",
    "/assets/hainan-language.webp",
    yingkouGallery[0]?.src,
  ];
  const cardImage = program.slug === "yingkou-beijing" && legacyYingkouPreviews.includes(normalizedCardImage?.path)
    ? image("/assets/yingkou/preview.png", program.title || "")
    : normalizedCardImage;
  return {
    ...program,
    image: normalizeMediaItem(program.image, program.title || ""),
    cardImage,
    gallery: gallery.map((item) => normalizeMediaItem(item, program.title || "")),
    details,
  };
}

function mergeBlock(defaultBlock, remoteBlock) {
  const merged = mergeValue(defaultBlock, remoteBlock);
  const defaultContent = defaultBlock.content || {};
  const remoteContent = remoteBlock?.content || {};

  if (["programs", "reviews", "cases"].includes(defaultBlock.id)) {
    const key = defaultBlock.id === "programs" ? "programs" : "items";
    merged.content[key] = mergeCollection(defaultContent[key] || [], remoteContent[key]);

    if (defaultBlock.id === "programs") {
      merged.content[key] = merged.content[key].map(normalizeProgram);
    }

    // Older versions stored only a placeholder image for cases. Keep the
    // current, approved case content on the public site until it is saved once
    // from the new editor; after that every field stays editable normally.
    if (defaultBlock.id === "cases" && Array.isArray(remoteContent[key])) {
      merged.content[key] = remoteContent[key].map((item, index) => (
        item && typeof item === "object" && Object.prototype.hasOwnProperty.call(item, "video")
          ? mergeValue(defaultContent[key]?.[index] || {}, item)
          : defaultContent[key]?.[index] || item
      ));
    }
  }

  return merged;
}

export function mergeCmsData(remote) {
  const fallback = cloneCmsData(defaultCmsData);
  if (!remote || remote.site?.id !== fallback.site.id || !remote.page?.blocks) return fallback;
  const remoteBlocks = new Map(remote.page.blocks.map((block) => [block.id, block]));
  fallback.site = mergeValue(fallback.site, remote.site);
  fallback.page = mergeValue(fallback.page, remote.page);
  fallback.page.blocks = fallback.page.blocks.map((block) => remoteBlocks.has(block.id) ? mergeBlock(block, remoteBlocks.get(block.id)) : block);
  // The API may return an empty posts table on an older installation. Keep
  // the built-in publications in that case; once posts exist, use the saved
  // CMS records and merge each record with its safe defaults.
  if (Array.isArray(remote.posts) && remote.posts.length) {
    fallback.posts = remote.posts.map((post, index) => mergeValue(fallback.posts[index] || {}, post));
  }
  return fallback;
}

export function getBlock(data, id) { return data?.page?.blocks?.find((block) => block.id === id) || defaultCmsData.page.blocks.find((block) => block.id === id); }
