import { StyleSheet, Text, View } from 'react-native';

export default function NoticeFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.noticeText}>
        Note: This ticket is non-refundable. Ticket is stored locally on device. Please do not change your{' '}
        {'\n'}handset or perform factory reset.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcebeb',
    borderWidth: 1,
    borderColor: '#FFD1D1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginVertical: 4,
  },
  noticeText: {
    color: '#C0392B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
