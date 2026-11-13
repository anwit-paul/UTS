import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export const PALETTE_COLORS = [
  // Distinct Warm Oranges & Ambers
  '#F39C12', // IRCTC Orange (Default)
  '#EA580C', // Deep Orange
  '#FB923C', // Soft Orange

  // Distinct Reds & Pinks
  '#EF4444', // Bright Red
  '#B91C1C', // Deep Red
  '#E11D48', // Ruby Rose
  '#EC4899', // Hot Pink
  '#F472B6', // Soft Pink
  '#C026D3', // Fuchsia / Magenta

  // Very Light Pinks
  '#FDF2F8',
  '#FCE7F3',
  '#FBCFE8',
  '#F9A8D4',

  // Very Light Yellows
  '#FFFBEB',
  '#FEF9C3',
  '#FEF08A',
  '#FDE68A',

  // Distinct Purples & Blues
  '#9333EA', // Violet
  '#7C3AED', // Royal Purple
  '#4F46E5', // Indigo
  '#818CF8', // Periwinkle
  '#2563EB', // Vivid Blue
  '#1E40AF', // Deep Navy
  '#06B6D4', // Cyan / Sky

  // Very Light Blues
  '#EFF6FF',
  '#DBEAFE',
  '#BFDBFE',
  '#E0F2FE',

  // Distinct Teals & Greens
  '#14B8A6', // Turquoise
  '#0D9488', // Deep Teal
  '#10B981', // Emerald Mint
  '#34D399', // Light Emerald
  '#22C55E', // Bright Green
  '#84CC16', // Lime

  // Very Light Greens
  '#F0FDF4',
  '#DCFCE7',
  '#BBF7D0',
  '#ECFCCB',

  // Distinct Yellows, Earth Tones & Neutrals
  '#A16207', // Ochre
  '#854D0E', // Warm Brown
  '#64748B', // Slate
  '#374151', // Dark Slate
  '#111827', // Charcoal
];

export default function ColorPickerModal({ visible, selectedColor, onSelectColor, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.headerRow}>
                <Text style={styles.modalTitle}>Choose Accent Color</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subHint}>
                Tap any color below to update all orange strips & accents
              </Text>

              <ScrollView contentContainerStyle={styles.paletteGrid} showsVerticalScrollIndicator={false}>
                {PALETTE_COLORS.map((hex) => {
                  const isSelected = selectedColor?.toUpperCase() === hex.toUpperCase();
                  return (
                    <TouchableOpacity
                      key={hex}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: hex },
                        isSelected && styles.selectedSwatch,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelectColor(hex);
                        onClose();
                      }}>
                      {isSelected && <View style={styles.checkMark} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#1E232A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHint: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  colorSwatch: {
    width: 29,
    height: 29,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedSwatch: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    transform: [{ scale: 1.08 }],
  },
  checkMark: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
