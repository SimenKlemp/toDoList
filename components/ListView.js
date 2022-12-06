import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {useCallback, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from 'expo-checkbox';
import UpdateTaskComponent from "./UpdateTaskComponent";
import {useFocusEffect} from "@react-navigation/native";



const ListView = ({ navigation, route }) => {

    const [list, setList] = useState([])
    const [listContent, setListContent] = useState("");
    const [currentList, setCurrentList] = useState([]);

    const addContentHandler = async () => {

        const contentObject = {contentId: (currentList.content.map((list) => list)).length, contentName: listContent, completed: false}

        list.find(x => x.id === currentList.id).content.push(contentObject)

        setList(currentToDoList => [...currentToDoList])

        setCurrentList(list.find(x => x.id === currentList.id))

        await write(list)
        await setListContent("")
    }

    const retrieveLists = async () => {
        try {
            const listData = JSON.parse(await AsyncStorage.getItem("ToDoList"))

            if(listData != null) {
                return listData
            }
        } catch (error) {
            console.log(error);
        }
    };

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

    const contentEmpty = () => {
        return (
            <View style={{ alignItems:"center" }}>
                <Text style={styles.item}>No data found</Text>
            </View>
        );
    };

    const handleCompleted = async (contents) => {
        const tasks = list.find(x => x.id === currentList.id).content

        const mainList = list.map((listCurrent) => listCurrent)

        for (let i = 0; i < tasks.length; i++) {
            if(tasks[i].contentId === contents.contentId) {
                tasks[i] = { contentId: contents.contentId, contentName: contents.contentName, completed: !contents.completed }
            }
        }

        for(let i = 0; i < mainList.length; i++) {
            if(mainList[i].id === currentList.id) {
                mainList[i].content = tasks
            }
        }

        setList(mainList)
        setCurrentList(list.find(x => x.id === currentList.id))
        await write(list)
    }

    useFocusEffect(
        useCallback(() => {
            retrieveLists().then( response => {
                if(response !== undefined) {
                    setList(response)
                    setCurrentList(response.find(x => x.id === route.params.currentItem))
                }
            })
        },[]))

    if(!currentList) {
        return <Text>Fetching items</Text>
    }

    return (
        <>
            <View style={styles.mainContainer}>

                <View>
                    <Text style={styles.contentTitle}>
                        Legg til nytt innhold
                    </Text>

                    <SafeAreaView >

                        <TextInput
                            placeholder="Legg til nytt innhold"
                            value={listContent}
                            style = {styles.input}
                            onChangeText={(text) => setListContent(text)}
                            blurOnSubmit={false}
                            onSubmitEditing= {addContentHandler}
                        />
                    </SafeAreaView>

                </View>
                {currentList?.content ? (

                    <View>
                        <Text style={styles.listTitle}>
                            {currentList.name}
                        </Text>
                        <View>
                            <FlatList data={currentList.content.sort((a,b) => Number(a.completed) - Number(b.completed) )}
                                      ListEmptyComponent={contentEmpty}
                                      keyExtractor={(item) => item.contentId}
                                      ItemSeparatorComponent={() => <View style={{height: 7}} />}
                                      renderItem={task => {
                                          return <View style = {styles.container} >
                                              <Text style = {styles.text}>
                                                  {task.item.contentName}
                                              </Text>

                                              <View style={styles.tinyLogo}>
                                                  <Checkbox onValueChange={() => handleCompleted(task.item)} value={task.item.completed}/>
                                              </View>

                                              <TouchableOpacity onPress={() => navigation.navigate('UpdateTaskComponent', {currentTask: task.item, currentList: currentList, totalList: list })} style={styles.containerUpdate}>
                                                  <Image source={require('../assets/editIcon.png')} style={styles.tinyLogo}  />
                                              </TouchableOpacity>

                                          </View>
                                      }}
                            />

                        </View>
                    </View>
                ): <Text>Henter liste</Text>}

            </View>

        </>
    )
};

const styles = StyleSheet.create ({
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
    listTitle: {
        marginTop: 30,
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        height: 50,
        paddingEnd: 1,
        textAlign: "center",

    },

    contentTitle: {
        marginTop: 30,
        fontSize: 20,
        color: "#000000",
        fontWeight: "bold",
        height: 50,
        paddingEnd: 1,


    },
    tinyLogo: {
        width: 25,
        height: 25,
        position: 'absolute',
        left: 20,
        marginTop: 18

    },
    mainContainer: {
        paddingHorizontal: 20
    },
    containerUpdate: {
        position: 'absolute',
        right: 60,
        paddingTop: 100
    },
})

const alertItemName = (item) => {
    alert(item)
}

export default ListView







