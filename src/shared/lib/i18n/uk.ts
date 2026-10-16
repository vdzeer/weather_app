export const uk = {
  locale: 'uk',

  now: 'Зараз',
  today: 'Сьогодні',
  feelsLike: (t: string) => `Відчувається як ${t}`,
  highLow: (high: string, low: string) => `Макс. ${high}, мін. ${low}`,
  next24h: 'Наступні 24 години',
  tenDays: 'Прогноз на 10 днів',
  details: 'Зараз надворі',
  humidity: 'Вологість',
  wind: 'Вітер',
  gusts: (v: string) => `Пориви до ${v}`,
  uvIndex: 'УФ-індекс',
  pressure: 'Тиск',
  sunrise: 'Схід сонця',
  sunset: 'Захід сонця',
  precipitation: 'Опади',
  precipitationToday: 'за сьогодні',
  visibility: 'Видимість',
  updatedAt: (time: string) => `Оновлено о ${time}`,
  offline: (time: string) => `Немає інтернету. Прогноз станом на ${time}.`,
  dataSource: 'Дані про погоду: Open-Meteo.com (CC BY 4.0)',
  myLocation: 'Моє місце',

  loadErrorTitle: 'Не вдалося завантажити прогноз',
  loadErrorBody: 'Перевірте зʼєднання з інтернетом і спробуйте ще раз.',
  loadingForecast: 'Завантажуємо прогноз…',
  retry: 'Повторити',

  welcomeTitle: 'Погода там, де ви',
  welcomeBody:
    'Дозвольте доступ до геолокації, і прогноз для вашого місця буде на першому екрані. Або знайдіть місто вручну.',
  allowLocation: 'Дозволити геолокацію',
  findCity: 'Знайти місто',
  locationDeniedTitle: 'Немає доступу до геолокації',
  locationDeniedBody:
    'Щоб бачити погоду для свого місця, увімкніть геолокацію в налаштуваннях телефону. Або додайте місто вручну.',
  locating: 'Визначаємо ваше місце…',
  locationFailedTitle: 'Не вдалося визначити місце',
  locationFailedBody:
    'Перевірте, чи увімкнена геолокація на телефоні, і спробуйте ще раз. Або знайдіть місто вручну.',
  openSettings: 'Відкрити налаштування',

  back: 'Назад',
  cities: 'Міста',
  searchPlaceholder: 'Знайти місто',
  searchEmpty: (q: string) => `Нічого не знайдено за запитом «${q}».`,
  searchError: 'Пошук недоступний. Перевірте інтернет.',
  add: 'Додати',
  cancel: 'Скасувати',
  edit: 'Змінити',
  done: 'Готово',
  removeCity: (name: string) => `Видалити: ${name}`,
  noSavedCities:
    'Тут зʼявляться міста, за якими ви стежите. Знайдіть місто через пошук угорі.',
  alreadySaved: 'Уже в списку',

  settings: 'Налаштування',
  units: 'Одиниці',
  temperature: 'Температура',
  windSpeed: 'Вітер',
  pressureUnit: 'Тиск',
  notifications: 'Сповіщення',
  morningForecast: 'Ранковий прогноз',
  morningForecastHint: 'Щодня: температура, опади й вітер на день.',
  morningTime: 'Час',
  rainAlerts: 'Попередження про опади',
  rainAlertsHint:
    'Коли протягом двох годин почнеться дощ чи сніг. Перевірка працює у фоні, тому може спізнюватися.',
  notificationsDenied:
    'Сповіщення вимкнені для цього застосунку. Увімкніть їх у налаштуваннях телефону.',
  notificationsFor: (name: string) => `Прогноз для: ${name}`,
  about: 'Про застосунок',
  version: 'Версія',
  openMeteo: 'Джерело даних',

  goToCity: (name: string) => `Відкрити: ${name}`,
  page: (index: number, total: number) => `Місто ${index} з ${total}`,
  hourA11y: (time: string, temp: string, condition: string, rain: string) =>
    `${time}: ${temp}, ${condition}${
      rain ? `, імовірність опадів ${rain}` : ''
    }`,
  dayA11y: (
    day: string,
    low: string,
    high: string,
    condition: string,
    rain: string,
  ) =>
    `${day}: від ${low} до ${high}, ${condition}${
      rain ? `, імовірність опадів ${rain}` : ''
    }`,

  conditions: {
    clear: 'Ясно',
    mainlyClear: 'Переважно ясно',
    partlyCloudy: 'Мінлива хмарність',
    overcast: 'Хмарно',
    fog: 'Туман',
    rimeFog: 'Туман із памороззю',
    drizzle: 'Мряка',
    freezingDrizzle: 'Крижана мряка',
    lightRain: 'Невеликий дощ',
    rain: 'Дощ',
    heavyRain: 'Сильний дощ',
    freezingRain: 'Крижаний дощ',
    lightSnow: 'Невеликий сніг',
    snow: 'Сніг',
    heavySnow: 'Сильний сніг',
    snowGrains: 'Снігова крупа',
    lightShowers: 'Короткочасний дощ',
    showers: 'Зливовий дощ',
    heavyShowers: 'Злива',
    snowShowers: 'Снігопад',
    heavySnowShowers: 'Сильний снігопад',
    thunderstorm: 'Гроза',
    thunderstormHail: 'Гроза з градом',
  },
  uv: {
    low: 'низький',
    moderate: 'помірний',
    high: 'високий',
    veryHigh: 'дуже високий',
    extreme: 'екстремальний',
  },
  weekdaysShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  // Full words: the wind note sits under the 10-day list, where «Пн» is Monday.
  compass: [
    'північний',
    'північно-східний',
    'східний',
    'південно-східний',
    'південний',
    'південно-західний',
    'західний',
    'північно-західний',
  ],
  unitLabels: {
    celsius: '°C',
    fahrenheit: '°F',
    ms: 'м/с',
    kmh: 'км/год',
    mph: 'миль/год',
    mmHg: 'мм рт. ст.',
    hPa: 'гПа',
    mm: 'мм',
    km: 'км',
  },

  notif: {
    morningTitle: (place: string, low: string, high: string) =>
      `${place}: від ${low} до ${high}`,
    dry: 'Без опадів.',
    rainFrom: (time: string, chance: number) =>
      `Дощ імовірний з ${time} (${chance}%).`,
    snowFrom: (time: string, chance: number) =>
      `Сніг імовірний з ${time} (${chance}%).`,
    strongWind: (v: string) => `Вітер до ${v}.`,
    rainSoonTitle: 'Скоро дощ',
    snowSoonTitle: 'Скоро сніг',
    soonBody: (place: string, time: string) =>
      `${place}: опади почнуться близько ${time}.`,
  },
};

export type Strings = typeof uk;
