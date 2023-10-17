import {useState, useEffect, useRef} from 'react'
import { useNavigate, Link, useParams} from 'react-router-dom';
import styled from 'styled-components';
import PreviewReklama from './PreviewReklama';
import ReklamaService from '../../services/ReklamaService';
import config from '../../settings/config';

const AdEdit = () => {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [ad, setAd] = useState([]);

  const {id} = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState("11-14 октября 2022 в Москве, Крокус Экспо состоится 21-ая Международная выставка сварочных материалов, оборудования и технологий – Weldex.<br/><br/>Более 100 производителей и поставщиков представят свои лучшие решения в следующих разделах:<br/><br/><li>Оборудование для сварки</li><br/><li>Материалы для сварочных работ</li><br/><li>Оборудование для резки металла</li><br/><li>Инструменты и приспособления для сварочных работ</li><br/><li>Оборудование для контроля качества сварных соединений</li><br/><li>Промышленные роботы при проведении сварочных работ</li><br/><li>и др. </li><br/><br/>Ассоциация выступает отраслевым информационным партнером выставки. Участники ассоциации могут бесплатно посетить выставку по промокоду «amp». Зарегистрируйтесь по <a href='https://weldex.ru/Rus/get-eticket?utm_source=amp&utm_medium=referral&utm_campaign=eticket&promo=amp' target='_blank' style='color: blue'>сылке</a><br/><br/><b>Это пример, удали меня<b>");
  const [url, setUrl] = useState('');
  const [preview_url, setPreview_url] = useState([]);
  const [photo_url, setPhoto_url] = useState({});
  const [file_url, setFile_url] = useState('');

  const [top_place, setTopPlace] = useState('');
  const [side_place, setSidePlace] = useState('');
  const [card_place, setCardPlace] = useState('');
  const [card_text, setCard_text] = useState('');
  const [overlay, setOverlay] = useState('');

  const [deletedFiles, setDeletedFiles] = useState('');


  const top_placeRef = useRef(null);
  const side_placeRef = useRef(null);
  const card_placeRef = useRef(null);
  const card_textRef = useRef(null);
  const overlayRef = useRef(null);

  
  useEffect(() => {
    (async() => {
      try {
        const response = await ReklamaService.getReklamaById(id);
        
        setTitle(response?.data?.title)
        setDescription(response?.data?.description)
        setUrl(response?.data?.url)
        setPreview_url(response?.data?.preview_url)
        setPhoto_url(response?.data?.photo_url)
        setFile_url(response?.data?.file_url)

        setTopPlace(response?.data?.top_place)
        setSidePlace(response?.data?.side_place)
        setCardPlace(response?.data?.card_place)
        setCard_text(response?.data?.card_text)
        setOverlay(response?.data?.overlay)

        // console.log(response)

      } catch (e) {
        console.error(e)
      } finally {
        setReady(true)
      }
    })()
  }, [])

  const handleForm = (e) => {
    e.preventDefault();
  
    const dataForm = e.target;
    console.log(e)
  
    const title = dataForm[0]?.value;
    const description = dataForm[1]?.value;
    const url = dataForm[2]?.value;
    const preview_url = dataForm[3]?.files;
    const photo_url = dataForm[5]?.files;
    const file_url_new = dataForm[7].files;

    const top_place = top_placeRef?.current?.value;
    const side_place = side_placeRef?.current?.value;
    const card_place = card_placeRef?.current?.value;
    const card_text = card_textRef?.current?.value;
    const overlay = overlayRef?.current?.value;
    


    console.log('title >> ', title)//
    console.log('description >> ', description)//
    console.log('preview_url >> ', preview_url)//
    console.log('photo_url >> ', photo_url)//
    console.log('file_url >> ', file_url_new)
    console.log('site >>', url)
    console.log('top_place >> ', top_place)//
    console.log('side_place >> ', side_place)//
    console.log('card_place >> ', card_place)//
    console.log('card_text >> ', card_text)
    console.log('overlay >> ', overlay)//

    console.log('deletedFiles >> ', deletedFiles)

    if (title < 1 || description < 1 || !top_place || !side_place || !card_place || overlay < 1 ) {console.log('rejected'); return};

      
    const formData = new FormData();
  
    formData.append('title', title);
    formData.append('description', description);
    formData.append('url', url);

    formData.append('top_place', top_place);
    formData.append('side_place', side_place);
    formData.append('card_place', card_place);
    formData.append('card_text', card_text);
    formData.append('overlay', overlay);

    Object.values(deletedFiles).forEach(file => {
      formData.append("delete_files", file);
    });
  
    Object.values(preview_url).forEach(photo => {
      formData.append("preview_url", photo);
    });
  
    Object.values(photo_url).forEach(photo => {
      formData.append("photo_url", photo);
    });
  
    Object.values(file_url_new).forEach(file => {
      formData.append("file_url", file);
    });
  
    ReklamaService.updateReklama(id, formData);  
  
    navigate(`/reklama`)

    // window.location.reload()
  
  }
  
  const removePhotoPreview = (e, id) => {
    e.preventDefault();
    console.log(e)
    const fileName = e.target?.parentElement.children[0].currentSrc.split('/').splice(-1, 1)[0];

    setDeletedFiles(state => [...state, fileName]);
    setPreview_url({})
  }

  const removePhotoMain = (e, id) => {
    e.preventDefault();
    // setDeletedMain(id);
    
    const fileName = e.target?.parentElement.children[0].currentSrc.split('/').splice(-1, 1)[0];

    setDeletedFiles(state => [...state, fileName]);
    setPhoto_url({})
  }

  const removeFile = (e, id) => {
    e.preventDefault();
    // setDeletedFile(id);
    const fileName = e.target?.parentElement.children[0].href.split('/').splice(-1, 1)[0];
    console.log(fileName)

    setDeletedFiles(state => [...state, fileName]);
    setFile_url('')
  }

  const handleAddPreview = (e) => {
    let arrayofFiles= [];

    for (var i = 0; i < e.target?.files?.length; i++){
      arrayofFiles.push(e.target?.files[i]);
    }
    
    let images = [];

    arrayofFiles.map((e) => {
      const ImageUrl =  URL.createObjectURL(e);
      
      images.push(ImageUrl)
    })

    setPhoto_url(images)
  }

  const handleAddMain = (e) => {
    let arrayofFiles= [];

    for (var i = 0; i < e.target?.files?.length; i++){
      arrayofFiles.push(e.target?.files[i]);
    }
    
    let images = [];

    arrayofFiles.map((e) => {
      const ImageUrl =  URL.createObjectURL(e);
      
      images.push(ImageUrl)
    })

    setPhoto_url(images)
  }

  const removeFileFromDownloads = (e, indx) => {
    e.preventDefault();
    console.log(e)
    const fileName = e.target?.parentElement.children[0].innerText;
    // console.log(fileName)
    const index = e.target?.id;

    let newPreview = [...file_url];
    let newDeletedFile = [...deletedFiles]

    newPreview.splice(indx,1);
    newDeletedFile.push(fileName);

    setFile_url(newPreview);
    setDeletedFiles(newDeletedFile);
  }

  return (

    <Body>
      {ready && 

            <Form onSubmit={handleForm}>
              <p>Заголовок <b>Пустым быть не может!</b></p>
              <input placeholder='Введите заголовок, основной' value={title} onChange={(e) => setTitle(e.target?.value)}/>

              <div className='href'><a href='https://html5-editor.net/' target='_blank'>Если нужно, ссылка на HTML-редактор</a></div>

              <p>Описание ПОЛНОЕ вместе с тегами</p>
              <textarea placeholder='<b>Введите основной текст</b>' value={description} onChange={e => setDescription(e.target?.value)}/>

              <p>Основной сайт компании (будет помещен в кнопку)</p>
              <input placeholder='Введите сайт' value={url} onChange={(e) => setUrl(e.target?.value)}/>

              <p>Выберете превью фото, небольшого разрешения. <b>Пустым быть не может!</b></p>
              <input type='file' onChange={handleAddPreview}/>    

              <div className='preview'>
              {preview_url?.length !== 0 && <img src={`${config?.UPLOAD_API_URL}/uploads/ad/${preview_url[0]?.filename}`} alt=''/>}
                <button
                    id={id}
                    key={id}
                    onClick={(e) => removePhotoPreview(e, id)}
                  >Очистить
                </button>
              </div>


              <p>Выберете основное фото, разрешение побольше. <b>Пустым быть не может!</b></p>
              <input type='file' onChange={handleAddMain}/> 

              <div className='preview'>
              {photo_url.length !== 0 && <img src={`${config?.UPLOAD_API_URL}/uploads/ad/${photo_url[0]?.filename}`} alt=''/>}
                <button
                    id={id}
                    key={id}
                    onClick={(e) => removePhotoMain(e, id)}
                  >Очистить
                </button>
              </div>


              <p>Выберете до 5 файлов в дополнение. Еще {5 - file_url?.length}</p>
              <input type='file' multiple id='file-input'/>    

             <div className='preview'>
             {file_url && file_url?.map((item, index) => (
              <div>
                <a href={`${config?.UPLOAD_API_URL}uploads/ad/${item?.filename}`}>{item?.filename}</a>
                <button
                  id={index}
                  key={index}
                  onClick={(e) => removeFileFromDownloads(e, index)}
                >
                  Удалить
                </button>
              </div>
             ))}
                <button
                    id={id}
                    key={id}
                    onClick={(e) => removeFile(e, id)}
                  >Очистить
                </button>
              </div>

              <div className='bordered-div'>
                <p>Размещать или нет в <b>верхнем</b> блоке?</p>
                <p>Если 0 - не размещать совсем в этом блоке</p>
                <p>Выберете место в очереди от 1 до 12</p> 
                <p><b>Пустым быть не может!</b></p>
                <input type='number' min='0' max='12' value={top_place} onChange={(e) => setTopPlace(e.target?.value)} ref={top_placeRef}/>
              </div>

              <div className='bordered-div'>
                <p>Размещать или нет в блоке <b>слева</b>?</p>
                <p>Если 0 - не размещать совсем в этом блоке</p>
                <p>Выберете место в очереди от 1 до 12</p>   
                <p><b>Пустым быть не может!</b></p>
                <input type='number' min='0' max='12' value={side_place} onChange={(e) => setSidePlace(e.target?.value)} ref={side_placeRef}/>
              </div>

              <div className='bordered-div'>
                <p>Размещать или нет в <b>карточках</b>?</p>
                <p>Если 0 - не размещать совсем в этом блоке</p>
                <p>Выберете место в очереди от 1 до 12</p>
                <p><b>Пустым быть не может!</b></p>
                <input type='number' min='0' max='12' value={card_place} onChange={(e) => setCardPlace(e.target?.value)} ref={card_placeRef}/>
                <p>Текст который будет написан на карточке под Заголовком</p>
                <input placeholder='Введите текст карточки' value={card_text} onChange={(e) => setCard_text(e.target?.value)} ref={card_textRef}/>
              </div>

              <p>Оверлей. <b>Пустым быть не может!</b></p>
              <input placeholder='Введите текст карточки' value={overlay} onChange={(e) => setOverlay(e.target?.value)} ref={overlayRef}/>

              <button type='submite'>Сохранить</button>
            </Form>


      }
      <Help>
        <PreviewReklama description={description}/>
      </Help>

    </Body>
  )
};

export default AdEdit;

const Body = styled.div`
  display: flex;
  margin: 40px;
  padding: 40px 0;
  color: black;
  max-width: 1840px;
  width: 100%;
  margin: 0 auto 100px;
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

  .preview {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    button {
      padding: 5px 10px;
      background: #4B525C;
      color: white;
      border-radius: 5px;
      margin: 0 auto;
      margin-top: 20px;
      font-size: 18px;
      margin-bottom: 20px;
    }
  }

  .preview a {
    font-size: 30px;
    color: blue;
    margin-bottom: 30px;
  }

  .href {
    margin-bottom: 20px;
    color: blue;
    text-decoration: underline;
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