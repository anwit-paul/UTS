import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const MOST_USED_STORAGE_KEY = '@uts/most-used-colors';
const MAX_MOST_USED_COLORS = 8;

export const PALETTE_COLORS = [
  // Distinct Warm Oranges & Ambers
  '#F39C12', // IRCTC Orange (Default)
  '#EA580C', // Deep Orange

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
  const [usageCounts, setUsageCounts] = useState({});
  const [isEditingMostUsed, setIsEditingMostUsed] = useState(false);
  const [colorsToDelete, setColorsToDelete] = useState([]);
  const usageCountsRef = useRef({});
  const loadPromiseRef = useRef(Promise.resolve({}));
  const writeQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    if (!visible) {
      setIsEditingMostUsed(false);
      setColorsToDelete([]);
    }
  }, [visible]);

  useEffect(() => {
    let isMounted = true;
    const loadPromise = AsyncStorage.getItem(MOST_USED_STORAGE_KEY)
      .then((storedCounts) => {
        if (storedCounts === null) {
          return {};
        }

        const parsedCounts = JSON.parse(storedCounts);
        if (!parsedCounts || typeof parsedCounts !== 'object' || Array.isArray(parsedCounts)) {
          throw new Error('Stored most-used colors must be an object.');
        }

        return Object.fromEntries(
          Object.entries(parsedCounts).filter(
            ([color, count]) => PALETTE_COLORS.includes(color) && Number.isSafeInteger(count) && count > 0
          )
        );
      })
      .catch((error) => {
        console.error('Failed to load most-used colors.', error);
        return {};
      });

    loadPromiseRef.current = loadPromise;
    loadPromise.then((storedCounts) => {
      usageCountsRef.current = storedCounts;
      if (isMounted) {
        setUsageCounts(storedCounts);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateUsageCounts = async (color) => {
    await loadPromiseRef.current;
    const nextCounts = { ...usageCountsRef.current };
    nextCounts[color] = (nextCounts[color] || 0) + 1;

    usageCountsRef.current = nextCounts;
    setUsageCounts(nextCounts);

    await persistUsageCounts(nextCounts);
  };

  const persistUsageCounts = (nextCounts) => {
    const writePromise = writeQueueRef.current
      .then(() => AsyncStorage.setItem(MOST_USED_STORAGE_KEY, JSON.stringify(nextCounts)))
      .then(() => true)
      .catch((error) => {
        console.error('Failed to save most-used colors.', error);
        return false;
      });
    writeQueueRef.current = writePromise;
    return writePromise;
  };

  const mostUsedColors = Object.entries(usageCounts)
    .sort(
      ([colorA, countA], [colorB, countB]) =>
        countB - countA || PALETTE_COLORS.indexOf(colorA) - PALETTE_COLORS.indexOf(colorB)
    )
    .slice(0, MAX_MOST_USED_COLORS)
    .map(([color]) => color);

  const selectColor = (color) => {
    void updateUsageCounts(color);
    onSelectColor(color);
    onClose();
  };

  const toggleColorForDeletion = (color) => {
    setColorsToDelete((colors) =>
      colors.includes(color) ? colors.filter((item) => item !== color) : [...colors, color]
    );
  };

  const saveMostUsedColors = async () => {
    const nextCounts = { ...usageCountsRef.current };
    colorsToDelete.forEach((color) => {
      delete nextCounts[color];
    });

    if (await persistUsageCounts(nextCounts)) {
      usageCountsRef.current = nextCounts;
      setUsageCounts(nextCounts);
      setColorsToDelete([]);
      setIsEditingMostUsed(false);
    }
  };

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
                Tap a color to apply it. Use × to choose colors to remove, then ✓ to save.
              </Text>

              <View style={styles.mostUsedSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Most used</Text>
                  {mostUsedColors.length > 0 && (
                    <TouchableOpacity
                      style={styles.editColorsButton}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isEditingMostUsed ? 'Save most-used colors' : 'Choose most-used colors to delete'
                      }
                      onPress={() => {
                        if (isEditingMostUsed) {
                          void saveMostUsedColors();
                        } else {
                          setColorsToDelete([]);
                          setIsEditingMostUsed(true);
                        }
                      }}>
                      <Text style={styles.editColorsButtonText}>
                        {isEditingMostUsed ? '✓' : '×'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {mostUsedColors.length === 0 ? (
                  <Text style={styles.emptyMostUsed}>Your selected colors will appear here</Text>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.mostUsedRow}>
                    {mostUsedColors.map((hex) => {
                      const isSelected = selectedColor?.toUpperCase() === hex.toUpperCase();
                      return (
                        <TouchableOpacity
                          key={hex}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: hex },
                            isSelected && styles.selectedSwatch,
                            isEditingMostUsed && colorsToDelete.includes(hex) && styles.markedForDeletion,
                          ]}
                          activeOpacity={0.7}
                          accessibilityLabel={`${hex}, most used color${
                            colorsToDelete.includes(hex) ? ', marked for deletion' : ''
                          }`}
                          accessibilityHint={
                            isEditingMostUsed
                              ? 'Tap to mark or unmark this color for deletion'
                              : 'Tap to apply this color'
                          }
                          onPress={() => {
                            if (isEditingMostUsed) {
                              toggleColorForDeletion(hex);
                            } else {
                              selectColor(hex);
                            }
                          }}>
                          {isSelected && <View style={styles.checkMark} />}
                          {isEditingMostUsed && colorsToDelete.includes(hex) && (
                            <View style={styles.deleteMark}>
                              <Text style={styles.deleteMarkText}>×</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

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
                      onPress={() => selectColor(hex)}>
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
    marginBottom: 12,
  },
  mostUsedSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },
  editColorsButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editColorsButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  emptyMostUsed: {
    color: '#9CA3AF',
    fontSize: 12,
    paddingVertical: 8,
  },
  mostUsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  colorSwatch: {
    position: 'relative',
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
  markedForDeletion: {
    opacity: 0.45,
  },
  deleteMark: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteMarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
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
