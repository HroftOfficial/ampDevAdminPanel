import React, { useState, useEffect, useContext } from 'react';
import "./newZakaz.css";
// import { Layout } from '../../../components/layout/Layout';
import { useNavigate } from "react-router-dom";
import UserService from '../../../services/UserService';

import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

// import { citiesData } from '../../../utils/only_cities';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Cropper from 'react-easy-crop'
import { cities } from '../../../utils/only_cities2';
import getCroppedImg from "../../../utils/cropImage";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { setWith } from 'lodash';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



import MemberWork from '../../../components/memberWork/MemberWork';

import NumberFormat from "react-number-format";

import ImageUploading from "react-images-uploading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from '@mui/system';
import { v4 as uuidv4 } from 'uuid';


import { Context } from "../../../index";
import { observer } from "mobx-react-lite";


import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { StyledEngineProvider } from '@mui/material/styles';

const reorder = (list, startIndex, endIndex) => {
  console.log('reorder', list, startIndex, endIndex)
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
console.log('result', result)
  return result;
};


const NeZakaz = () => {
  const { store } = useContext(Context);


  // start 

  // cities,
  const [inputValue, setInputValue] = useState('');
  // cities,
  const [inputValueUsers, setInputValueUsers] = useState('');
  // title,
  const [title, setTitle] = useState('');
  // details,
  const [details, setDetails] = useState('');
  // kl,
  const [kl, setKl] = useState(0);
  // kl_text,
  // const [klText, setKlText] = useState([]);
  const [selectKlText, setSelectKlText] = useState('партия')
  // many,
  const [many, setMany] = useState(0);
  // work_category,
  const [toms, setToms] = useState([]);
  const [selectToms, setSelectToms] = useState([])
  // work_info,
  const [workInfo, setWorkInfo] = useState([]);
  // inhere_user,
  const [inhereUser, setInhereUser] = useState([]);
  const [typeInhereUser, setTypeInhereUser] = useState(false)
  const [selectInhereUser, setSelectInhereUser] = useState('')
  // zakaz_access_level,
  const [workGroup, setWorkGroup] = useState([]);
  const [selectWorkGroup, setSelectWorkGroup] = useState([])
  // max_width,
  const [maxWidth, setMaxWidth] = useState(0);
  // max_d
  const [maxD, setMaxD] = useState(0);

  // photo_url,
  const [photoUrl, setPhotoUrl] = useState([])
  // file_url,
  const [fileUrl, setFileUrl] = useState([])
  // telegram_url,
  const [telegramUrl, setTelegramUrl] = useState([])
  // end 



  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [raiting, setRaiting] = useState('3');
  const [legend, setLegend] = useState('стабильное предприятие');
  const [html, setHtml] = useState('');
  const [inn, setInn] = useState('');
  const [ogrn, setOgrn] = useState('');
  const [info, setInfo] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const maxNumber = 3;

  const [state, setState] = useState([]);
  const [stateWork, setStateWork] = useState([]);





  const [message, setMessage] = useState('');

  const [openCities, setOpenCities] = useState(false);
  const [selectCity, setSelectCity] = useState(null);


  const [openImage, setOpenImage] = useState(false);
  const [newImage, setNewImage] = useState(null);


  const [crop, setCrop] = useState({ x: 0, y: 0 })

  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)

  const [users, setUsers] = useState([])



  let navigate = useNavigate();

  useEffect(() => {
    getToms();
    // getWorkGroup();
    getUsers();
  }, [])




  async function getUsers() {
    try {
      setMessage('');
      // store.setLoading(true);
      const response = await UserService.fetchInhereUser();
      setUsers(response?.data);
      // store.setLoading(false);
    } catch (error) {
      setMessage(error?.response?.data?.message);
    } finally {
      // store.setLoading(false);
    }
  }


  const handleCloseImage = () => {
    setOpenImage(false);
  }

  // helper function: generate a new file from base64 String
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }

  // async function changeImage () {
  //   try {
  //     const id = currentId;
  //     setMessage('');
  //     const base64Data = await getCroppedImg(newImage, croppedArea);
  //     const file = dataURLtoFile(base64Data, 'logo.jpg')
  //     store.setLoading(true);
  //     const data = new FormData();
  //     data.append('images', file);
  //     const response = await UserService.changeImage(id, data);
  //     store.setLoading(false);
  //     setOpenImage(false);
  //     getUsers();
  //   } catch (error) {
  //     setMessage(error?.response?.data?.message)
  //   }finally{
  //     store.setLoading(false);
  //   }
  // }


  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    console.dir(croppedAreaPixels)
    setCroppedArea(croppedAreaPixels)
  }

  const onSelectFile = (event) => {
    if (event?.target?.files && event?.target?.files?.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        var image = new Image();

        image.src = reader.result;

        image.onload = function () {
          if (image.width < 350) {
            alert(`картинка слишком маленькая ${image.width}px. Найди другую картинку!`);
          }
        };

      };
      reader.readAsDataURL(event?.target?.files[0]);
      reader.addEventListener("load", () => {
        setNewImage(reader?.result)
      });
    }
  }



  async function getToms() {
    try {
      setMessage('');
      const response = await UserService.getToms();
      setToms(response?.data);
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }
  }

  async function getWorkGroup() {
    try {
      setMessage('');
      const response = await UserService.getWorkGroup();
      setWorkGroup(response?.data);
    } catch (error) {
      setMessage(error?.response?.data?.message)
    }
  }

  async function createUser(e) {
    try {
      e.preventDefault();
      setMessage('');
      const resultState = Object.keys(state).filter(key => state[key] === true)
      const resultWork = Object.keys(stateWork).filter(key => stateWork[key] === true)
      const base64Data = await getCroppedImg(newImage, croppedArea);
      const file = dataURLtoFile(base64Data, 'logo.jpg')
      const f_data = new FormData();
      f_data.append('images', file);
      f_data.append('name', name);
      f_data.append('email', email);
      f_data.append('org', org);
      f_data.append('raiting', raiting);
      f_data.append('legend', legend);
      f_data.append('html__href', html);
      f_data.append('inn', inn);
      f_data.append('ogrn', ogrn);
      f_data.append('information', info);
      f_data.append('description', description);
      resultWork.forEach((item) => {
        f_data.append('user_access_level[]', item);
      })
      resultState.forEach((item) => {
        f_data.append('work_category[]', item);
      })
      f_data.append('cities', inputValue);

      const response = await UserService.createUserAmp(f_data);
      navigate('/usersAmp')
    } catch (error) {
      setMessage(error?.response?.data?.message)
      console.error(error.response.data.message);
    }
  }

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeWork = (event) => {
    setStateWork({
      ...stateWork,
      [event.target.name]: event.target.checked,
    });
    console.log(stateWork)
  };

  const handleCloseCities = () => {
    setOpenCities(false);
  }

  async function prepareCitiesChange() {
    // setSelectCity(null)
    setOpenCities(true);
  }

  const openWindow = async () => {
    setNewImage(null)
    setOpenImage(true);
  }


  const handleChangeTypeInhereUser = (event) => {
    // console.log(event.target.value)

    setTypeInhereUser(event.target.value);
  };


  // function InhereUserView({boltest}) {

  //   if (boltest) {
  //     return <MemberWork handleChange={handleChangeWork} />;
  //   }

  //   return <UsersAmp />;
  // }

  const inhereBlock = (typeInhereUser) => {

    return <MemberWork handleChange={handleChangeWork} text={typeInhereUser} />

  }

  const handleChangeMany = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  // function NumberFormatCustom(props) {
  //   const { inputRef, onChange, ...other } = props;


  
  
  //   return (
  //     <NumberFormat
  //       {...other}
  //       ref={inputRef}
  //       onValueChange={values => {
  //         onChange({
  //           target: {
  //             value: values.value
  //           }
  //         });
  //       }}
  //       thousandSeparator
  //       // prefix="P "
  //     />
  //   );
  // }

  const onChangeImage = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };


  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      images,
      result.source.index,
      result.destination.index
    );
console.log('quotes', quotes)
    setImages( quotes );
  }

  const grid = 8;

  const QuoteItem = styled('div')(
    `width: 200px,
    border: 1px solid grey,
    margin-bottom: ${grid}px,
    background-color: lightblue,
    padding: ${grid}px`,
  );

  function removeItem(index) {
    const result = images.splice(index, 1);
    console.log('remove item',images, result, index)
    // setPhoto(result)
  }

  function Quote({ quote, index }) {
    console.log('quote', quote, index)
    return (
      <Draggable draggableId={uuidv4()} index={index}>
        {provided => (
          <QuoteItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            { <img src={quote?.replace(/public/i, process.env.REACT_APP_API_URL_TEST)} 
              alt="img" 
              style={{width:'200px'}}/>}
              <button onClick={()=>removeItem(index)}>удалить</button>
          </QuoteItem>
        )}
      </Draggable>
    );
  }


  const QuoteList = React.memo(function QuoteList({ quotes }) {
    console.log('qu', quotes)
    return quotes.map((item, index,) => (
      <Quote quote={item.path} index={index} key={index} />
    ));
  });

  return (
    <Layout>

      <div className="newZakaz">
        <h1 className="newZakazTitle">Новый заказ</h1>

        <div className="newZakazForm">
          <div className="newZakazItem">
            <label>Наименование заказа</label>
            <input
              type="text"
              placeholder="Шестерня "
              name='title'
              onChange={e => setTitle(e.target.value)}
              required
              value={title}
            />
          </div>
          <div className="newZakazItem">
            <InputLabel id='info'>Описание заказа</InputLabel>
            <TextareaAutosize
              aria-label="description"
              minRows={3}
              onChange={(e) => setDetails(e.target.value)}
              value={details}
            />
          </div>
        </div>
        <div className="newZakazForm">





        {/* <TextField

          // label="react-number-format2"
          value={many}
          // onChange={this.handleChangeMany("numberformat")}
          onChange={e => setMany(e.target.value)}
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        /> */}



          <div className="newZakazItem">
            <label>Стоимость</label>
            <NumberFormat 
        thousandSeparator={" "}
        // prefix={'₽ '} 
        decimalScale={2}
        fixedDecimalScale={true}
        decimalSeparator={"."}
        className='muiInput'
        name='many'
              onChange={e => setMany(e.target.value)}
              required
              value={many}
        />
          </div>
          <div className="newZakazItemSmall">
            <label>Количество</label>
            <input
              type="number"
              name='kl'
              onChange={e => setKl(e.target.value)}
              required
              value={kl}
            />
          </div>
          <div className="newZakazItemSmall">
            <label>Периодичность</label>
            <Select
              id="select"
              value={selectKlText}
              onChange={(e) => setSelectKlText(e.target.value)}
            >

              <MenuItem value={'партия'}>партия</MenuItem>
              <MenuItem value={'месяц/шт'}>месяц/шт</MenuItem>
              <MenuItem value={'год/шт'}>год/шт</MenuItem>
            </Select>
          </div>
        </div>


        <div className="newZakazForm">
          <div className="newZakazItemSmall">
            <label>Max D</label>
            <input
              type="number"
              name='maxD'
              onChange={e => setMaxD(e.target.value)}
              required
              value={maxD}
            />
          </div>
          <div className="newZakazItemSmall">
            <label>Max L</label>
            <input
              type="number"
              name='maxWidth'
              onChange={e => setMaxWidth(e.target.value)}
              required
              value={maxWidth}
            />
          </div>
        </div>
        <div className="newUserItem">
          <InputLabel id='info'>Населенный пункт {selectCity}</InputLabel>
          <Autocomplete
            id="cities"
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={cities}
            autoHighlight
            getOptionLabel={(option) => option.value}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.value}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Выберите город"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-cities', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>




        <div className="newUserErrorMessage">
          {message}
        </div>

        <MemberWork
          handleChange={handleChangeWork}
          title={'Группа доступа'}
          helper={'если ничего не выбрано, то запишется только "Общий доступ"'}
        />

        <div style={{ paddingTop: '20px' }}><hr /></div>
        <div className="legendToms">Владелец заказа</div>

        <Autocomplete
          id="inhereUsers"
          inputValue={inputValueUsers}
          onInputChange={(event, newInputValue) => {
            setInputValueUsers(newInputValue);
          }}
          options={users}
          autoHighlight
          getOptionLabel={(option) => option.org}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.org}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Выберите владельца заказа"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-data', // disable autocomplete and autofill
              }}
            />
          )}
        />

        <div style={{ paddingTop: '20px' }}><hr /></div>
        <div className="tomsAreaForm">
          <div className="legendToms">Виды мех обработки</div>
          {toms.map((t) =>
            <>
              <div className='legendToms'>{t?._id?.group_name}</div>
              <div className='tomsArea'>
                {t?.items.map((cb) =>
                  <div className='tomsLabel'>
                    <FormControlLabel
                      control={
                        <Checkbox onChange={handleChange} name={cb?.type_id} key={cb?.type_id}
                          defaultChecked={cb?.type_id === '5f51fda156a0c50b1a44c69c'}
                        />
                      }
                      label={cb?.name}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="newZakazItem">
          <div className="title">Фото и файлы</div>


          <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {/* <QuoteList quotes={images} /> */}
            <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">

            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.data_url} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
                       { images.length < maxNumber &&
            <button
              style={isDragging ? { color: "red" } : null}
              onClick={onImageUpload}
              {...dragProps}
            >
              
              Click or Drop here
            </button>
           }
          </div>
        )}
      </ImageUploading>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>



          {/* <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">

            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.data_url} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
                       { images.length < maxNumber &&
            <button
              style={isDragging ? { color: "red" } : null}
              onClick={onImageUpload}
              {...dragProps}
            >
              
              Click or Drop here
            </button>
           }
          </div>
        )}
      </ImageUploading> */}
        </div>
        <div className="newUserItem">
          <button
            className="createUserButton"
            onClick={(e) => createUser(e)}
          >Создать
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default observer(NeZakaz);