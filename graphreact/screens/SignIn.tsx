
import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';

const SIGN_IN = gql`
mutation getSignIn($input: SignInInput!){
    signIn(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SignIn = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    const navigation = useNavigation();
  
    const [signIn, { data, error, loading }] = useMutation(SIGN_IN);

    useEffect(() => {
        if (error) {
          Alert.alert('Invalid credentials, try again');
        }
      }, [error])
    
      if (data) {
        // save token
        AsyncStorage
          .setItem('token', data.signIn.token)
          .then(() => {
            // redirect home
            navigation.navigate('Authorised')
          })
      }
    
      const onSubmit = () => {
        signIn({ variables: { email, password }})
      }
  return (
    <View style={{ padding: 20 }}>
    <TextInput  placeholder="seyi@gmail.com" value={email} onChangeText={setEmail} style={{ color: 'white', fontSize: 18, width: '100%', marginVertical: 25,  }}
    />

    <TextInput  placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={{ color: 'white', fontSize: 18, width: '100%', marginVertical: 25, 
      }}
    />
    <Pressable 
      onPress={onSubmit} 
      disabled={loading}
      style={{ 
        backgroundColor: '#5800FF',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
      }}
    >
      <Text 
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          Sign In
      </Text>
    </Pressable>

    <Pressable 
      onPress={() => {console.warn('nbavigate'); navigation.navigate('SignUp')}} 
      style={{ 
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
      }}
    >
      <Text 
        style={{
          color: '#5800FF',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          New here? Sign up
      </Text>
    </Pressable>
  </View>
  )
}

export default SignIn