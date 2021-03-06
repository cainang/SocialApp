import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import Fire from '../Fire';
import UserPermissions from '../utils/UserPermissions';
import * as ImagePicker from 'expo-image-picker';

export default class RegisterScreen extends React.Component{
    static navigationOptions = {
        headerShown: null
    }
    state = {
        user: {
            name: "",
            email: "",
            senha: "",
            avatar: null
        },
        errorMessage: null
    }

    handleSignUp = () => {
        Fire.shared.createUser(this.state.user);
    }
        
    handlePickAvatar = async () =>{
        UserPermissions.getCameraPermission();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3]
        })

        if(!result.cancelled){
            this.setState({user: {...this.state.user, avatar: result.uri}});
        }
    }
    render(){
        return(
            <ScrollView style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                <Text style={styles.greeting}>
                    {'Olá Você é Novo Por Aqui!\nVamos ao Cadastro!'}
                    
                </Text>
                <View style={{position: 'absolute', top: 64, alignItems: 'center', width: '100%'}}>
                    <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                        <Image source={{uri: this.state.user.avatar}} style={styles.avatar}/>
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>
                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Nome</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            onChangeText={name => this.setState({user: {...this.state.user, name}})}
                            value={this.state.user.name}
                        ></TextInput>
                    </View>
                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Email</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            onChangeText={email => this.setState({user: {...this.state.user, email}})}
                            value={this.state.user.email}
                        ></TextInput>
                    </View>
                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Senha</Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize='none'
                            onChangeText={senha => this.setState({user: {...this.state.user, senha}})}
                            value={this.state.user.senha}
                        ></TextInput>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{color: '#FFF', fontWeight: '500'}}>Cadastra-se</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={{color: '#414959', fontSize: 13}}>
                        Já tem uma Conta? <Text style={{fontWeight: '500', color: '#E9446A'}}>Faça Login!</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: 'center'
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30, 
        marginTop: 60
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 15
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: '#161F3D'
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: '#E9446A',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    avatar: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#E1E2E6',
        borderRadius: 50,
        marginTop: 48,
        justifyContent: 'center',
        alignItems: 'center'
    }
});