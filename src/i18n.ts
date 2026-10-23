export enum Locale {
  Ko = 'ko',
  En = 'en',
}

export enum TextKey {
  NavMenu = 'nav.menu',
  NavStory = 'nav.story',
  NavVisit = 'nav.visit',
  SampleNotice = 'sample.notice',
  HeroHint = 'hero.hint',
  WindowEyebrow = 'window.eyebrow',
  WindowTitle = 'window.title',
  WindowHint = 'window.hint',
  WindowSign = 'window.sign',
  StoryEyebrow = 'story.eyebrow',
  StoryStep1Title = 'story.step1.title',
  StoryStep1Body = 'story.step1.body',
  StoryStep2Title = 'story.step2.title',
  StoryStep2Body = 'story.step2.body',
  StoryStep3Title = 'story.step3.title',
  StoryStep3Body = 'story.step3.body',
  StoryDish = 'story.dish',
  StoryDishPrice = 'story.dishPrice',
  MenuEyebrow = 'menu.eyebrow',
  MenuTitle = 'menu.title',
  VisitEyebrow = 'visit.eyebrow',
  VisitTitle = 'visit.title',
  VisitAddress = 'visit.address',
  VisitDays1 = 'visit.days1',
  VisitTime1 = 'visit.time1',
  VisitDays2 = 'visit.days2',
  VisitTime2 = 'visit.time2',
  VisitDays3 = 'visit.days3',
  VisitTime3 = 'visit.time3',
  VisitLastOrderLabel = 'visit.lastOrderLabel',
  VisitLastOrder = 'visit.lastOrder',
  VisitPhone = 'visit.phone',
  VisitParking = 'visit.parking',
  MenuNote = 'menu.note',
  Badge = 'badge',
  FooterLine = 'footer.line',
  FooterCredit = 'footer.credit',
  LangToggle = 'lang.toggle',
}

type Dictionary = Record<TextKey, string>;

const ko: Dictionary = {
  [TextKey.NavMenu]: '메뉴',
  [TextKey.NavStory]: '이야기',
  [TextKey.NavVisit]: '오시는 길',
  [TextKey.SampleNotice]: '가상 브랜드 · 샘플 사이트',
  [TextKey.HeroHint]: '눈꽃을 눌러 보세요',
  [TextKey.WindowEyebrow]: '성에 낀 창문',
  [TextKey.WindowTitle]: '안쪽이 궁금하다면,\n창문을 문질러 보세요',
  [TextKey.WindowHint]: '드래그해서 성에 닦기',
  [TextKey.WindowSign]: '영업 중',
  [TextKey.StoryEyebrow]: '한 그릇이 되기까지',
  [TextKey.StoryStep1Title]: '우유를 얼려요',
  [TextKey.StoryStep1Body]: '매일 아침 우유에 연유를 섞어 영하 15도에서 천천히 얼려요.',
  [TextKey.StoryStep2Title]: '눈꽃처럼 갈아요',
  [TextKey.StoryStep2Body]: '얼린 우유를 얇게 깎아 내면 입에 넣자마자 녹는 눈꽃 얼음이 돼요.',
  [TextKey.StoryStep3Title]: '그리고 당신의 접시 위로',
  [TextKey.StoryStep3Body]: '그날 쓸 크림과 시트는 그날 아침에 만들어요. 그래서 늦은 오후엔 품절이 잦아요.',
  [TextKey.StoryDish]: '우유 눈꽃빙수',
  [TextKey.StoryDishPrice]: '9,500원',
  [TextKey.MenuEyebrow]: 'Menu',
  [TextKey.MenuTitle]: '메뉴',
  [TextKey.VisitEyebrow]: 'Visit',
  [TextKey.VisitTitle]: '영업시간 · 오시는 길',
  [TextKey.VisitAddress]: '서울 마포구 소복길 12, 1층',
  [TextKey.VisitDays1]: '화 – 금',
  [TextKey.VisitTime1]: '12:00 – 21:00',
  [TextKey.VisitDays2]: '토 · 일',
  [TextKey.VisitTime2]: '11:00 – 21:00',
  [TextKey.VisitDays3]: '월요일',
  [TextKey.VisitTime3]: '정기 휴무',
  [TextKey.VisitLastOrderLabel]: '라스트 오더',
  [TextKey.VisitLastOrder]: '20:30',
  [TextKey.VisitPhone]: '02-000-0000 (샘플 번호)',
  [TextKey.VisitParking]: '건물 뒤 2대 주차 가능',
  [TextKey.MenuNote]: '시즌 메뉴는 재료가 떨어지면 일찍 마감될 수 있어요. 가격은 부가세 포함입니다.',
  [TextKey.Badge]: '예약 문의 · RESERVE · ',
  [TextKey.FooterLine]: '소복소복, 오늘도 쌓이는 중',
  [TextKey.FooterCredit]: '이 사이트는 홈페이지 제작 예시로 만든 가상 브랜드입니다.',
  [TextKey.LangToggle]: 'EN',
};

const en: Dictionary = {
  [TextKey.NavMenu]: 'Menu',
  [TextKey.NavStory]: 'Story',
  [TextKey.NavVisit]: 'Visit',
  [TextKey.SampleNotice]: 'Fictional brand · Sample site',
  [TextKey.HeroHint]: 'Tap the snowflake',
  [TextKey.WindowEyebrow]: 'Frosted window',
  [TextKey.WindowTitle]: 'Curious what’s inside?\nWipe the window',
  [TextKey.WindowHint]: 'Drag to clear the frost',
  [TextKey.WindowSign]: 'OPEN',
  [TextKey.StoryEyebrow]: 'How a bowl is made',
  [TextKey.StoryStep1Title]: 'We freeze the milk',
  [TextKey.StoryStep1Body]: 'Every morning, milk and condensed milk freeze slowly at −15°C.',
  [TextKey.StoryStep2Title]: 'Shaved like snowflakes',
  [TextKey.StoryStep2Body]: 'Shaved paper-thin, the frozen milk melts the moment it touches your tongue.',
  [TextKey.StoryStep3Title]: 'Then onto your plate',
  [TextKey.StoryStep3Body]: 'We bake the sponge and whip the cream every morning, so things sell out by late afternoon.',
  [TextKey.StoryDish]: 'Milk snowflake bingsu',
  [TextKey.StoryDishPrice]: '₩9,500',
  [TextKey.MenuEyebrow]: 'Menu',
  [TextKey.MenuTitle]: 'Our menu',
  [TextKey.VisitEyebrow]: 'Visit',
  [TextKey.VisitTitle]: 'Hours & location',
  [TextKey.VisitAddress]: '1F, 12 Sobok-gil, Mapo-gu, Seoul',
  [TextKey.VisitDays1]: 'Tue – Fri',
  [TextKey.VisitTime1]: '12:00 – 21:00',
  [TextKey.VisitDays2]: 'Sat · Sun',
  [TextKey.VisitTime2]: '11:00 – 21:00',
  [TextKey.VisitDays3]: 'Monday',
  [TextKey.VisitTime3]: 'Closed',
  [TextKey.VisitLastOrderLabel]: 'Last order',
  [TextKey.VisitLastOrder]: '20:30',
  [TextKey.VisitPhone]: '02-000-0000 (sample number)',
  [TextKey.VisitParking]: 'Two parking spaces behind the building',
  [TextKey.MenuNote]: 'Seasonal items may sell out early. Prices include VAT.',
  [TextKey.Badge]: 'RESERVE · 예약 문의 · ',
  [TextKey.FooterLine]: 'Softly, softly — still piling up',
  [TextKey.FooterCredit]: 'This is a fictional brand built as a website design sample.',
  [TextKey.LangToggle]: '한국어',
};

const dictionaries: Record<Locale, Dictionary> = { [Locale.Ko]: ko, [Locale.En]: en };

const STORAGE_KEY = 'sobok.locale';
const textKeys = new Set<string>(Object.values(TextKey));

const isLocale = (value: string): value is Locale => value === Locale.Ko || value === Locale.En;
const isTextKey = (value: string): value is TextKey => textKeys.has(value);

let current: Locale = Locale.Ko;
const listeners: Array<(locale: Locale) => void> = [];

export const t = (key: TextKey): string => dictionaries[current][key];

export const locale = (): Locale => current;

export const onLocaleChange = (listener: (locale: Locale) => void): void => {
  listeners.push(listener);
};

const apply = (): void => {
  document.documentElement.lang = current;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n ?? '';
    if (isTextKey(key)) element.textContent = t(key);
  });
};

export const setLocale = (next: Locale): void => {
  current = next;
  localStorage.setItem(STORAGE_KEY, next);
  apply();
  listeners.forEach((listener) => listener(next));
};

export const initLocale = (): void => {
  const saved = localStorage.getItem(STORAGE_KEY) ?? '';
  const browser = navigator.language.toLowerCase().startsWith(Locale.Ko) ? Locale.Ko : Locale.En;
  current = isLocale(saved) ? saved : browser;
  apply();
};
