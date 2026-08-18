import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Buildings,
  ChatsCircle,
  Check,
  Clock,
  EnvelopeSimple,
  GlobeHemisphereEast,
  GraduationCap,
  List,
  Phone,
  ShieldCheck,
  Sparkle,
  Translate,
  X,
} from "@phosphor-icons/react";
import {
  programs,
  quizSteps,
  recommendProgram,
  faqGroups,
  universitySteps,
  visaSteps,
} from "./data.js";

const CONTACT_PHONE = "+7 (903) 450-54-43";
const CONTACT_PHONE_HREF = "tel:+79034505443";
const WHATSAPP_HREF = "https://wa.me/79034505443";
const TELEGRAM_HREF = "https://t.me/chinainsummer";
const MAX_HREF = "https://max.ru/";
const VK_HREF = "https://vk.ru/study.holidays";

const SOCIAL_ICON_PATHS = {
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  telegram: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  vk: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z",
  max: "M1.769 0A1.77 1.77 0 0 0 0 1.769V22.23A1.77 1.77 0 0 0 1.769 24H22.23A1.77 1.77 0 0 0 24 22.231V1.77A1.77 1.77 0 0 0 22.231 0zm12.485 3.28a4.301 4.301 0 0 1 4.3 4.302 4.301 4.301 0 0 1-1.993 3.63 6.085 6.085 0 0 1 1.054 3.422 6.085 6.085 0 0 1-6.085 6.085 6.085 6.085 0 0 1-6.085-6.085 6.085 6.085 0 0 1 4.66-5.916 4.301 4.301 0 0 1-.152-1.136 4.301 4.301 0 0 1 4.301-4.301zm0 1.849a2.453 2.453 0 0 0-2.453 2.453 2.453 2.453 0 0 0 2.453 2.453 2.453 2.453 0 0 0 2.453-2.453 2.453 2.453 0 0 0-2.453-2.453zm-2.724 5.268a4.237 4.237 0 0 0-4.237 4.237 4.237 4.237 0 0 0 4.237 4.237 4.237 0 0 0 4.237-4.237 4.237 4.237 0 0 0-4.237-4.237zm.032 2.54a1.781 1.781 0 1 1 0 3.562 1.781 1.781 0 0 1 0-3.562Z",
};

function SocialIcon({ name, size = 24 }) {
  return (
    <svg className={`social-icon social-icon--${name}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={SOCIAL_ICON_PATHS[name]} />
    </svg>
  );
}

function Brand({ light = false }) {
  return (
    <a className={`brand ${light ? "brand--light" : ""}`} href="#top">
      <span className="brand__mark" aria-hidden="true">白泽</span>
      <span className="brand__copy">
        <strong>Бай Цзэ</strong>
        <small>Учеба и каникулы в Китае</small>
      </span>
    </a>
  );
}

function Header({ openQuiz }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Поступление", "#university"],
    ["Визы", "#visa"],
    ["Каникулы", "#programs"],
    ["Сопровождение", "#safety"],
    ["Курсы", "#language"],
    ["О нас", "#about"],
  ];

  return (
    <header className="site-header">
      <div className="shell header__row">
        <Brand />
        <nav className={`nav ${menuOpen ? "nav--open" : ""}`} aria-label="Основная навигация">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav__mobile-phone" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
        </nav>
        <div className="header__actions">
          <a className="header__phone" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
          <button className="button button--small" onClick={openQuiz}>Подобрать программу</button>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ openQuiz }) {
  return (
    <section className="hero section" id="top">
      <div className="shell hero__grid">
        <div className="hero__copy reveal">
          <p className="eyebrow">Бай Цзэ</p>
          <h1>Учеба и каникулы в Китае</h1>
          <p className="hero__lead">Открываем Китай для вас и ваших детей. Помогаем выбрать вуз и получить грант, организуем каникулы с погружением в язык, культуру и технологии будущего.</p>
          <div className="button-row">
            <a className="button" href="#programs">Смотреть программы <ArrowRight size={18} /></a>
            <button className="button button--ghost" onClick={openQuiz}>Подобрать за 1 минуту</button>
          </div>
        </div>
        <div className="hero__visual reveal reveal--delay">
          <div className="hero__rings" aria-hidden="true" />
          <img src="/assets/hero-campus.webp" alt="Подростки с куратором на современном кампусе в Китае" fetchPriority="high" />
          <div className="hero__note hero__note--bottom">
            <strong>С 2008 года</strong>
            <span>помогаем учиться за границей</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChina() {
  const reasons = [
    { icon: GlobeHemisphereEast, title: "Образование мирового уровня", text: "Китайские вузы - лидеры международных рейтингов. Дипломы признаются во всём мире." },
    { icon: Buildings, title: "Умный бюджет", text: "Доступные цены на обучение и проживание. Возможность получить стипендии и гранты." },
    { icon: Translate, title: "Китайский язык из первоисточника", text: "Ваш ребёнок будет говорить на языке будущего, а не просто учить его по учебникам." },
    { icon: ShieldCheck, title: "Безопасность и яркие впечатления", text: "Безопасная страна, великая культура, невероятная кухня и друзья со всего света." },
  ];
  return (
    <section className="section section--compact" aria-labelledby="why-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="why-title">Почему Китай?</h2>
          <p>Страна, где современное образование встречается с языком, культурой и безопасной самостоятельностью.</p>
        </div>
        <div className="benefit-grid reveal">
          {reasons.map(({ icon: Icon, title, text }) => (
            <article className="benefit" key={title}>
              <Icon size={32} weight="duotone" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudyAbroad({ openForm }) {
  const fears = [
    ["Не знаем, с чего начать", "Разложим поступление по шагам и объясним, какие решения нужны сейчас."],
    ["Боимся ошибиться с вузом", "Сравним города, программы, бюджет и требования, чтобы выбор был осознанным."],
    ["Переживаем за ребёнка", "Расскажем про кампус, быт, связь с куратором и поддержку на каждом этапе."],
    ["Не понимаем, как всё оплатить", "Подскажем варианты грантов, стипендий и планирования расходов."],
  ];

  return (
    <section className="section study-abroad" id="study-abroad" aria-labelledby="study-abroad-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="study-abroad-title">Хочу учиться за границей</h2>
          <p>Поступление в Китай - большой шаг для всей семьи. Мы помогаем превратить тревогу и вопросы в понятный план.</p>
        </div>
        <div className="study-abroad__grid">
          <div className="study-abroad__media reveal">
            <img src="/assets/chengdu-family.webp" alt="Студенты и куратор на кампусе в Китае" loading="lazy" />
            <div className="study-abroad__caption"><strong>Поддержка семьи</strong><span>От первого разговора до адаптации в кампусе</span></div>
          </div>
          <div className="study-abroad__fears reveal">
            {fears.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
        <div className="study-abroad__cta reveal">
          <div>
            <h3>Даже если сейчас не понятно, где учиться и как всё организовать - это нормально</h3>
            <p>Запишитесь на бесплатную консультацию и получите персональный пошаговый план поступления.</p>
          </div>
          <button className="button" onClick={() => openForm("Бесплатная консультация по поступлению")}>Записаться на бесплатную консультацию <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function Programs({ openProgram }) {
  return (
    <section className="section programs" id="programs" aria-labelledby="programs-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="programs-title">Каникулы в Китае. Выбери своё приключение</h2>
          <p>Язык, море, технологии и культура. Подберём программу под возраст, цели и самостоятельность ребёнка.</p>
        </div>
        <div className="program-grid">
          {programs.map((program, index) => (
            <button
              className={`program-card program-card--${index + 1} reveal`}
              key={program.slug}
              onClick={() => openProgram(program)}
            >
              <img src={program.cardImage} alt="" loading="lazy" />
              <span className="program-card__shade" />
              <span className="program-card__content">
                <small>{program.meta}</small>
                <strong>{program.title}</strong>
                <span>{program.description}</span>
              </span>
              <span className="program-card__arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const points = ["Встреча и проводы", "24/7 связь с родителями", "Медицинская страховка", "Проверенное питание"];
  return (
    <section className="section" id="safety">
      <div className="shell safety__grid">
        <div className="safety__media reveal">
          <img src="/assets/airport-support.webp" alt="Куратор сопровождает подростков в аэропорту" loading="lazy" />
          <div className="safety__badge"><ShieldCheck size={24} /> Группа под присмотром</div>
        </div>
        <div className="safety__copy reveal">
          <h2>Мы летим вместе с вами</h2>
          <p>Вам не придётся переживать за ребёнка в аэропорту или чужой стране. Кураторы сопровождают группу от вылета из Краснодара или Москвы до возвращения домой.</p>
          <div className="check-grid">
            {points.map((point) => <span key={point}><Check size={18} weight="bold" />{point}</span>)}
          </div>
          <a className="text-link" href="#contacts">Задать вопрос о безопасности <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function About({ openConsultation }) {
  return (
    <section className="section about" id="about">
      <div className="shell about__grid reveal">
        <div className="about__big">2008</div>
        <div>
          <h2>Study@Holidays. Бай Цзэ</h2>
          <p className="about__lead">Почти тысяча студентов уже отправились с нами на учебу за границу или в языковые лагеря.</p>
        </div>
        <div className="about__body">
          <p>У нас есть программы под разные цели, возраст и бюджет. Бай Цзэ отвечает за азиатское направление: Китай.</p>
          <p>Расскажем, как поступить в топ-университет, выучить первые иероглифы или провести каникулы от лепки пельменей до диалогов на китайском.</p>
          <button className="button button--light" onClick={openConsultation}>Записаться на консультацию</button>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="faq-title">Обучение в Китае: главные вопросы родителей и студентов</h2>
          <p>Собрали ответы о языке, выборе города, документах, кампусе и перспективах после выпуска.</p>
        </div>
        <div className="faq__groups reveal">
          {faqGroups.map((group) => (
            <details className="faq-group" key={group.title}>
              <summary>
                <span><strong>{group.title}</strong><small>{group.summary}</small></span>
                <ArrowRight size={20} />
              </summary>
              <div className="faq-group__body">
                {group.items.map(([question, answer]) => (
                  <details className="faq-item" key={question}>
                    <summary><span>{question}</span><ArrowRight size={18} /></summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ openForm }) {
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="shell reviews__layout">
        <div className="reviews__lead reveal">
          <span className="reviews__mark"><ChatsCircle size={32} weight="duotone" /></span>
          <h2 id="reviews-title">Отзывы</h2>
          <p>Мы добавим сюда реальные истории семей после согласования публикации. Для нас важно показывать живой опыт, а не собирать отзывы без разрешения.</p>
          <button className="button button--ghost" onClick={() => openForm("Запросить отзывы и примеры программ")}>Запросить примеры <ArrowRight size={18} /></button>
        </div>
        <div className="reviews__empty reveal">
          <div className="reviews__quote">“</div>
          <strong>Ваш отзыв может быть здесь</strong>
          <p>Расскажите, какой маршрут вы рассматриваете. Мы покажем подходящие истории родителей и студентов.</p>
          <a className="text-link" href={VK_HREF} target="_blank" rel="noreferrer">Смотреть новости во ВКонтакте <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function Cases() {
  const cases = [
    ["Поступление в вуз", "Здесь разместим скриншот или видео отзыва семьи после согласования публикации.", "/assets/hero-campus.webp", GraduationCap],
    ["Каникулы в Китае", "Здесь разместим историю поездки, фото и видео группы с разрешения участников.", "/assets/chengdu-family.webp", GlobeHemisphereEast],
    ["Китайский язык", "Здесь разместим отзыв ученика о занятиях и прогрессе в китайском языке.", "/assets/hainan-language.webp", Translate],
  ];
  return (
    <section className="section cases" id="cases" aria-labelledby="cases-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="cases-title">Кейсы</h2>
          <p>Добавим сюда реальные скриншоты, видео и истории семей после согласования публикации.</p>
        </div>
        <div className="cases__grid">
          {cases.map(([title, text, image, Icon]) => (
            <article className="case-card reveal" key={title}>
              <img className="case-card__image" src={image} alt="" loading="lazy" />
              <span className="case-card__icon"><Icon size={28} weight="duotone" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailSection({ id, icon: Icon, title, intro, description, steps, included, button, image, reverse = false, openForm }) {
  return (
    <section className={`section detail ${reverse ? "detail--reverse" : ""}`} id={id}>
      <div className="shell detail__grid">
        <div className="detail__intro reveal">
          <span className="detail__icon"><Icon size={30} weight="duotone" /></span>
          <h2>{title}</h2>
          <p className="detail__lead">{intro}</p>
          <p>{description}</p>
          <button className="button" onClick={() => openForm(button)}>{button}</button>
        </div>
        <div className="detail__panel reveal">
          {image && <img className="detail__image" src={image} alt="" loading="lazy" />}
          <h3>Как мы работаем</h3>
          <ol className="step-list">
            {steps.map(([name, text]) => (
              <li key={name}><span><Check size={16} weight="bold" /></span><div><strong>{name}</strong><p>{text}</p></div></li>
            ))}
          </ol>
          <details>
            <summary>Что входит в услугу <ArrowRight size={18} /></summary>
            <ul className="included-list">
              {included.map((item) => <li key={item}><Check size={16} />{item}</li>)}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}

function Language({ openForm }) {
  const features = [
    ["Индивидуально", "Программа под цели и уровень ученика."],
    ["В группе", "Живая практика в комфортной атмосфере."],
    ["С носителем", "Больше речи и правильного произношения."],
    ["Подготовка к HSK", "Системный маршрут до экзамена."],
  ];
  return (
    <section className="section language" id="language">
      <div className="shell">
        <div className="language__head reveal">
          <div>
            <h2>Заговорить по-китайски уверенно</h2>
            <p>Курсы для детей и взрослых, онлайн и офлайн. От первого иероглифа до HSK-6.</p>
          </div>
          <Translate size={64} weight="duotone" />
        </div>
        <div className="language__layout">
          <div className="language__image reveal">
            <img src="/assets/hainan-language.webp" alt="Занятие китайским языком у моря" loading="lazy" />
            <div><strong>Наша суперсила</strong><span>Практика языка в реальной среде</span></div>
          </div>
          <div className="language__features reveal">
            {features.map(([name, text]) => <article key={name}><h3>{name}</h3><p>{text}</p></article>)}
            <p className="language__statement">Учить китайский в классе хорошо. Заговорить на нём в Пекине бесценно!</p>
            <button className="button button--ghost" onClick={() => openForm("Записаться на пробный урок")}>Записаться на пробный урок <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizBanner({ openQuiz }) {
  return (
    <section className="section quiz-banner" id="quiz">
      <div className="shell quiz-banner__inner reveal">
        <div>
          <p className="eyebrow">Персональный подбор</p>
          <h2>Не знаете, с чего начать?</h2>
          <p>Ответьте на 5 вопросов. Мы предложим программу под возраст и цели ребёнка.</p>
        </div>
        <div className="quiz-banner__action">
          <div><Clock size={20} /> 1 минута</div>
          <button className="button button--terracotta" onClick={openQuiz}>Подобрать программу <ArrowRight size={18} /></button>
          <small>Ваши данные защищены</small>
        </div>
      </div>
    </section>
  );
}

function Contacts({ openForm }) {
  return (
    <section className="section contacts" id="contacts">
      <div className="shell contacts__grid">
        <div className="contacts__copy reveal">
          <h2>Приходите на бесплатную консультацию</h2>
          <p>Краснодар, ул. Красная 160, 3-й этаж, офис 307</p>
          <div className="contact-list">
            <a href={CONTACT_PHONE_HREF}><Phone size={22} />{CONTACT_PHONE}</a>
            <a href="tel:+79953218401"><Phone size={22} />+7 (995) 321-84-01</a>
            <a href="mailto:kubancenter@mail.ru"><EnvelopeSimple size={22} />kubancenter@mail.ru</a>
          </div>
          <button className="button" onClick={() => openForm("Бесплатная консультация в офисе")}>Записаться</button>
        </div>
        <div className="contacts__map reveal" aria-label="Яндекс Карта: Краснодар, улица Красная, 160">
          <iframe
            title="Яндекс Карта: Краснодар, улица Красная, 160"
            src="https://yandex.ru/map-widget/v1/?ll=38.976454%2C45.039808&mode=search&ol=geo&pt=38.976454%2C45.039808%2Cpm2rdm&z=16&lang=ru_RU"
            loading="lazy"
            allowFullScreen
          />
          <a href="https://yandex.ru/maps/?text=Краснодар%2C%20Красная%20160" target="_blank" rel="noreferrer">Открыть в Яндекс Картах <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function Footer({ setLegal }) {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div><Brand light /><p>Учеба, языковые программы и каникулы в Китае с полным сопровождением.</p></div>
        <div><h3>Направления</h3><a href="#university">Поступление</a><a href="#visa">Визы</a><a href="#programs">Каникулы</a><a href="#safety">Сопровождение</a><a href="#language">Китайский язык</a></div>
        <div><h3>Связаться</h3><a className="footer__social-link" href={WHATSAPP_HREF} target="_blank" rel="noreferrer"><SocialIcon name="whatsapp" size={18} />WhatsApp</a><a className="footer__social-link" href={TELEGRAM_HREF} target="_blank" rel="noreferrer"><SocialIcon name="telegram" size={18} />Telegram</a><a className="footer__social-link" href={MAX_HREF} target="_blank" rel="noreferrer"><SocialIcon name="max" size={18} />MAX</a><a className="footer__social-link" href={VK_HREF} target="_blank" rel="noreferrer"><SocialIcon name="vk" size={18} />ВКонтакте</a></div>
        <div><h3>Документы</h3><button onClick={() => setLegal("privacy")}>Политика ПДн</button><button onClick={() => setLegal("offer")}>Публичная оферта</button><p>ИП Лазаренко Наталья Леонидовна<br />ИНН 231009681142</p></div>
      </div>
      <div className="shell footer__bottom"><span>© 2026 Бай Цзэ</span><span>Краснодар, ул. Красная 160</span></div>
    </footer>
  );
}

function Modal({ children, onClose, className = "" }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal__panel ${className}`}>
        <button className="icon-button modal__close" onClick={onClose} aria-label="Закрыть"><X size={24} /></button>
        {children}
      </div>
    </div>
  );
}

function LeadForm({ title, onClose, defaultGoal = "" }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || String(data.get("phone")).replace(/\D/g, "").length < 10 || !data.get("consent")) {
      setError("Заполните имя, телефон и подтвердите согласие на обработку данных.");
      return;
    }
    setError("");
    setState("loading");
    window.setTimeout(() => setState("success"), 650);
  };

  if (state === "success") {
    return <div className="form-success"><Check size={36} weight="bold" /><h2>Спасибо!</h2><p>Заявка подготовлена. Менеджер свяжется с вами в рабочее время.</p><button className="button" onClick={onClose}>Готово</button></div>;
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <h2>{title}</h2>
      <p>Оставьте контакты. Первая консультация бесплатна.</p>
      <label>Ваше имя<input name="name" autoComplete="name" /></label>
      <label>Телефон<input name="phone" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></label>
      <label>Направление<select name="goal" defaultValue={defaultGoal}><option value="">Выберите направление</option><option>Каникулы в Китае</option><option>Поступление в вуз</option><option>Визовое сопровождение</option><option>Китайский язык</option></select></label>
      <label className="checkbox"><input type="checkbox" name="consent" /><span>Согласен с политикой обработки персональных данных</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--wide" disabled={state === "loading"}>{state === "loading" ? "Отправляем..." : "Отправить заявку"}</button>
    </form>
  );
}

function ProgramModal({ program, onClose, openQuiz }) {
  return (
    <Modal onClose={onClose} className="program-modal">
      <img src={program.image} alt="" />
      <div className="program-modal__copy">
        <small>{program.meta}</small><h2>{program.title}</h2><p>{program.description}</p>
        <div><Sparkle size={20} /><span><strong>Кому подойдёт</strong>{program.fit}</span></div>
        <p>Даты, стоимость, точная программа и условия участия подтверждаются менеджером после короткой консультации.</p>
        <button className="button" onClick={() => { onClose(); openQuiz(); }}>Подобрать программу</button>
      </div>
    </Modal>
  );
}

function QuizModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const recommendation = useMemo(() => recommendProgram(answers), [answers]);
  const current = quizSteps[step];
  const choose = (option) => {
    setAnswers((value) => ({ ...value, [current.id]: option }));
    if (step < quizSteps.length - 1) window.setTimeout(() => setStep((value) => value + 1), 130);
  };

  if (submitted) {
    return (
      <Modal onClose={onClose} className="quiz-modal">
        <div className="quiz-result"><Check size={38} weight="bold" /><h2>Подборка формируется</h2><p>Менеджер напишет вам в рабочее время и пришлёт варианты с актуальными датами и стоимостью.</p><button className="button" onClick={onClose}>Готово</button></div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} className="quiz-modal">
      {step < quizSteps.length ? (
        <>
          <div className="quiz__progress"><span>Вопрос {step + 1} из {quizSteps.length}</span><div><i style={{ width: `${((step + 1) / quizSteps.length) * 100}%` }} /></div></div>
          <h2>{current.title}</h2>
          <div className="quiz__options">
            {current.options.map((option) => <button className={answers[current.id] === option ? "is-selected" : ""} key={option} onClick={() => choose(option)}>{option}<ArrowRight size={18} /></button>)}
          </div>
          <button className="quiz__back" disabled={step === 0} onClick={() => setStep((value) => value - 1)}><ArrowLeft size={18} />Назад</button>
        </>
      ) : null}
      {step === quizSteps.length - 1 && answers[current.id] && (
        <div className="quiz-final">
          <div className="quiz-final__recommend"><small>Рекомендуем начать с</small><strong>{recommendation.title}</strong><span>{recommendation.description}</span></div>
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <label>Ваше имя<input required name="name" autoComplete="name" /></label>
            <label>Телефон<input required name="phone" autoComplete="tel" inputMode="tel" /></label>
            <label className="checkbox"><input required type="checkbox" /><span>Согласен на обработку персональных данных</span></label>
            <button className="button button--wide">Получить подбор программ</button>
          </form>
        </div>
      )}
    </Modal>
  );
}

function LegalModal({ type, onClose }) {
  const privacy = type === "privacy";
  return (
    <Modal onClose={onClose} className="legal-modal">
      <article>
        <p className="legal__notice">Редакция от 12 августа 2026 года. Черновик для юридической проверки.</p>
        <h2>{privacy ? "Политика обработки персональных данных" : "Публичная оферта"}</h2>
        {privacy ? (
          <>
            <h3>1. Оператор и общие положения</h3><p>Оператор: ИП Лазаренко Наталья Леонидовна, ИНН 231009681142, бренд «Бай Цзэ». Контакт для обращений: china@baize.ru. Политика применяется к данным, полученным через формы сайта, телефон, электронную почту и мессенджеры.</p>
            <h3>2. Какие данные обрабатываются</h3><p>Имя, номер телефона, адрес электронной почты, выбранное направление, ответы квиза, источник обращения и технические данные, необходимые для работы сайта. Данные о здоровье, документах и несовершеннолетних не должны передаваться через общую форму.</p>
            <h3>3. Цели и основания</h3><p>Ответ на обращение, подбор программы, подготовка консультации, исполнение договора и выполнение требований закона. Обработка на основании согласия прекращается после его отзыва, если иное хранение не требуется законом или договором.</p>
            <h3>4. Передача и хранение</h3><p>Данные могут передаваться подрядчикам по CRM, хостингу и связи только в необходимом объёме и при наличии договорных мер защиты. До подключения этих систем их точный перечень и сроки хранения необходимо утвердить.</p>
            <h3>5. Права пользователя</h3><p>Пользователь вправе запросить сведения об обработке, уточнение, блокирование или удаление данных, а также отозвать согласие, направив письмо оператору.</p>
          </>
        ) : (
          <>
            <h3>1. Статус документа</h3><p>Эта страница содержит предварительные условия оказания консультационных и сопроводительных услуг. Конкретная программа, цена, сроки, состав услуг и правила возврата фиксируются в индивидуальном договоре или счёте до оплаты.</p>
            <h3>2. Исполнитель</h3><p>ИП Лазаренко Наталья Леонидовна, ИНН 231009681142, бренд «Бай Цзэ», Краснодар, ул. Красная 160, офис 307.</p>
            <h3>3. Предмет</h3><p>Исполнитель оказывает услуги по подбору зарубежных образовательных и каникулярных программ, информационному, документальному и визовому сопровождению в согласованном объёме.</p>
            <h3>4. Цена и заключение договора</h3><p>Размещение заявки не создаёт обязанности по оплате. Договор считается заключённым после согласования существенных условий и совершения заказчиком предусмотренного платежа.</p>
            <h3>5. Ответственность</h3><p>Исполнитель отвечает за собственные обязательства в согласованном объёме. Решения вузов, консульств, перевозчиков и принимающих организаций находятся вне прямого контроля исполнителя, если иное прямо не зафиксировано договором.</p>
            <h3>6. Возвраты и споры</h3><p>Условия отказа, возврата и расчёта фактически понесённых расходов определяются индивидуальным договором и применимым законодательством РФ.</p>
          </>
        )}
      </article>
    </Modal>
  );
}

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [program, setProgram] = useState(null);
  const [form, setForm] = useState(null);
  const [legal, setLegal] = useState(null);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header openQuiz={() => setQuizOpen(true)} />
      <main>
        <Hero openQuiz={() => setQuizOpen(true)} />
        <WhyChina />
        <StudyAbroad openForm={(title) => setForm({ title, goal: "Поступление в вуз" })} />
        <DetailSection
          id="university" icon={GraduationCap}
          title="Китай: образовательный хаб XXI века"
          intro="Подготовим к HSK, подберём университет, поможем получить грант и студенческую визу."
          description="Вам не нужно искать университет на китайском сайте и разбираться в требованиях в одиночку. Мы берём процесс поступления на себя."
          steps={universitySteps}
          included={["Персональный куратор", "Подача в 3-5 университетов", "Подготовка документов", "Помощь с грантом", "Студенческая виза", "Встреча и адаптация"]}
          button="Записаться на консультацию" openForm={(title) => setForm({ title, goal: "Поступление в вуз" })}
        />
        <About openConsultation={() => setForm({ title: "Бесплатная консультация", goal: "" })} />
        <Faq />
        <DetailSection
          id="visa" icon={BookOpenText} reverse
          title="Пока вы собираете чемоданы, мы открываем визу"
          intro="Полное визовое сопровождение для детей и взрослых: от анкеты до паспорта с визой."
          description="Оформляем учебные краткосрочные и долгосрочные визы, а также деловые визы для поездок и стажировок."
          steps={visaSteps}
          included={["Проверка документов", "Заполнение анкеты", "Медицинская страховка", "Запись в визовый центр", "Контроль сроков", "Передача паспорта"]}
          button="Консультация по визе" image="/assets/airport-support.webp" openForm={(title) => setForm({ title, goal: "Визовое сопровождение" })}
        />
        <Programs openProgram={setProgram} />
        <Safety />
        <Language openForm={(title) => setForm({ title, goal: "Китайский язык" })} />
        <Reviews openForm={(title) => setForm({ title, goal: "" })} />
        <Cases />
        <QuizBanner openQuiz={() => setQuizOpen(true)} />
        <Contacts openForm={(title) => setForm({ title, goal: "" })} />
      </main>
      <Footer setLegal={setLegal} />
      <div className="floating-social" aria-label="Быстрая связь">
        <a className="floating-social__whatsapp" href={WHATSAPP_HREF} target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp"><SocialIcon name="whatsapp" size={25} /></a>
        <a className="floating-social__telegram" href={TELEGRAM_HREF} target="_blank" rel="noreferrer" aria-label="Написать в Telegram"><SocialIcon name="telegram" size={25} /></a>
        <a className="floating-social__max" href={MAX_HREF} target="_blank" rel="noreferrer" aria-label="Написать в MAX"><SocialIcon name="max" size={25} /></a>
        <a className="floating-social__vk" href={VK_HREF} target="_blank" rel="noreferrer" aria-label="Открыть ВКонтакте"><SocialIcon name="vk" size={25} /></a>
      </div>
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {program && <ProgramModal program={program} onClose={() => setProgram(null)} openQuiz={() => setQuizOpen(true)} />}
      {form && <Modal onClose={() => setForm(null)} className="form-modal"><LeadForm title={form.title} defaultGoal={form.goal} onClose={() => setForm(null)} /></Modal>}
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  );
}
