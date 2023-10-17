import tyres_mini from '../../img/reklama/tyres-mini.png';
import tyres from '../../img/reklama/tyres.jpg';
import compressor_mini from '../../img/reklama/compressor-mini.png';
import compressor from '../../img/reklama/compressor.png';
import newReklama from '../../img/reklama/null-baner.png';
import doc_compressor from '../../img/reklama/compressor-file.docx';
import weldex from '../../img/reklama/weldex.png';

const data = [
  {
    _id: 1,
    title: "Посетите главную выставку сварочной отрасли России – Weldex 2022!",
    description: "11-14 октября 2022 в Москве, Крокус Экспо состоится 21-ая Международная выставка сварочных материалов, оборудования и технологий – Weldex.<br/><br/>Более 100 производителей и поставщиков представят свои лучшие решения в следующих разделах:<br/><br/><li>Оборудование для сварки</li><br/><li>Материалы для сварочных работ</li><br/><li>Оборудование для резки металла</li><br/><li>Инструменты и приспособления для сварочных работ</li><br/><li>Оборудование для контроля качества сварных соединений</li><br/><li>Промышленные роботы при проведении сварочных работ</li><br/><li>и др. </li><br/><br/>Ассоциация выступает отраслевым информационным партнером выставки. Участники ассоциации могут бесплатно посетить выставку по промокоду «<b>amp</b>». Зарегистрируйтесь по <a href='https://weldex.ru/Rus/get-eticket?utm_source=amp&utm_medium=referral&utm_campaign=eticket&promo=amp' target='_blank' style='color: blue'>ссылке</a>",
    photo_url: weldex,
    photo_url_big: weldex,
    file_url: "",
    url: "https://weldex.ru/Ru",
    top: true,
    topPlace: 3,
    side: true,
    sidePlace: 1,
    toCard: true,
    card_text: "Участники ассоциации могут бесплатно посетить выставку по промокоду",
    cardPlace: 5,
    enabled: false,
  }, {
    _id: 2,
    title: "Компрессоры XINLEI",
    description: "Компрессоры используются для получения сжатого воздуха для нужд предприятий во многих отраслях промышленности (лёгкая, тяжёлая, пищевая, нефтеперерабатывающая и прочие). Не требует специального фундамента. Установка предназначена для круглосуточной работы без перерывов и обслуживания. Фильтр элементы расположены в легкодоступных местах что делает возможным проведение ТО без применения спец оборудования и высоко квалифицированного персонала. Компрессоры выгодно отличаются низкой стоимостью обслуживания и расходных материалов.<br/><br/><a href='doc_compressor' target='_blank' style='color: blue'><b>Файл</b></a>",
    photo_url: compressor_mini,
    photo_url_big: compressor,
    file_url: doc_compressor,
    url: "https://amp.copartner.ru/plant/details/61fa842bbcdc6f807e6d2267",
    top: false,
    topPlace: 4,
    side: true,
    sidePlace: 3,
    toCard: false,
    card_text: "",
    cardPlace: 6,
    enabled: true,

  }, {
    _id: 3,
    title: "Шины для погрузчиков и спецтехники. TN1 — Tyres Number One!",
    description: "<b>Москва:</b> <br/>ООО «ТАЦИТ-М»<br/>109383, г. Москва, ул. Шоссейная, д.90 стр. 24 (Офис / Склад)<br/> тел. +7 (495) 353-54-11, +7 (916) 182-54-44, +7(985)802-03-21, +7 (916) 182-43-33 <br/>E-mail: msk@tn1.ru, msk.tacit@yandex.ru<br/><br/><b>Санкт-Петербург:</b><br/>ООО «ТАЦИТ» <br/>192289, Санкт-Петербург, ул. Софийская, д. 101, лит. А (Офис / Склад) <br/>тел. +7 (812) 331-31-97, +7 (812) 327-01-25, +7 (952) 397-75-65, +7 (953) 375-03-04 <br/>E-mail: spbtn1@mail.ru<br/><br/><b>Ростов-на-Дону:</b> <br/>ООО «СТРОЙКОМПЛЕКТ-КАВКАЗ» <br/>проспект Стачки, д.249 (Офис / Склад) <br/>тел. +7 (928) 296-32-70, +7 (928) 229-75-90, +7 (928) 229-76-30, +7 (863) 291-53-40 <br/>E-mail: alex@tn1.ru",
    photo_url: tyres_mini,
    photo_url_big: tyres,
    file_url: "",
    url: "https://tn1.ru/",
    top: true,
    topPlace: 3,
    side: false,
    sidePlace: 4,
    toCard: false,
    card_text: "",
    cardPlace: 5,
    enabled: false,

  }, {
    _id: 0,
    title: "Здесь может быть Ваше предложение нашим партнерам!",
    description: "Для свзязи напишите нам на почту: amp@copartner.ru",
    photo_url: newReklama,
    photo_url_big: newReklama,
    file_url: "",
    url: "/advertising",
    top: false,
    topPlace: 5,
    side: true,
    sidePlace: 5,
    toCard: false,
    card_text: "",
    cardPlace: 4,
    enabled: true,

  }
]

export default data;

// response.data = [
//   {
//     _id: 1, // random
//     title: "Этот жирный заголовок будет стоять по центру",
//     description: "Тут все основное содержание с тегами",
//     photo_url: weldex, // фото на превью
//     photo_url_big: weldex, // большое фото
//     file_url: [], // массив файлов, на них рисуются ссылки
//     url: "https://weldex.ru/Ru" // основная ссылка (скорее внешняя)
//     top: false, // отображать в блоке сверху?
//     side: false, // отображать в блоке слева?
//     toCard: false, // разместить среди карточек?
//     card_text: "", // текст под заголовком у карточки
//     place: 4, // место среди карточек
//   }, {
//     _id: 2,
//     title: "Компрессоры XINLEI",
//     description: "",
//     photo_url: compressor_mini,
//     photo_url_big: compressor,
//     file_url: [doc_compressor],
//     url: "https://amp.copartner.ru/plant/details/61fa842bbcdc6f807e6d2267"
//   }, ...
// ]
