export const SITE_URL = "https://www.sicoesmonitor.com";
export const SITE_NAME = "SICOES Monitor";
export const SUPPORT_EMAIL = "jbendek@ribentek.com";

/** Title that fits Google's ~60 char limit; appends the brand only when it still fits. */
export function fitTitle(base: string, brand = SITE_NAME): string {
  const withBrand = `${base} | ${brand}`;
  return withBrand.length <= 60 ? withBrand : base;
}
