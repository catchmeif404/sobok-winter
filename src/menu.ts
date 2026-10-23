import gsap from 'gsap';
import { Locale, locale, onLocaleChange } from './i18n';

export enum MenuCategory {
  All = 'all',
  Bingsu = 'bingsu',
  Cake = 'cake',
  Drink = 'drink',
}

export enum MenuBadge {
  None = 'none',
  Best = 'best',
  Season = 'season',
  New = 'new',
}

type Localized = Record<Locale, string>;

interface MenuItem {
  category: Exclude<MenuCategory, MenuCategory.All>;
  name: Localized;
  description: Localized;
  price: number;
  badge: MenuBadge;
}

const categoryLabels: Record<MenuCategory, Localized> = {
  [MenuCategory.All]: { [Locale.Ko]: '전체', [Locale.En]: 'All' },
  [MenuCategory.Bingsu]: { [Locale.Ko]: '빙수', [Locale.En]: 'Bingsu' },
  [MenuCategory.Cake]: { [Locale.Ko]: '케이크', [Locale.En]: 'Cake' },
  [MenuCategory.Drink]: { [Locale.Ko]: '음료', [Locale.En]: 'Drinks' },
};

const badgeLabels: Record<MenuBadge, Localized> = {
  [MenuBadge.None]: { [Locale.Ko]: '', [Locale.En]: '' },
  [MenuBadge.Best]: { [Locale.Ko]: 'BEST', [Locale.En]: 'BEST' },
  [MenuBadge.Season]: { [Locale.Ko]: '시즌', [Locale.En]: 'SEASONAL' },
  [MenuBadge.New]: { [Locale.Ko]: 'NEW', [Locale.En]: 'NEW' },
};

const items: MenuItem[] = [
  {
    category: MenuCategory.Bingsu, price: 9500, badge: MenuBadge.Best,
    name: { [Locale.Ko]: '우유 눈꽃빙수', [Locale.En]: 'Milk snowflake bingsu' },
    description: { [Locale.Ko]: '얼린 우유를 곱게 갈아 연유와 콩가루를 올렸어요.', [Locale.En]: 'Finely shaved frozen milk with condensed milk and soybean powder.' },
  },
  {
    category: MenuCategory.Bingsu, price: 13500, badge: MenuBadge.Season,
    name: { [Locale.Ko]: '생딸기 빙수', [Locale.En]: 'Fresh strawberry bingsu' },
    description: { [Locale.Ko]: '설향 딸기 한 팩과 딸기 퓌레, 우유 얼음.', [Locale.En]: 'A full punnet of Seolhyang strawberries, purée and milk ice.' },
  },
  {
    category: MenuCategory.Bingsu, price: 11000, badge: MenuBadge.None,
    name: { [Locale.Ko]: '흑임자 인절미 빙수', [Locale.En]: 'Black sesame injeolmi bingsu' },
    description: { [Locale.Ko]: '고소한 흑임자 크림과 쫀득한 인절미.', [Locale.En]: 'Nutty black sesame cream with chewy rice cake.' },
  },
  {
    category: MenuCategory.Cake, price: 7800, badge: MenuBadge.Best,
    name: { [Locale.Ko]: '딸기 생크림 케이크', [Locale.En]: 'Strawberry cream cake' },
    description: { [Locale.Ko]: '가벼운 생크림과 딸기를 세 겹으로.', [Locale.En]: 'Three layers of airy cream and strawberries.' },
  },
  {
    category: MenuCategory.Cake, price: 7200, badge: MenuBadge.None,
    name: { [Locale.Ko]: '바스크 치즈케이크', [Locale.En]: 'Basque cheesecake' },
    description: { [Locale.Ko]: '겉은 진하게 굽고 속은 촉촉하게.', [Locale.En]: 'Deeply caramelised outside, creamy inside.' },
  },
  {
    category: MenuCategory.Cake, price: 6800, badge: MenuBadge.New,
    name: { [Locale.Ko]: '얼그레이 쉬폰', [Locale.En]: 'Earl Grey chiffon' },
    description: { [Locale.Ko]: '얼그레이 찻잎을 넣은 폭신한 쉬폰과 크림.', [Locale.En]: 'Fluffy chiffon with Earl Grey leaves and cream.' },
  },
  {
    category: MenuCategory.Drink, price: 4800, badge: MenuBadge.None,
    name: { [Locale.Ko]: '아메리카노', [Locale.En]: 'Americano' },
    description: { [Locale.Ko]: '산미가 적은 고소한 블렌드. HOT / ICE', [Locale.En]: 'A smooth, low-acidity blend. Hot / iced.' },
  },
  {
    category: MenuCategory.Drink, price: 6200, badge: MenuBadge.Best,
    name: { [Locale.Ko]: '호지차 라떼', [Locale.En]: 'Hojicha latte' },
    description: { [Locale.Ko]: '구운 녹차의 고소함과 부드러운 우유.', [Locale.En]: 'Roasted green tea with steamed milk.' },
  },
  {
    category: MenuCategory.Drink, price: 5800, badge: MenuBadge.None,
    name: { [Locale.Ko]: '진한 핫초코', [Locale.En]: 'Rich hot chocolate' },
    description: { [Locale.Ko]: '다크 초콜릿을 녹여 마시멜로를 띄워요.', [Locale.En]: 'Melted dark chocolate topped with marshmallows.' },
  },
  {
    category: MenuCategory.Drink, price: 6800, badge: MenuBadge.Season,
    name: { [Locale.Ko]: '무알콜 뱅쇼', [Locale.En]: 'Alcohol-free vin chaud' },
    description: { [Locale.Ko]: '포도, 오렌지, 시나몬을 오래 끓였어요.', [Locale.En]: 'Grape, orange and cinnamon, slowly simmered.' },
  },
];

const priceFormat: Record<Locale, Intl.NumberFormat> = {
  [Locale.Ko]: new Intl.NumberFormat('ko-KR'),
  [Locale.En]: new Intl.NumberFormat('en-US'),
};

const formatPrice = (price: number, current: Locale): string =>
  current === Locale.Ko ? `${priceFormat[current].format(price)}원` : `₩${priceFormat[current].format(price)}`;

export const createMenu = (tabs: HTMLElement, list: HTMLElement): void => {
  let active: MenuCategory = MenuCategory.All;

  const renderTabs = (): void => {
    const current = locale();
    tabs.replaceChildren(...Object.values(MenuCategory).map((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'tab';
      button.className = 'menu-tab';
      button.textContent = categoryLabels[category][current];
      button.setAttribute('aria-selected', String(category === active));
      button.addEventListener('click', () => {
        active = category;
        renderTabs();
        renderList(true);
      });
      return button;
    }));
  };

  const renderList = (animate: boolean): void => {
    const current = locale();
    const visible = items.filter((item) => active === MenuCategory.All || item.category === active);
    list.replaceChildren(...visible.map((item) => {
      const row = document.createElement('article');
      row.className = 'menu-item';
      const head = document.createElement('div');
      head.className = 'menu-item-head';
      const name = document.createElement('h3');
      name.textContent = item.name[current];
      if (item.badge !== MenuBadge.None) {
        const badge = document.createElement('span');
        badge.className = `menu-badge is-${item.badge}`;
        badge.textContent = badgeLabels[item.badge][current];
        name.append(badge);
      }
      const leader = document.createElement('span');
      leader.className = 'menu-leader';
      leader.ariaHidden = 'true';
      const price = document.createElement('span');
      price.className = 'menu-price';
      price.textContent = formatPrice(item.price, current);
      head.append(name, leader, price);
      const description = document.createElement('p');
      description.textContent = item.description[current];
      const category = document.createElement('span');
      category.className = 'menu-category';
      category.textContent = categoryLabels[item.category][current];
      row.append(category, head, description);
      return row;
    }));
    if (animate) gsap.from(list.children, { y: 18, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.04 });
  };

  renderTabs();
  renderList(false);
  onLocaleChange(() => {
    renderTabs();
    renderList(false);
  });
};
