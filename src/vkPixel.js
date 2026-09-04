/**
 * Initializes VK Ads retargeting when a real numeric pixel ID is configured.
 *
 * The ID can be supplied at build time (VITE_VK_ADS_PIXEL_ID), via the
 * `vk-ads-pixel-id` meta tag, or by setting window.__BAIZE_VK_PIXEL_ID before
 * the app starts. We intentionally do not guess an ID: VK would attribute
 * visits to the wrong account otherwise.
 */
export function initVkAdsPixel() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__BAIZE_VK_PIXEL_LOADED) return;

  const metaId = document.querySelector('meta[name="vk-ads-pixel-id"]')?.getAttribute("content") || "";
  const id = String(window.__BAIZE_VK_PIXEL_ID || import.meta.env.VITE_VK_ADS_PIXEL_ID || metaId).trim();
  if (!/^\d+$/.test(id)) return;

  window.__BAIZE_VK_PIXEL_LOADED = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://vk.com/js/api/openapi.js?169";
  script.onload = () => {
    if (window.VK?.Retargeting) {
      window.VK.Retargeting.Init(id);
      window.VK.Retargeting.Hit();
    }
  };
  document.head.appendChild(script);

  const noscriptPixel = document.createElement("img");
  noscriptPixel.src = `https://vk.com/rtrg?p=${encodeURIComponent(id)}`;
  noscriptPixel.width = 1;
  noscriptPixel.height = 1;
  noscriptPixel.alt = "";
  noscriptPixel.style.position = "absolute";
  noscriptPixel.style.left = "-9999px";
  noscriptPixel.setAttribute("aria-hidden", "true");
  document.body.appendChild(noscriptPixel);
}
