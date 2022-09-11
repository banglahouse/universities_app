import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,FlatList,TextInput,Button,ListItem ,Alert ,TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const db = SQLite.openDatabase('dbName');
// Favourite screen
function Favourite() {
    // isFouced hook is used to querry the db whenver user comes in fav screen
    const isFocused = useIsFocused();
    // for error handling from DB querry
    const [empty, setEmpty] = useState([]);

    // data from db is stored here
    const [favourite, setFavourite] = useState([])

    // will run whenever user comes to this screen , but only once
useEffect(() => {
    
    db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM University_table',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setFavourite(temp);
   
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true)
            }
   
          }
        );
   
      });

    return () => {
        
    }
}, [isFocused])

// Function to delete from db

function deleteFromDB(item) {
    console.log(item)
    db.transaction(tx => {
        tx.executeSql(
            "DELETE FROM University_table WHERE domain_address = (?)",
            [`${item. domain_address}`],
            (tx, result) => {
                setFavourite(favourite.filter(s => s !== item))
                console.log(`deleted: ${item.university_name}`);
            },
            (txn, err) => {
                console.log(err);
            },
        );
        return
    })
}


    // Render flatlist of fav items
    const renderItem = ({ item }) => {


        return <View key={item.university_name} style={styles.cardUi}>
            <View style={{flex:0.8}}>
            <Text style={{fontSize:18}}>{item.university_name}</Text>

            </View>
        
        <View>

            {
              
                    <TouchableOpacity
                        
                        key={item.university_name}
                        onPress={() => deleteFromDB(item)}
                        style={[ { backgroundColor: '#00cc00' }]}
                    >
                                                   <FontAwesome name={'star-o'} size={24} />

                        {/* <Text style={{ fontSize: 18 }}>{''}</Text> */}
                    </TouchableOpacity> 
            }

        </View>
    
        </View>
    }

    return (
        <View style={styles.container}>

           <Text>{'\n'}</Text>
           {/* data displayed below */}
            {
                <FlatList

                data={favourite}
                renderItem={renderItem}
                keyExtractor={item => item.university_name}

            />                
                }
        </View>
    )
}
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
    alignItems:"flex-start",
    multiline:true,
    backgroundColor: "cornsilk",

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


export default Favourite
