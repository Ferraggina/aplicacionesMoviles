import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validatePassword } from '../utils/validators';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const newErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return;

    const result = await register(username, password);
    if (!result.ok) {
      setErrors({ username: result.error });
      return;
    }
    Alert.alert('Listo', 'Cuenta creada. Ya podés iniciar sesión.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        error={errors.username}
        autoCapitalize="none"
      />
      <AppInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />
      <AppButton title="Registrarme" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5' },
});
