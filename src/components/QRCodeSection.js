import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export default function QRCodeSection() {
  return (
    <View style={styles.container}>
      <View style={styles.qrBox}>
        <Image
          source={require('../../assets/images/qrcode.png')}
          contentFit="contain"
          style={styles.qrImage}
          accessibilityLabel="Ticket QR code"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: -50,
  },
  qrBox: {
    width: 220,
    height: 220,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: '95%',
    height: '95%',
  },
});
