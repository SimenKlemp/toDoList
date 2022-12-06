import {
    Button,
    Text,
    TextInput,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    TouchableWithoutFeedback, Alert
} from "react-native";
import {useCallback, useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid';
import {useFocusEffect} from "@react-navigation/native";


const HomeScreen = ({ navigation}) => {

    const [list, setList] = useState([]);
    const [name, setName] = useState("");


    const write = async (list) => {
        try {
            await AsyncStorage.setItem(
                'ToDoList',
                JSON.stringify(list)
            )
        } catch (e) {
            alert('Failed to store data to file');
        }
    };

    const retrieveLists = async () => {
        try {
            const listData = JSON.parse(await AsyncStorage.getItem("ToDoList"))

            if(listData != null) {
                setList(listData)
            }
        } catch (error) {
            console.log(error);
        }
    };


    const listEmpty = () => {
        return (
            <View style={{ alignItems:"center" }}>
                <Text style={styles.item}>No data found</Text>
            </View>
        );
    };

    useFocusEffect(
        useCallback(() => {
            retrieveLists().then( response => {
                if(response !== undefined) {
                    setList(response)
                }
            })
        },[]))



    useEffect( () => {
        write(list).then(async () => {
            console.log('Successfully updated list')
        })

    },[list])


    const handleSubmit = () => {
        if (name.length === 0 || name === "" ) {
            return
        }

        let id = 0

        while(list.filter(item => item.id === id).length > 0) {
            id++
        }

        const newTodo = {id: id , name: name, content: []}
        setList([...list, newTodo])
        setName("")
    }

    const showConfirmDialog = (id) => {
        return Alert.alert(
            "Er du sikker?",
            "Er du sikker på at du vil slette listen?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        removeList(id)
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };

    const removeList = (id)  => {
        setList(list.filter((listMain) => listMain.id !== id)
        )
    };

    return (
        <>
            <View style={styles.mainContainer}>
                <View>
                    <Text style={styles.textInput}>
                        Legg til nye lister
                    </Text>
                    <SafeAreaView >
                        <TextInput
                            placeholder="Legg til ny liste"
                            value={name}
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                            blurOnSubmit={false}
                            onSubmitEditing={handleSubmit}
                        />
                    </SafeAreaView>
                </View>
                <Text
                    style={styles.listTitle}> Lister
                </Text>
                <View>
                    <FlatList data={list}
                              keyExtractor={(item) => item.id}
                              ListEmptyComponent={listEmpty}
                              ItemSeparatorComponent={() => <View style={{height: 7}} />}
                              renderItem={listMain=> {
                                  return <View>
                                      <TouchableOpacity
                                          key={listMain.item.id}
                                          style={styles.container}
                                          onPress={() => navigation.navigate('ListView', {currentItem: listMain.item.id})}>
                                          <Text style={styles.text}>
                                              {listMain.item.name}
                                          </Text>
                                          <TouchableOpacity onPress={() => showConfirmDialog(listMain.item.id)} style={styles.containerDelete}>
                                              <Image source={require('../assets/deleteIcon.png')} style={styles.tinyLogo}  />
                                          </TouchableOpacity>
                                      </TouchableOpacity>
                                  </View>

                              }}
                    />
                </View>
            </View>

        </>
    );
};


const styles = StyleSheet.create({
    containerInput: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    input: {
        width: '100%',
        color: '#555555',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        height: 50,
        borderColor: '#3EB489',
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#ffffff'

    },

    textInput: {
        marginTop: 30,
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        height: 50,
        paddingEnd: 1,
        marginLeft: 3,
    },
    container: {
        padding: 15,
        marginTop: 1,
        backgroundColor: '#3EB489',
        alignItems: 'center',
        borderColor: '#3EB489',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20
    },
    text: {
        color: '#000000',
        fontSize: 20
    },
    listTitle: {
        marginTop: 30,
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        height: 50,
        paddingEnd: 1,
        marginLeft: 2,
    },
    tinyLogo: {
        width: 20,
        height: 20,

    },
    containerDelete: {
        position: 'absolute',
        right: 20,
        paddingTop: 20
    },
    appContainer: {
       backgroundColor: '#000000'
    },
    containerFlatList: {
        flex: 1,

    },
    mainContainer: {
        paddingHorizontal: 20
    }

})

export default HomeScreen