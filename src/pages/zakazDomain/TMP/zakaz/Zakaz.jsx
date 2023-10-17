import React, { useState, useEffect, useContext } from 'react';
import "./zakaz.css";
import { useNavigate, useParams } from "react-router-dom";

import Loader from '../../../components/loader/Loader';
// import { Context } from "../../../index";
import { AuthContext } from "../../../hoc/AuthProvider";
import { observer } from "mobx-react-lite";

import ZakazService from '../../../services/ZakazService';

// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from '@mui/system';
import { v4 as uuidv4 } from 'uuid';
import config from '../../../settings/config';

const reorder = (list, startIndex, endIndex) => {
  console.log('reorder', list, startIndex, endIndex)
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
console.log('result', result)
  return result;
};

const Zakaz = () => {
  const { store } = useContext(AuthContext);

  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState([]);
  const [file, setFile] = useState([]);
  const [telegram, setTelegram] = useState([]);

 
  useEffect(() => {
    getZakazFiles(id)
  }, [])



  async function getZakazFiles(id) {
    try {
      store.setLoading(true);
      setMessage('');
      const response = await ZakazService.getZakazFilesToId(id);
      // console.log('data', response?.data?.photo_url[0].path)
      setNumber(response?.data?.number);
      setTitle(response?.data?.title);
      setPhoto(response?.data?.photo_url);
      setFile(response?.data?.file_url);
      setTelegram(response?.data?.telegram_url);

    } catch (error) {
      setMessage(error?.response?.data?.message)
    } finally {
      store.setLoading(false);
    }
  }


  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      photo,
      result.source.index,
      result.destination.index
    );
console.log('quotes', quotes)
    setPhoto( quotes );
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
    const result = photo.splice(index, 1);
    console.log('remove item',photo, result, index)
    // setPhoto(result)
  }

  // function Quote({ quote, index }) {
  //   console.log('quote', quote, index)
  //   return (
  //     <Draggable draggableId={uuidv4()} index={index}>
  //       {provided => (
  //         <QuoteItem
  //           ref={provided.innerRef}
  //           {...provided.draggableProps}
  //           {...provided.dragHandleProps}
  //         >
  //           { <img src={quote?.replace(/public/i, config?.UPLOAD_API_URL)} 
  //             alt="img" 
  //             style={{width:'200px'}}/>}
  //             <button onClick={()=>removeItem(index)}>удалить</button>
  //         </QuoteItem>
  //       )}
  //     </Draggable>
  //   );
  // }


  // const QuoteList = React.memo(function QuoteList({ quotes }) {
  //   console.log('qu', quotes)
  //   return quotes.map((item, index,) => (
  //     <Quote quote={item.path} index={index} key={index} />
  //   ));
  // });
  

  return (
    <>

      <div className="newUser">
        <h1 className="newUserTitle">Редактирование чертежей и файлов заказа:</h1>
        <br />
        <span className='titleFiles'> номер {number}</span> <br />
        <span className='titleFiles'>"{title}"</span>
        {(store.isLoading)
          ? <Loader />
          : <>
{/* main  */}
{/* <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={photo} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext> */}
{/* /main  */}
          {/* <div className="newUserForm">
          <div>Чертежи</div>
          {photo.map((item,index) => 
            (

              <img src={item?.path?.replace(/public/i, process.env.REACT_APP_API_URL_TEST)} 
              alt="img" 
              style={{width:'600px'}}/>
            )

          
          )}
          </div> */}
          <div className="newUserForm">
          <div>Чертежи телеграм</div>
          {telegram.map(item => 
            (
              <img src={item?.path?.replace(/public/i, config?.UPLOAD_API_URL)} 
              alt="img" 
              style={{width:'600px'}}/>
            )

          
          )}
          </div>
          <div className="newUserForm">
          <div>Файлы</div>
          {file.map(item => 
            (
              <img src={item?.path?.replace(/public/i, config?.UPLOAD_API_URL)} 
              alt="img" 
              style={{width:'600px'}}/>
            )

          
          )}
          </div>
            
            <div className="newUserItem">
              <button
                className="createUserButton"
              >Сохранить
              </button>
            </div>
          </>
        }
      </div>
    </>
  );
}

export default observer(Zakaz);