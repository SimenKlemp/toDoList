import {SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const UpdateTaskComponent = ({navigation, route}) => {

    const [list, setList] = useState(route.params.totalList)
    const [currentList, setCurrentList] = useState(route.params.currentList);
    const [updatedName, setUpdatedName] = useState("");


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


    const updateTaskHandler = async (contents) => {
        const tasks = list.find(x => x.id === currentList.id).content
        const inBetweenList = list.map((listCurrent) => listCurrent)

        for (let i = 0; i < tasks.length; i++) {
            if(tasks[i].contentId === contents.contentId) {
                tasks[i] = { contentId: contents.contentId, contentName: updatedName, completed: contents.completed }
            }
        }
        for(let i = 0; i < inBetweenList.length; i++) {
            if(inBetweenList[i].id === currentList.id) {
                inBetweenList[i].content = tasks
            }
        }

        setList(inBetweenList)
        setCurrentList(list.find(x => x.id === currentList.id))
        await write(list)
        await navigation.navigate('ListView')
    }

    useEffect(() => {
        setUpdatedName(route.params.currentTask.contentName)
    }, [])

    return (
        <>
            <View>
                <View>
                    <Text style={styles.textInput}>
                        Oppdater oppgave
                    </Text>
                    <SafeAreaView >
                        <TextInput
                            placeholder="Add new list element"
                            value={updatedName}
                            style={styles.input}
                            onChangeText={(text) => setUpdatedName(text)}
                            onSubmitEditing= {() =>
                                updateTaskHandler(route.params.currentTask)}

                        />
                    </SafeAreaView>
                </View>
            </View>
        </>
            )
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
    }
})

export default UpdateTaskComponent;

