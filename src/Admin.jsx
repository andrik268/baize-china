import { useEffect, useMemo, useState } from "react";
import { ArrowClockwise, ArrowSquareOut, CaretDown, CaretUp, Check, FileText, FloppyDisk, Image as ImageIcon, Info, LinkSimple, MagnifyingGlass, Plus, SignOut, TextT, Trash, UploadSimple, VideoCamera, X } from "@phosphor-icons/react";
import { getRemoteSession, loadRemoteCms, loadRemoteLeads, loginRemote, logoutRemote, saveRemoteCms, uploadRemoteMedia } from "./apiClient.js";
import { ADMIN_LOGIN, CMS_SESSION_KEY, defaultCmsData, mergeCmsData } from "./cmsData.js";

const SECTIONS = [
  { id: "leads", label: "Заявки", note: "Новые обращения с сайта", icon: "leads" },
  { id: "news", label: "Новости", note: "Публикации, фото и даты", icon: "image" },
  { id: "site", label: "Сайт и SEO", note: "Название сайта и описание для поиска", icon: "settings" },
  { id: "header", label: "Шапка и логотип", note: "Логотип, меню, телефон и кнопка", icon: "links" },
  { id: "hero", label: "Первый экран", note: "Заголовок, фото и кнопки", icon: "image" },
  { id: "why", label: "Почему Китай", note: "Карточки преимуществ", icon: "text" },
  { id: "studyAbroad", label: "Поступление", note: "Страхи родителей и призыв", icon: "text" },
  { id: "universities", label: "Университеты", note: "Тексты, фото и списки вузов", icon: "text" },
  { id: "university", label: "Поступление в вуз", note: "Этапы, фото и кнопка", icon: "image" },
  { id: "about", label: "О компании", note: "Цифры и рассказ о Бай Цзэ", icon: "text" },
  { id: "faq", label: "Вопросы и ответы", note: "Группы вопросов и ответов", icon: "text" },
  { id: "visa", label: "Визы", note: "Этапы, фото и кнопка", icon: "image" },
  { id: "programs", label: "Каникулы", note: "Все программы, фото и галереи", icon: "image" },
  { id: "safety", label: "Сопровождение", note: "Фото, пункты и ссылка", icon: "image" },
  { id: "language", label: "Курсы китайского", note: "Фото, карточки и кнопка", icon: "image" },
  { id: "reviews", label: "Отзывы", note: "Видео-слайдер отзывов", icon: "video" },
  { id: "cases", label: "Кейсы", note: "Карточки, фото и видео", icon: "video" },
  { id: "quiz", label: "Персональный подбор", note: "Баннер, вопросы и подписи", icon: "text" },
  { id: "contacts", label: "Контакты", note: "Телефоны, карта и соцсети", icon: "links" },
  { id: "footer", label: "Подвал", note: "Ссылки и реквизиты", icon: "links" },
  { id: "forms", label: "Тексты форм", note: "Поля, ошибки и сообщения", icon: "text" },
  { id: "legal", label: "Документы", note: "Политика и оферта", icon: "text" },
];

const FIELD_LABELS = {
  alt: "Описание изображения", address: "Адрес", authorImage: "Фото автора", authorName: "Автор", badge: "Текст плашки", brand: "Название бренда", brandHref: "Ссылка логотипа", button: "Текст кнопки", buttonText: "Текст кнопки", cardImage: "Фото карточки", consentLabel: "Текст согласия", contactsTitle: "Заголовок колонки", copyright: "Копирайт", coverImage: "Обложка новости", ctaButton: "Текст кнопки", ctaText: "Текст призыва", ctaTitle: "Заголовок призыва", description: "Описание", details: "Описание в окне программы", directionsTitle: "Заголовок колонки", documentsTitle: "Заголовок колонки", email: "Email", emailHref: "Ссылка email", eyebrow: "Надзаголовок", fit: "Кому подойдёт", goalLabel: "Подпись выбора направления", goalPlaceholder: "Подсказка выбора направления", href: "Ссылка", image: "Изображение", included: "Что входит", includedTitle: "Заголовок раскрывающегося списка", inn: "ИНН", intro: "Вводный текст", isActive: "Показывать на сайте", isPublished: "Показывать новость на сайте", lead: "Подзаголовок", leadIntro: "Текст над формой", legalName: "Юридическое название", linkHref: "Ссылка", linkText: "Текст ссылки", links: "Ссылки", logo: "Логотип", mapEmbed: "Ссылка виджета карты", mapLink: "Ссылка на карту", maxChannelHref: "Ссылка на канал MAX", maxChannelLabel: "Название канала MAX", minuteText: "Текст с временем", nameLabel: "Подпись поля имени", navigation: "Пункты меню", navigationHrefs: "Ссылки пунктов меню", noteText: "Текст плашки", noteTitle: "Заголовок плашки", number: "Большая цифра", offerLabel: "Текст ссылки на оферту", offerSections: "Текст оферты", offerTitle: "Заголовок оферты", panelTitle: "Заголовок блока с этапами", paragraphs: "Абзацы", phone: "Телефон", phoneHref: "Ссылка телефона", phoneLabel: "Подпись поля телефона", points: "Пункты", primaryButton: "Основная кнопка", primaryButtonHref: "Ссылка основной кнопки", privacyLabel: "Текст ссылки на политику", privacySections: "Текст политики", privacyText: "Текст о защите данных", privacyTitle: "Заголовок политики", programs: "Программы", publishedAt: "Дата публикации", resultButton: "Кнопка результата", resultText: "Текст результата", resultTitle: "Заголовок результата", secondPhone: "Дополнительный телефон", secondPhoneHref: "Ссылка дополнительного телефона", secondaryButton: "Вторая кнопка", seoDescription: "Описание для поиска", seoKeywords: "Ключевые слова", seoTitle: "Заголовок для поиска", services: "Короткие услуги", socials: "Социальные сети", sortOrder: "Порядок показа", statement: "Акцентная фраза", steps: "Этапы", submitLabel: "Текст кнопки отправки", successButton: "Кнопка после отправки", successText: "Текст после отправки", successTitle: "Заголовок после отправки", tagline: "Подпись под названием", text: "Текст", title: "Заголовок", validationError: "Текст ошибки", video: "Видео", label: "Подпись", kind: "Тип медиа", path: "Ссылка на файл", poster: "Постер видео", reviewButton: "Кнопка формы отзыва", reviewTitle: "Заголовок формы отзыва", reviewIntro: "Вводный текст формы отзыва", reviewNameLabel: "Подпись имени в отзыве", reviewContactLabel: "Подпись контакта в отзыве", reviewProgramLabel: "Подпись программы в отзыве", reviewProgramPlaceholder: "Подсказка выбора программы", reviewRatingLabel: "Подпись оценки", reviewTextLabel: "Подпись текста отзыва", reviewConsentLabel: "Согласие для отзыва", reviewValidationError: "Ошибка формы отзыва", reviewSubmitLabel: "Кнопка отправки отзыва", reviewSuccessTitle: "Заголовок после отзыва", reviewSuccessText: "Текст после отзыва",
};

const GROUPS = {
  header: [["Бренд и контакты", ["logo", "brand", "tagline", "brandHref", "phone", "phoneHref", "buttonText"]], ["Меню", ["navigation", "navigationHrefs"]]],
  hero: [["Текст и кнопки", ["eyebrow", "title", "lead", "services", "primaryButton", "primaryButtonHref", "secondaryButton"]], ["Фото и плашка", ["image", "noteTitle", "noteText"]]],
  universities: [["Заголовок и фото", ["eyebrow", "title", "paragraphs", "image"]], ["Списки университетов", ["groups"]]],
  university: [["Текст и кнопка", ["title", "intro", "description", "button"]], ["Фото и этапы", ["image", "panelTitle", "steps", "includedTitle", "included"]]],
  visa: [["Текст и кнопка", ["title", "intro", "description", "button"]], ["Фото и этапы", ["image", "panelTitle", "steps", "includedTitle", "included"]]],
  programs: [["Заголовок раздела", ["title", "lead"]], ["Программы и галереи", ["programs"]]],
  safety: [["Текст и ссылка", ["title", "text", "badge", "points", "linkText", "linkHref"]], ["Фото", ["image"]]],
  language: [["Заголовок и фото", ["title", "lead", "image", "badgeTitle", "badgeText"]], ["Карточки и кнопка", ["features", "statement", "button"]]],
  reviews: [["Заголовок и кнопка", ["title", "lead", "reviewButton"]], ["Видео в слайдере", ["items"]]],
  cases: [["Заголовок", ["title", "lead"]], ["Карточки с медиа", ["items"]]],
  quiz: [["Баннер", ["eyebrow", "title", "lead", "button", "minuteText", "privacyText"]], ["Вопросы и результат", ["steps", "resultTitle", "resultText", "resultButton", "nameLabel", "phoneLabel", "consentLabel", "submitLabel"]]],
  contacts: [["Контакты", ["title", "address", "phone", "phoneHref", "secondPhone", "secondPhoneHref", "email", "emailHref", "button"]], ["Карта и социальные сети", ["mapEmbed", "mapLink", "socials", "maxChannelLabel", "maxChannelHref"]]],
  footer: [["Тексты и документы", ["text", "directionsTitle", "contactsTitle", "documentsTitle", "privacyLabel", "offerLabel", "copyright", "address", "legalName", "inn"]], ["Ссылки", ["links"]]],
  forms: [["Форма заявки", ["leadIntro", "nameLabel", "phoneLabel", "goalLabel", "goalPlaceholder", "consentLabel", "validationError", "submitLabel", "loadingLabel", "successTitle", "successText", "successButton"]], ["Форма отзыва", ["reviewTitle", "reviewIntro", "reviewNameLabel", "reviewContactLabel", "reviewProgramLabel", "reviewProgramPlaceholder", "reviewRatingLabel", "reviewTextLabel", "reviewConsentLabel", "reviewValidationError", "reviewSubmitLabel", "reviewSuccessTitle", "reviewSuccessText"]]],
  legal: [["Заголовки", ["notice", "privacyTitle", "offerTitle"]], ["Политика", ["privacySections"]], ["Оферта", ["offerSections"]]],
};

function labelize(key) { return FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function getPath(source, path) { return path.split(".").reduce((value, key) => value?.[key], source); }
function setPath(source, path, value) { const next = clone(source); const keys = path.split("."); let cursor = next; keys.forEach((key, index) => { if (index === keys.length - 1) cursor[key] = value; else cursor = cursor[key]; }); return next; }
function removeAtPath(source, path) { const next = clone(source); const keys = path.split("."); const index = Number(keys.pop()); const list = getPath(next, keys.join(".")); if (Array.isArray(list) && Number.isInteger(index)) list.splice(index, 1); return next; }
function moveAtPath(source, path, direction) { const next = clone(source); const keys = path.split("."); const index = Number(keys.pop()); const list = getPath(next, keys.join(".")); const target = index + direction; if (Array.isArray(list) && target >= 0 && target < list.length) [list[index], list[target]] = [list[target], list[index]]; return next; }
function titleForItem(item, index) { if (typeof item === "string") return item || `Пункт ${index + 1}`; if (Array.isArray(item)) return item[0] || `Пункт ${index + 1}`; return item?.title || item?.label || item?.name || `Элемент ${index + 1}`; }
function createItem(path, value) { if (path === "posts" || path.endsWith(".posts")) return { id: `news-${Date.now()}`, title: "Новая новость", description: "", coverImage: "", authorName: "", authorImage: "", seoKeywords: "", isPublished: true, sortOrder: (value?.length || 0) * 10 + 10, publishedAt: new Date().toISOString().slice(0, 10), updatedAt: "", body: [] }; if (path.includes("gallery")) return { kind: "image", path: "", alt: "" }; if (path.includes("reviews.items")) return { title: "Новый отзыв", text: "", video: { kind: "video", path: "", label: "" }, isActive: true }; if (path.includes("cases.items")) return { title: "Новый кейс", text: "", video: { kind: "video", path: "", label: "" }, image: { kind: "image", path: "", alt: "" }, isActive: true }; if (path.includes("programs")) return { slug: `program-${Date.now()}`, title: "Новая программа", meta: "", description: "", fit: "", image: { kind: "image", path: "", alt: "" }, cardImage: { kind: "image", path: "", alt: "" }, gallery: [], details: [], isActive: true }; if (path.includes("steps")) return { id: `step-${Date.now()}`, title: "Новый вопрос", options: ["Вариант ответа"] }; if (path.includes("Sections")) return { title: "Новый пункт", text: "" }; if (Array.isArray(value?.[0])) return ["Новый заголовок", "Новый текст"]; if (typeof value?.[0] === "string") return "Новый пункт"; return { title: "Новый элемент", text: "" }; }

const IMAGE_FIELD_KEYS = new Set(["image", "cardImage", "logo", "poster", "coverImage", "authorImage"]);
const VIDEO_FIELD_KEYS = new Set(["video"]);
function mediaKindFor(fieldKey, path, value) {
  if (value?.kind === "video") return "video";
  if (value?.kind === "image") return "image";
  if (VIDEO_FIELD_KEYS.has(fieldKey) || /\.(?:mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(String(value?.path || value || ""))) return "video";
  if (IMAGE_FIELD_KEYS.has(fieldKey) || /(?:gallery|image|photo|logo|poster|cover)/i.test(path)) return "image";
  return "";
}

function SectionIcon({ name, size = 18 }) { if (name === "image") return <ImageIcon size={size} />; if (name === "video") return <VideoCamera size={size} />; if (name === "links") return <LinkSimple size={size} />; if (name === "text") return <TextT size={size} />; if (name === "leads") return <FileText size={size} />; return <Info size={size} />; }

function MediaField({ label, value, onChange, mediaKind = "" }) {
  const [uploading, setUploading] = useState(false); const [error, setError] = useState(""); const kind = mediaKind || (value?.kind === "video" ? "video" : "image");
  async function upload(event) { const file = event.target.files?.[0]; event.target.value = ""; if (!file) return; if (kind === "image" && !file.type.startsWith("image/")) { setError("Для этого поля выберите изображение: JPG, PNG, WebP, GIF или SVG."); return; } if (kind === "video" && !file.type.startsWith("video/")) { setError("Для этого поля выберите видео: MP4, WebM или MOV."); return; } if (file.size > 100 * 1024 * 1024) { setError("Размер файла не должен превышать 100 МБ."); return; } setUploading(true); setError(""); try { const path = await uploadRemoteMedia(file); onChange({ ...(value || {}), kind, path, ...(kind === "image" ? { alt: value?.alt || file.name } : { label: value?.label || file.name }) }); } catch (uploadError) { setError(uploadError.message || "Не удалось загрузить файл."); } finally { setUploading(false); } }
  return <div className="cms-media-field"><div className="cms-field-label">{label}</div><div className={`cms-media-preview cms-media-preview--${kind}`}>{value?.path ? (kind === "video" ? <video controls preload="metadata" src={value.path} /> : <img src={value.path} alt={value.alt || "Предпросмотр"} />) : <div><SectionIcon name={kind} size={32} /><span>{kind === "video" ? "Видео пока не выбрано" : "Изображение пока не выбрано"}</span></div>}</div><div className="cms-media-actions"><label className="cms-button cms-button--secondary"><UploadSimple size={17} />{uploading ? "Загружаем..." : kind === "video" ? "Заменить видео" : "Заменить изображение"}<input hidden type="file" accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"} onChange={upload} disabled={uploading} /></label>{value?.path ? <button className="cms-button cms-button--ghost" type="button" onClick={() => onChange({ ...(value || {}), kind, path: "" })}><X size={16} /> Убрать</button> : null}</div><label className="cms-field"><span>Ссылка на файл</span><input value={value?.path || ""} placeholder="/uploads/... или https://..." onChange={(event) => onChange({ ...(value || {}), kind, path: event.target.value })} /></label>{kind === "image" ? <label className="cms-field"><span>Описание изображения</span><input value={value?.alt || ""} onChange={(event) => onChange({ ...(value || {}), kind, alt: event.target.value })} /></label> : <label className="cms-field"><span>Подпись для видео</span><input value={value?.label || ""} onChange={(event) => onChange({ ...(value || {}), kind, label: event.target.value })} /></label>}{error ? <p className="cms-error">{error}</p> : null}</div>;
}

function ScalarField({ label, value, fieldKey, onChange }) { if (typeof value === "boolean") return <label className="cms-toggle"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>; const isLink = /href|link|embed|path/i.test(fieldKey); const multiline = typeof value === "string" && (value.length > 86 || /text|description|lead|intro|paragraph|statement|notice|error/i.test(fieldKey)); return <label className="cms-field"><span>{label}</span>{multiline ? <textarea rows={4} value={value ?? ""} onChange={(event) => onChange(event.target.value)} /> : <input type={isLink ? "url" : "text"} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />}</label>; }

function ArrayEditor({ label, value, path, onChange, onRemove, onMove }) { return <section className="cms-collection"><div className="cms-collection-head"><div><strong>{label}</strong><span>{value.length} {value.length === 1 ? "элемент" : "элементов"}</span></div><button className="cms-button cms-button--secondary cms-button--small" type="button" onClick={() => onChange(path, [...value, createItem(path, value)])}><Plus size={16} /> Добавить</button></div><p className="cms-collection-help">Откройте элемент, внесите правки и нажмите «Сохранить». Чтобы временно убрать карточку с сайта, выключите переключатель «Показывать на сайте».</p><div className="cms-collection-list">{value.map((item, index) => <details className="cms-collection-item" key={`${path}.${index}.${titleForItem(item, index)}`}><summary><span><b>{index + 1}</b><strong>{titleForItem(item, index)}</strong>{item?.isActive === false ? <em>Скрыто</em> : null}</span><CaretDown size={18} /></summary><div className="cms-collection-item__body"><div className="cms-item-actions"><button type="button" onClick={() => onMove(`${path}.${index}`, -1)} disabled={index === 0}><CaretUp size={17} /> Выше</button><button type="button" onClick={() => onMove(`${path}.${index}`, 1)} disabled={index === value.length - 1}><CaretDown size={17} /> Ниже</button><button type="button" className="cms-item-delete" onClick={() => { if (window.confirm("Удалить этот элемент? После сохранения он исчезнет с сайта.")) onRemove(`${path}.${index}`); }}><Trash size={16} /> Удалить</button></div><EditorNode value={item} label={label} fieldKey="item" path={`${path}.${index}`} onChange={onChange} onRemove={onRemove} onMove={onMove} /></div></details>)}</div></section>; }

function EditorNode({ value, label, fieldKey, path, onChange, onRemove, onMove }) {
  const mediaKind = mediaKindFor(fieldKey, path, value);
  const isMediaObject = value && typeof value === "object" && !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, "path") && (value.kind || Object.prototype.hasOwnProperty.call(value, "alt") || Object.prototype.hasOwnProperty.call(value, "label") || mediaKind);
  const isMediaString = typeof value === "string" && mediaKind;
  if (isMediaObject || isMediaString) {
    const mediaValue = isMediaString ? { kind: mediaKind, path: value } : { ...value, kind: value.kind || mediaKind };
    return <MediaField label={label} value={mediaValue} mediaKind={mediaKind} onChange={(next) => onChange(path, next)} />;
  }
  if (Array.isArray(value)) return <ArrayEditor label={label} value={value} path={path} onChange={onChange} onRemove={onRemove} onMove={onMove} />;
  if (value && typeof value === "object") return <div className="cms-object-fields">{Object.entries(value).filter(([key]) => key !== "id").map(([key, child]) => <EditorNode key={`${path}.${key}`} value={child} label={labelize(key)} fieldKey={key} path={`${path}.${key}`} onChange={onChange} onRemove={onRemove} onMove={onMove} />)}</div>;
  return <ScalarField label={label} value={value} fieldKey={fieldKey} onChange={(next) => onChange(path, next)} />;
}

function LoginScreen({ onLogin }) { const [login, setLogin] = useState(ADMIN_LOGIN); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); async function submit(event) { event.preventDefault(); setLoading(true); setError(""); try { await onLogin(login, password); } catch (loginError) { setError(loginError.message || "Не удалось войти"); } finally { setLoading(false); } } return <main className="cms-login"><form className="cms-login-card" onSubmit={submit}><div className="cms-login-brand">白泽</div><p className="cms-kicker">Панель управления сайтом</p><h1>Войти в админку</h1><p>Меняйте тексты, ссылки, изображения и видео без работы с кодом.</p><label className="cms-field"><span>Логин</span><input type="email" value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" /></label><label className="cms-field"><span>Пароль</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error ? <p className="cms-error">{error}</p> : null}<button className="cms-button cms-button--primary cms-login-submit" disabled={loading}>{loading ? "Проверяем..." : "Войти"}</button></form></main>; }

function LeadsPanel({ leads, loading, onRefresh }) {
  const sourceLabel = (source) => ({ quiz: "Персональный подбор", review: "Новый отзыв" }[source] || "Консультация");
  return (
    <section className="cms-leads-panel">
      <div className="cms-panel-header">
        <div><h2>Заявки с сайта</h2><p>Здесь находятся обращения и отзывы посетителей. Новые записи всегда находятся вверху; отзывы отмечены отдельной меткой и ждут проверки.</p></div>
        <button className="cms-button cms-button--secondary" onClick={onRefresh} disabled={loading}><ArrowClockwise size={17} />{loading ? "Обновляем..." : "Обновить"}</button>
      </div>
      {loading && !leads.length ? <p className="cms-empty">Загружаем заявки...</p> : null}
      {!loading && !leads.length ? <p className="cms-empty">Пока заявок нет. Когда посетитель заполнит форму, запись появится здесь.</p> : null}
      <div className="cms-leads-list">
        {leads.map((lead) => (
          <article className={`cms-lead-card ${lead.source === "review" ? "cms-lead-card--review" : ""}`} key={lead.id}>
            <div className="cms-lead-card__top"><strong>{lead.name || "Без имени"}</strong><span>{lead.createdAt || ""}</span></div>
            {lead.contact ? <a className="cms-lead-contact" href={`tel:${String(lead.contact).replace(/\D/g, "")}`}>{lead.contact}</a> : <span className="cms-lead-no-contact">Контакт не указан</span>}
            <div className="cms-lead-tags"><span>{sourceLabel(lead.source)}</span><span>{lead.status === "new" ? "Новая" : lead.status}</span></div>
            {lead.message ? <p>{lead.message}</p> : null}
            {lead.fields?.goal ? <p><b>Направление:</b> {lead.fields.goal}</p> : null}
            {lead.source === "review" && lead.fields?.program ? <p><b>Программа:</b> {lead.fields.program}</p> : null}
            {lead.source === "review" && lead.fields?.rating ? <p><b>Оценка:</b> {"★".repeat(Math.max(1, Math.min(5, Number(lead.fields.rating))))}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsPanel({ data, onChange, onRemove, onMove }) {
  const posts = Array.isArray(data.posts) ? data.posts : [];
  return (
    <section className="cms-content-panel">
      <div className="cms-panel-header">
        <div><p className="cms-kicker">Публикации сайта</p><h2>Новости</h2><p>Добавляйте новости, меняйте заголовки, даты, описания и обложки. Выключите «Показывать новость на сайте», чтобы сохранить публикацию в админке, но временно скрыть её для посетителей.</p></div>
        <div className="cms-panel-media-hint"><Info size={18} /><span>Обложку можно загрузить с компьютера или заменить прямой ссылкой.</span></div>
      </div>
      <section className="cms-card cms-editor-group">
        <h3>Публикации и обложки</h3>
        <EditorNode value={posts} label="Новости" fieldKey="posts" path="posts" onChange={onChange} onRemove={onRemove} onMove={onMove} />
      </section>
    </section>
  );
}

function SitePanel({ data, onChange }) { return <section className="cms-card cms-site-panel"><div className="cms-panel-header"><div><h2>Сайт и SEO</h2><p>Эти данные видны в поисковых системах и во вкладке браузера. Они не меняют текст на страницах.</p></div></div><div className="cms-two-columns"><ScalarField label="Название сайта" fieldKey="name" value={data.site.name} onChange={(value) => onChange("site.name", value)} /><ScalarField label="Домен" fieldKey="domain" value={data.site.domain} onChange={(value) => onChange("site.domain", value)} /><ScalarField label="Заголовок страницы для поиска" fieldKey="seoTitle" value={data.page.seoTitle} onChange={(value) => onChange("page.seoTitle", value)} /><ScalarField label="Описание страницы для поиска" fieldKey="seoDescription" value={data.page.seoDescription} onChange={(value) => onChange("page.seoDescription", value)} /></div></section>; }

function ContentPanel({ section, block, blockIndex, onChange, onRemove, onMove }) { const content = block.content || {}; const configured = GROUPS[section.id] || [["Содержимое блока", Object.keys(content)]]; const shownKeys = new Set(configured.flatMap(([, keys]) => keys)); const remaining = Object.keys(content).filter((key) => !shownKeys.has(key)); return <section className="cms-content-panel"><div className="cms-panel-header"><div><p className="cms-kicker">Редактирование блока</p><h2>{section.label}</h2><p>{section.note}. Изменения станут видны на сайте после сохранения.</p></div><div className="cms-panel-media-hint"><Info size={18} /><span>Изображения и видео можно загрузить с компьютера или вставить ссылку.</span></div></div>{configured.map(([groupTitle, keys]) => <section className="cms-card cms-editor-group" key={groupTitle}><h3>{groupTitle}</h3>{keys.filter((key) => Object.prototype.hasOwnProperty.call(content, key)).map((key) => <EditorNode key={key} value={content[key]} label={labelize(key)} fieldKey={key} path={`page.blocks.${blockIndex}.content.${key}`} onChange={onChange} onRemove={onRemove} onMove={onMove} />)}</section>)}{remaining.length ? <details className="cms-card cms-editor-group cms-extra-fields"><summary>Дополнительные поля <CaretDown size={18} /></summary>{remaining.map((key) => <EditorNode key={key} value={content[key]} label={labelize(key)} fieldKey={key} path={`page.blocks.${blockIndex}.content.${key}`} onChange={onChange} onRemove={onRemove} onMove={onMove} />)}</details> : null}</section>; }

export function AdminApp() {
  const [user, setUser] = useState(null); const [data, setData] = useState(defaultCmsData); const [activeId, setActiveId] = useState("leads"); const [status, setStatus] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [dirty, setDirty] = useState(false); const [leads, setLeads] = useState([]); const [leadsLoading, setLeadsLoading] = useState(false); const [search, setSearch] = useState("");
  const visibleSections = useMemo(() => SECTIONS.filter((section) => `${section.label} ${section.note}`.toLowerCase().includes(search.toLowerCase())), [search]); const activeSection = SECTIONS.find((section) => section.id === activeId) || SECTIONS[0]; const activeBlockIndex = data.page.blocks.findIndex((block) => block.id === activeId); const activeBlock = data.page.blocks[activeBlockIndex];
  useEffect(() => { Promise.all([getRemoteSession().catch(() => null), loadRemoteCms()]).then(([session, remote]) => { setUser(session); setData(mergeCmsData(remote)); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!user) return; setLeadsLoading(true); loadRemoteLeads().then(setLeads).catch(() => setLeads([])).finally(() => setLeadsLoading(false)); }, [user]);
  async function login(login, password) { const session = await loginRemote(login, password); setUser(session); }
  const update = (path, value) => { setData((current) => setPath(current, path, value)); setDirty(true); setStatus(""); }; const remove = (path) => { setData((current) => removeAtPath(current, path)); setDirty(true); setStatus(""); }; const move = (path, direction) => { setData((current) => moveAtPath(current, path, direction)); setDirty(true); setStatus(""); };
  async function save() { setSaving(true); setStatus(""); try { const saved = await saveRemoteCms(data); setData(mergeCmsData(saved)); setDirty(false); setStatus("Изменения опубликованы"); } catch (error) { setStatus(error.message || "Не удалось сохранить изменения"); } finally { setSaving(false); } }
  async function logout() { try { await logoutRemote(); } catch { /* Local state is still cleared. */ } localStorage.removeItem(CMS_SESSION_KEY); setUser(null); }
  async function refreshLeads() { setLeadsLoading(true); try { setLeads(await loadRemoteLeads()); } catch { setStatus("Не удалось загрузить заявки"); } finally { setLeadsLoading(false); } }
  if (loading) return <main className="cms-login"><div className="cms-login-card"><p>Загружаем панель...</p></div></main>;
  if (!user) return <LoginScreen onLogin={login} />;
  return <div className="cms-shell"><aside className="cms-sidebar"><div className="cms-sidebar-brand"><span>白泽</span><div><strong>Бай Цзэ</strong><small>Управление сайтом</small></div></div><div className="cms-sidebar-search"><MagnifyingGlass size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти раздел" aria-label="Найти раздел" /></div><nav aria-label="Разделы админки">{visibleSections.map((section) => <button key={section.id} className={section.id === activeId ? "is-active" : ""} onClick={() => setActiveId(section.id)}><SectionIcon name={section.icon} /><span>{section.label}</span>{section.id === "leads" && leads.length ? <b>{leads.length}</b> : null}</button>)}</nav><div className="cms-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer">Открыть сайт <ArrowSquareOut size={16} /></a><a href="/admin-guide.html" target="_blank" rel="noreferrer">Пособие <ArrowSquareOut size={16} /></a><button onClick={logout}><SignOut size={16} /> Выйти</button></div></aside><main className="cms-main"><header className="cms-topbar"><div><p className="cms-kicker">Админка / {activeSection.label}</p><h1>{activeId === "leads" ? "Заявки" : activeSection.label}</h1></div><div className="cms-top-actions">{status ? <span className={status === "Изменения опубликованы" ? "cms-saved" : "cms-error"}>{status === "Изменения опубликованы" ? <Check size={17} /> : null}{status}</span> : null}{activeId !== "leads" ? <button className="cms-button cms-button--primary" onClick={save} disabled={saving || !dirty}><FloppyDisk size={18} />{saving ? "Сохраняем..." : dirty ? "Сохранить изменения" : "Все сохранено"}</button> : null}</div></header><div className="cms-editor">{activeId === "leads" ? <LeadsPanel leads={leads} loading={leadsLoading} onRefresh={refreshLeads} /> : activeId === "news" ? <NewsPanel data={data} onChange={update} onRemove={remove} onMove={move} /> : activeId === "site" ? <SitePanel data={data} onChange={update} /> : activeBlock ? <ContentPanel section={activeSection} block={activeBlock} blockIndex={activeBlockIndex} onChange={update} onRemove={remove} onMove={move} /> : <p className="cms-empty">Раздел пока не настроен.</p>}</div></main></div>;
}
