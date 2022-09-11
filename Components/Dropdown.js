import React,{useEffect,useState} from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
const [dropdown, setDropdown] = useState([]);
const [open, setOpen] = useState(false);
const [value, setValue] = useState(null)
const [country,setCountry] = useState()
;

function Dropdown(item) {

    React.useEffect(() => {

        (async () => {
        const response = await fetch('https://trial.mobiscroll.com/content/countries.json')
        const data= await response.json() 
      
    
         setCountry(data)

        })();

  
  

  
  
  
        
        return () => {
        };
   
    }, []);
    return (
        <DropDownPicker
        open={open}
        value={value}
        items={country.map((item)=> ({label:item.text,value:item.text}))}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => {
          setDropdown(value)
        }}  
      />
      
    )
}

export default Dropdown
