import type { MapCityName } from "./future-projects-map";

export type CityPhoto = Readonly<{
  src: string;
  alt: string;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl: string;
}>;

/** Free photographs selected from Wikimedia Commons; attribution is shown in the tooltip. */
export const CITY_PHOTOS: Record<MapCityName, CityPhoto> = {
  Москва: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg/960px-Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Москва",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Saint_Basil%27s_Cathedral_and_the_Red_Square.jpg",
    author: "U.S. Department of State",
    license: "Public domain",
    licenseUrl: "",
  },
  "Санкт-Петербург": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Peter_%26_Paul_fortress_in_SPB_03.jpg/960px-Peter_%26_Paul_fortress_in_SPB_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Санкт-Петербург",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Peter_%26_Paul_fortress_in_SPB_03.jpg",
    author: "Florstein ( Telegram: WikiPhoto.Space )",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Тверь: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%B0_%D0%A2%D0%B2%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.jpg/960px-%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%B0_%D0%A2%D0%B2%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Тверь",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%B0_%D0%A2%D0%B2%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.jpg",
    author: "Ветер Тверских Крыш",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  "Великий Новгород": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Veliky_Novgorod_montage_%282015%29.png/960px-Veliky_Novgorod_montage_%282015%29.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Великий Новгород",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Veliky_Novgorod_montage_(2015).png",
    author: "Insider , Dio-fine-art , Нелли , Belliy , Konstantin hramov",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Смоленск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Assumption_Cathedral_in_Smolensk.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Смоленск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Assumption_Cathedral_in_Smolensk.jpg",
    author: "Fisss at English Wikipedia",
    license: "Public domain",
    licenseUrl: "",
  },
  Брянск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D0%BE%D1%80%D0%B0_%28%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B9%29_-_1.jpg/960px-%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D0%BE%D1%80%D0%B0_%28%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B9%29_-_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Брянск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D0%BE%D1%80%D0%B0_(%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B9)_-_1.jpg",
    author: "Надежда Алистратова",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Воронеж: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D1%86%D0%B5%D0%BD%D1%82%D1%80_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_%D1%81_%D0%93%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D0%B8_%D0%A7%D0%B8%D0%B6%D0%BE%D0%B2%D0%B0.jpg/960px-%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D1%86%D0%B5%D0%BD%D1%82%D1%80_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_%D1%81_%D0%93%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D0%B8_%D0%A7%D0%B8%D0%B6%D0%BE%D0%B2%D0%B0.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Воронеж",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D1%86%D0%B5%D0%BD%D1%82%D1%80_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_%D1%81_%D0%93%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D0%B8_%D0%A7%D0%B8%D0%B6%D0%BE%D0%B2%D0%B0.jpg",
    author: "Insider",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  "Ростов-на-Дону": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/View_Rostov.jpg/960px-View_Rostov.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Ростов-на-Дону",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:View_Rostov.jpg",
    author: "Вадим Анохин",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Краснодар: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/05/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Краснодар",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80.png",
    author: "Дагиров Умар",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Сочи: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/%D0%A1%D0%BE%D1%87%D0%B8-%D0%BA%D0%BE%D0%BB%D0%BB%D0%B0%D0%B61.jpg/960px-%D0%A1%D0%BE%D1%87%D0%B8-%D0%BA%D0%BE%D0%BB%D0%BB%D0%B0%D0%B61.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Сочи",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%BE%D1%87%D0%B8-%D0%BA%D0%BE%D0%BB%D0%BB%D0%B0%D0%B61.jpg",
    author: "Георгий Долгопский",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Волгоград: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Volgograd_Montage_2016.png/960px-Volgograd_Montage_2016.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Волгоград",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Volgograd_Montage_2016.png",
    author: "AlexTref871 , A.Savin , FontCity , Администрация Волгоградской области",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Саратов: {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/90/%D0%9A%D1%80%D1%8B%D1%82%D1%8B%D0%B9_%D1%80%D1%8B%D0%BD%D0%BE%D0%BA._%D0%A1%D0%B0%D1%80%D0%B0%D1%82%D0%BE%D0%B2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Саратов",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D1%8B%D1%82%D1%8B%D0%B9_%D1%80%D1%8B%D0%BD%D0%BE%D0%BA._%D0%A1%D0%B0%D1%80%D0%B0%D1%82%D0%BE%D0%B2.jpg",
    author: "Фото с сайта Panoramio.com автор Prisoner_of_today",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Самара: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Samara_-_Port_%282008-07-13%29.jpg/960px-Samara_-_Port_%282008-07-13%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Самара",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Samara_-_Port_(2008-07-13).jpg",
    author: "Vlad Volkov",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  Казань: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/KAZ_Collage_2015.png/960px-KAZ_Collage_2015.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Казань",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:KAZ_Collage_2015.png",
    author:
      "A.Savin , Ilya Tsvetkov , Денис Петьовка , NoPlayerUfa , TY-214 , AlexTref871",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  "Нижний Новгород": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Nizhny_Novgorod_2025-04-29_Minin_and_Pozharsky_square_01.jpg/960px-Nizhny_Novgorod_2025-04-29_Minin_and_Pozharsky_square_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Нижний Новгород",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Nizhny_Novgorod_2025-04-29_Minin_and_Pozharsky_square_01.jpg",
    author: "AlexTref871",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Екатеринбург: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Views_of_Yekaterinburg_from_Vysotsky_viewpoint_-_12.jpg/960px-Views_of_Yekaterinburg_from_Vysotsky_viewpoint_-_12.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Екатеринбург",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Views_of_Yekaterinburg_from_Vysotsky_viewpoint_-_12.jpg",
    author: "Vyacheslav Bukharov",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Пермь: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Perm_Russia.jpg/960px-Perm_Russia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Пермь",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Perm_Russia.jpg",
    author: "Latitude",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
  },
  Челябинск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/%D0%9A%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0.jpg/960px-%D0%9A%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Челябинск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0.jpg",
    author: "Bastiat74",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Тюмень: {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/%D0%9A%D1%80%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B7%D0%B4%D0%B2%D0%B8%D0%B6%D0%B5%D0%BD%D1%81%D0%BA%D0%B0%D1%8F_%D1%86%D0%B5%D1%80%D0%BA%D0%BE%D0%B2%D1%8C_%28%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C%29-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Тюмень",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%BE%D0%B7%D0%B4%D0%B2%D0%B8%D0%B6%D0%B5%D0%BD%D1%81%D0%BA%D0%B0%D1%8F_%D1%86%D0%B5%D1%80%D0%BA%D0%BE%D0%B2%D1%8C_(%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C)-2.jpg",
    author: "Igor Nikolajeviĉ Pivovarov",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Уфа: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/%D3%A8%D0%A4%D3%A8-2015-%28v2%29.jpg/960px-%D3%A8%D0%A4%D3%A8-2015-%28v2%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Уфа",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D3%A8%D0%A4%D3%A8-2015-(v2).jpg",
    author: "Rg 102 , Qweasdqwe , Тара-Амингу , Важнов Алексей Геннадьевич",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
  },
  Оренбург: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/%D0%92%D0%B8%D0%B4_%D1%81_%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8_%D0%BD%D0%B0_%D0%A3%D0%BB_%D0%A7%D0%BA%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0_%28263014995%29_%28cropped%29.jpeg/960px-%D0%92%D0%B8%D0%B4_%D1%81_%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8_%D0%BD%D0%B0_%D0%A3%D0%BB_%D0%A7%D0%BA%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0_%28263014995%29_%28cropped%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Оренбург",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B8%D0%B4_%D1%81_%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8_%D0%BD%D0%B0_%D0%A3%D0%BB_%D0%A7%D0%BA%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0_(263014995)_(cropped).jpeg",
    author: "Ramil",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  },
  Астрахань: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Panarama_astrakhan_2009.jpg/960px-Panarama_astrakhan_2009.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Астрахань",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Panarama_astrakhan_2009.jpg",
    author: "Madyudya Denis",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Пенза: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Penza_from_Ferris_wheel.JPG/960px-Penza_from_Ferris_wheel.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Пенза",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Penza_from_Ferris_wheel.JPG",
    author: "Владимир Шеляпин",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Саранск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Saransk.jpg/960px-Saransk.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Саранск",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Saransk.jpg",
    author: "Hannerdy",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Чебоксары: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheboksary._View_of_downtown.jpg/960px-Cheboksary._View_of_downtown.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Чебоксары",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cheboksary._View_of_downtown.jpg",
    author: "Bestalex",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Владимир: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%2C_%D0%B2%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80.JPG/960px-%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%2C_%D0%B2%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Владимир",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80,_%D0%B2%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80.JPG",
    author: "Vladimir-city",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Ярославль: {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Yarolslav_colage.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Ярославль",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Yarolslav_colage.png",
    author:
      "User:Veinarde , User:Gnesener1900 , User:PetarM , User:Monedula , User:Jochims , User:Alexxx1979 , User:Nastyusha , User:Night Rain 5",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
  },
  Тула: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Tula_asv2019-09_img04_Kremlin_aerial_view.jpg/960px-Tula_asv2019-09_img04_Kremlin_aerial_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Тула",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tula_asv2019-09_img04_Kremlin_aerial_view.jpg",
    author: "A.Savin",
    license: "FAL",
    licenseUrl: "http://artlibre.org/licence/lal/en",
  },
  Калуга: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Kaluga_2012_MainSquare_03_1TM.jpg/960px-Kaluga_2012_MainSquare_03_1TM.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Калуга",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kaluga_2012_MainSquare_03_1TM.jpg",
    author: "Kaluga.2012",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Рязань: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/%D0%A4%D0%B5%D1%81%D1%82%D0%B8%D0%B2%D0%B0%D0%BB%D1%8C_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%85%D0%BE%D0%BF%D0%BB%D0%B0%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D0%B8.jpg/960px-%D0%A4%D0%B5%D1%81%D1%82%D0%B8%D0%B2%D0%B0%D0%BB%D1%8C_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%85%D0%BE%D0%BF%D0%BB%D0%B0%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D0%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Рязань",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A4%D0%B5%D1%81%D1%82%D0%B8%D0%B2%D0%B0%D0%BB%D1%8C_%D0%B2%D0%BE%D0%B7%D0%B4%D1%83%D1%85%D0%BE%D0%BF%D0%BB%D0%B0%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B2_%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D0%B8.jpg",
    author: "Ted.ns",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Тольяти: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Komsomolsky_district%2C_Tolyatti%2C_Russia.JPG/960px-Komsomolsky_district%2C_Tolyatti%2C_Russia.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Тольятти",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Komsomolsky_district,_Tolyatti,_Russia.JPG",
    author: "ShinePhantom",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Ульяновск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_city_of_Ulyanovsk%2C_Russia.jpg/960px-The_city_of_Ulyanovsk%2C_Russia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Ульяновск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_city_of_Ulyanovsk,_Russia.jpg",
    author: "The Krasnoyarsk National and Cultural Autonomy of the Chuvash People",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  },
  Новороссийск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Cruiser_MikhailKutuzov1.JPG/960px-Cruiser_MikhailKutuzov1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Новороссийск",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cruiser_MikhailKutuzov1.JPG",
    author: "Николай Путин",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Майкоп: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/%D0%92%D0%BE%D0%BA%D0%B7%D0%B0%D0%BB_%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%D0%B0.JPG/960px-%D0%92%D0%BE%D0%BA%D0%B7%D0%B0%D0%BB_%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%D0%B0.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Майкоп",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%92%D0%BE%D0%BA%D0%B7%D0%B0%D0%BB_%D0%9C%D0%B0%D0%B9%D0%BA%D0%BE%D0%BF%D0%B0.JPG",
    author: "Знанибус at ru.wikipedia",
    license: "Public domain",
    licenseUrl: "",
  },
  Ставрополь: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/%D0%A6%D0%B5%D0%BD%D1%82%D1%80_%D0%A1%D1%82%D0%B0%D0%B2%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D1%8F.jpg/960px-%D0%A6%D0%B5%D0%BD%D1%82%D1%80_%D0%A1%D1%82%D0%B0%D0%B2%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D1%8F.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Ставрополь",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A6%D0%B5%D0%BD%D1%82%D1%80_%D0%A1%D1%82%D0%B0%D0%B2%D1%80%D0%BE%D0%BF%D0%BE%D0%BB%D1%8F.jpg",
    author: "Каракорум",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Белгород: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4_%D1%81_%D0%B0%D1%8D%D1%80%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%B0_5_%D0%B0%D0%B2%D0%B3%D1%83%D1%81%D1%82%D0%B0_2014_10.jpg/960px-%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4_%D1%81_%D0%B0%D1%8D%D1%80%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%B0_5_%D0%B0%D0%B2%D0%B3%D1%83%D1%81%D1%82%D0%B0_2014_10.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Белгород",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4_%D1%81_%D0%B0%D1%8D%D1%80%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%B0_5_%D0%B0%D0%B2%D0%B3%D1%83%D1%81%D1%82%D0%B0_2014_10.jpg",
    author: "Дмитрий Романенко (Dmitry Romanenko)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Курск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/%D0%97%D0%BD%D0%B0%D0%BC%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D0%A1%D0%BE%D0%B1%D0%BE%D1%80_%D0%9A%D1%83%D1%80%D1%81%D0%BA_%28cropped%29.jpg/960px-%D0%97%D0%BD%D0%B0%D0%BC%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D0%A1%D0%BE%D0%B1%D0%BE%D1%80_%D0%9A%D1%83%D1%80%D1%81%D0%BA_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Курск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%97%D0%BD%D0%B0%D0%BC%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9_%D0%A1%D0%BE%D0%B1%D0%BE%D1%80_%D0%9A%D1%83%D1%80%D1%81%D0%BA_(cropped).jpg",
    author: "Newinho",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Орел: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Epiphany_Cathedral_%28even_without_Ivan_the_Terrible%29_%2829711780983%29.jpg/960px-Epiphany_Cathedral_%28even_without_Ivan_the_Terrible%29_%2829711780983%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Орел",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Epiphany_Cathedral_(even_without_Ivan_the_Terrible)_(29711780983).jpg",
    author: "Victor from Shchelkovo, Russia",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  Липецк: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/%D0%9B%D0%B8%D0%BF%D0%B5%D1%86%D0%BA_2016.jpg/960px-%D0%9B%D0%B8%D0%BF%D0%B5%D1%86%D0%BA_2016.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Липецк",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9B%D0%B8%D0%BF%D0%B5%D1%86%D0%BA_2016.jpg",
    author:
      "Усерд 1. Усерд 2. Шалин [Public domain], с Викисклада 3. Andre ustinoff [CC BY-SA 4.0 ( https://creativecommons.org/licenses/by-sa/4.0 )], с Викисклада 4. Stkorv [CC BY-SA 4.0 ( https://creativecommons.org/licenses/by-sa/4.0 )], с Викисклада 5. Шалин [GFDL ( http://www.gnu.org/copyleft/fdl.html ) или CC BY-SA 3.0 ( https://creativecommons.org/licenses/by-sa/3.0 )], с Викисклада 6. Усерд",
    license: "Public domain",
    licenseUrl: "",
  },
  Тамбов: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Tambov_TransgfigurationCathedral_101_0477.jpg/960px-Tambov_TransgfigurationCathedral_101_0477.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Тамбов",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tambov_TransgfigurationCathedral_101_0477.jpg",
    author: "Ludvig14",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  Вологда: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sophia_panorama_2.jpg/960px-Sophia_panorama_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Вологда",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sophia_panorama_2.jpg",
    author: "Happykg",
    license: "Public domain",
    licenseUrl: "",
  },
  Торжок: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sergei_Prokudin-Gorskii%2C_Cathedral_of_the_Transfigured_Saviour_and_the_Church_of_the_Entry_into_Jerusalem%2C_Torzhok%2C_Russian_Empire%2C_1910.jpg/960px-Sergei_Prokudin-Gorskii%2C_Cathedral_of_the_Transfigured_Saviour_and_the_Church_of_the_Entry_into_Jerusalem%2C_Torzhok%2C_Russian_Empire%2C_1910.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Торжок",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sergei_Prokudin-Gorskii,_Cathedral_of_the_Transfigured_Saviour_and_the_Church_of_the_Entry_into_Jerusalem,_Torzhok,_Russian_Empire,_1910.jpg",
    author: "Sergei Prokudin-Gorskii",
    license: "Public domain",
    licenseUrl: "",
  },
  "Орехово-Зуево": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/CentralBulv_OZ.jpg/960px-CentralBulv_OZ.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Орехово-Зуево",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:CentralBulv_OZ.jpg",
    author: "AlexeyWerner",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Муром: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Murom_aerial_view.jpg/960px-Murom_aerial_view.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Муром",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Murom_aerial_view.jpg",
    author: "Cyrios",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Арзамас: {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Arzamas_Montage.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    alt: "Панорама города Арзамас",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Arzamas_Montage.jpg",
    author: "Alexxx1979, Arzamas52, Иван Манилов, Тулип, Arzy",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  "Йошкар-Ола": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9E%D0%B1%D0%BE%D0%BB%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D0%9D%D0%BE%D0%B3%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%B0.jpg/960px-%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9E%D0%B1%D0%BE%D0%BB%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D0%9D%D0%BE%D0%B3%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%B0.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Йошкар-Ола",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%9E%D0%B1%D0%BE%D0%BB%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D0%9D%D0%BE%D0%B3%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%B0.jpg",
    author: "Petr Vasiliev",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  "Набережные Челны": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Naberezhnye_Tchelny_1.JPG/960px-Naberezhnye_Tchelny_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Набережные Челны",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Naberezhnye_Tchelny_1.JPG",
    author: "Brücke-Osteuropa",
    license: "Public domain",
    licenseUrl: "",
  },
  Бугульма: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Memorial_BOB_Bugulma_01.jpg/960px-Memorial_BOB_Bugulma_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Бугульма",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Memorial_BOB_Bugulma_01.jpg",
    author: "SergeVS",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  Магнитогорск: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Magnitogorsk_-_%D0%9F%D1%80%D0%B0%D0%B2%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD.jpg/960px-Magnitogorsk_-_%D0%9F%D1%80%D0%B0%D0%B2%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    alt: "Панорама города Магнитогорск",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Magnitogorsk_-_%D0%9F%D1%80%D0%B0%D0%B2%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD.jpg",
    author: "Pesotsky",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
  },
};
