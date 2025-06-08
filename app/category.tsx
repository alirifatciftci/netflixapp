import { StyleSheet, Text, View } from 'react-native';

export default function CategoryPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kategori Sayfası</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 24 }
});
