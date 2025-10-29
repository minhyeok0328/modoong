import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
      <WebView
        source={{ uri: 'https://visionary-piroshki-ef01f6.netlify.app/' }}
        style={{ flex: 1, width: '100%', height: '100%' }}
      />
    </SafeAreaView>
  );
}
