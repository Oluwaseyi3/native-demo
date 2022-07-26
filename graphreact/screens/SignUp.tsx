import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert,   ActivityIndicator,  } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client';

const SIGN_UP = gql`
mutation getSignUp($input: SignUpInput!){
    signUp(input: $input) {
        token
       user {
         id
         name,
         email
       }
     
    }
  }
`;


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
  
    const navigation = useNavigation();
  

    const [signUp, { data, error, loading }] = useMutation(SIGN_UP);

    
  if (error) {
    Alert.alert('Error signing up. Try again')
  }

  if (data) {
    
    AsyncStorage
      .setItem('token', data.signUp.token)
      .then(() => {
        
        navigation.navigate('Authorised')
      })
  }

  const onSubmit = () => {
    signUp({variables: { name, email, password }})
  }
  
  return (
    <View style={{ padding: 20 }}>
    <TextInput  placeholder="name" value={name} onChangeText={setName} style={{ color: 'white', fontSize: 18, width: '100%', marginVertical: 25, 
      }}
    />

    <TextInput  placeholder="seyi@gmail.com" value={email} onChangeText={setEmail} style={{ color: 'white', fontSize: 18, width: '100%', marginVertical: 25,  }}
    />

    <TextInput  placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={{ color: 'white', fontSize: 18, width: '100%', marginVertical: 25,  }}
    />

    <Pressable 
      onPress={onSubmit} 
      style={{ 
        backgroundColor: '#5800FF',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
      }}
    >
      {loading && <ActivityIndicator />}
      <Text 
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          Sign up
      </Text>
    </Pressable>

    <Pressable
      disabled={loading}
      onPress={() => { navigation.navigate('SignIn')} } 
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
          Already Have an account? Pls Sign in
      </Text>
    </Pressable>
  </View>
  )
}

export default SignUp