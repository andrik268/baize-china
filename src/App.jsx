import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Buildings,
  Check,
  Clock,
  DownloadSimple,
  EnvelopeSimple,
  GlobeHemisphereEast,
  GraduationCap,
  List,
  MapPin,
  PaperPlaneTilt,
  Phone,
  ShieldCheck,
  Sparkle,
  Student,
  Translate,
  UsersThree,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import {
  programs,
  quizSteps,
  recommendProgram,
  universitySteps,
  visaSteps,
} from "./data.js";

const CONTACT_PHONE = "+7 (903) 450-54-43";
const CONTACT_PHONE_HREF = "tel:+79034505443";
const WHATSAPP_HREF = "https://wa.me/79034505443";
const TELEGRAM_HREF = "https://t.me/chinainsummer";

const whyChina = [
  { icon: GlobeHemisphereEast, title: "Язык будущего", text: "Китайский язык международной бизнес-элиты." },
  { icon: Buildings, title: "Технологии", text: "Знакомство с IT-гигантами и технопарками." },
  { icon: Student, title: "Самостоятельность", text: "Международная среда учит адаптивности." },
  { icon: ShieldCheck, title: "Безопасность", text: "Китай входит в число безопасных стран для учебы." },
];

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
    ["Каникулы", "#programs"],
    ["Курсы", "#language"],
    ["Визы", "#visa"],
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
          <p className="eyebrow">Учеба и каникулы в Китае</p>
          <h1>Открываем Китай для вас и ваших детей</h1>
          <p className="hero__lead">Язык, культура и технологии будущего. Полное сопровождение из России и визовая поддержка.</p>
          <div className="button-row">
            <a className="button" href="#programs">Смотреть программы <ArrowRight size={18} /></a>
            <button className="button button--ghost" onClick={openQuiz}>Подобрать за 1 минуту</button>
          </div>
        </div>
        <div className="hero__visual reveal reveal--delay">
          <div className="hero__rings" aria-hidden="true" />
          <img src="/assets/hero-campus.webp" alt="Подростки с куратором на современном кампусе в Китае" fetchPriority="high" />
          <div className="hero__note hero__note--top">
            <ShieldCheck size={28} />
            <span><strong>Летим вместе</strong>Сопровождение группы</span>
          </div>
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
  return (
    <section className="section section--compact" aria-labelledby="why-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="why-title">Зачем отправлять ребёнка в Поднебесную?</h2>
          <p>Поездка становится первым самостоятельным шагом в международное образование.</p>
        </div>
        <div className="benefit-grid reveal">
          {whyChina.map(({ icon: Icon, title, text }) => (
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

function Programs({ openProgram }) {
  return (
    <section className="section programs" id="programs" aria-labelledby="programs-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="programs-title">Выберите своё приключение</h2>
          <p>Для детей, студентов и взрослых: от первой поездки в лагерь до знакомства с университетом.</p>
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
            <button className="button" onClick={() => openForm("Записаться на пробный урок")}>Записаться</button>
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
        <div className="contacts__map reveal" aria-label="Схема расположения офиса">
          <div className="map__roads" aria-hidden="true" />
          <div className="map__pin"><MapPin size={30} weight="fill" /><strong>Красная, 160</strong><span>офис 307</span></div>
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
        <div><h3>Направления</h3><a href="#programs">Каникулы</a><a href="#university">Поступление</a><a href="#language">Китайский язык</a><a href="#visa">Визы</a></div>
        <div><h3>Связаться</h3><a href={WHATSAPP_HREF} target="_blank" rel="noreferrer">WhatsApp</a><a href={TELEGRAM_HREF} target="_blank" rel="noreferrer">Telegram</a><a href="https://vk.ru/study.holidays" target="_blank" rel="noreferrer">ВКонтакте</a></div>
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
        <Programs openProgram={setProgram} />
        <Safety />
        <About openConsultation={() => setForm({ title: "Бесплатная консультация", goal: "" })} />
        <DetailSection
          id="university" icon={GraduationCap}
          title="Китай: образовательный хаб XXI века"
          intro="Подготовим к HSK, подберём университет, поможем получить грант и студенческую визу."
          description="Вам не нужно искать университет на китайском сайте и разбираться в требованиях в одиночку. Мы берём процесс поступления на себя."
          steps={universitySteps}
          included={["Персональный куратор", "Подача в 3-5 университетов", "Подготовка документов", "Помощь с грантом", "Студенческая виза", "Встреча и адаптация"]}
          button="Записаться на консультацию" openForm={(title) => setForm({ title, goal: "Поступление в вуз" })}
        />
        <DetailSection
          id="visa" icon={BookOpenText} reverse
          title="Пока вы собираете чемоданы, мы открываем визу"
          intro="Полное визовое сопровождение для детей и взрослых: от анкеты до паспорта с визой."
          description="Оформляем учебные краткосрочные и долгосрочные визы, а также деловые визы для поездок и стажировок."
          steps={visaSteps}
          included={["Проверка документов", "Заполнение анкеты", "Медицинская страховка", "Запись в визовый центр", "Контроль сроков", "Передача паспорта"]}
          button="Консультация по визе" image="/assets/airport-support.webp" openForm={(title) => setForm({ title, goal: "Визовое сопровождение" })}
        />
        <Language openForm={(title) => setForm({ title, goal: "Китайский язык" })} />
        <QuizBanner openQuiz={() => setQuizOpen(true)} />
        <Contacts openForm={(title) => setForm({ title, goal: "" })} />
      </main>
      <Footer setLegal={setLegal} />
      <div className="floating-social" aria-label="Быстрая связь"><a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp"><WhatsappLogo size={24} weight="fill" /></a><a href={TELEGRAM_HREF} target="_blank" rel="noreferrer" aria-label="Написать в Telegram"><PaperPlaneTilt size={22} weight="fill" /></a></div>
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {program && <ProgramModal program={program} onClose={() => setProgram(null)} openQuiz={() => setQuizOpen(true)} />}
      {form && <Modal onClose={() => setForm(null)} className="form-modal"><LeadForm title={form.title} defaultGoal={form.goal} onClose={() => setForm(null)} /></Modal>}
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  );
}
