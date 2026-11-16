import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TicketCard({
  ticketData,
  accentColor = '#F39C12',
  onColorPress,
}) {
  return (
    <View style={styles.card}>
      {/* Top Branding & Status */}
      <View style={styles.gridContainer}>
        <View>
          <Text style={styles.label}>JOURNEY TICKET</Text>
          <Text style={styles.value}>{ticketData.journeyCode}</Text>
        </View>
        <View style={styles.activeBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.activeText}>ACTIVE</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View>
          <Text style={styles.label}>SOURCE</Text>
          <Text style={styles.value}>{ticketData.source}</Text>
        </View>
        <View style={styles.rightAlign}>
          <Text style={styles.label}>DESTINATION</Text>
          <Text style={styles.value}>{ticketData.destination}</Text>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>DISTANCE</Text>
          <Text style={styles.value}>{ticketData.distance}</Text>
        </View>
        <View style={[styles.gridItem, styles.rightAlign]}>
          <Text style={[styles.label, styles.leftAlignedGridText]}>PASSENGERS</Text>
          <Text style={[styles.value, styles.leftAlignedGridText]}>{ticketData.passengers}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>TICKET TYPE</Text>
          <Text style={styles.value}>{ticketData.ticketType}</Text>
        </View>
        <View style={[styles.gridItem, styles.rightAlign]}>
          <Text style={[styles.label, styles.leftAlignedGridText]}>TRAIN TYPE</Text>
          <Text style={[styles.value, styles.leftAlignedGridText]}>{ticketData.trainType}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>CLASS</Text>
          <Text style={styles.value}>{ticketData.classType}</Text>
        </View>
        <View style={[styles.gridItem, styles.rightAlign]}>
          <Text style={[styles.label, styles.leftAlignedGridText]}>FARE</Text>
          <Text style={[styles.fareValue, styles.leftAlignedGridText]}>₹{ticketData.fare}</Text>
        </View>
      </View>

      {/* Via Pill Box */}
      {ticketData.via && (
        <View style={styles.viaPill}>
          <Ionicons name="share-social-outline" size={14} color="#64748B" style={styles.viaIcon} />
          <Text style={styles.viaPillText}>Via: {ticketData.via}</Text>
        </View>
      )}

      {/* Reference / Barcode String */}
      {ticketData.barcodeString && (
        <View style={styles.barcodeStringRow}>
          <Text style={styles.barcodeStringText}>{ticketData.barcodeString}</Text>
        </View>
      )}

      {/* Perforated Divider with Side Cutout Semi-Circles */}
      <View style={styles.notchDividerContainer}>
        <View style={styles.leftSemiCircle} />
        <View style={styles.dashedDivider} />
        <View style={styles.rightSemiCircle} />
      </View>

      {/* Bottom Information Section above Orange Strip */}
      <View style={styles.bottomInfoSection}>
        <Text style={styles.commenceText}>Commence Journey within 1 Hrs</Text>
        {ticketData.validityText && (
          <Text style={styles.validityInfoText}>{ticketData.validityText}</Text>
        )}
      </View>

      {/* Solid Bottom Strip (tappable to change color) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onColorPress}
        style={[styles.bottomOrangeStrip, { backgroundColor: accentColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginBottom: 6,
    elevation: 0,
    overflow: 'hidden',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextContainer: {
    marginLeft: 8,
  },
  hindiBrand: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C0392B',
  },
  englishBrand: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C0392B',
    letterSpacing: 0.3,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 25,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27AE60',
    marginRight: 4,
  },
  activeText: {
    color: '#27AE60',
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stationRow: {
    marginBottom: 12,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#888888',
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  valueLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  valueMedium: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222222',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  gridItem: {
    flex: 1,
  },
  leftAlignedGridItem: {
    alignItems: 'flex-start',
  },
  leftAlignedGridText: {
    textAlign: 'left',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  fareValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },
  viaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAfAfA',
    borderWidth: 1,
    borderColor: '#dee1e6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 3,
    marginBottom: 4,
  },
  viaIcon: {
    marginRight: 8,
  },
  viaPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  barcodeStringRow: {
    paddingVertical: 1,
  },
  barcodeStringText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
    letterSpacing: 0.5,
  },
  notchDividerContainer: {
    position: 'relative',
    height: 22,
    marginHorizontal: -16, // expand past card padding to touch edges
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  dashedDivider: {
    width: '100%',
    height: 1,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderColor: '#CBD5E1',
  },
  leftSemiCircle: {
    position: 'absolute',
    left: -13.5,
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#F1F2F4', // matches screen background color to look cut out
    overflow: 'hidden',
    zIndex: 2,
  },
  rightSemiCircle: {
    position: 'absolute',
    right: -13.5,
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#F1F2F4', // matches screen background color to look cut out
    overflow: 'hidden',
    zIndex: 2,
  },
  bottomInfoSection: {
    paddingVertical: 4,
    paddingBottom: 6,
  },
  commenceText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '300',
    marginBottom: 0,
  },
  validityInfoText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '300',
  },
  bottomOrangeStrip: {
    height: 16,
    backgroundColor: '#F39C12',
    marginHorizontal: -16, // expands to full card width
    marginBottom: -1, // expands to full card width
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});
