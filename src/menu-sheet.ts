import { Locale } from './i18n';
import { MenuBadge, MenuCategory, type MenuItem } from './menu';

// Google Sheets "Publish to web" CSV link. Without it the built-in menu is used.
const SHEET_URL: string | undefined = import.meta.env.VITE_MENU_SHEET_CSV;
const TIMEOUT_MS = 5000;

enum Column {
  Category = 'category',
  NameKo = 'name_ko',
  NameEn = 'name_en',
  DescriptionKo = 'description_ko',
  DescriptionEn = 'description_en',
  Price = 'price',
  Badge = 'badge',
}

export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
};

// Built per call: menu.ts imports this module, so its enums are not ready at load time.
const categoryAliases = (): Record<string, Exclude<MenuCategory, MenuCategory.All>> => ({
  bingsu: MenuCategory.Bingsu, 빙수: MenuCategory.Bingsu,
  cake: MenuCategory.Cake, 케이크: MenuCategory.Cake,
  drink: MenuCategory.Drink, 음료: MenuCategory.Drink,
});

const badgeAliases = (): Record<string, MenuBadge> => ({
  '': MenuBadge.None, none: MenuBadge.None,
  best: MenuBadge.Best, 베스트: MenuBadge.Best,
  season: MenuBadge.Season, 시즌: MenuBadge.Season,
  new: MenuBadge.New, 신메뉴: MenuBadge.New,
});

export const rowsToItems = (rows: string[][]): MenuItem[] => {
  const [header, ...body] = rows;
  if (!header) return [];
  const index = new Map(header.map((h, i) => [h.trim().toLowerCase(), i]));
  const categories = categoryAliases();
  const badges = badgeAliases();
  const get = (row: string[], column: Column): string => (row[index.get(column) ?? -1] ?? '').trim();
  return body.flatMap((row) => {
    const category = categories[get(row, Column.Category).toLowerCase()];
    const price = Number(get(row, Column.Price).replace(/[^\d]/g, ''));
    const nameKo = get(row, Column.NameKo);
    if (!category || !nameKo || !price) return [];
    const descriptionKo = get(row, Column.DescriptionKo);
    return [{
      category,
      price,
      badge: badges[get(row, Column.Badge).toLowerCase()] ?? MenuBadge.None,
      name: { [Locale.Ko]: nameKo, [Locale.En]: get(row, Column.NameEn) || nameKo },
      description: { [Locale.Ko]: descriptionKo, [Locale.En]: get(row, Column.DescriptionEn) || descriptionKo },
    }];
  });
};

export const loadSheetMenu = async (): Promise<MenuItem[] | null> => {
  if (!SHEET_URL) return null;
  try {
    const response = await fetch(SHEET_URL, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
    if (!response.ok) return null;
    const items = rowsToItems(parseCsv(await response.text()));
    return items.length ? items : null;
  } catch {
    return null;
  }
};
