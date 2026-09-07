/**
 * In-App Checkout & Enrollment Screen — Tech Indro
 * Supports UPI (Google Pay, PhonePe, Paytm), Card, and Net Banking mock flows
 * Automatically adds course to user's enrolled list in AsyncStorage
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors, { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/Colors';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    courseId?: string;
    title?: string;
    price?: string;
    instructor?: string;
  }>();

  const courseTitle = params.title || 'Full Stack Web & AI Engineering';
  const courseId = params.courseId || 'fullstack';
  const basePrice = parseInt(params.price || '999', 10);
  const discount = Math.round(basePrice * 0.2); // 20% scholarship
  const finalPrice = Math.max(0, basePrice - discount);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'TECHINDRO' || couponCode.trim().toUpperCase() === 'ISRO50') {
      setCouponApplied(true);
      Alert.alert('Coupon Applied! 🎉', 'Flat ₹200 additional discount added!');
    } else {
      Alert.alert('Invalid Coupon', 'Try "TECHINDRO" for exclusive student discount.');
    }
  };

  const calculatedTotal = couponApplied ? Math.max(0, finalPrice - 200) : finalPrice;

  const handlePayNow = async () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid VPA like user@okaxis or name@paytm.');
      return;
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card', 'Please enter a 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        Alert.alert('Incomplete Card Details', 'Please fill in expiry and CVV.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate gateway network request
    setTimeout(async () => {
      const generatedTxn = 'TXN_' + Math.floor(100000 + Math.random() * 900000);
      setTransactionId(generatedTxn);

      try {
        // Save to user's enrolled courses in AsyncStorage
        const stored = await AsyncStorage.getItem('@enrolled_courses');
        const enrolled = stored ? JSON.parse(stored) : [];
        const newEnrollment = {
          id: courseId,
          title: courseTitle,
          progress: 5,
          lessonsDone: 1,
          totalLessons: 32,
          nextTopic: 'Module 1: Orientation & Architecture Setup',
          enrolledAt: new Date().toISOString(),
          txn: generatedTxn,
        };

        // Avoid duplicates
        if (!enrolled.some((c: any) => c.id === courseId)) {
          enrolled.unshift(newEnrollment);
          await AsyncStorage.setItem('@enrolled_courses', JSON.stringify(enrolled));
        }
      } catch (err) {
        // continue even if storage fails
      }

      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={48} color="#10B981" />
          </View>
          <Text style={styles.successHeader}>Enrollment Successful! 🎉</Text>
          <Text style={styles.successSub}>
            Welcome to <Text style={{ fontWeight: 'bold', color: Colors.primaryLight }}>{courseTitle}</Text>.
          </Text>

          {/* Receipt Card */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValue}>{transactionId}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount Paid</Text>
              <Text style={[styles.receiptValue, { color: Colors.primary, fontWeight: 'bold' }]}>
                ₹{calculatedTotal}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Payment Method</Text>
              <Text style={styles.receiptValue}>{paymentMethod.toUpperCase()}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Access Status</Text>
              <Text style={[styles.receiptValue, { color: '#10B981', fontWeight: 'bold' }]}>
                UNLOCKED (Lifetime)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.goToDashboardBtn}
            onPress={() => router.replace('/dashboard')}
          >
            <Ionicons name="school" size={20} color="#fff" />
            <Text style={styles.btnTextWhite}>Go to My Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backHomeOutlineBtn}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.btnTextMuted}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backIconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Secure Checkout</Text>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={14} color="#10B981" />
          <Text style={styles.lockText}>256-bit Encrypted</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Course Summary Card */}
        <View style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Course Summary</Text>
          <View style={styles.courseRow}>
            <View style={styles.courseIconBox}>
              <Ionicons name="book" size={22} color={Colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.courseName}>{courseTitle}</Text>
              <Text style={styles.courseMeta}>All Modules • Lifetime Access • Verified Certificate</Text>
            </View>
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Original Tuition</Text>
            <Text style={styles.strikePrice}>₹{basePrice + 1000}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tech Indro Scholarship (-20%)</Text>
            <Text style={styles.discountPrice}>-₹{discount + 1000}</Text>
          </View>
          {couponApplied && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Promo Code (TECHINDRO)</Text>
              <Text style={styles.discountPrice}>-₹200</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{calculatedTotal}</Text>
          </View>
        </View>

        {/* Coupon Code Section */}
        <View style={styles.couponCard}>
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon (e.g. TECHINDRO)"
              placeholderTextColor={Colors.textMuted}
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
              editable={!couponApplied}
            />
            <TouchableOpacity
              style={[styles.applyCouponBtn, couponApplied && styles.couponAppliedBtn]}
              onPress={handleApplyCoupon}
              disabled={couponApplied}
            >
              <Text style={styles.applyCouponText}>{couponApplied ? 'Applied' : 'Apply'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method Selector */}
        <Text style={styles.sectionTitle}>Select Payment Mode</Text>
        <View style={styles.methodTabs}>
          <TouchableOpacity
            style={[styles.methodTab, paymentMethod === 'upi' && styles.methodTabActive]}
            onPress={() => setPaymentMethod('upi')}
          >
            <Ionicons
              name="flash"
              size={18}
              color={paymentMethod === 'upi' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.methodTabText, paymentMethod === 'upi' && styles.methodTabTextActive]}>
              Instant UPI / QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.methodTab, paymentMethod === 'card' && styles.methodTabActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons
              name="card"
              size={18}
              color={paymentMethod === 'card' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.methodTabText, paymentMethod === 'card' && styles.methodTabTextActive]}>
              Debit / Credit Card
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Payment Details */}
        {paymentMethod === 'upi' ? (
          <View style={styles.paymentBox}>
            <Text style={styles.fieldLabel}>Enter UPI ID / VPA</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g. yourname@oksbi or 9876543210@paytm"
              placeholderTextColor={Colors.textMuted}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
            <View style={styles.upiAppsRow}>
              <Text style={styles.upiAppsLabel}>Supported Apps:</Text>
              <View style={styles.appBadge}>
                <Text style={styles.appBadgeText}>GPay</Text>
              </View>
              <View style={styles.appBadge}>
                <Text style={styles.appBadgeText}>PhonePe</Text>
              </View>
              <View style={styles.appBadge}>
                <Text style={styles.appBadgeText}>Paytm</Text>
              </View>
              <View style={styles.appBadge}>
                <Text style={styles.appBadgeText}>BHIM</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.paymentBox}>
            <Text style={styles.fieldLabel}>Card Number</Text>
            <TextInput
              style={styles.inputField}
              placeholder="4532 •••• •••• 8921"
              placeholderTextColor={Colors.textMuted}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.cardDoubleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Valid Thru</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.textMuted}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="•••"
                  placeholderTextColor={Colors.textMuted}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            <Text style={styles.fieldLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Full Name as on Card"
              placeholderTextColor={Colors.textMuted}
              value={cardName}
              onChangeText={setCardName}
            />
          </View>
        )}

        {/* Security badge */}
        <View style={styles.trustFooter}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text style={styles.trustFooterText}>
            100% Refund Guarantee within 7 days if not satisfied.
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payNowBtn, isProcessing && styles.payNowBtnDisabled]}
          onPress={handlePayNow}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.payNowText}>Pay ₹{calculatedTotal} & Unlock Course</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backIconBtn: {
    padding: Spacing.xs,
  },
  topBarTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98122',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  lockText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#10B981',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  orderCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  courseIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  courseMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  strikePrice: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: FontSize.xs,
    color: '#10B981',
    fontWeight: FontWeight.semibold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  totalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primaryLight,
  },
  couponCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  couponInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  applyCouponBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
  },
  couponAppliedBtn: {
    backgroundColor: '#10B981',
  },
  applyCouponText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  methodTabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodTabActive: {
    borderColor: Colors.primary,
    backgroundColor: '#8B5CF61A',
  },
  methodTabText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  methodTabTextActive: {
    color: Colors.primaryLight,
    fontWeight: FontWeight.bold,
  },
  paymentBox: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  inputField: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  upiAppsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  upiAppsLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  appBadge: {
    backgroundColor: Colors.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  appBadgeText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: FontWeight.bold,
  },
  cardDoubleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  trustFooterText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  payNowBtnDisabled: {
    opacity: 0.7,
  },
  payNowText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  // Success Screen
  successScroll: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B98122',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  successHeader: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  successSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  receiptValue: {
    fontSize: FontSize.xs,
    color: Colors.text,
  },
  goToDashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  btnTextWhite: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: '#fff',
  },
  backHomeOutlineBtn: {
    paddingVertical: Spacing.sm,
  },
  btnTextMuted: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
