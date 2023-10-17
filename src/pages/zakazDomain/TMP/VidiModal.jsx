import { useState } from 'react';
import styled from "styled-components";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';

const VidiModal = (props) => {
  const [selected, setSelected] = useState(props.selected)
  const [selectedText, setSelectedText] = useState(props.selectedText)

  const handleClose = () => {
    props.setShowModal(false)
  }


  const handleSubmite = (e) => {
    e.preventDefault();
    // console.log('Sended selected >> ', selected);
    // console.log('Sended text selected >> ', selectedText)
    if (props.setSelected) props.setSelected(selected)
    if (props.setSelectedText) props.setSelectedText(selectedText)
    if (props.postUsersToms) props.postUsersToms({work_category: selected});
 
    props.setShowModal(false)
  }


  const handleCheck = (e) => {
    // console.log(e)
    const id = e.target.id;
    const name = e.target.labels[0].innerText;

    // console.log(id)
    // console.log(name)

    if (!selected.includes(id)) {
      // props.setSelected(selected => ([...selected, id]))
      setSelected(selected => ([...selected, id]))
      // console.log('setSelected >> + ', id)
    } else {
    
    const temp = selected.slice()
    const index = temp.indexOf(id)
    temp.splice(index, 1)
    // props.setSelected(temp)
    setSelected(temp)

    // console.log('setSelected >> - ', id)
    }

    if (!selectedText.includes(name)) {
      // props.setSelectedText(selected => ([...selected, name]))
      setSelectedText(selected => ([...selected, name]))
      // console.log('setSelectedText >> + ', name)
    } else {
    
    const temp = selectedText.slice()
    const index = temp.indexOf(name)
    temp.splice(index, 1)
    // props.setSelectedText(temp)
    setSelectedText(temp)

    // console.log('setSelectedText >> - ', name)
    }
  }

  return (
    <ModalContent>
        <FormLabel 
          id="controlled-radio-buttons-group"
          style={{ color: "black", fontWeight: 700, fontSize: "1.4rem", padding:'30px 0px 5px 0px' }}
          >
          Виды механической обработки:
          <span className="close" onClick={handleClose}>&times;</span>
        </FormLabel>  

        <ModalBody>

          {props.data?.map((group) => (

            <GroupLabel key={group._id}>{group.name_key}
            
              {group.items.map((item) => (

                <FormControlLabel
                  className="width100"
                  key={item.id_name}
                  id={item.id_name}
                  name={item.name}
                  control={ <Checkbox id={item.id_name} defaultChecked={props.selected.includes(item.id_name) ?  true : false} onChange={(e) => handleCheck(e)} name={item.id_name}/> }
                  label={<ItemLebel>{item?.name} </ItemLebel>}
                />
                
              ))}

            </GroupLabel>

          ))}

        </ModalBody>
      
        <button onClick={handleSubmite}>Готово</button>
    </ModalContent>
  )
}

export default VidiModal;

const ModalContent = styled.div`
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 55px 79px 100px;
  width: 85%;
  height: auto;
  margin-bottom: 200px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;

  @media screen and (max-width: 1024px) {
    padding: 35px 59px;
  }

  @media screen and (max-width: 768px) {
    padding: 25px 20px;
  }

  @-webkit-keyframes animatetop {
    from {left:-300px; opacity:0} 
    to {left:0; opacity:1}
  }

  @keyframes animatetop {
    from {left:-300px; opacity:0}
    to {left:0; opacity:1}
  }

  .close {
    color: black;
    float: right;
    font-size: 40px;
    font-weight: bold;
    margin-right: 40px;
    @media screen and (max-width: 768px) {
      margin-right: -4px;
      margin-top: -10px;
    }
  }

  .close:hover,
  .close:focus {
    color: #00AEAE;
    text-decoration: none;
    cursor: pointer;
  }

  button {
    display: flex;
    padding: 15px 35px;
    margin: 0 auto;
    background: #44ad67;
    border-radius: 5px;
    margin-top: 25px;
    border: none;
    cursor: pointer;
    font-size: 24px;
    text-align: center;
    color: #FFFFFF;
  }
`;


const ModalBody = styled.div`
  margin-top: 30px;
  column-count: 3;
  text-align: left;
  color: black;

  .width100 {
    width: 100%;
  }

  @media screen and (max-width: 1024px) {
    column-count: 2;
  }

  @media screen and (max-width: 768px) {
    column-count: 1;
  }
`;

const GroupLabel = styled.div`
  margin-bottom: 30px;
  font-weight: 500;
  font-size: 24px;
  color: #333333;
`;

const ItemLebel = styled.div`
  font-size: 18px;
  color: #525252;
`;