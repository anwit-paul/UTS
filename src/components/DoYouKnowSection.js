import { StyleSheet, Text, View } from 'react-native';

export default function DoYouKnowSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do you know?</Text>
      
      <Text style={styles.paragraph}>
        IR recovers only 57% of cost of travel on an average.
      </Text>
      
      <Text style={styles.paragraph}>
        This ticket is booked on a personal user ID. It's sale/purchase is an offence u/s 143 of the Railways Act, 1989.
      </Text>
      
      <Text style={styles.paragraph}>
        For enquiry and integrated railway helpline, please dial 139.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: -15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 10,
  },
});

