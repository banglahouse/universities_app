import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// import { ListItem } from "@react-native-material/core";

import uniqid from 'generate-unique-id';
const db = SQLite.openDatabase('dbName');
import { useIsFocused } from "@react-navigation/native";
import AppButton from './AppButton'


export default function Home({ navigation }) {

    // Loader for when fetch is working
    const [isLoading, setLoading] = useState(false);
    // Sets Value of dropdown when selected
    const [dropdown, setDropdown] = useState([]);
    // sets data list of countries coming from a api for dropdown
    const [country, setCountry] = useState()
    // Sets data of university coming from the API given as problem
    const [universities, setUniversites] = useState([])
    
    // dropdown configs
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState()

    // shows List of college when loading is over
    const [show, setShow] = useState();

    // sets data from local DB(SQL lite) when drop down is changed or  when link is changed from home to fav
    const [selected, setSelected] = useState([]);
    // Local db data stored in map for faster iteration
    const [selectedinDB, setSelectedinDB] = useState(new Map())
    
    const isFocused = useIsFocused();

// this works to fetch data of countries when app is launched , isFoused used to refresh whenever user changes screen and comes back
    React.useEffect(() => {

        (async () => {
            const response = await fetch('https://trial.mobiscroll.com/content/countries.json')
            const data = await response.json()


            setCountry(data)
            setLoading(true)
            setValue('Select an item')
            setShow(false)
        })();

        // SQL querry to create table
        db.transaction(function (txn) {
            txn.executeSql('CREATE TABLE IF NOT EXISTS University_table(  university_name VARCHAR(255), domain_address VARCHAR(255) PRIMARY KEY, country VARCHAR(25))')
        })

        return () => {
        };
        
    }, [isFocused]);

// This function gets data when country is selected,it also checks if any data is already there in db
// to change it's colour as selected
    async function fetchData(countryFromText) {
        const universitiesInDB = new Map();

        try {
            setLoading(false);
            const response = await fetch(`http://universities.hipolabs.com/search?country=${countryFromText}`);

            db.transaction(tx => {

                tx.executeSql(
                    "SELECT * FROM University_table WHERE country = ? ", [`${countryFromText}`], (tx, results) => {

                        for (let i = 0; i < results.rows.length; ++i) {

                            universitiesInDB.set(results.rows.item(i).university_name, results.rows.item(i).domain_address)
                        }
                        setSelectedinDB(universitiesInDB)

                    }
                )
                setShow(true)

            })





            const data = await response.json();
            JSON.stringify(data)


            // isActive key value pair injected to check if data is already in DB or not, 
            // this way we can later change the color of fav icon
            for (let i = 0; i < data.length; i++) {
                data[i].uniqueId = uniqid()

                if (selectedinDB.has(data[i].name)) {
                    data[i].isActive = 'Y'

                    
                } else {
                    data[i].isActive = 'N'

                }



            }
            setUniversites(data)
            console.log(universities)


        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(true);
        }
    }


    // Function to save data in local db
    function saveToDb(item) {


        selected.includes(item) ?


            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM University_table WHERE domain_address = (?)",
                    [`${item.web_pages}`],
                    (tx, result) => {
                        setSelected(selected.filter(s => s !== item))
                        console.log(`deleted: ${item.name}`);
                    },
                    (txn, err) => {
                        console.log(err);
                    },
                );
                return
            })
            : db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO University_table (university_name,domain_address,country) VALUES (?, ?,?)",
                    [`${item.name}`, `${item.web_pages}`, `${item.country}`],
                    (tx, result) => {
                        console.log(`created ${item.name}`);
                        setSelected([...selected, item])

                    },
                    (txn, err) => {
                        console.log(err);
                    },
                );
            });

}


    // Fucntion to change data from localDB and state
    function deleteFromDB(item) {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM University_table WHERE domain_address = (?)",
                [`${item.web_pages}`],
                (tx, result) => {
                    setSelected(selected.filter(s => s !== item))
                    console.log(`deleted: ${item.name}`);
                },
                (txn, err) => {
                    console.log(err);
                },
            );
            return
        })
    }

    // render's item in flatlist

    const renderItem = ({ item }) => {


        return      <View key={item.uniqueId} style={styles.cardUi}>

            <View style={{flex:0.8}}>

            <Text>{item.name}</Text>
            </View>
    
            {
                item.isActive == 'Y' ?
                    <TouchableOpacity
    
                        key={item.name}
                        onPress={() => deleteFromDB(item)}
                        style={[styles.button, { backgroundColor: '#00cc00' }]}
                    >
                          <FontAwesome name={'star-o'} size={24} />
                        {/* <Text style={{ fontSize: 18 }}>click me</Text> */}
                    </TouchableOpacity> : <TouchableOpacity
    
                        key={item.name}
                        onPress={() => saveToDb(item)}
                        style={[styles.button, { backgroundColor: selected.includes(item) ? '#00cc00' : '#f2f2f2' }]}
                    >
                           <FontAwesome name={'star-o'} size={24} />

                        {/* <Text style={{ fontSize: 18 }}>click me</Text> */}
                    </TouchableOpacity>
            }
    
        </View>
    
    };
    


    return (


        <View style={styles.container}>



            {
                // Dropdown 
                isLoading ?
                    <DropDownPicker
                    style={{
                        backgroundColor: "cornsilk"
                      }}
                        open={open}
                        value={value}
                        items={country.map((item) => ({ label: item.text, value: item.text }))}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Select a Country"

                        onChangeValue={(value) => {
                            setDropdown(value)
                        }}
                    /> : <Text> Still Loading....</Text>



            }

                <Text>{"\n"}</Text>





     

            <View>
               
                {/* Button to get data */}
            <TouchableOpacity onPress={()=>{ fetchData(dropdown) }} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>Get Data</Text>
            </TouchableOpacity>

            </View>
            <Text>{"\n"}</Text>

            {

                show ? 
                
                // FlatList with data
                <FlatList

                data={universities}
                renderItem={renderItem}
                keyExtractor={item => item.uniqueId}
        
            />
                

                    : <Text></Text>
            }
      
        </View>

    );
}



// Stylesheet for styling

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin:2,
        padding:4
        // alignItems: 'center',
        // justifyContent: 'center',
        // width:100%,
    },
    item: {
        flexGrow: 0,
        backgroundColor: "blue",
        color: "white",
        minHeight: 70,
        minWidth: 100,
        padding: 2,
        margin: 2,
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
      },
  appButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
  },
  cardUi:{
    backgroundColor: "cornsilk",

    alignItems:"flex-start",
    multiline:true,
    // alignItems: "stretch",
    // height:1,
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:6,


  },
  button:{
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  }
});
