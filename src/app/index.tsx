import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';

const cores = {
  fundo: '#b2b1db',
  destaque: '#e2e607',
  texto: '#000000',
  textoSecundario: '#e40c0c',
};

const URL_API = 'https://jsonplaceholder.typicode.com/users';

type Usuario = {
  id: number;
  name: string;
  email: string;
};

export default function HomeScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error('Erro na requisição');
        const dados: Usuario[] = await resposta.json();
        setUsuarios(dados);
      } catch (e) {
        setErro('Não foi possível carregar os dados.');
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>{erro}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.titulo}>Lista de Usuários</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.lista}>
            <Text style={styles.nome}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 16,
  },
  centro: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.destaque,
    marginTop: 16,
    marginBottom: 16,
  },
  lista: {
    paddingBottom: BottomTabInset + 16,
  },
 
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.texto,
  },
  email: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 4,
  },
  texto: {
    color: cores.texto,
  },
});
