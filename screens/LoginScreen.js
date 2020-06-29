import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation } from 'react-native';
import * as firebase from 'firebase';

export default class LoginScreen extends React.Component{
    static navigationOptions = {
        headerShown: null
    }
    state = {
        email: "",
        senha: "",
        errorMessage: null
    }

    handleLogin = () => {
        const {email, senha} = this.state;

        firebase.auth().signInWithEmailAndPassword(email, senha).catch(err => this.setState({errorMessage: err.message}))
    }
    render(){
        return(
            <ScrollView style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                <Text style={styles.greeting}>
                    {'Olá de Novo!\nBem Vindo de Volta!'}
                </Text>
                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>
                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Email</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize='none' 
                            onChangeText={email => this.setState({email})}
                            value={this.state.email}
                        ></TextInput>
                    </View>
                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Senha</Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize='none'
                            onChangeText={senha => this.setState({senha})}
                            value={this.state.senha}
                        ></TextInput>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={{color: '#FFF', fontWeight: '500'}}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}} onPress={() => this.props.navigation.navigate('Register')}>
                    <Text style={{color: '#414959', fontSize: 13}}>
                        Novo no SocialApp? <Text style={{fontWeight: '500', color: '#E9446A'}}>Cadastre-se!</Text>
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
        marginHorizontal: 30
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
    }
});