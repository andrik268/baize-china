import { useEffect, useMemo, useState } from "react";
import { ArrowClockwise, ArrowSquareOut, Check, FloppyDisk, Image as ImageIcon, SignOut, UploadSimple, X } from "@phosphor-icons/react";
import { getRemoteSession, loadRemoteCms, loadRemoteLeads, loginRemote, logoutRemote, saveRemoteCms, uploadRemoteImage } from "./apiClient.js";
import { ADMIN_LOGIN, CMS_SESSION_KEY, cloneCmsData, defaultCmsData, mergeCmsData } from "./cmsData.js";

const SECTIONS = [
  ["header", "Шапка сайта"], ["hero", "Первый экран"], ["why", "Почему Китай"], ["studyAbroad", "Поступление"], ["universities", "Университеты"], ["university", "Поступление в вуз"], ["about", "О компании"], ["faq", "Вопросы и ответы"], ["visa", "Визы"], ["programs", "Каникулы"], ["safety", "Сопровождение"], ["language", "Курсы китайского"], ["reviews", "Отзывы"], ["cases", "Кейсы"], ["quiz", "Персональный подбор"], ["contacts", "Контакты"], ["footer", "Подвал"], ["leads", "Заявки"],
];

const labelize = (key) => ({
  title: "Заголовок", lead: "Подзаголовок", text: "Текст", description: "Описание", image: "Изображение", cardImage: "Изображение карточки", alt: "Описание изображения", button: "Кнопка", primaryButton: "Основная кнопка", secondaryButton: "Вторая кнопка", address: "Адрес", phone: "Телефон", secondPhone: "Дополнительный телефон", email: "Электронная почта", linkText: "Текст ссылки", statement: "Акцентная фраза", eyebrow: "Надзаголовок", noteTitle: "Заголовок плашки", noteText: "Текст плашки", brand: "Название бренда", tagline: "Подпись бренда", ctaTitle: "Заголовок призыва", ctaText: "Текст призыва", copyright: "Копирайт", legalName: "Юридическое название", inn: "ИНН",
}[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()));

function setPath(source, path, value) {
  const next = cloneCmsData(source);
  const keys = path.split(".");
  let cursor = next;
  keys.forEach((key, index) => { if (index === keys.length - 1) cursor[key] = value; else cursor = cursor[key]; });
  return next;
}

function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function upload(event) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Выберите изображение JPG, PNG, WebP или SVG."); return; }
    setUploading(true); setError("");
    try { const remotePath = await uploadRemoteImage(file); onChange({ ...(value || {}), path: remotePath, alt: value?.alt || file.name }); }
    catch (uploadError) { setError(uploadError.message || "Не удалось загрузить изображение."); }
    finally { setUploading(false); }
  }
  return <div className="cms-image-field">
    <div className="cms-field-label">{label}</div>
    <div className="cms-image-preview">{value?.path ? <img src={value.path} alt={value.alt || "Предпросмотр"} /> : <ImageIcon size={30} />}</div>
    <div className="cms-image-actions">
      <label className="cms-button cms-button--secondary"><UploadSimple size={17} />{uploading ? "Загружаем…" : "Заменить изображение"}<input hidden type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={upload} disabled={uploading} /></label>
      {value?.path ? <button className="cms-button cms-button--ghost" type="button" onClick={() => onChange({ path: "", alt: "" })}><X size={16} /> Убрать</button> : null}
    </div>
    <label className="cms-field"><span>Путь изображения</span><input value={value?.path || ""} onChange={(event) => onChange({ ...(value || {}), path: event.target.value })} /></label>
    <label className="cms-field"><span>Описание для доступности</span><input value={value?.alt || ""} onChange={(event) => onChange({ ...(value || {}), alt: event.target.value })} /></label>
    {error ? <p className="cms-error">{error}</p> : null}
  </div>;
}

function ScalarField({ label, value, onChange }) {
  if (typeof value === "boolean") return <label className="cms-check"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>;
  const multiline = typeof value === "string" && (value.length > 100 || value.includes("\n"));
  return <label className="cms-field"><span>{label}</span>{multiline ? <textarea rows={4} value={value ?? ""} onChange={(event) => onChange(event.target.value)} /> : <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function EditorNode({ value, label, path, onChange }) {
  if (value && typeof value === "object" && !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, "path") && Object.prototype.hasOwnProperty.call(value, "alt")) return <ImageField label={label} value={value} onChange={(next) => onChange(path, next)} />;
  if (Array.isArray(value)) return <div className="cms-array"><div className="cms-array-heading"><strong>{label}</strong><span>{value.length} элементов</span></div>{value.map((item, index) => <div className="cms-array-row" key={`${path}.${index}`}><div className="cms-array-row__title">{typeof item === "object" ? `Элемент ${index + 1}` : `${label} ${index + 1}`}</div><EditorNode value={item} label={typeof item === "object" ? "" : `Значение ${index + 1}`} path={`${path}.${index}`} onChange={onChange} /></div>)}</div>;
  if (value && typeof value === "object") return <fieldset className="cms-object"><legend>{label}</legend>{Object.entries(value).filter(([key]) => !["id", "slug", "icon", "type", "isActive", "settings"].includes(key)).map(([key, child]) => <EditorNode key={`${path}.${key}`} value={child} label={labelize(key)} path={`${path}.${key}`} onChange={onChange} />)}</fieldset>;
  return <ScalarField label={label} value={value} onChange={(next) => onChange(path, next)} />;
}

function LoginScreen({ onLogin }) {
  const [login, setLogin] = useState(ADMIN_LOGIN); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setLoading(true); setError(""); try { await onLogin(login, password); } catch (loginError) { setError(loginError.message || "Не удалось войти"); } finally { setLoading(false); } }
  return <main className="cms-login"><form className="cms-login-card" onSubmit={submit}><div className="cms-login-brand">白泽</div><p className="cms-kicker">Панель управления сайтом</p><h1>Войти в админку</h1><p>Здесь можно менять тексты, изображения и ссылки на сайте.</p><label className="cms-field"><span>Логин</span><input type="email" value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" /></label><label className="cms-field"><span>Пароль</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>{error ? <p className="cms-error">{error}</p> : null}<button className="cms-button cms-button--primary" disabled={loading}>{loading ? "Проверяем…" : "Войти"}</button></form></main>;
}

function LeadsPanel({ leads, loading, onRefresh }) {
  return <div className="cms-leads-panel">
    <div className="cms-leads-toolbar"><div><h3>Заявки с сайта</h3><p>Новые обращения из форм консультации и персонального подбора.</p></div><button className="cms-button cms-button--secondary" onClick={onRefresh} disabled={loading}><ArrowClockwise size={17} />{loading ? "Обновляем…" : "Обновить"}</button></div>
    {loading && !leads.length ? <p className="cms-leads-empty">Загружаем заявки…</p> : null}
    {!loading && !leads.length ? <p className="cms-leads-empty">Пока заявок нет. Они появятся здесь после заполнения формы на сайте.</p> : null}
    <div className="cms-leads-list">{leads.map((lead) => <article className="cms-lead-card" key={lead.id}>
      <div className="cms-lead-card__top"><strong>{lead.name || "Без имени"}</strong><span>{lead.createdAt || ""}</span></div>
      <a className="cms-lead-card__contact" href={`tel:${String(lead.contact || "").replace(/\D/g, "")}`}>{lead.contact}</a>
      <div className="cms-lead-card__meta"><span>{lead.source === "quiz" ? "Персональный подбор" : "Форма консультации"}</span><span className="cms-lead-status">{lead.status === "new" ? "Новая" : lead.status}</span></div>
      {lead.message ? <p>{lead.message}</p> : null}
      {lead.fields?.goal ? <p><b>Направление:</b> {lead.fields.goal}</p> : null}
    </article>)}</div>
  </div>;
}

export function AdminApp() {
  const [user, setUser] = useState(null); const [data, setData] = useState(defaultCmsData); const [activeId, setActiveId] = useState("hero"); const [status, setStatus] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [leads, setLeads] = useState([]); const [leadsLoading, setLeadsLoading] = useState(false);
  const activeBlock = useMemo(() => data.page.blocks.find((block) => block.id === activeId) || data.page.blocks[0], [data, activeId]);
  useEffect(() => { Promise.all([getRemoteSession().catch(() => null), loadRemoteCms()]).then(([session, remote]) => { setUser(session); setData(mergeCmsData(remote)); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!user) return; setLeadsLoading(true); loadRemoteLeads().then(setLeads).catch(() => setLeads([])).finally(() => setLeadsLoading(false)); }, [user]);
  async function login(login, password) { const session = await loginRemote(login, password); setUser(session); }
  async function save() { setSaving(true); setStatus(""); try { const saved = await saveRemoteCms(data); setData(mergeCmsData(saved)); setStatus("Сохранено"); } catch (error) { setStatus(error.message || "Не удалось сохранить"); } finally { setSaving(false); } }
  async function logout() { try { await logoutRemote(); } catch { /* local session can still be cleared */ } localStorage.removeItem(CMS_SESSION_KEY); setUser(null); }
  async function refreshLeads() { setLeadsLoading(true); try { setLeads(await loadRemoteLeads()); } catch { setStatus("Не удалось загрузить заявки"); } finally { setLeadsLoading(false); } }
  if (loading) return <main className="cms-login"><div className="cms-login-card"><p>Загружаем панель…</p></div></main>;
  if (!user) return <LoginScreen onLogin={login} />;
  const update = (path, value) => setData((current) => setPath(current, path, value));
  return <div className="cms-shell">
    <aside className="cms-sidebar"><div className="cms-sidebar-brand"><span>白泽</span><div><strong>Бай Цзэ</strong><small>Редактор сайта</small></div></div><nav>{SECTIONS.map(([id, label]) => <button key={id} className={id === activeId ? "is-active" : ""} onClick={() => setActiveId(id)}>{label}</button>)}</nav><div className="cms-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer">Открыть сайт <ArrowSquareOut size={16} /></a><button onClick={logout}><SignOut size={16} /> Выйти</button></div></aside>
    <main className="cms-main"><header className="cms-topbar"><div><p className="cms-kicker">Админка / Бай Цзэ</p><h1>Редактор контента</h1></div><div className="cms-top-actions">{status ? <span className={status === "Сохранено" ? "cms-saved" : "cms-error"}>{status === "Сохранено" ? <Check size={17} /> : null}{status}</span> : null}{activeId !== "leads" ? <button className="cms-button cms-button--primary" onClick={save} disabled={saving}><FloppyDisk size={18} />{saving ? "Сохраняем…" : "Сохранить изменения"}</button> : null}</div></header><section className="cms-editor"><div className="cms-editor-intro"><span className="cms-section-number">{String(SECTIONS.findIndex(([id]) => id === activeId) + 1).padStart(2, "0")}</span><div><h2>{SECTIONS.find(([id]) => id === activeId)?.[1] || activeBlock.title}</h2><p>{activeId === "leads" ? "Здесь отображаются обращения посетителей сайта." : "Меняйте значения ниже и нажмите «Сохранить изменения». Фото можно загрузить прямо с компьютера."}</p></div></div>{activeId === "leads" ? <LeadsPanel leads={leads} loading={leadsLoading} onRefresh={refreshLeads} /> : <div className="cms-card cms-content-card"><EditorNode value={activeBlock.content} label="Содержимое блока" path={`page.blocks.${data.page.blocks.findIndex((block) => block.id === activeId)}.content`} onChange={update} /></div>}</section></main>
  </div>;
}
