import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';



// import { Container } from './styles';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Login</Text>

    <View style={{ width: '80%', height: "auto", backgroundColor: 'white', borderRadius: 10, marginTop: 20 }}>
      <TextInput placeholder="Username" style={{ width: '100%', height: 50, borderRadius: 10, paddingLeft: 20 }} value={username} onChangeText={(text) => setUsername(text)} />
      <TextInput placeholder="Senha" style={{ width: '100%', height: 50, borderRadius: 10, paddingLeft: 20, marginTop: 10 }} value={password} onChangeText={(text) => setPassword(text)} />
      <TextInput placeholder="Informe o token" style={{ width: '100%', height: 50, borderRadius: 10, paddingLeft: 20, marginTop: 10 }} value={token} onChangeText={(text) => setToken(text)} />
    </View>

    <TouchableOpacity style={{ width: '80%', height: 50, backgroundColor: 'green', borderRadius: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
      // Aqui você pode adicionar a lógica de autenticação, como enviar os dados para um servidor e verificar se o login é válido.
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Token:', token);
    }}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
    </TouchableOpacity>

  </View>;

}

export default Login;