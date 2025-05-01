import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

const App = () => {
  const [tagId, setTagId] = useState(null);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const checkNfc = async () => {
      const isSupported = await NfcManager.isSupported();
      setSupported(isSupported);
      if (isSupported) {
        await NfcManager.start();
      }
    };

    checkNfc();
  }, []);

  const startNfc = async () => {
    setError(null);
    try {
      await NfcManager.registerTagEvent(tag => {
        if (tag) {
          Alert.alert(JSON.stringify(tag, null, 2))
          const id = parseTagId(tag.id);
          setTagId(id);
        }
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const stopNfc = () => {
    NfcManager.unregisterTagEvent()
      .catch(err => setError(err.message));
  };

  const parseTagId = (id: any) => {
    if (!id) return null;
    return id.map((byte) => byte.toString(16).padStart(2, '0')).join(':');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leitor NFC Básico</Text>
      
      {!supported ? (
        <Text>Seu dispositivo não suporta NFC</Text>
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
          
          <Text style={styles.tagId}>
            TAG ID: {tagId || 'Aproxime uma tag NFC'}
          </Text>

          <View style={styles.buttons}>
            <Button title="Iniciar Leitura" onPress={startNfc} />
            <Button title="Parar Leitura" onPress={stopNfc} color="red" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  tagId: {
    fontSize: 18,
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttons: {
    gap: 10,
  },
});

export default App;