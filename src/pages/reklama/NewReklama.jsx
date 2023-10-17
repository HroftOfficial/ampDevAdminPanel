import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import PreviewReklama from './PreviewReklama';
import ReklamaService from '../../services/ReklamaService';
import data from './reklamaState';

const AddReklama = () => {
  const navigate = useNavigate();

  // const [title, setTitle] = useState('');
  const [description, setDescription] = useState("11-14 октября 2022 в Москве, Крокус Экспо состоится 21-ая Международная выставка сварочных материалов, оборудования и технологий – Weldex.<br/><br/>Более 100 производителей и поставщиков представят свои лучшие решения в следующих разделах:<br/><br/><li>Оборудование для сварки</li><br/><li>Материалы для сварочных работ</li><br/><li>Оборудование для резки металла</li><br/><li>Инструменты и приспособления для сварочных работ</li><br/><li>Оборудование для контроля качества сварных соединений</li><br/><li>Промышленные роботы при проведении сварочных работ</li><br/><li>и др. </li><br/><br/>Ассоциация выступает отраслевым информационным партнером выставки. Участники ассоциации могут бесплатно посетить выставку по промокоду «amp». Зарегистрируйтесь по <a href='https://weldex.ru/Rus/get-eticket?utm_source=amp&utm_medium=referral&utm_campaign=eticket&promo=amp' target='_blank' style='color: blue'>сылке</a><br/><br/><b>Это пример, удали меня<b>");
  // const [url, setUrl] = useState('');
  // const [photo_url, setPhoto_url] = useState({});
  // const [photo_url_big, setPhoto_url_big] = useState({});
  // const [file_url, setFile_url] = useState([]);
  // const [top, setTop] = useState(false);
  // const [side, setSide] = useState(false);
  // const [toCard, setToCard] = useState(false);
  // const [card_text, setCard_text] = useState('');
  // const [place, setPlace] = useState('');

const handleForm = (e) => {
  e.preventDefault();

  const dataForm = e.target;
  // console.log(e)

  const title = dataForm[0]?.value;
  const description = dataForm[1]?.value;
  const url = dataForm[2]?.value;
  const preview_url = dataForm[3]?.files;
  const photo_url = dataForm[4]?.files;
  const file_url = dataForm[5]?.files;

  const top_place = dataForm[6]?.value;
  const side_place = dataForm[7]?.value;
  const card_place = dataForm[8]?.value;
  const card_text = dataForm[9]?.value;
  const overlay = dataForm[10]?.value;

  // console.log(title)
  // console.log(description)
  // console.log(preview_url)
  // console.log(photo_url)
  // console.log(file_url)
  // console.log(url)
  // console.log(top_place)
  // console.log(side_place)
  // console.log(card_place)
  // console.log(card_text)
  // console.log(overlay)


  const formData = new FormData();

  formData.append('title', title);
  formData.append('description', description);
  formData.append('url', url);
  formData.append('top_place', top_place);
  formData.append('side_place', side_place);
  formData.append('card_place', card_place);
  formData.append('card_text', card_text);
  formData.append('overlay', overlay);

  Object.values(preview_url).forEach(photo => {
    formData.append("preview_url", photo);
  });

  Object.values(photo_url).forEach(photo => {
    formData.append("photo_url", photo);
  });

  Object.values(file_url).forEach(file => {
    formData.append("file_url", file);
  });
  (async() => {
    const resp = await ReklamaService.addReklama(formData);  
    // console.log(resp)

    navigate(`/reklama`)
  })()


}


const [cardValue, setCardValue] = useState(false)

  return(
    <Body>

      <Form onSubmit={handleForm}>
        <p>Заголовок <b>Пустым быть не может!</b></p>
        <input placeholder='Введите заголовок, основной'/>

        <div className='href'><a href='https://html5-editor.net/' target='_blank'>Если нужно, ссылка на HTML-редактор</a></div>

        <p>Описание ПОЛНОЕ вместе с тегами</p>
        <textarea placeholder='<b>Введите основной текст</b>' value={description} onChange={e => setDescription(e.target?.value)}/>

        <p>Основной сайт компании (будет помещен в кнопку)</p>
        <input placeholder='https://yandex.ru/maps/'/>

        <p>Выберете превью фото, небольшого разрешения <b>Пустым быть не может!</b></p>
        <input type='file'/>    

        <p>Выберете основное фото, разрешение побольше <b>Пустым быть не может!</b></p>
        <input type='file'/>    

        <p>Выберете до 5 файлов</p>
        <input type='file' multiple id='file-input'/>    
 
        <div className='bordered-div'>
          <p>Размещать или нет в <b>верхнем</b> блоке?</p>
          <p>Если 0 - не размещать совсем в этом блоке</p>
          <p>Выберете место в очереди от 1 до 12 </p> 
          <p><b>Пустым быть не может!</b></p>
          <input type='number' defaultValue='0' min='0' max='12'/>
        </div>

        <div className='bordered-div'>
          <p>Размещать или нет в блоке <b>слева</b>?</p>
          <p>Если 0 - не размещать совсем в этом блоке</p>
          <p>Выберете место в очереди от 1 до 12</p>   
          <p><b>Пустым быть не может!</b></p>
          <input type='number' defaultValue='0' min='0' max='12'/>
        </div>

        <div className='bordered-div'>
          <p>Размещать или нет в <b>карточках</b>?</p>
          <p>Если 0 - не размещать совсем в этом блоке</p>
          <p>Выберете место в очереди от 1 до 12</p>
          <p><b>Пустым быть не может!</b></p>
          <input type='number' defaultValue='0' min='0' max='12'/>
          <p>Текст который будет написан на карточке под Заголовком</p>
          <input placeholder='Введите текст карточки'/>
        </div>

        <p>Оверлей (полупрозрачный фон, и текст на нем)</p>
        <input placeholder='Введите сайт' defaultValue='Спецпредложения для партнеров ассоциации'/>

        <button type='submite'>Сохранить</button>
      </Form>

      <Help>

        <PreviewReklama description={description}/>

      </Help>

    </Body>
  )
}

export default AddReklama

const Body = styled.div`
  display: flex;
  margin: 40px;
  padding: 40px 0;
  color: black;
  max-width: 1840px;
  width: 100%;
  margin: 0 auto;
  box-sizing: content-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: 0 20px;

  .bordered-div {
    display: flex;
    flex-direction: column;
    border: 1px solid #00000030;
    border-radius: 5px;
    padding: 20px;
    margin-top: 20px;
  }

  .href {
    margin-bottom: 20px;
    color: blue;
  }

  input, textarea {
    margin-bottom: 20px;
    border: 1px solid black;
    padding: 10px 15px;
    border-radius: 5px;
    outline: none;
  }

  textarea {
    min-height: 400px;
  }

  input[type='checkbox'] {
    width: 20px; 
    height: 20px;
    margin-left: 10px;
  }

  button[type='submite'] {
    width: 140px;
    height: 50px;
    background: #61b85e;
    color: white;
    border-radius: 5px;
    border: none;
    margin: 0 auto;
    margin-top: 40px;
    font-size: 22px;
  }
`;

const Help = styled.div`
  display: flex;
  flex-direction: column;
`;