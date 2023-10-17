import { useState , useEffect} from 'react';
import styled from "styled-components";
import {  useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled as MIstuled}  from '@mui/material/styles';
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import Modal from './VidiModal';
import User from '../../services/TomsService';  
import docIco from '../../img/upload-document-ico.svg';
import photoIco from '../../img/upload-photo-ico.svg';
import deleteIco from '../../img/delete-ico.svg';
import Orders from '../../services/ZakazService'; // куда отправлять
import UserServicePortal from '../../services/UserServicePortal';
import WorkGroupService from '../../services/WorkGroupService';
import citiesData from './cities';
// console.log('Test page')

const Listbox = MIstuled('ul')(() => ({
  width: '100%',
  margin: 0,
  padding: 0,
  zIndex: 1,
  top: 67,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: 'white',
  overflow: 'auto',
  maxHeight: 200,
  border: '1px solid rgba(0,0,0,.25)',
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: '#00AEAE',
    color: 'white',
    cursor: 'pointer',
  },
  '& li:active': {
    backgroundColor: '#00AEAE',
    color: 'white',
  },
}));  

const warningTitle = {
  max: 'Максимальная длина заголовка 50 символов',
  min: 'Минимальная длина заголовка 2 символа',
  required: 'Заголовок не может быть пустым',
};

const warningDetails = {
  required: 'Заполните описание',
};

const warningKl = {
  required: 'Укажите количество',
};

const warningPhoto = {
  required: "Загрузите минимум 1 фото",
  large: "Фото слишком большие",
  type: "Недопустимый формат фото",
};

const warningFile = {
  required: "Загрузите минимум 1 файл",
  large: "Файлы слишком большие",
  type: "Недопустимый формат файлов",
};

const addZakazSchema = yup.object({
  title: yup.string().required(warningTitle.required).min(2, warningTitle.min).max(50, warningTitle.max),
  details: yup.string().required(warningDetails.required),
  kl: yup.string().required(warningKl.required),
  photo: yup.mixed()
  .test('required', warningPhoto.required, (value) =>{
    return value && value.length
  } )
  .test("fileSize", warningPhoto.large, (value, context) => {
    if (value.length < 1) return true
    return value && value[0] && value[0].size <= 2000000;
  })
  .test("type", warningPhoto.type, function (value) {
    if (value.length < 1) return true
    return value && value[0] && (
      value[0].type === "image/jpeg" || 
      value[0].type === "image/jpg" || 
      value[0].type === "image/png"
    );
  }),
  file: yup.mixed()
  .test('required', warningFile.required, (value) =>{
    return value && value.length
  } )
  .test("fileSize", warningFile.large, (value, context) => {
    if (value.length < 1) return true
    return value && value[0] && value[0].size <= 2000000;
  })
  .test("type", warningFile.type, function (value) {
    if (value.length < 1) return true
    return value && value[0] && (
      value[0].type === "image/jpeg" || 
      value[0].type === "image/jpg" || 
      value[0].type === "image/png"||
      value[0].type === "image/xls" || 
      value[0].type === "image/docx" || 
      value[0].type === "image/doc" || 
      value[0].type === "image/pdf" || 
      value[0].type === "image/xlsx" 
    );
  }),
});

const AddOrder = () => {
  const [ready, setReady] = useState(false);
  const [listVidi, setListVidi] = useState([]);

  const [selected, setSelected] = useState([]);
  const [selectedText, setSelectedText] = useState([]);

  const [arrayFile, setArrayFile] = useState([]);
  const [arrayPhoto, setArrayPhoto] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [workGroup, setWorkGroup] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);

  const [idWorkUser, setIdWorkUser] = useState([]);
  const [nameWorkUser, setNameWorkUser] = useState([]);
  const [access_level, setAccess_level] = useState([0]);

  const [title, setTitle] = useState('');
  const [many, setMany] = useState('');
  const [kl, setKl] = useState('');
  const [kl_text, setKl_text] = useState("партия");
  const [max_width, setMax_width] = useState('');
  const [max_d, setMax_d] = useState('');
  const [cities, setCities] = useState('');
  const [details, setDetails] = useState('');

  const  [previewPhoto, setPreviewPhoto] = useState([]);
  const  [previewFile, setPreviewFile] = useState([]);

  const [newPreview, setNewPreview] = useState(0);

  const [inputText, setInputText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async() => {
      try {
        const vidi = await User.getUsersToms();
        // console.log('Vidi > ', vidi)
        setListVidi(vidi.data)


        const workGroup = await WorkGroupService.fetchWorkGroup()
        // console.log('Work group > ', workGroup)
        setWorkGroup(workGroup?.data)

        const groupUsers = await UserServicePortal.fetchUsers()
        // console.log('GroupUser > ', groupUsers)
        setGroupUsers(groupUsers?.data)        
      } catch (e) {
        console.error('Error > ', e);
      } finally {
        setReady(true);
      }
    })()
  }, [])

  const handleOpenMenu = (e) => {
    e.preventDefault();
    setShowModal(true)
  }

  window.onclick = (e) => {
    const modal = document.getElementById('vidiModal');
    if (e.target == modal) {
       setShowModal(false)
    }
  }

  const handleDelete = (e) => {
    const id = e.target?.parentElement.children[0].id;
    const name = e.target?.parentElement.children[0].innerText;

    const tempSelected = selected.slice()
    const index1 = tempSelected.indexOf(id)
    tempSelected.splice(index1, 1)
    setSelected(tempSelected)

    const tempSelectedText = selectedText.slice()
    const index2 = tempSelectedText.indexOf(name)
    tempSelectedText.splice(index2, 1)
    setSelectedText(tempSelectedText)
  }

  const onSelectPhoto = (e)=>{
    let arrayofFiles= [];
    for (var i = 0; i < e.target.files.length; i++){
      const fileExtention = e.target?.files[i]?.name.split('.')[1]
      // console.log(fileExtention)
      let images = [];

      // if ( 
      // fileExtention == 'png' || 
      // fileExtention == 'jpg' || 
      // fileExtention == 'jpeg'||  
      // fileExtention == 'PNG'|| 
      // fileExtention == 'JPG'|| 
      // fileExtention == 'JPEG') {
        arrayofFiles.push(e.target?.files[i]);
        
        
        arrayofFiles.forEach((item) => {
          const ImageUrl =  URL.createObjectURL(item);
          
          images.push(ImageUrl)
        })
        setPreviewPhoto(images)
        
      // }
    }
    setNeedPhoto(false)
    setArrayPhoto(arrayofFiles)
  }

  const removePhotoFromArray = (e, indx) => {
    e.preventDefault();

    let newPreview = [...previewPhoto];
    let newLength = [...arrayPhoto]

    newPreview.splice(indx, 1);
    newLength.splice(indx, 1);

    setPreviewPhoto(newPreview);
    setArrayPhoto(newLength);
  }

  const onSelectFile = (e)=>{
    let arrayofFiles= [];
    for (var i = 0; i < e.target.files.length; i++){
      const fileExtention = e.target?.files[i]?.name.split('.')[1]
      // console.log(fileExtention)

      // if (fileExtention == 'pdf' || 
      // fileExtention == 'doc' || 
      // fileExtention == 'docx' || 
      // fileExtention == 'xls' || 
      // fileExtention == 'xlsx' || 
      // fileExtention == 'png' || 
      // fileExtention == 'jpg' || 
      // fileExtention == 'jpeg'|| 
      // fileExtention == 'PDF'|| 
      // fileExtention == 'DOC'|| 
      // fileExtention == 'DOCX'|| 
      // fileExtention == 'XLS'|| 
      // fileExtention == 'XLSX'|| 
      // fileExtention == 'PNG'|| 
      // fileExtention == 'JPG'|| 
      // fileExtention == 'JPEG') {
        arrayofFiles.push(e.target?.files[i]);
        
        setPreviewFile(arrayofFiles)
      // }
    }
    setNeedFile(false)
    setArrayFile(arrayofFiles)
  }

  const removeFileFromArray = (e, indx) => {
    e.preventDefault();

    let newPreview = [...previewFile];
    let newLength = [...arrayFile]

    newPreview.splice(indx,1);
    newLength.splice(indx,1);

    setPreviewFile(newPreview);
    setArrayFile(newLength);
  }

  const handleNewPreview = (e) => {
    const name = e.target?.id
    setNewPreview(name)
  }

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options: citiesData,
    getOptionLabel: (option) => option?.value,
  });

  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const filteredData = groupUsers.filter((el) => {
    //if no input the return the original
    if (inputText === '') {
      return el;
    }
    //return the item which contains the user input
    else {
      return el.org.toLowerCase().includes(inputText)
    }
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addZakazSchema),
    defaultValues: {
      title: '',
      details: '',
      kl: '',
      photo: [],
      file: [],
    },
  });

  const onSubmit = async (data, e) => {
    try {
      // console.log('Sended form React Hook Form > ', data);

      const data2 = {many,  kl_text, max_width,  max_d, cities: e.target[6].value, newPreview, selected, access_level};

      if (arrayPhoto?.length < 1) {setNeedPhoto(true); return;}
      if (arrayFile?.length < 1) {setNeedFile(true); return;}
      if (arrayPhoto?.length > 10) {setManyPhoto(true); return;}
      if (arrayFile?.length > 10) {setManyFile(true); return;}
      setNeedPhoto(false)
      setNeedFile(false)
      setManyPhoto(false)
      setManyFile(false)

      const formData = new FormData();

      formData.append('title', data.title)
      formData.append('many', many)
      formData.append('kl', data.kl)
      formData.append('kl_text', kl_text)
      formData.append('max_width', max_width)
      formData.append('max_d', max_d)
      formData.append('cities', e.target[6].value)
      formData.append('details', data.details)
      formData.append('index_photo', newPreview) 
      formData.append('inhere_user', idWorkUser) 
      formData.append('inhere_user_name', nameWorkUser) 
      formData.append('zakaz_access_level', access_level) 

      Object.values(selected).forEach(category => {
        formData.append("work_category", category);
      });

      Object.values(arrayPhoto).forEach(photo => {
        formData.append("photo_url", photo);
      });

      Object.values(arrayFile).forEach(file => {
        formData.append("file_url", file);
      });


      // console.log('Sended from State >> ', data2)
      // console.log('Sended Photo >> ', arrayPhoto)
      // console.log('Sended Files >> ', arrayFile)
      // console.log('Sended inhere_user >> ', idWorkUser)
      // console.log('Sended inhere_user_name >> ', nameWorkUser)

      const order = await Orders.addZakaz(formData);

      // console.log('Response >>> ', order)
  
      navigate('/zakazes')
    } catch (e) {
      console.error('Error > ', e);
    }
  };

  const [needPhoto, setNeedPhoto] = useState(false);
  const [needFile, setNeedFile] = useState(false);
  const [manyPhoto, setManyPhoto] = useState(false);
  const [manyFile, setManyFile] = useState(false);

  return (
    <Body>
      {ready && 
      <div className='context-wrapper '>
        <h2>Добавление заказа</h2>

        <Forma enctype="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
          
          <Controller control={control}
            render={({ field: { onChange, value } }) => (
            <InputWrapper errorState={!!errors.title}>
              {errors.title ? <ErrMessage>  {errors.title.message} </ErrMessage> : <p>Название заказа</p>}
              <input 
                className='input' 
                type="text"
                placeholder='Название заказа' 
                value={value} 
                {...register('title')}/>
            </InputWrapper> )}
            name="title"
            rules={{ required: true }}
          />

          <p>Стоимость</p>
          <input className='input' placeholder='Стоимость' value={many} onChange={(e) => setMany(e.target.value)}/>

          <Controller control={control}
            render={({ field: { onChange, value } }) => (
            <InputWrapper errorState={!!errors.title}>
              {errors.kl ? <ErrMessage>  {errors.kl.message} </ErrMessage> : <p>Количество деталей</p>}
              <input 
                className='input' 
                type="text"
                placeholder='Количество деталей' 
                value={value} 
                {...register('kl')}/>
            </InputWrapper> )}
            name="kl"
            rules={{ required: true }}
          />

          <p>Периодичность</p>
          <select value={kl_text} onChange={(e) => setKl_text(e.target.value)}>
            <option disabled >Периодичность</option>
            <option value="партия">Партия</option>
            <option value="мес/шт">шт/мес</option>
            <option value="год/шт">шт/год</option>
            <option value="шт.">шт.</option>
          </select>

          <p>Max длина (линейный размер)</p>
          <input className='input' placeholder='Max длина (линейный размер)' value={max_width} onChange={(e) => setMax_width(e.target.value)}/>

          <p>Max диаметр</p>
          <input className='input' placeholder='Max диаметр' value={max_d} onChange={(e) => setMax_d(e.target.value)}/>

          <p>Город доставки</p>
          <CitiesDiv >
            <div {...getRootProps()} style = {{display: 'flex', width: '100%', boxSizing: 'content-box'}}>
              {/* <Label {...getInputLabelProps()}>useAutocomplete</Label> */}
              <InputCities {...getInputProps()} placeholder='Город доставки' />
            </div>
            {groupedOptions.length > 0 && getInputProps().value.length >= 3 ? (
              <Listbox {...getListboxProps()} >
                {groupedOptions.map((option, index) => {
                  return (
                  <li {...getOptionProps({ option, index })} key={index}>{option?.value}</li>
                )})
              }
              </Listbox>
            ) : null}
          </CitiesDiv>


          <Controller control={control}
            render={({ field: { onChange, value } }) => (
            <InputWrapper errorState={!!errors.details}>
              {errors.details ? <ErrMessage>  {errors.details.message} </ErrMessage> : <p>Описание заказа</p>}
              <textarea 
                placeholder='Описание заказа' 
                value={value} 
                {...register('details')}/>
            </InputWrapper> )}
            name="details"
            rules={{ required: true }}
          />

          {selectedText?.length > 0 && <div className='toms'>
            <h2>Выбранные виды мехобработки:</h2>
            {selectedText.map((item, index) => (
              <div className='tom'>
                <div id={index}>{item}</div> 
                <div className="close" onClick={handleDelete}>&times;</div>
              </div>
            ))}
          </div>}

          <button className='action-menu' onClick={handleOpenMenu}>Добавить виды обработки</button>

          {/* <div className='upload_warning'><i>Внимание: загрузите как минимум 1 фото и 1 документ</i>  </div> */}
          <div className='upload'>
            <div className='input'>
              <label htmlFor='photo-input'>{arrayPhoto?.length > 0 ? `Выбрано ${arrayPhoto?.length} фото` : `Загрузите до 10 фото заказа. Разрешенные форматы: png, jpg, jpeg.`}
                <img src={photoIco} alt=''/>
              </label>



              {/* <input type='file' multiple id='photo-input' onChange={onSelectPhoto}/> */}

              <Controller
                control={control}
                name="photo"
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <InputWrapper errorState={!!errors.photo}>
                    {errors.photo ? <ErrMessage> {errors.photo.message} </ErrMessage> : null}
                    <input
                      // className="input"
                      id="photo-input"
                      type="file"
                      multiple
                      // value={value}
                      onInput={onSelectPhoto}
                      onChange={onChange}
                      accept="image/jpeg,image/png"
                      {...register("photo")}
                    />
                  </InputWrapper>
                )}
              />



              {/* {needPhoto && <ErrMessage> Загрузите фото </ErrMessage>} */}
              {manyPhoto && <ErrMessage> Много фото, удалите часть </ErrMessage>}
            </div>

            <div className='input'>
              <label htmlFor='file-input'>{arrayFile?.length > 0 ? `Выбрано ${arrayFile?.length} файлов` : `Загрузите до 10 файлов заказа. Разрешенные форматы: pdf, doc, docx, xls, xlsx, png, jpg, jpeg.`}
                <img src={docIco} alt=''/>
              </label>



              {/* <input type='file' multiple id='file-input' onChange={onSelectFile}/> */}


              <Controller
                control={control}
                name="file"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <InputWrapper errorState={!!errors.file}>
                    {errors.file ? <ErrMessage> {errors.file.message} </ErrMessage> : null}
                    <input
                      // className="input"
                      id="file-input"
                      type="file"
                      multiple
                      // value={value}
                      onInput={onSelectFile}
                      onChange={onChange}
                      accept=".pdf,  .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg"
                      {...register("file")}
                    />
                  </InputWrapper>
                )}
              />



              {/* {needFile && <ErrMessage> Загрузите файл </ErrMessage>} */}
              {manyFile && <ErrMessage> Много файлов, удалите часть </ErrMessage>}
            </div>

          </div>

          <div className='preview-wrapper'>

            <div className='text-wrapper'>
              {previewPhoto?.length === 1 && <div className='text'>Эта фотография будет фотографией предпросмотра</div>}
              {previewPhoto?.length > 1 && <div className='text'>Выберете фотографию предпросмотра</div>}
              
              <div className='preview'>
                {previewPhoto?.map((img, index)=> (
                  <div key={index} className='preview-item'>
                    <img src={img} id={index} alt="pic1" className='preview-img' onClick={handleNewPreview} style = {{border: newPreview == index ? 'solid 2px #00AEAE' : 'none'}}/>
                    <button
                      id={index}
                      key={index}
                      onClick={(e) => {removePhotoFromArray(e, index)}}
                      className='delete-btn'
                    >
                      <img src={deleteIco} alt=''/>
                    </button>

                  </div>
                ))}
              </div>
            </div>

            <div className='preview-file'>
              {previewFile.map((file, index)=>(
                <div key={index} className='preview-item-file'>
                  <span>{file?.name}</span>
                  <button
                    id={index}
                    key={index}
                    onClick={(e) => removeFileFromArray(e, index)}
                    className='delete-btn'
                  >
                    <img src={deleteIco} alt=''/>
                  </button>
                </div>
              ))}
            </div>

          </div>


          <Oweners>ЗАКАЗ ТРЕБУЕТ СПЕЦ РАЗРЕШЕНИЕ
            <div className='own-list'>
              {workGroup.map((item) => (
                <div key={item?._id} className='own-list__lable'>
                  <input id={item?._id} type='radio' name='spec' onClick={() => {
                      // console.log(item)
                      setNameWorkUser(item?.name); 
                      setIdWorkUser(item?._id);
                      setAccess_level([item?.access_level])
                    }}
                    defaultChecked={item?.access_level == 0}
                  />
                  <label htmlFor={item?._id}>{item?.name}</label>
                </div>
              ))}
            </div> 
          </Oweners>
        
          <Oweners>Владелец
            <div className="search">
              <TextField
                id="outlined-basic"
                onChange={inputHandler}
                variant="outlined"
                fullWidth
                label="Поиск по организации"
              />
            </div>

            <div className='own-list'>
              {filteredData.map((item) => {
                if (item?.deleted == false && item?.enabled == true) return (
                <div key={item?._id} className='own-list__lable'>
                  <input id={item?._id} type='radio' name='common' onClick={() => {
                      // console.log(item);
                      setNameWorkUser(item.org); 
                      setIdWorkUser(item._id)
                    }}
                  />
                  <label htmlFor={item?._id}>{item?.org}</label>
                </div>)                
              })}
            </div>
          </Oweners>

          <button className='accept-btn' type='submite'>Сохранить</button>
          {/* <button className='accept-btn' type='submite' onClick={handleSubmite}>Сохранить</button> */}
        </Forma>

      </div>}

      <VidiModal id='vidiModal' style={{display: showModal ? 'block' : 'none' }}>
        <Modal 
          data={listVidi}
          selected={selected}
          setSelected={setSelected}
          selectedText={selectedText}
          setSelectedText={setSelectedText}
          setShowModal={setShowModal}
        />
      </VidiModal>
    </Body>
  )
}

export default AddOrder;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrMessage = styled.p`
  color: red;
`;

const Oweners = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-left: 20px;

  .search {
    margin-top: 20px;
  }
  
  .own-list {
    columns: 2;
    margin-top: 20px;

    input {
      margin-top: 10px;
    }

    &__lable {
      margin-top: 10px;
      font-size: 16px;
    }
  }
`;

const Body = styled.section`
  display: flex;
  color: black;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  max-width: 1200px;
  width: 100%;

  .context-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px 66px 72px;
    max-width: 1200px;
    width: 100%;
    box-sizing: content-box;
  }

  h2 {
    font-weight: 500;
    font-size: 24px;
    color: #333333;
  }
`;

const InputCities = styled.input`
  padding: 15px;
  border: 1px solid #BFBFBF;
  border-radius: 5px;
  outline: none;
  width: 100%;
  color: black;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  /* box-sizing: content-box; */
`

const CitiesDiv = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  /* box-sizing: content-box; */
`;

const Forma = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  width: 100%;
  box-sizing: content-box;


  p {
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
  }

  .input {
    padding: 15px;
    border: 1px solid #BFBFBF;
    border-radius: 5px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    /* max-width: 1000px; */
    color: black;
    font-size: 16px;
  }

  select {
    padding: 15px;
    border: 1px solid #BFBFBF;
    border-radius: 5px;
    outline: none;
    width: 100%;
    /* max-width: 1000px; */
    /* box-sizing: content-box; */
    color: black;
    background-color: white;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
  }

  textarea {
    padding: 15px;
    font-size: 18px;
    color: black;
    border: 1px solid #BFBFBF;
    border-radius: 5px;
    width: 100%;
    height: 200px;
    resize: none; 
    outline: none;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    box-sizing: border-box;

  }

  .toms {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;


    h2 {
      display: flex;
      margin: 0;
      align-items: center;
      font-size: 22px;
    }

    .tom {
      display: flex;
      border: 1.5px solid #BFBFBF;
      padding: 10px 20px;
      border-radius: 5px;
      align-items: center;
      font-size: 18px;
      color: black;
      height: 20px; 

      .close {
        color: black;
        float: right;
        font-size: 40px;
        margin-left: 20px;
      }

      .close:hover,
      .close:focus {
        color: #00AEAE;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }

  .action-menu {
    display: flex;
    margin-top: 35px;
    font-size: 20px;
    text-decoration-line: underline;  
    color: #00AEAE;
    border: none;
    background-color: white;
  }

  .upload_warning {
    font-size: 20px;
    margin: 0 auto;
    margin-top: 30px;
    color: #00AEAE;
  }

  .upload {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .input {
      text-align: center;
      height: 175px;
      width: 45%;
      border: 1px solid #BFBFBF;
      border-radius: 5px;
    }

    label {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      /* padding: 0 30%; */
      font-size: 18px;
      color: #BFBFBF;
      cursor: pointer;

      img {
        margin-top: 10px;
      }
    }

    input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  }

  .preview-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
    
    .text-wrapper {
      display: flex;
      flex-direction: column;
      width : 49%;
      
      .text {
        margin: 0;
        font-size: 18px;
        text-align: justify;
        color: #7C7C7C;
      }
    }

    .preview-file {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width : 49%;
      gap: 15px;
      margin-top:10px;

      .preview-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 135px;
      }

      .preview-item-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 60px;
      }

      .preview-img {
        height: 110px;
        cursor: pointer;
        border: 1px solid #00000022;
      }

      span {
        font-size: 18px;
        text-align: justify;
        text-decoration-line: underline;
        color: #7C7C7C;
        cursor: pointer;
      }

      .delete-btn {
        width: 18px;
        height: 20px;
        margin-top: 10px;
        border: none;
        background-color: white;
      }
    }

    .preview {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top:10px;

      .preview-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 135px;
      }

      .preview-item-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 135px;
      }

      .preview-img {
        height: 110px;
        cursor: pointer;
        border: 1px solid #00000022;
      }

      .delete-btn {
        width: 18px;
        height: 20px;
        margin-top: 10px;
        border: none;
        background-color: white;
      }
    }
  }

  .accept-btn {
    display:flex;
    width: 340px;
    height: 67px;
    align-items: center;
    border: none;
    justify-content: center;
    background: #44ad67;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 89px;
    font-size: 24px;
    color: #FFFFFF;
  }
`;


const VidiModal = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  padding-bottom: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full widtsh */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: #000000ae; /* Black w/ opacity */
`;
