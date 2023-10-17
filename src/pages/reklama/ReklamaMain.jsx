import {useState, useEffect} from 'react'
import styled from 'styled-components';
import {observer} from "mobx-react-lite";
import { useNavigate, Link} from 'react-router-dom';
import data from './reklamaState';
import ReklamaService from '../../services/ReklamaService';
import config from '../../settings/config';

const Advertising = () => {
  const [ready, setReady] = useState(false);
  const [ad, setAd] = useState([]);

  useEffect(() => {
    try {
      (async() => {
        const response = await ReklamaService.getReklamas();
        console.log(response)
        setAd(response.data)
      })()
    } catch (e) {
      console.error('Reklama error >>> ', e)
    } finally {
      setReady(true)
    } 
  }, [])

  const navigate = useNavigate();

  const handleDelete = (e) => {
    console.log(e)
    const id = e.target.id;
    const da = prompt('Точно?', 'Да') 
    if (da == 'Да' || da == 'да')  {
      console.log('delete ad >> ', id)
      const resp = ReklamaService.deleteReklama(id)
      // console.log(resp)
      window.location.reload()

    } else {
      console.log('delete ad >> net', id)
    }
  }

  const handleDisabled = (e) => {
    console.log(e)
    const id = e.target.id;

    console.log('Disabled > ', id)
    const resp = ReklamaService.stateReklama(id, {enabled: false})
    // console.log(resp)

    window.location.reload()

  }

  const handleActive = (e) => {
    console.log(e)
    const id = e.target.id;
    console.log('Enabled > ', id)

    const resp = ReklamaService.stateReklama(id, {enabled: true})
    // console.log(resp)

    window.location.reload()
  }

  const handleEdit = (e) => {
    console.log(e)
    const id = e.target.id;

    navigate(`/reklama/edit/${id}`)
  }

  return (
    <Wrapper>
      {ready && 
          <div className='ad-list'>
            {ad.map((item) => {
              return (
              <div className='item' key={item._id} id={item._id}>
                {item.enabled ? <button className='enabled-btn' onClick={handleDisabled} id={item._id} title='Отключить'>На сайте</button> :
                <button className='disabled-btn' onClick={handleActive} id={item._id} title='Включить'>Активировать</button>}

                <button className='delete-btn' onClick={handleDelete} id={item._id} title='Удалить'>Удалить</button>
                <button className='edit-btn' onClick={handleEdit} id={item._id} title='Редактировать'>Редактировать</button>
                <img alt='' src={`${config?.UPLOAD_API_URL}/uploads/ad/${item.preview_url[0]?.filename}`} id={item._id}/>
              </div>
            )})}
          </div>
      }
      <Link to='new' className='link-new'>Добавить рекламу</Link>
    </Wrapper>
  )
};

export default observer(Advertising);

const Wrapper = styled.div`
  display: flex;
  color: black;
  /* justify-content: center; */
  flex-direction: column;
  min-height: 59vh;
  font-family: 'Roboto', sans-serif;
  margin: 30px;

  .header {
    display: flex;
    max-width: 1440px;
    width: 100%;
    text-align: center;
  }

  .ad-list {
    display: flex;
    max-width: 1440px;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 30px;
  }

  .item {
    display: flex;
    /* height: 300px; */
    height: auto;
    max-height: 300px;
    width: auto;
    /* max-width: 700px */
    position: relative;
    

    img {
      height: 250px;
    }

    .enabled-btn{
      position: absolute;
      padding: 10px;
      border: 1px solid black;
      top: 10px;
      left: 10px;
      background-color: white;
      border-radius: 5px; 
      background-color: #6ae06a;
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
    }

    .disabled-btn{
      position: absolute;
      padding: 10px;
      border: 1px solid black;
      top: 10px;
      left: 10px;
      background-color: white;
      border-radius: 5px; 
      background-color: yellow;
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      font-weight: 500;
    }

    .delete-btn{
      position: absolute;
      padding: 10px;
      border: 1px solid black;
      top: 10px;
      right: 10px;
      background-color: white;
      border-radius: 5px; 
      background-color: tomato;
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
    }

    .edit-btn {
      position: absolute;
      padding: 10px;
      border: 1px solid black;
      bottom: 10px;
      left: calc(50% - 60px);
      background-color: white;
      border-radius: 5px; 
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
    }
  }

  .link-new {
    margin: 0 auto;
    border: 1px solid black;
    color: black;
    padding: 15px;
    border-radius: 5px; 
    margin-top: 30px;
    font-size: 16px;
  }
`;
