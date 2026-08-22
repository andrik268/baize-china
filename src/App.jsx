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
  yingkouGallery,
  universitySteps,
  visaSteps,
} from "./data.js";
import { loadRemoteCms, submitLead } from "./apiClient.js";
import { defaultCmsData, getBlock, mergeCmsData } from "./cmsData.js";
import { CmsContext, useCms } from "./cmsContext.js";

const CONTACT_PHONE = "+7 (903) 450-54-43";
const CONTACT_PHONE_HREF = "tel:+79034505443";
const WHATSAPP_HREF = "https://wa.me/qr/NL4IWGGHHW3HL1";
const TELEGRAM_HREF = "https://t.me/chinainsummer";
const MAX_HREF = "https://max.ru/u/f9LHodD0cOIIDx6pG5WILnOJudHFpeJU2O83YpgmMthMi0cPQNv2JWO20gM";
const MAX_CHANNEL_HREF = "https://max.ru/join/_iffpxt8pk9Rf29rOX1swElr4iSKT22FMtNA6yUC_NE";
const VK_HREF = "https://vk.ru/study.holidays";

// Video stories supplied by the client. The last three files are testimonials;
// the first five are shown in the cases section. Keeping the paths in the app
// means they remain visible even when the remote CMS still has an older block
// snapshot without media fields.
const CASE_VIDEO_SOURCES = [
  "/assets/videos/8526131038840.mp4",
  "/assets/videos/9001755413065.mp4",
  "/assets/videos/18216247233144.mp4",
  "/assets/videos/18216256932472.mp4",
  "/assets/videos/18216264469112.mp4",
];

const CASE_VIDEO_FALLBACKS = [
  { title: "Поступление в вуз", text: "История поступления и подготовки к учебе в Китае." },
  { title: "Каникулы в Китае", text: "Как проходит поездка и погружение в китайскую культуру." },
  { title: "Китайский язык", text: "Практика языка и заметный прогресс уже во время программы." },
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

function blockContent(cms, id) {
  return getBlock(cms, id)?.content || getBlock(defaultCmsData, id).content;
}

const FALLBACK_SOCIALS = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp" },
  { label: "Telegram", href: TELEGRAM_HREF, icon: "telegram" },
  { label: "MAX", href: MAX_HREF, icon: "max" },
  { label: "ВКонтакте", href: VK_HREF, icon: "vk" },
];

function getSocials(cms) {
  return blockContent(cms, "contacts").socials || FALLBACK_SOCIALS;
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
    <a className={`brand ${light ? "brand--light" : ""}`} href="#top">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".24" />
          <path d="M9 31c3.9-9.8 10.4-15 19.2-15 4.2 0 7.9 1.2 10.8 3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10.5 35.2c6.6-2.5 14.4-2.2 22.8 2.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".78" />
          <circle cx="34.3" cy="11.6" r="3.2" fill="#e1b450" />
          <text x="24" y="30" textAnchor="middle" fill="currentColor" fontSize="9.2" fontWeight="800" letterSpacing=".4">白泽</text>
        </svg>
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
  const links = (c.navigation || []).map((label) => [label, { "Университеты": "#universities", "Визы": "#visa", "Каникулы": "#programs", "Сопровождение": "#safety", "Курсы": "#language", "О нас": "#about" }[label] || "#top"]);

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
            <a className="button" href="#programs">{c.primaryButton} <ArrowRight size={18} /></a>
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
          {(c.programs || []).map((program, index) => (
            <button
              className={`program-card program-card--${index + 1} reveal`}
              key={program.slug}
              onClick={() => openProgram(program)}
            >
              <img
                src={program.slug === "yingkou-beijing" ? yingkouGallery[0].src : (program.cardImage?.path || program.cardImage)}
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
          <div className="safety__badge"><ShieldCheck size={24} /> Группа под присмотром</div>
        </div>
        <div className="safety__copy reveal">
          <h2>{c.title}</h2>
          <p>{c.text}</p>
          <div className="check-grid">
            {(c.points || []).map((point) => <span key={point}><Check size={18} weight="bold" />{point}</span>)}
          </div>
          <a className="text-link" href="#contacts">{c.linkText} <ArrowRight size={18} /></a>
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

function Reviews({ openForm }) {
  const cms = useCms(); const c = blockContent(cms, "reviews");
  const [activeReview, setActiveReview] = useState(0);
  const activeItem = REVIEW_VIDEO_FALLBACKS[activeReview];
  const activeVideo = REVIEW_VIDEO_SOURCES[activeReview];
  const moveReview = (offset) => setActiveReview((value) => (value + offset + REVIEW_VIDEO_SOURCES.length) % REVIEW_VIDEO_SOURCES.length);
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="shell reviews__layout">
        <div className="reviews__lead reveal">
          <span className="reviews__mark"><ChatsCircle size={32} weight="duotone" /></span>
          <h2 id="reviews-title">{c.title}</h2>
          <p>{c.lead}</p>
          <button className="button button--ghost" onClick={() => openForm(c.button)}>{c.button} <ArrowRight size={18} /></button>
        </div>
        <div className="reviews__videos reveal">
          <div className="reviews-slider" role="region" aria-roledescription="carousel" aria-label="Видео-отзывы">
            <article className="review-video-card">
              <video className="review-video-card__video" controls preload="metadata" playsInline src={activeVideo} aria-label={activeItem.title} />
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
                {REVIEW_VIDEO_SOURCES.map((video, index) => (
                  <button
                    className={`reviews-slider__dot ${index === activeReview ? "reviews-slider__dot--active" : ""}`}
                    key={video}
                    type="button"
                    role="tab"
                    aria-selected={index === activeReview}
                    aria-label={`Отзыв ${index + 1}`}
                    onClick={() => setActiveReview(index)}
                  />
                ))}
              </div>
              <span className="reviews-slider__count">{activeReview + 1} / {REVIEW_VIDEO_SOURCES.length}</span>
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

function Cases() {
  const cms = useCms(); const c = blockContent(cms, "cases"); const icons = [GraduationCap, GlobeHemisphereEast, Translate];
  const cmsItems = c.items || [];
  const items = CASE_VIDEO_SOURCES.map((video, index) => ({
    ...CASE_VIDEO_FALLBACKS[index],
    ...cmsItems[index],
    video,
  }));
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
              {video ? (
                <video className="case-card__video" controls preload="metadata" playsInline src={video} aria-label={title} />
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
          <div><Clock size={20} /> 1 минута</div>
          <button className="button button--terracotta" onClick={openQuiz}>{c.button} <ArrowRight size={18} /></button>
          <small>Ваши данные защищены</small>
        </div>
      </div>
    </section>
  );
}

function Contacts({ openForm }) {
  const cms = useCms(); const c = blockContent(cms, "contacts");
  const maxChannelHref = c.maxChannelHref || MAX_CHANNEL_HREF;
  const maxChannelLabel = c.maxChannelLabel || "Канал MAX";
  return (
    <section className="section contacts" id="contacts">
      <div className="shell contacts__grid">
        <div className="contacts__copy reveal">
          <h2>{c.title}</h2>
          <p>{c.address}</p>
          <div className="contact-list">
            <a href={`tel:${String(c.phone).replace(/\D/g, "")}`}><Phone size={22} />{c.phone}</a>
            <a href={`tel:${String(c.secondPhone).replace(/\D/g, "")}`}><Phone size={22} />{c.secondPhone}</a>
            <a href={`mailto:${c.email}`}><EnvelopeSimple size={22} />{c.email}</a>
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
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div><Brand light /><p>{c.text}</p></div>
        <div><h3>Направления</h3><a href="#universities">Университеты</a><a href="#university">Как поступить</a><a href="#visa">Визы</a><a href="#programs">Каникулы</a><a href="#safety">Сопровождение</a><a href="#language">Китайский язык</a></div>
        <div><h3>Связаться</h3>{socials.map((social) => <a className="footer__social-link" href={social.href} target="_blank" rel="noreferrer" key={social.label}><SocialIcon name={social.icon} size={18} />{social.label}</a>)}</div>
        <div><h3>Документы</h3><button onClick={() => setLegal("privacy")}>Политика ПДн</button><button onClick={() => setLegal("offer")}>Публичная оферта</button><p>{c.legalName}<br />{c.inn}</p></div>
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
    const goal = data.get("goal") || "";
    submitLead({ name: data.get("name"), phone: data.get("phone"), message: title, source: "site", fields: { goal, form: title } }).catch(() => null).finally(() => window.setTimeout(() => setState("success"), 450));
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

function ProgramModal({ program, onClose, openForm }) {
  const [slide, setSlide] = useState(0);
  const gallery = program.slug === "yingkou-beijing"
    ? (program.gallery?.length ? program.gallery : yingkouGallery)
    : [{ src: program.image?.path || program.image, alt: program.title }];
  const currentSlide = gallery[slide] || gallery[0];
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
        <p>Даты, стоимость, точная программа и условия участия подтверждаются менеджером после короткой консультации.</p>
        <button className="button button--wide program-modal__cta" onClick={() => { onClose(); openForm(`Получить презентацию: ${program.title}`); }}>Получить презентацию <ArrowRight size={18} /></button>
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
          <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); submitLead({ name: data.get("name"), phone: data.get("phone"), message: "Персональный подбор программы", source: "quiz", fields: answers }).catch(() => null).finally(() => setSubmitted(true)); }}>
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
  const [cmsData, setCmsData] = useState(defaultCmsData);
  const [quizOpen, setQuizOpen] = useState(false);
  const [program, setProgram] = useState(null);
  const [form, setForm] = useState(null);
  const [legal, setLegal] = useState(null);
  const socials = getSocials(cmsData);

  useEffect(() => {
    loadRemoteCms().then((remote) => setCmsData(mergeCmsData(remote)));
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
        {socials.map((social) => <a className={`floating-social__${social.icon}`} href={social.href} target="_blank" rel="noreferrer" aria-label={`Открыть ${social.label}`} key={social.label}><SocialIcon name={social.icon} size={25} /></a>)}
      </div>
      {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
      {program && <ProgramModal program={program} onClose={() => setProgram(null)} openForm={(title) => setForm({ title, goal: "Каникулы в Китае" })} />}
      {form && <Modal onClose={() => setForm(null)} className="form-modal"><LeadForm title={form.title} defaultGoal={form.goal} onClose={() => setForm(null)} /></Modal>}
      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
      </>
    </CmsContext.Provider>
  );
}
