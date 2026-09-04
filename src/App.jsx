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
  quizSteps,
  recommendProgram,
} from "./data.js";
import { loadRemoteCms, submitLead } from "./apiClient.js";
import { defaultCmsData, getBlock, mergeCmsData } from "./cmsData.js";
import { CmsContext, useCms } from "./cmsContext.js";
import { initVkAdsPixel } from "./vkPixel.js";

const CONTACT_PHONE = "+7 (903) 450-54-43";
const CONTACT_PHONE_HREF = "tel:+79034505443";
const WHATSAPP_HREF = "https://wa.me/qr/NL4IWGGHHW3HL1";
const TELEGRAM_HREF = "https://t.me/chinainsummer";
const MAX_HREF = "https://max.ru/u/f9LHodD0cOIIDx6pG5WILnOJudHFpeJU2O83YpgmMthMi0cPQNv2JWO20gM";
const MAX_CHANNEL_HREF = "https://max.ru/join/_iffpxt8pk9Rf29rOX1swElr4iSKT22FMtNA6yUC_NE";
const VK_HREF = "https://vk.ru/study.holidays";

// Keep the proven public presentation available even when an older CMS
// snapshot has no media references yet. Once a client adds a media field in
// the new editor, that selected file is used instead of the fallback.
const CASE_VIDEO_SOURCES = [
  "/assets/videos/18335854955128.mp4",
  "/assets/videos/8526131038840.mp4",
  "/assets/videos/18216247233144.mp4",
  "/assets/videos/18216256932472.mp4",
  "/assets/videos/18216264469112.mp4",
];

const CASE_VIDEO_FALLBACKS = [
  { title: "Поступление в вуз", text: "Реальная история поступления в китайский вуз." },
  { title: "Каникулы в Китае", text: "Одно из любимых занятий на программе — фотосессия в национальных костюмах." },
  { title: "Китайский язык", text: "«Дети все такие умные, хорошенькие...», — преподаватель китайского языка поделилась впечатлениями об участии в нашем летнем лагере." },
  { title: "Поддержка на каждом шаге", text: "Куратор рядом до, во время и после поездки." },
  { title: "Новый опыт в Китае", text: "Еще одна реальная история участника программы Бай Цзэ." },
];

const REVIEW_VIDEO_SOURCES = [
  "/assets/videos/18216269384312.mp4",
  "/assets/videos/18216273709688.mp4",
  "/assets/videos/18216283802232.mp4",
];

const REVIEW_VIDEO_FALLBACKS = [
  { title: "Отзыв участника", text: "Личная история о поездке и впечатлениях от программы." },
  { title: "Отзыв семьи", text: "Что особенно понравилось родителям и студентам." },
  { title: "Опыт обучения", text: "Реальный отзыв о поддержке и результатах программы." },
];

const CASE_CONTENT_OVERRIDES = [
  CASE_VIDEO_FALLBACKS[0],
  CASE_VIDEO_FALLBACKS[1],
  CASE_VIDEO_FALLBACKS[2],
];

function blockContent(cms, id) {
  return getBlock(cms, id)?.content || getBlock(defaultCmsData, id).content;
}

const FALLBACK_NAVIGATION_HREFS = {
  Университеты: "#universities",
  Визы: "#visa",
  Каникулы: "#programs",
  Сопровождение: "#safety",
  Курсы: "#language",
  "О нас": "#about",
  Новости: "#news",
};

const FALLBACK_FOOTER_LINKS = [
  { label: "Университеты", href: "#universities" },
  { label: "Как поступить", href: "#university" },
  { label: "Визы", href: "#visa" },
  { label: "Каникулы", href: "#programs" },
  { label: "Сопровождение", href: "#safety" },
  { label: "Китайский язык", href: "#language" },
];

const FALLBACK_SOCIALS = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp" },
  { label: "Telegram", href: TELEGRAM_HREF, icon: "telegram" },
  { label: "MAX", href: MAX_HREF, icon: "max" },
  { label: "ВКонтакте", href: VK_HREF, icon: "vk" },
];

const DEFAULT_CONSENT_TEXT = "Нажимая на кнопку, я даю согласие на обработку персональных данных и соглашаюсь с Политикой конфиденциальности.";
const DEFAULT_COOKIE_TEXT = "Мы используем файлы cookie для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей Политикой конфиденциальности.";

function getSocials(cms) {
  return blockContent(cms, "contacts").socials || FALLBACK_SOCIALS;
}

function getNavigationLinks(content) {
  const labels = content.navigation || [];
  const navigation = labels.some((label) => label === "Новости") ? labels : [...labels, "Новости"];
  return navigation.map((label) => [label, content.navigationHrefs?.[label] || FALLBACK_NAVIGATION_HREFS[label] || "#top"]);
}

function mediaPath(value) {
  if (typeof value === "string") return value;
  return value?.path || value?.src || "";
}

function formatNewsDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
}

function ConsentCopy({ text }) {
  const value = String(text || DEFAULT_CONSENT_TEXT);
  const policyMarker = "Политикой конфиденциальности";
  const markerIndex = value.indexOf(policyMarker);
  if (markerIndex >= 0) {
    return <>{value.slice(0, markerIndex)}<a href="/privacy-policy">{policyMarker}</a>{value.slice(markerIndex + policyMarker.length)}</>;
  }
  return <>{value} <a href="/privacy-policy">Политика конфиденциальности</a>.</>;
}

const SOCIAL_ICON_PATHS = {
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  telegram: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  vk: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z",
  max: "M1.769 0A1.77 1.77 0 0 0 0 1.769V22.23A1.77 1.77 0 0 0 1.769 24H22.23A1.77 1.77 0 0 0 24 22.231V1.77A1.77 1.77 0 0 0 22.231 0zm12.485 3.28a4.301 4.301 0 0 1 4.3 4.302 4.301 4.301 0 0 1-1.993 3.63 6.085 6.085 0 0 1 1.054 3.422 6.085 6.085 0 0 1-6.085 6.085 6.085 6.085 0 0 1-6.085-6.085 6.085 6.085 0 0 1 4.66-5.916 4.301 4.301 0 0 1-.152-1.136 4.301 4.301 0 0 1 4.301-4.301zm0 1.849a2.453 2.453 0 0 0-2.453 2.453 2.453 2.453 0 0 0 2.453 2.453 2.453 2.453 0 0 0 2.453-2.453 2.453 2.453 0 0 0-2.453-2.453zm-2.724 5.268a4.237 4.237 0 0 0-4.237 4.237 4.237 4.237 0 0 0 4.237 4.237 4.237 0 0 0 4.237-4.237 4.237 4.237 0 0 0-4.237-4.237zm.032 2.54a1.781 1.781 0 1 1 0 3.562 1.781 1.781 0 0 1 0-3.562Z",
};

function SocialIcon({ name, size = 24 }) {
  if (name === "max") {
    return <img className="social-icon social-icon--max" width={size} height={size} src="/assets/max-logo-official.svg" alt="" aria-hidden="true" />;
  }

  return (
    <svg className={`social-icon social-icon--${name}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={SOCIAL_ICON_PATHS[name]} />
    </svg>
  );
}

function Brand({ light = false }) {
  const cms = useCms();
  const brand = blockContent(cms, "header");
  return (
    <a className={`brand ${light ? "brand--light" : ""}`} href={brand.brandHref || "#top"}>
      <span className="brand__mark" aria-hidden="true">
        {brand.logo?.path ? <img src={brand.logo.path} alt="" /> : <svg viewBox="0 0 48 48" role="presentation">
          <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".24" />
          <path d="M9 31c3.9-9.8 10.4-15 19.2-15 4.2 0 7.9 1.2 10.8 3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10.5 35.2c6.6-2.5 14.4-2.2 22.8 2.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".78" />
          <circle cx="34.3" cy="11.6" r="3.2" fill="#e1b450" />
          <text x="24" y="30" textAnchor="middle" fill="currentColor" fontSize="9.2" fontWeight="800" letterSpacing=".4">白泽</text>
        </svg>}
      </span>
      <span className="brand__copy">
        <strong>{brand.brand}</strong>
        <small>{brand.tagline}</small>
      </span>
    </a>
  );
}

function Header({ openQuiz }) {
  const cms = useCms();
  const c = blockContent(cms, "header");
  const [menuOpen, setMenuOpen] = useState(false);
  const links = getNavigationLinks(c);

  return (
    <header className="site-header">
      <div className="shell header__row">
        <Brand />
        <nav className={`nav ${menuOpen ? "nav--open" : ""}`} aria-label="Основная навигация">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav__mobile-phone" href={c.phoneHref || CONTACT_PHONE_HREF}>{c.phone}</a>
        </nav>
        <div className="header__actions">
          <a className="header__phone" href={c.phoneHref || CONTACT_PHONE_HREF}>{c.phone}</a>
          <button className="button button--small" onClick={openQuiz}>{c.buttonText}</button>
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
  const cms = useCms();
  const c = blockContent(cms, "hero");
  return (
    <section className="hero section" id="top">
      <div className="shell hero__grid">
        <div className="hero__copy reveal">
          <p className="eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p className="hero__lead">{c.lead}</p>
          <div className="hero__services">
            {(c.services || []).map((service) => <span key={service}>{service}</span>)}
          </div>
          <div className="button-row">
            <a className="button" href={c.primaryButtonHref || "#programs"}>{c.primaryButton} <ArrowRight size={18} /></a>
            <button className="button button--ghost" onClick={openQuiz}>{c.secondaryButton}</button>
          </div>
        </div>
        <div className="hero__visual reveal reveal--delay">
          <div className="hero__rings" aria-hidden="true" />
          <img src={c.image?.path} alt={c.image?.alt || ""} fetchPriority="high" />
          <div className="hero__note hero__note--bottom">
            <strong>{c.noteTitle}</strong>
            <span>{c.noteText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChina() {
  const cms = useCms(); const c = blockContent(cms, "why");
  const icons = [GlobeHemisphereEast, Buildings, Translate, ShieldCheck];
  return (
    <section className="section section--compact" aria-labelledby="why-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="why-title">{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="benefit-grid reveal">
          {(c.items || []).map(({ title, text }, index) => {
            const Icon = icons[index % icons.length];
            return (
            <article className="benefit" key={title}>
              <Icon size={32} weight="duotone" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StudyAbroad({ openForm }) {
  const cms = useCms(); const c = blockContent(cms, "studyAbroad");

  return (
    <section className="section study-abroad" id="study-abroad" aria-labelledby="study-abroad-title">
      <div className="shell">
        <div className="study-abroad__heading reveal">
          <h2 id="study-abroad-title">{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="study-abroad__fears reveal">
          {(c.fears || []).map(({ title, text }, index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <div className="study-abroad__cta reveal">
          <div>
            <h3>{c.ctaTitle}</h3>
            <p>{c.ctaText}</p>
          </div>
          <button className="button" onClick={() => openForm(c.ctaButton)}>{c.ctaButton} <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function Universities() {
  const cms = useCms(); const c = blockContent(cms, "universities");
  return (
    <section className="section universities" id="universities" aria-labelledby="universities-title">
      <div className="shell">
        <div className="universities__intro reveal">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="universities-title">{c.title}</h2>
            {(c.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <img src={c.image?.path} alt={c.image?.alt || ""} loading="lazy" />
        </div>
        <div className="universities__accordions reveal">
          {(c.groups || []).map((group) => (
            <details className="university-accordion" key={group.title}>
              <summary><span><strong>{group.title}</strong><small>{group.summary}</small></span><b aria-hidden="true">+</b></summary>
              <div className="university-accordion__body">
                {group.items.map(([title, text]) => (
                  <article key={title}><h3>{title}</h3><p>{text}</p></article>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programs({ openProgram }) {
  const cms = useCms(); const c = blockContent(cms, "programs");
  return (
    <section className="section programs" id="programs" aria-labelledby="programs-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="programs-title">{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="program-grid">
          {(c.programs || []).filter((program) => program.isActive !== false).map((program, index) => (
            <button
              className={`program-card program-card--${index + 1} reveal`}
              key={program.slug}
              onClick={() => openProgram(program)}
            >
              <img
                src={program.cardImage?.path || program.cardImage || program.image?.path || program.image}
                alt={program.cardImage?.alt || program.title || ""}
                loading="lazy"
              />
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
  const cms = useCms(); const c = blockContent(cms, "safety");
  return (
    <section className="section" id="safety">
      <div className="shell safety__grid">
        <div className="safety__media reveal">
          <img src={c.image?.path} alt={c.image?.alt || ""} loading="lazy" />
          <div className="safety__badge"><ShieldCheck size={24} /> {c.badge || "Группа под присмотром"}</div>
        </div>
        <div className="safety__copy reveal">
          <h2>{c.title}</h2>
          <p>{c.text}</p>
          <div className="check-grid">
            {(c.points || []).map((point) => <span key={point}><Check size={18} weight="bold" />{point}</span>)}
          </div>
          <a className="text-link" href={c.linkHref || "#contacts"}>{c.linkText} <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function About({ openConsultation }) {
  const cms = useCms(); const c = blockContent(cms, "about");
  return (
    <section className="section about" id="about">
      <div className="shell about__grid reveal">
        <div className="about__big">{c.number}</div>
        <div>
          <h2>{c.title}</h2>
          <p className="about__lead">{c.lead}</p>
        </div>
        <div className="about__body">
          {(c.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <button className="button button--light" onClick={openConsultation}>{c.button}</button>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const cms = useCms(); const c = blockContent(cms, "faq");
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="faq-title">{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="faq__groups reveal">
          {(c.groups || []).map((group) => (
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

function Reviews({ openReviewForm }) {
  const cms = useCms(); const c = blockContent(cms, "reviews");
  const cmsItems = Array.isArray(c.items) ? c.items.filter((item) => item.isActive !== false && item.video?.path) : [];
  const items = cmsItems.length ? cmsItems : REVIEW_VIDEO_FALLBACKS.map((item, index) => ({ ...item, video: { path: REVIEW_VIDEO_SOURCES[index], kind: "video" } }));
  const [activeReview, setActiveReview] = useState(0);
  const activeItem = items[activeReview] || items[0];
  const moveReview = (offset) => setActiveReview((value) => (value + offset + items.length) % items.length);

  useEffect(() => {
    if (activeReview >= items.length) setActiveReview(0);
  }, [activeReview, items.length]);

  if (!activeItem) return null;
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="shell reviews__layout">
        <div className="reviews__lead reveal">
          <span className="reviews__mark"><ChatsCircle size={32} weight="duotone" /></span>
          <h2 id="reviews-title">{c.title}</h2>
          <p>{c.lead}</p>
          {openReviewForm ? <button className="button button--ghost reviews__review-button" type="button" onClick={openReviewForm}>{c.reviewButton || "Оставить отзыв"} <ArrowRight size={18} /></button> : null}
        </div>
        <div className="reviews__videos reveal">
          <div className="reviews-slider" role="region" aria-roledescription="carousel" aria-label="Видео-отзывы">
            <article className="review-video-card">
              <video className="review-video-card__video" controls preload="metadata" playsInline src={activeItem.video.path} aria-label={activeItem.title} />
              <div className="review-video-card__body">
                <strong>{activeItem.title}</strong>
                <p>{activeItem.text}</p>
              </div>
            </article>
            <div className="reviews-slider__controls">
              <button className="reviews-slider__arrow" type="button" onClick={() => moveReview(-1)} aria-label="Предыдущий отзыв">
                <ArrowLeft size={20} />
              </button>
              <div className="reviews-slider__dots" role="tablist" aria-label="Выбор отзыва">
                {items.map((item, index) => (
                  <button
                    className={`reviews-slider__dot ${index === activeReview ? "reviews-slider__dot--active" : ""}`}
                    key={item.video.path || index}
                    type="button"
                    role="tab"
                    aria-selected={index === activeReview}
                    aria-label={`Отзыв ${index + 1}`}
                    onClick={() => setActiveReview(index)}
                  />
                ))}
              </div>
              <span className="reviews-slider__count">{activeReview + 1} / {items.length}</span>
              <button className="reviews-slider__arrow" type="button" onClick={() => moveReview(1)} aria-label="Следующий отзыв">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function News() {
  const cms = useCms();
  const posts = Array.isArray(cms.posts) ? cms.posts.filter((post) => post?.isPublished !== false) : [];
  const fallbackImages = ["/assets/hero-campus.webp", "/assets/chengdu-family.webp", "/assets/hainan-language.webp"];

  if (!posts.length) return null;
  return (
    <section className="section news" id="news" aria-labelledby="news-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <p className="eyebrow">Бай Цзэ · Новости</p>
          <h2 id="news-title">Новости</h2>
          <p>Полезные материалы, новые программы и важные даты для тех, кто планирует учёбу и каникулы в Китае.</p>
        </div>
        <div className="news-grid">
          {posts.map((post, index) => {
            const cover = mediaPath(post.coverImage) || fallbackImages[index % fallbackImages.length];
            return (
              <article className="news-card reveal" key={post.id || `${post.title}-${index}`}>
                <div className="news-card__media">
                  <img src={cover} alt={post.title || "Новость Бай Цзэ"} loading="lazy" />
                </div>
                <div className="news-card__body">
                  {post.publishedAt ? <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt)}</time> : null}
                  <h3>{post.title}</h3>
                  {post.description ? <p>{post.description}</p> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cases() {
  const cms = useCms(); const c = blockContent(cms, "cases"); const icons = [GraduationCap, GlobeHemisphereEast, Translate];
  const cmsItems = Array.isArray(c.items) ? c.items : [];
  const items = CASE_VIDEO_SOURCES.map((fallbackVideo, index) => {
    const cmsItem = cmsItems[index];
    const media = cmsItem && Object.prototype.hasOwnProperty.call(cmsItem, "video") ? cmsItem.video?.path : fallbackVideo;
    const legacyCopy = cmsItem && Object.prototype.hasOwnProperty.call(cmsItem, "video") ? {} : CASE_CONTENT_OVERRIDES[index];
    return { ...CASE_VIDEO_FALLBACKS[index], ...cmsItem, ...legacyCopy, video: media ? { path: media } : null };
  }).filter((item) => item.isActive !== false);
  return (
    <section className="section cases" id="cases" aria-labelledby="cases-title">
      <div className="shell">
        <div className="heading-stack reveal">
          <h2 id="cases-title">{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="cases__grid">
            {items.map(({ title, text, image, video }, index) => {
              const Icon = icons[index % icons.length];
              return (
              <article className="case-card reveal" key={title}>
              {video?.path ? (
                <video className="case-card__video" controls preload="metadata" playsInline src={video.path} aria-label={title} />
              ) : (
                <img className="case-card__image" src={image?.path || image} alt={image?.alt || ""} loading="lazy" />
              )}
              <span className="case-card__icon"><Icon size={28} weight="duotone" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function DetailSection({ id, icon: Icon, title, intro, description, steps, included, button, image, reverse = false, openForm }) {
  const cms = useCms(); const c = blockContent(cms, id);
  title = c.title; intro = c.intro; description = c.description; steps = c.steps; included = c.included; button = c.button; image = c.image?.path || image;
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
          <h3>{c.panelTitle || "Как мы работаем"}</h3>
          <ol className="step-list">
            {steps.map(([name, text]) => (
              <li key={name}><span><Check size={16} weight="bold" /></span><div><strong>{name}</strong><p>{text}</p></div></li>
            ))}
          </ol>
          <details>
            <summary>{c.includedTitle || "Что входит в услугу"} <ArrowRight size={18} /></summary>
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
  const cms = useCms(); const c = blockContent(cms, "language");
  return (
    <section className="section language" id="language">
      <div className="shell">
        <div className="language__head reveal">
          <div>
            <h2>{c.title}</h2>
            <p>{c.lead}</p>
          </div>
          <Translate size={64} weight="duotone" />
        </div>
        <div className="language__layout">
          <div className="language__image reveal">
            <img src={c.image?.path} alt={c.image?.alt || ""} loading="lazy" />
            <div><strong>{c.badgeTitle}</strong><span>{c.badgeText}</span></div>
          </div>
          <div className="language__features reveal">
            {(c.features || []).map(({ title, text }) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
            <p className="language__statement">{c.statement}</p>
            <button className="button" onClick={() => openForm(c.button)}>{c.button} <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizBanner({ openQuiz }) {
  const cms = useCms(); const c = blockContent(cms, "quiz");
  return (
    <section className="section quiz-banner" id="quiz">
      <div className="shell quiz-banner__inner reveal">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2>{c.title}</h2>
          <p>{c.lead}</p>
        </div>
        <div className="quiz-banner__action">
          <div><Clock size={20} /> {c.minuteText || "1 минута"}</div>
          <button className="button button--terracotta" onClick={openQuiz}>{c.button} <ArrowRight size={18} /></button>
          <small>{c.privacyText || "Ваши данные защищены"}</small>
        </div>
      </div>
    </section>
  );
}

function Contacts({ openForm }) {
  const cms = useCms(); const c = blockContent(cms, "contacts");
  const maxChannelHref = c.maxChannelHref || MAX_CHANNEL_HREF;
  const maxChannelLabel = c.maxChannelLabel || "Канал MAX";
  const phoneHref = c.phoneHref || `tel:${String(c.phone || "").replace(/\D/g, "")}`;
  const secondPhoneHref = c.secondPhoneHref || `tel:${String(c.secondPhone || "").replace(/\D/g, "")}`;
  const emailHref = c.emailHref || `mailto:${c.email || ""}`;
  return (
    <section className="section contacts" id="contacts">
      <div className="shell contacts__grid">
        <div className="contacts__copy reveal">
          <h2>{c.title}</h2>
          <p>{c.address}</p>
          <div className="contact-list">
            <a href={phoneHref}><Phone size={22} />{c.phone}</a>
            <a href={secondPhoneHref}><Phone size={22} />{c.secondPhone}</a>
            <a href={emailHref}><EnvelopeSimple size={22} />{c.email}</a>
          </div>
          <a className="contacts__channel" href={maxChannelHref} target="_blank" rel="noreferrer">
            <span className="contacts__channel-icon"><SocialIcon name="max" size={22} /></span>
            <span><strong>{maxChannelLabel}</strong><small>Новости и общение в MAX</small></span>
            <ArrowUpRight size={18} />
          </a>
          <button className="button" onClick={() => openForm(c.button)}>{c.button}</button>
        </div>
        <div className="contacts__map reveal" aria-label="Яндекс Карта: Краснодар, улица Красная, 160">
          <iframe
            title="Яндекс Карта: Краснодар, улица Красная, 160"
            src={c.mapEmbed}
            loading="lazy"
            allowFullScreen
          />
          <a href={c.mapLink} target="_blank" rel="noreferrer">Открыть в Яндекс Картах <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function Footer({ setLegal }) {
  const cms = useCms(); const c = blockContent(cms, "footer"); const socials = getSocials(cms);
  const footerLinks = c.links || FALLBACK_FOOTER_LINKS;
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div><Brand light /><p>{c.text}</p></div>
        <div><h3>{c.directionsTitle || "Направления"}</h3>{footerLinks.map((link) => <a href={link.href || "#top"} key={`${link.label}-${link.href}`}>{link.label}</a>)}</div>
        <div><h3>{c.contactsTitle || "Связаться"}</h3>{socials.map((social) => <a className="footer__social-link" href={social.href} target="_blank" rel="noreferrer" key={social.label}><SocialIcon name={social.icon} size={18} />{social.label}</a>)}</div>
        <div><h3>{c.documentsTitle || "Документы"}</h3><a href="/privacy-policy">{c.privacyLabel || "Политика ПДн"}</a><button onClick={() => setLegal("offer")}>{c.offerLabel || "Публичная оферта"}</button><p>{c.legalName}<br />{c.inn}<br />{c.ogrn || "ОГРН: уточняется"}</p></div>
      </div>
      <div className="shell footer__bottom"><span>{c.copyright}</span><span>{c.address}</span></div>
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
  const cms = useCms(); const c = blockContent(cms, "forms");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || String(data.get("phone")).replace(/\D/g, "").length < 10 || !data.get("consent")) {
      setError(c.validationError || "Заполните имя, телефон и подтвердите согласие на обработку данных.");
      return;
    }
    setError("");
    setState("loading");
    const goal = data.get("goal") || "";
    submitLead({ name: data.get("name"), phone: data.get("phone"), message: title, source: "site", fields: { goal, form: title } }).catch(() => null).finally(() => window.setTimeout(() => setState("success"), 450));
  };

  if (state === "success") {
    return <div className="form-success"><Check size={36} weight="bold" /><h2>{c.successTitle || "Спасибо!"}</h2><p>{c.successText || "Заявка подготовлена. Менеджер свяжется с вами в рабочее время."}</p><button className="button" onClick={onClose}>{c.successButton || "Готово"}</button></div>;
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <h2>{title}</h2>
      <p>{c.leadIntro || "Оставьте контакты. Первая консультация бесплатна."}</p>
      <label>{c.nameLabel || "Ваше имя"}<input name="name" autoComplete="name" /></label>
      <label>{c.phoneLabel || "Телефон"}<input name="phone" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></label>
      <label>{c.goalLabel || "Направление"}<select name="goal" defaultValue={defaultGoal}><option value="">{c.goalPlaceholder || "Выберите направление"}</option><option>Каникулы в Китае</option><option>Поступление в вуз</option><option>Визовое сопровождение</option><option>Китайский язык</option></select></label>
      <label className="checkbox"><input type="checkbox" name="consent" /><span><ConsentCopy text={c.consentLabel} /></span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--wide" disabled={state === "loading"}>{state === "loading" ? (c.loadingLabel || "Отправляем...") : (c.submitLabel || "Отправить заявку")}</button>
    </form>
  );
}

function ReviewForm({ onClose }) {
  const cms = useCms();
  const forms = blockContent(cms, "forms");
  const programs = blockContent(cms, "programs").programs || [];
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || !data.get("message") || !data.get("consent")) {
      setError(forms.reviewValidationError || "Заполните имя, отзыв и подтвердите согласие на публикацию.");
      return;
    }

    setError("");
    setState("loading");
    try {
      await submitLead({
        name: data.get("name"),
        contact: data.get("contact") || "",
        message: data.get("message"),
        source: "review",
        fields: { program: data.get("program") || "", rating: data.get("rating") || "5" },
      });
      setState("success");
    } catch (submitError) {
      setError(submitError.message || "Не удалось отправить отзыв. Попробуйте ещё раз.");
      setState("idle");
    }
  }

  if (state === "success") {
    return <div className="form-success"><Check size={36} weight="bold" /><h2>{forms.reviewSuccessTitle || "Спасибо за отзыв!"}</h2><p>{forms.reviewSuccessText || "Отзыв отправлен на проверку и появится на сайте после согласования."}</p><button className="button" type="button" onClick={onClose}>{forms.successButton || "Готово"}</button></div>;
  }

  return (
    <form className="lead-form review-form" onSubmit={submit} noValidate>
      <h2>{forms.reviewTitle || "Оставить отзыв"}</h2>
      <p>{forms.reviewIntro || "Расскажите, как прошла поездка или обучение. Отзыв появится на сайте после проверки менеджером."}</p>
      <label>{forms.reviewNameLabel || "Ваше имя"}<input name="name" autoComplete="name" /></label>
      <label>{forms.reviewContactLabel || "Телефон или email (необязательно)"}<input name="contact" autoComplete="email" /></label>
      <label>{forms.reviewProgramLabel || "Программа"}<select name="program" defaultValue=""><option value="">{forms.reviewProgramPlaceholder || "Выберите программу"}</option>{programs.filter((program) => program?.title).map((program) => <option key={program.slug || program.title}>{program.title}</option>)}</select></label>
      <label>{forms.reviewRatingLabel || "Оценка"}<select name="rating" defaultValue="5"><option value="5">★★★★★ Отлично</option><option value="4">★★★★ Очень хорошо</option><option value="3">★★★ Хорошо</option><option value="2">★★ Есть что улучшить</option><option value="1">★ Нужна обратная связь</option></select></label>
      <label>{forms.reviewTextLabel || "Ваш отзыв"}<textarea name="message" rows="5" placeholder="Напишите несколько предложений о вашем опыте" /></label>
      <label className="checkbox"><input type="checkbox" name="consent" /><span><ConsentCopy text={forms.reviewConsentLabel} /></span></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button--wide" type="submit" disabled={state === "loading"}>{state === "loading" ? (forms.loadingLabel || "Отправляем...") : (forms.reviewSubmitLabel || "Отправить отзыв")}</button>
    </form>
  );
}

function ProgramModal({ program, onClose, openForm }) {
  const [slide, setSlide] = useState(0);
  const gallery = program.gallery?.length
    ? program.gallery
    : [{ path: program.image?.path || program.image, alt: program.title }];
  const currentSlide = gallery[slide] || gallery[0];
  const details = program.details || [];
  const moveSlide = (direction) => setSlide((value) => (value + direction + gallery.length) % gallery.length);

  return (
    <Modal onClose={onClose} className="program-modal">
      <div className="program-modal__gallery">
        <div className="program-modal__gallery-frame">
          <img src={currentSlide.src || currentSlide.path} alt={currentSlide.alt || program.title} />
          {gallery.length > 1 && (
            <div className="program-modal__gallery-controls">
              <span>{slide + 1} / {gallery.length}</span>
              <div>
                <button type="button" onClick={() => moveSlide(-1)} aria-label="Предыдущее фото"><ArrowLeft size={20} /></button>
                <button type="button" onClick={() => moveSlide(1)} aria-label="Следующее фото"><ArrowRight size={20} /></button>
              </div>
            </div>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="program-modal__gallery-dots" aria-label="Выбор фотографии">
            {gallery.map((item, index) => (
              <button
                type="button"
                className={index === slide ? "is-active" : ""}
                key={item.src || item.path || index}
                onClick={() => setSlide(index)}
                aria-label={`Открыть фото ${index + 1}`}
                aria-current={index === slide ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <div className="program-modal__copy">
        <small>{program.meta}</small><h2>{program.title}</h2><p>{program.description}</p>
        <div><Sparkle size={20} /><span><strong>Кому подойдёт</strong>{program.fit}</span></div>
        <div className="program-modal__details">
          {details.map((detail) => <p key={detail}>{detail}</p>)}
        </div>
        <button className="button button--wide program-modal__cta" onClick={() => { onClose(); openForm(`Получить презентацию: ${program.title}`); }}>Получить презентацию <ArrowRight size={18} /></button>
      </div>
    </Modal>
  );
}

function QuizModal({ onClose }) {
  const cms = useCms(); const c = blockContent(cms, "quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const steps = c.steps || quizSteps;
  const programs = useMemo(() => blockContent(cms, "programs").programs || [], [cms]);
  const recommendation = useMemo(() => recommendProgram(answers, programs), [answers, programs]);
  const current = steps[step];
  const choose = (option) => {
    setAnswers((value) => ({ ...value, [current.id]: option }));
    if (step < steps.length - 1) window.setTimeout(() => setStep((value) => value + 1), 130);
  };

  if (submitted) {
    return (
      <Modal onClose={onClose} className="quiz-modal">
        <div className="quiz-result"><Check size={38} weight="bold" /><h2>{c.resultTitle || "Подборка формируется"}</h2><p>{c.resultText || "Менеджер напишет вам в рабочее время и пришлёт варианты с актуальными датами и стоимостью."}</p><button className="button" onClick={onClose}>{c.resultButton || "Готово"}</button></div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} className="quiz-modal">
      {step < steps.length ? (
        <>
          <div className="quiz__progress"><span>Вопрос {step + 1} из {steps.length}</span><div><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div></div>
          <h2>{current.title}</h2>
          <div className="quiz__options">
            {current.options.map((option) => <button className={answers[current.id] === option ? "is-selected" : ""} key={option} onClick={() => choose(option)}>{option}<ArrowRight size={18} /></button>)}
          </div>
          <button className="quiz__back" disabled={step === 0} onClick={() => setStep((value) => value - 1)}><ArrowLeft size={18} />Назад</button>
        </>
      ) : null}
      {step === steps.length - 1 && answers[current.id] && (
        <div className="quiz-final">
          <div className="quiz-final__recommend"><small>Рекомендуем начать с</small><strong>{recommendation?.title || "персональной консультации"}</strong><span>{recommendation?.description || "Мы подберём программу после короткой консультации."}</span></div>
          <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); submitLead({ name: data.get("name"), phone: data.get("phone"), message: "Персональный подбор программы", source: "quiz", fields: answers }).catch(() => null).finally(() => setSubmitted(true)); }}>
            <label>{c.nameLabel || "Ваше имя"}<input required name="name" autoComplete="name" /></label>
            <label>{c.phoneLabel || "Телефон"}<input required name="phone" autoComplete="tel" inputMode="tel" /></label>
            <label className="checkbox"><input required type="checkbox" /><span><ConsentCopy text={c.consentLabel} /></span></label>
            <button className="button button--wide">{c.submitLabel || "Получить подбор программ"}</button>
          </form>
        </div>
      )}
    </Modal>
  );
}

function LegalModal({ type, onClose }) {
  const cms = useCms(); const c = blockContent(cms, "legal");
  const privacy = type === "privacy";
  const sections = privacy ? c.privacySections || [] : c.offerSections || [];
  return (
    <Modal onClose={onClose} className="legal-modal">
      <article>
        <p className="legal__notice">{c.notice}</p>
        <h2>{privacy ? c.privacyTitle : c.offerTitle}</h2>
        {sections.map((section) => <div key={section.title}><h3>{section.title}</h3><p>{section.text}</p></div>)}
      </article>
    </Modal>
  );
}

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Политика обработки персональных данных | Бай Цзэ";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "Политика в отношении обработки персональных данных сайта Бай Цзэ.");
  }, []);

  return (
    <main className="privacy-page">
      <div className="shell privacy-page__inner">
        <a className="privacy-page__brand" href="#top">
          <span className="brand__mark" aria-hidden="true"><img src="/favicon.svg" alt="" /></span>
          <span><strong>Бай Цзэ</strong><small>Учеба и каникулы в Китае</small></span>
        </a>
        <article className="privacy-page__card">
          <p className="eyebrow">Документы</p>
          <h1>Политика в отношении обработки персональных данных</h1>
          <h2>1. Общие положения</h2>
          <p>1.1. Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей сайта https://china-baize.ru/ (далее — Сайт).</p>
          <p>1.2. Оператором персональных данных является ИП Лазаренко Наталья Леонидовна, ИНН 231009681142, адрес: г. Краснодар, ул. Красная, 160, e-mail: kubancenter@mail.ru (далее — Оператор).</p>
          <h2>2. Цели сбора персональных данных</h2>
          <p>2.1. Обработка данных осуществляется исключительно в целях:</p>
          <ul><li>предоставления консультаций по вопросам учебы и каникул в Китае;</li><li>оформления документов для поступления, виз и грантов;</li><li>отправки информационных и новостных материалов (при наличии согласия).</li></ul>
          <h2>3. Объем и категории обрабатываемых данных</h2>
          <p>3.1. Оператор может обрабатывать следующие данные пользователя: фамилия, имя, отчество; номер телефона; адрес электронной почты; данные, необходимые для оформления виз и поступления (по отдельному согласию).</p>
          <h2>4. Права пользователя</h2>
          <p>4.1. Пользователь имеет право на получение информации, касающейся обработки его персональных данных, а также на требование уточнения, блокирования или уничтожения данных, если они являются неполными, устаревшими или полученными незаконно.</p>
          <h2>5. Контакты</h2>
          <p>5.1. Все вопросы, связанные с обработкой персональных данных, можно направить по адресу: kubancenter@mail.ru или по телефону: +7 903 450 54 43.</p>
          <p className="privacy-page__updated">Дата обновления: 02.09.2026</p>
        </article>
        <a className="privacy-page__back" href="/">Вернуться на сайт</a>
      </div>
    </main>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try { return window.localStorage.getItem("baize-cookie-consent") !== "accepted"; } catch { return true; }
  });
  if (!visible) return null;
  const accept = () => {
    try { window.localStorage.setItem("baize-cookie-consent", "accepted"); } catch { /* privacy banner can still close */ }
    setVisible(false);
  };
  return (
    <aside className="cookie-banner" role="status" aria-label="Уведомление о cookie">
      <p>{DEFAULT_COOKIE_TEXT} <a href="/privacy-policy">Политикой конфиденциальности</a>.</p>
      <button className="button button--small" type="button" onClick={accept}>Хорошо</button>
    </aside>
  );
}

export default function App() {
  const [cmsData, setCmsData] = useState(defaultCmsData);
  const [quizOpen, setQuizOpen] = useState(false);
  const [program, setProgram] = useState(null);
  const [form, setForm] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [legal, setLegal] = useState(null);
  const socials = getSocials(cmsData);

  useEffect(() => {
    loadRemoteCms().then((remote) => setCmsData(mergeCmsData(remote)));
  }, []);

  useEffect(() => {
    initVkAdsPixel();
  }, []);

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
    <CmsContext.Provider value={cmsData}>
      <>
      <Header openQuiz={() => setQuizOpen(true)} />
      <main>
        <Hero openQuiz={() => setQuizOpen(true)} />
        <WhyChina />
        <StudyAbroad openForm={(title) => setForm({ title, goal: "Поступление в вуз" })} />
        <Universities />
        <DetailSection
          id="university" icon={GraduationCap}
          openForm={(title) => setForm({ title, goal: "Поступление в вуз" })}
        />
        <About openConsultation={() => setForm({ title: "Бесплатная консультация", goal: "" })} />
        <Faq />
        <DetailSection
          id="visa" icon={BookOpenText} reverse
          openForm={(title) => setForm({ title, goal: "Визовое сопровождение" })}
        />
        <Programs openProgram={setProgram} />
        <Safety />
        <Language openForm={(title) => setForm({ title, goal: "Китайский язык" })} />
        <Reviews openReviewForm={() => setReviewOpen(true)} />
        <Cases />
        <News />
        <QuizBanner openQuiz={() => setQuizOpen(true)} />
        <Contacts openForm={(title) => setForm({ title, goal: "" })} />
      </main>
      <Footer setLegal={setLegal} />
      <div className="floating-social" aria-label="Быстрая связь">
        {socials.map((social) => <a className={`floating-social__${social.icon}`} href={social.href} target="_blank" rel="noreferrer" aria-label={`Открыть ${social.label}`} key={social.label}><SocialIcon name={social.icon} size={25} /></a>)}
      </div>
      <CookieBanner />
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {program && <ProgramModal program={program} onClose={() => setProgram(null)} openForm={(title) => setForm({ title, goal: "Каникулы в Китае" })} />}
      {form && <Modal onClose={() => setForm(null)} className="form-modal"><LeadForm title={form.title} defaultGoal={form.goal} onClose={() => setForm(null)} /></Modal>}
      {reviewOpen && <Modal onClose={() => setReviewOpen(false)} className="form-modal"><ReviewForm onClose={() => setReviewOpen(false)} /></Modal>}
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
      </>
    </CmsContext.Provider>
  );
}
