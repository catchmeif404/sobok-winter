export enum Locale {
  Ko = 'ko',
  En = 'en',
}

export enum TextKey {
  NavMenu = 'nav.menu',
  NavStory = 'nav.story',
  NavVisit = 'nav.visit',
  SampleNotice = 'sample.notice',
  HeroEyebrow = 'hero.eyebrow',
  HeroTitle = 'hero.title',
  HeroLead = 'hero.lead',
  HeroHint = 'hero.hint',
  HeroSerial = 'hero.serial',
  HeroUnique = 'hero.unique',
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
  MenuEyebrow = 'menu.eyebrow',
  MenuTitle = 'menu.title',
  Menu1Name = 'menu.1.name',
  Menu1Desc = 'menu.1.desc',
  Menu2Name = 'menu.2.name',
  Menu2Desc = 'menu.2.desc',
  Menu3Name = 'menu.3.name',
  Menu3Desc = 'menu.3.desc',
  VisitEyebrow = 'visit.eyebrow',
  VisitTitle = 'visit.title',
  VisitBody = 'visit.body',
  VisitChance = 'visit.chance',
  VisitAddress = 'visit.address',
  VisitHours = 'visit.hours',
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
  [TextKey.HeroEyebrow]: '겨울 디저트 하우스',
  [TextKey.HeroTitle]: '첫눈',
  [TextKey.HeroLead]: '첫눈 오는 날에만 문을 여는 작은 디저트 가게, 소복입니다.',
  [TextKey.HeroHint]: '눈꽃을 눌러 보세요',
  [TextKey.HeroSerial]: '오늘의 눈꽃',
  [TextKey.HeroUnique]: '같은 눈꽃은 두 번 내리지 않아요',
  [TextKey.WindowEyebrow]: '성에 낀 창문',
  [TextKey.WindowTitle]: '안쪽이 궁금하다면,\n창문을 문질러 보세요',
  [TextKey.WindowHint]: '드래그해서 성에 닦기',
  [TextKey.WindowSign]: '영업 중',
  [TextKey.StoryEyebrow]: '눈꽃이 되기까지',
  [TextKey.StoryStep1Title]: '영하 15도의 구름 속',
  [TextKey.StoryStep1Body]: '먼지 한 톨에 물방울이 얼어붙으면서 작은 육각형이 생겨요.',
  [TextKey.StoryStep2Title]: '여섯 갈래로 자라요',
  [TextKey.StoryStep2Body]: '떨어지는 동안 온도와 습도가 바뀔 때마다 가지가 하나씩 뻗어 나가요.',
  [TextKey.StoryStep3Title]: '그리고 당신의 접시 위로',
  [TextKey.StoryStep3Body]: '그날의 눈처럼, 소복의 디저트도 그날 아침에만 만들어요.',
  [TextKey.MenuEyebrow]: '오늘의 메뉴',
  [TextKey.MenuTitle]: '눈 오는 날의 단맛',
  [TextKey.Menu1Name]: '첫눈 우유빙수',
  [TextKey.Menu1Desc]: '얼린 우유를 눈송이처럼 갈아 연유와 볶은 콩가루를 올렸어요.',
  [TextKey.Menu2Name]: '딸기 소복 케이크',
  [TextKey.Menu2Desc]: '설향 딸기와 가벼운 생크림을 눈 쌓이듯 겹겹이.',
  [TextKey.Menu3Name]: '호지차 눈꽃 라떼',
  [TextKey.Menu3Desc]: '구운 녹차 향 위로 우유 거품 눈꽃을 그려 드려요.',
  [TextKey.VisitEyebrow]: '영업 안내',
  [TextKey.VisitTitle]: '첫눈 예보가 뜨면\n문을 엽니다',
  [TextKey.VisitBody]: '기상청 첫눈 예보가 나오는 날 아침, 이 페이지와 인스타그램으로 알려 드려요.',
  [TextKey.VisitChance]: '이번 주 눈 소식 확률',
  [TextKey.VisitAddress]: '서울 어딘가, 골목 끝 하얀 문',
  [TextKey.VisitHours]: '첫눈 오는 날 11:00 – 눈이 그칠 때까지',
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
  [TextKey.HeroEyebrow]: 'Winter dessert house',
  [TextKey.HeroTitle]: 'FIRST SNOW',
  [TextKey.HeroLead]: 'Sobok is a tiny dessert shop that opens only on the day of the first snow.',
  [TextKey.HeroHint]: 'Tap the snowflake',
  [TextKey.HeroSerial]: 'Today’s flake',
  [TextKey.HeroUnique]: 'No two snowflakes fall twice',
  [TextKey.WindowEyebrow]: 'Frosted window',
  [TextKey.WindowTitle]: 'Curious what’s inside?\nWipe the window',
  [TextKey.WindowHint]: 'Drag to clear the frost',
  [TextKey.WindowSign]: 'OPEN',
  [TextKey.StoryEyebrow]: 'How a snowflake is made',
  [TextKey.StoryStep1Title]: 'Inside a −15°C cloud',
  [TextKey.StoryStep1Body]: 'Water freezes onto a speck of dust and a tiny hexagon is born.',
  [TextKey.StoryStep2Title]: 'It grows six arms',
  [TextKey.StoryStep2Body]: 'Every shift in temperature and humidity on the way down sprouts a new branch.',
  [TextKey.StoryStep3Title]: 'Then onto your plate',
  [TextKey.StoryStep3Body]: 'Like that day’s snow, every Sobok dessert is made that morning only.',
  [TextKey.MenuEyebrow]: 'Today’s menu',
  [TextKey.MenuTitle]: 'Sweets for a snowy day',
  [TextKey.Menu1Name]: 'First-snow milk bingsu',
  [TextKey.Menu1Desc]: 'Frozen milk shaved like falling snow, condensed milk and roasted soybean powder.',
  [TextKey.Menu2Name]: 'Strawberry sobok cake',
  [TextKey.Menu2Desc]: 'Seolhyang strawberries and airy cream, layered like settling snow.',
  [TextKey.Menu3Name]: 'Hojicha snowflake latte',
  [TextKey.Menu3Desc]: 'Roasted green tea with a milk-foam snowflake drawn on top.',
  [TextKey.VisitEyebrow]: 'Opening days',
  [TextKey.VisitTitle]: 'We open when\nthe first snow is forecast',
  [TextKey.VisitBody]: 'On the morning the weather service forecasts the first snow, we post it here and on Instagram.',
  [TextKey.VisitChance]: 'Chance of snow this week',
  [TextKey.VisitAddress]: 'Somewhere in Seoul, a white door at the end of an alley',
  [TextKey.VisitHours]: 'First-snow day 11:00 – until the snow stops',
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
