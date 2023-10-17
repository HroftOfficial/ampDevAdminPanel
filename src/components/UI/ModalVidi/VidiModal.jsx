import classes from "./VidiModal.module.css";
import { useState, useEffect } from 'react';
import Toms from '../../../services/TomsService';  
import FormLabel from "@mui/material/FormLabel";
import { Checkbox } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';

const VidiModal = (props) => {
  const [selected, setSelected] = useState(props.selected)
  const [selectedText, setSelectedText] = useState(props.selectedText)
  const [listVidi, setListVidi] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async() => {
      try {
        const vidi = await Toms.getUsersToms();
        setListVidi(vidi.data)      
      } catch (e) {
        console.error('Error > ', e);
      } finally {
        setReady(true);
      }
    })()
  }, [])

  const handleClose = () => {
    props.setShowModal(false)
  }

  const handleSubmite = (e) => {
    e.preventDefault();
    if (props.setSelected) props.setSelected(selected)
    if (props.setSelectedText) props.setSelectedText(selectedText)
    if (props.postUsersToms) props.postUsersToms({work_category: selected});
    props.setShowModal(false)
  }

  const handleCheck = (e) => {
    const id = e.target.id;
    const name = e.target.labels[0].innerText;

    if (!selected.includes(id)) {
      setSelected(selected => ([...selected, id]))
    } else {
      const temp = selected.slice()
      const index = temp.indexOf(id)
      temp.splice(index, 1)
      setSelected(temp)
    }

    if (!selectedText.includes(name)) {
      setSelectedText(selected => ([...selected, name]))
    } else {
      const temp = selectedText.slice()
      const index = temp.indexOf(name)
      temp.splice(index, 1)
      setSelectedText(temp)
    }
  }

  return (
    <div className={classes.body}>
      {ready && 
      <div className={classes.modal__content}>
        <FormLabel 
          id="controlled-radio-buttons-group"
          style={{ color: "black", fontWeight: 700, fontSize: "1.4rem", padding:'30px 0px 5px 0px' }}
        >
          Виды механической обработки:
          <span className={classes.close} onClick={handleClose}>&times;</span>
        </FormLabel>  

        <div className={classes.modal__body}>

          {listVidi?.map((group) => (
            <div className={classes.label__group} key={group._id}>{group.name_key}
            
              {group.items.map((item) => (
                <FormControlLabel
                  style={{width: '100%'}}
                  key={item.id_name}
                  id={item.id_name}
                  name={item.name}
                  control={ <Checkbox id={item.id_name} defaultChecked={props.selected.includes(item.id_name) ?  true : false} onChange={(e) => handleCheck(e)} name={item.id_name}/> }
                  label={<div className={classes.label__item}>{item?.name} </div>}
                />
              ))}

            </div>
          ))}

        </div>
      
        <button className={classes.button} onClick={handleSubmite}>Готово</button>
      </div>}
    </div>
  )
}

export default VidiModal;
