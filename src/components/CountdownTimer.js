import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DIGIT_HEIGHT = 54;
const TIMER_DIGIT_WIDTH = 30;

function parseSeconds(timerStr) {
  if (typeof timerStr === 'number') return timerStr;
  if (!timerStr) return 299; // default 04:59 = 299s
  const parts = timerStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return 299;
}

// Single slot for minutes (each minute digit rolls independently when its value changes)
function RollingMinuteSlot({ currentVal, prevVal }) {
  const [anim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (prevVal !== undefined && prevVal !== currentVal) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }).start();
    }
  }, [currentVal, prevVal, anim]);

  const currentTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DIGIT_HEIGHT, 0],
  });

  const prevTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DIGIT_HEIGHT],
  });

  return (
    <View style={styles.digitSlot}>
      {prevVal !== undefined && prevVal !== currentVal && (
        <Animated.View
          style={[
            styles.digitWrap,
            { transform: [{ translateY: prevTranslateY }] },
          ]}>
          <Text style={styles.timerText}>{prevVal}</Text>
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.digitWrap,
          { transform: [{ translateY: currentTranslateY }] },
        ]}>
        <Text style={styles.timerText}>{currentVal}</Text>
      </Animated.View>
    </View>
  );
}

// Entire 2-digit seconds block moves together as a whole unit
function RollingSecondsBlock({ currentSecStr, prevSecStr }) {
  const [anim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (prevSecStr !== undefined && prevSecStr !== currentSecStr) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }).start();
    }
  }, [currentSecStr, prevSecStr, anim]);

  const currentTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-DIGIT_HEIGHT, 0],
  });

  const prevTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DIGIT_HEIGHT],
  });

  return (
    <View style={styles.secondsSlot}>
      {prevSecStr !== undefined && prevSecStr !== currentSecStr && (
        <Animated.View
          style={[
            styles.secondsWrap,
            { transform: [{ translateY: prevTranslateY }] },
          ]}>
          <View style={styles.secondsRow}>
            <Text style={styles.timerDigitText}>{prevSecStr[0]}</Text>
            <Text style={styles.timerDigitText}>{prevSecStr[1]}</Text>
          </View>
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.secondsWrap,
          { transform: [{ translateY: currentTranslateY }] },
        ]}>
        <View style={styles.secondsRow}>
          <Text style={styles.timerDigitText}>{currentSecStr[0]}</Text>
          <Text style={styles.timerDigitText}>{currentSecStr[1]}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function CountdownTimer({
  timer = '04:59',
  bookingDate,
  referenceNumber = 'R18011',
  accentColor = '#F39C12',
  onColorPress,
}) {
  const [initialSeconds] = useState(() => parseSeconds(timer));
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [prevRemainingSeconds, setPrevRemainingSeconds] = useState(initialSeconds);
  const [referenceDigits, setReferenceDigits] = useState(() =>
    String(referenceNumber).replace(/\D/g, ''),
  );
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [referenceDraft, setReferenceDraft] = useState('');

  // Animated width progress for the orange timer line (fills from 0% left to 100% right over 5 mins = 300s)
  const [progressAnim] = useState(() => new Animated.Value(0));

  const finishReferenceEdit = () => {
    const digits = referenceDraft.replace(/\D/g, '');
    if (digits) setReferenceDigits(digits);
    setIsEditingReference(false);
  };

  useEffect(() => {
    const totalDurationMs = (initialSeconds || 300) * 1000;

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDurationMs,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        setPrevRemainingSeconds(prev);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSeconds, progressAnim]);

  const prevSecs = prevRemainingSeconds;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const prevMinutes = Math.floor(prevSecs / 60);
  const prevSeconds = prevSecs % 60;

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const prevMinStr = String(prevMinutes).padStart(2, '0');
  const prevSecStr = String(prevSeconds).padStart(2, '0');

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      {/* Top banner strip (tappable to change color) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onColorPress}
        style={[styles.topSandwichStrip, { backgroundColor: accentColor }]}
      />

      {/* Main Counter Card with side rails */}
      <View style={styles.mainContainer}>
        <Image
          source={require('../../assets/images/counterbackground1.png')}
          contentFit="fill"
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.backgroundOverlay]}
        />

        {/* Left Side Rail: Vertical INDIAN RAILWAYS + Dashed Line */}
        <View style={styles.sideRail}>
          <View style={styles.verticalTextWrap}>
            <Text style={styles.sideRailText}>INDIAN RAILWAYS</Text>
          </View>
          <View style={styles.dashedLine} />
        </View>

        {/* Center Countdown Content */}
        <View style={styles.centerContent}>
          <Text style={styles.previewTitle}>
            Dynamic preview will close in
          </Text>

          {/* Massive Rolling Countdown Display */}
          <View style={styles.timerRow}>
            <View style={styles.digitGroup}>
              <RollingMinuteSlot currentVal={minStr[0]} prevVal={prevMinStr[0]} />
              <RollingMinuteSlot currentVal={minStr[1]} prevVal={prevMinStr[1]} />
            </View>
            <Text style={styles.colonText}>:</Text>
            <RollingSecondsBlock currentSecStr={secStr} prevSecStr={prevSecStr} />
          </View>

          <Text style={styles.dateLabel}>Ticket Booking Date & Time</Text>
          <Text style={styles.timestamp}>
            {bookingDate}
          </Text>
          {isEditingReference ? (
            <View style={styles.referenceInputRow}>
              <Text style={styles.refNumber}>R</Text>
              <TextInput
                autoFocus
                accessibilityLabel="Reference number"
                keyboardType="number-pad"
                returnKeyType="done"
                selectTextOnFocus
                style={styles.referenceInput}
                value={referenceDraft}
                onChangeText={(value) => setReferenceDraft(value.replace(/\D/g, ''))}
                onBlur={finishReferenceEdit}
                onSubmitEditing={finishReferenceEdit}
              />
            </View>
          ) : (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Reference number R${referenceDigits}. Tap to edit`}
              onPress={() => {
                setReferenceDraft(referenceDigits);
                setIsEditingReference(true);
              }}
            >
              <Text style={styles.refNumber}>R{referenceDigits}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.nonTransferableText}>Ticket is Non-Transferable</Text>
        </View>

        {/* Right Side Rail: Dashed Line + Vertical भारतीय रेल */}
        <View style={styles.sideRail}>
          <View style={styles.dashedLine} />
          <View style={styles.verticalTextWrap}>
            <Text style={styles.sideRailTextHindi}>भारतीय रेल</Text>
          </View>
        </View>
      </View>

      {/* Animated Timer Line beneath counter card (tappable to change color) */}
      <TouchableOpacity activeOpacity={0.8} onPress={onColorPress} style={[styles.timerTrack, { backgroundColor: '#D1D5DB' }]}>
        <Animated.View
          style={[
            styles.timerBar,
            { width: progressWidth, backgroundColor: accentColor },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 0,
    marginTop: 0,
  },
  topSandwichStrip: {
    height: 12,
    backgroundColor: '#F39C12',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  mainContainer: {
    backgroundColor: '#1E232A',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  backgroundOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sideRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  verticalTextWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideRailText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.2,
    transform: [{ rotate: '-90deg' }],
    width: 250,
    textAlign: 'center',
  },
  sideRailTextHindi: {
    color: '#94A3B8',
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: 1.5,
    transform: [{ rotate: '-90deg' }],
    width: 250,
    textAlign: 'center',
  },
  dashedLine: {
    width: 1,
    height: '110%',
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#94A3B8',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  previewTitle: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: DIGIT_HEIGHT,
    marginVertical: 3,
  },
  digitGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digitSlot: {
    width: TIMER_DIGIT_WIDTH,
    height: DIGIT_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsSlot: {
    width: TIMER_DIGIT_WIDTH * 2,
    height: DIGIT_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: TIMER_DIGIT_WIDTH * 2,
  },
  colonText: {
    color: '#FF2A2A',
    fontSize: 47,
    fontWeight: '900',
    includeFontPadding: false,
    marginHorizontal: 2,
    lineHeight: DIGIT_HEIGHT,
  },
  timerText: {
    color: '#FF2A2A',
    fontSize: DIGIT_HEIGHT * 0.9,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: DIGIT_HEIGHT,
  },
  timerDigitText: {
    color: '#FF2A2A',
    fontSize: DIGIT_HEIGHT * 0.9,
    fontWeight: '900',
    width: TIMER_DIGIT_WIDTH,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: DIGIT_HEIGHT,
  },
  dateLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    color: '#F59E0B', // Massive bold amber timestamp
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  refNumber: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
  },
  referenceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referenceInput: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    minWidth: 48,
    padding: 0,
  },
  nonTransferableText: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 3,
  },
  timerTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#374151',
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
});
