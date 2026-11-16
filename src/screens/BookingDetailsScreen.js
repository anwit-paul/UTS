import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPickerModal from '../components/ColorPickerModal';
import ConnectingJourneyButton from '../components/ConnectingJourneyButton';
import CountdownTimer from '../components/CountdownTimer';
import DoYouKnowSection from '../components/DoYouKnowSection';
import Header from '../components/Header';
import NoticeFooter from '../components/NoticeFooter';
import QRCodeSection from '../components/QRCodeSection';
import TicketCard from '../components/TicketCard';

function getFormattedBookingDate() {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Current time minus 52 minutes
  const bookingTime = new Date(Date.now() - 52 * 60 * 1000);

  const day = bookingTime.getDate();
  const month = MONTHS[bookingTime.getMonth()];
  const year = bookingTime.getFullYear();
  const hours = String(bookingTime.getHours()).padStart(2, '0');
  const minutes = String(bookingTime.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

function getFormattedValidityText() {
  // Tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const day = String(tomorrow.getDate()).padStart(2, '0');
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const year = tomorrow.getFullYear();

  return `Valid for one ret. jrny. till midnight of ${day}/${month}/${year}`;
}

export default function BookingDetailsScreen({ navigation }) {
  const [accentColor, setAccentColor] = useState('#F39C12');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const bookingDate = useMemo(() => getFormattedBookingDate(), []);
  const validityText = useMemo(() => getFormattedValidityText(), []);

  const ticketInfo = {
    journeyCode: 'XHNEH914B',
    source: 'PANVEL',
    destination: 'THANE',
    via: 'SNCR-TUH',
    distance: '37 km',
    passengers: '1 Adult, 0 Child',
    ticketType: 'RETURN',
    trainType: 'AC-EMU',
    classType: 'FIRST',
    fare: '210.00',
    barcodeString: 'IR:27AAAGM0289C2ZI',
    validityText,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        mobileNumber="8451973961"
        onBackPress={() => navigation?.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Greeting Banner */}
          <View style={styles.greetingBanner}>
            <Text style={styles.greetingText}>Thank You ANWIT, Happy Journey!</Text>
          </View>

          {/* Countdown Timer Section */}
          <CountdownTimer
            timer="04:59"
            bookingDate={bookingDate}
            referenceNumber="R18007"
            accentColor={accentColor}
            onColorPress={() => setIsColorPickerVisible(true)}
          />

          {/* Main Ticket Details Card */}
          <TicketCard
            ticketData={ticketInfo}
            accentColor={accentColor}
            onColorPress={() => setIsColorPickerVisible(true)}
          />

          {/* Important Notice Footer */}
          <NoticeFooter />
        </View>

        {/* Connecting Journey Notice & Button */}
        <View style={styles.connectingJourneyContainer}>
          <Text style={styles.connectingNoticeText}>
            Connecting Journey: Validity till 1 hrs...
          </Text>
          <ConnectingJourneyButton onPress={() => console.log('Connecting Journey Clicked')} />
        </View>

        {/* QR Code Section */}
        <QRCodeSection />

        {/* Do You Know Section */}
        <DoYouKnowSection />
      </ScrollView>

      {/* Instant Color Picker Modal */}
      <ColorPickerModal
        visible={isColorPickerVisible}
        selectedColor={accentColor}
        onSelectColor={(color) => setAccentColor(color)}
        onClose={() => setIsColorPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b65beff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F1F2F4',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#F1F2F4',
    flexGrow: 1,
  },
  greetingBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: -16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#333333',
  },
  connectingJourneyContainer: {
    marginVertical: 4,
  },
  connectingNoticeText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
});
