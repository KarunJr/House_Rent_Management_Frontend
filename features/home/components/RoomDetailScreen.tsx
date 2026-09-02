import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BillInvoice, Payment, RoomWithDetails } from '../home.types';
import { Avatar } from './ui/Avatar';
import Badge from './ui/StatusBadge';

interface RoomDetailScreenProps {
  room: RoomWithDetails;
  invoiceHistory: BillInvoice[];
  payments: Payment[];
  onBack: () => void;
  onEdit: () => void;
}

const ROOM_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=900&fit=crop&auto=format',
  2: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&h=900&fit=crop&auto=format',
  3: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=900&fit=crop&auto=format',
};

const floorLabel = (floorNumber: number) => {
  if (floorNumber === 1) return '1st Floor';
  if (floorNumber === 2) return '2nd Floor';
  if (floorNumber === 3) return '3rd Floor';

  return `${floorNumber}th Floor`;
};

const formatCurrency = (amount: number) => `रू ${amount.toLocaleString('en-IN')}`;

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatMonthYear = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

const getAccentColor = (status: RoomWithDetails['status']) => {
  switch (status) {
    case 'OCCUPIED':
      return '#22C7B8';
    case 'AVAILABLE':
      return '#F59E0B';
    case 'MAINTENANCE':
      return '#F97316';
    default:
      return '#64748B';
  }
};

// const getBadgeStatus = (room: RoomWithDetails) => {
//   if (room.status === 'MAINTENANCE') return 'maintenance' as const;
//   if (room.status === 'AVAILABLE' || room.active_lease === null) return 'vacant' as const;
//   if (room.current_invoice?.status === 'PAID') return 'paid' as const;
//   if (room.current_invoice?.status === 'PARTIAL') return 'partial' as const;
//   if (room.current_invoice?.status === 'OVERDUE') return 'overdue' as const;
//   if (room.current_invoice?.status === 'CANCELLED') return 'cancelled' as const;
//   return 'pending' as const;
// };

const paymentTone = (status: BillInvoice['status']) => {
  switch (status) {
    case 'PAID':
      return {
        iconBg: '#E8FBF5',
        iconColor: '#10B981',
        amountColor: '#10B981',
        badge: 'paid' as const,
      };
    case 'OVERDUE':
      return {
        iconBg: '#FEF2F2',
        iconColor: '#EF4444',
        amountColor: '#DC2626',
        badge: 'overdue' as const,
      };
    case 'PARTIAL':
      return {
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        amountColor: '#2563EB',
        badge: 'partial' as const,
      };
    case 'CANCELLED':
      return {
        iconBg: '#F3F4F6',
        iconColor: '#6B7280',
        amountColor: '#4B5563',
        badge: 'cancelled' as const,
      };
    default:
      return {
        iconBg: '#FFFBEB',
        iconColor: '#D97706',
        amountColor: '#B45309',
        badge: 'pending' as const,
      };
  }
};

const SpecItem = ({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) => (
  <View style={styles.specItem}>
    <Ionicons name={icon} size={16} color="#94A3B8" />
    <Text style={styles.specValue}>{value}</Text>
    <Text style={styles.specLabel}>{label}</Text>
  </View>
);

export default function RoomDetailScreen({
  room,
  invoiceHistory,
  payments,
  onBack,
  onEdit,
}: RoomDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const accentColor = getAccentColor(room.status);
  const isVacant = room.status === 'AVAILABLE' || room.active_lease === null;
  const isMaintenance = room.status === 'MAINTENANCE';
  const heroImage = ROOM_IMAGES[room.floor.floor_number] ?? ROOM_IMAGES[1];
  const currentRent = room.active_lease?.monthly_rent ?? room.base_rent_amount;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: isVacant
              ? Math.max(insets.bottom + 24, 32)
              : Math.max(insets.bottom + 96, 118),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.heroShell}>
              <ImageBackground
                source={{ uri: heroImage }}
                style={styles.heroImage}
                imageStyle={styles.heroImageBorder}
              >
                <LinearGradient
                  colors={[
                    'rgba(15, 23, 42, 0.66)',
                    'rgba(15, 23, 42, 0.1)',
                    'rgba(15, 23, 42, 0)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />

                <View style={[styles.heroTopBar, { paddingTop: Math.max(insets.top, 10) }]}>
                  <Pressable onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={18} color="#0F172A" />
                  </Pressable>

                  <View style={styles.heroActions}>
                    <View style={[styles.floorChip, { backgroundColor: accentColor }]}>
                      <Text style={styles.floorChipText}>{floorLabel(room.floor.floor_number)}</Text>
                    </View>
                    <Pressable onPress={onEdit} style={styles.editButton}>
                      <Ionicons name="pencil-outline" size={18} color="#0F172A" />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.heroTitleBlock}>
                  <Text style={styles.heroTitle}>Room {room.room_name}</Text>
                  <Text style={styles.heroSubtitle}>
                    {isMaintenance
                      ? 'Maintenance in progress'
                      : isVacant
                        ? 'Available for new tenant'
                        : 'Active rental unit'}
                  </Text>
                </View>
              </ImageBackground>

              <View style={styles.heroCard}>
                <View style={styles.specRow}>
                  <SpecItem
                    icon="layers-outline"
                    value={String(room.floor.floor_number)}
                    label="Floor"
                  />
                  <SpecItem icon="person-outline" value={isVacant ? '0' : '1'} label="Tenant" />
                  {/* <SpecItem
                    icon="document-text-outline"
                    value={currentInvoice ? formatMonthYear(currentInvoice.billing_month).split(' ')[0] : 'No'}
                    label="Invoice"
                  /> */}
                  <View style={styles.rentBlock}>
                    <Text style={styles.rentAmount}>{formatCurrency(currentRent)}</Text>
                    <Text style={styles.rentSuffix}>/mo</Text>
                  </View>
                </View>

                {isMaintenance && (
                  <Text style={styles.descriptionText}>
                    This room is temporarily unavailable while service work is being completed.
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TENANT</Text>

              {isVacant ? (
                <View style={styles.card}>
                  <View style={styles.emptyStateIcon}>
                    <Ionicons name="person-add-outline" size={24} color={accentColor} />
                  </View>
                  <Text style={styles.emptyStateTitle}>
                    {isMaintenance ? 'Room unavailable right now' : 'No tenant assigned'}
                  </Text>
                  <Text style={styles.emptyStateText}>
                    {isMaintenance
                      ? 'Assigning a tenant will make sense after maintenance is complete.'
                      : 'This room is open and ready for a new lease.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.card}>
                  <View style={styles.tenantHeader}>
                    <Avatar name={room.tenant!.name} size={50} />

                    <View style={styles.tenantMeta}>
                      <Text style={styles.tenantName}>{room.tenant!.name}</Text>
                      <Text style={styles.tenantLine}>{room.tenant!.phone}</Text>
                      <Text style={styles.tenantLine}>
                        Tenant since {formatMonthYear(room.active_lease!.start_date)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tenantActions}>
                    <Pressable style={styles.primaryAction}>
                      <Ionicons name="call-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Call</Text>
                    </Pressable>

                    <Pressable style={[styles.secondaryAction, { borderColor: accentColor }]}>
                      <Ionicons name="chatbubble-outline" size={16} color={accentColor} />
                      <Text style={[styles.secondaryActionText, { color: accentColor }]}>
                        Message
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PAYMENT HISTORY</Text>
                <Text style={styles.floorChip}>View All</Text>
              </View>

              <View style={styles.card}>
                {invoiceHistory.length === 0 ? (
                  <Text style={styles.emptyListText}>No invoices recorded for this room yet.</Text>
                ) : (
                  invoiceHistory.map((invoice, index) => {
                    const tone = paymentTone(invoice.status);
                    const payment = payments.find((item) => item.invoice_id === invoice.id) ?? null;

                    return (
                      <View
                        key={invoice.id}
                        style={[
                          styles.paymentRow,
                          index < invoiceHistory.length - 1 ? styles.paymentRowBorder : null,
                        ]}
                      >
                        <View style={styles.paymentLeft}>
                          <View style={[styles.paymentIcon, { backgroundColor: tone.iconBg }]}>
                            <Ionicons
                              name="document-text-outline"
                              size={16}
                              color={tone.iconColor}
                            />
                          </View>

                          <View style={styles.paymentTextWrap}>
                            <Text style={styles.paymentMonth}>
                              {formatMonthYear(invoice.billing_month)}
                            </Text>
                            <Text style={styles.paymentDate}>
                              {payment
                                ? `Paid on ${formatShortDate(payment.paid_at)}`
                                : invoice.due_date
                                  ? `Due on ${formatShortDate(invoice.due_date)}`
                                  : 'Payment not recorded yet'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.paymentRight}>
                          <Text style={[styles.paymentAmount, { color: tone.amountColor }]}>
                            {formatCurrency(invoice.total_amount)}
                          </Text>
                          <Badge status={tone.badge} size="sm" />
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>ROOM DETAILS</Text>

              <View style={styles.card}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Room status</Text>
                  <Text style={styles.infoValue}>
                    {room.status.charAt(0) + room.status.slice(1).toLowerCase()}
                  </Text>
                </View>
                <View style={[styles.infoRow, styles.infoBorder]}>
                  <Text style={styles.infoLabel}>Base rent</Text>
                  <Text style={styles.infoValue}>{formatCurrency(room.base_rent_amount)}</Text>
                </View>
                <View style={[styles.infoRow, styles.infoBorder]}>
                  <Text style={styles.infoLabel}>Current invoice</Text>
                  <Text style={styles.infoValue}>
                    {currentInvoice ? formatCurrency(currentInvoice.total_amount) : 'Not available'}
                  </Text>
                </View>
                <View style={[styles.infoRow, styles.infoBorder]}>
                  <Text style={styles.infoLabel}>Latest payment</Text>
                  <Text style={styles.infoValue}>
                    {currentPayment
                      ? `${formatCurrency(currentPayment.amount)}`
                      : 'Not recorded'}
                  </Text>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>

        {!isVacant ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <Pressable style={[styles.footerButton, { backgroundColor: accentColor }]}>
              <Text style={styles.footerButtonText}>Record New Payment</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2F6',
  },
  screen: {
    flex: 1,
    backgroundColor: '#EEF2F6',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 18,
  },
  heroShell: {
    gap: 0,
  },
  heroImage: {
    height: 260,
    justifyContent: 'space-between',
  },
  heroImageBorder: {
    borderRadius: 30,
  },
  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  floorChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleBlock: {
    paddingHorizontal: 18,
    paddingBottom: 94,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    fontWeight: '600',
  },
  heroCard: {
    marginTop: -54,
    marginHorizontal: 12,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specItem: {
    width: 56,
    alignItems: 'center',
    marginRight: 12,
  },
  specValue: {
    marginTop: 8,
    color: '#334155',
    fontSize: 16,
    fontWeight: '800',
  },
  specLabel: {
    marginTop: 2,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  rentBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: 2,
  },
  rentAmount: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  rentSuffix: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  descriptionText: {
    marginTop: 16,
    color: '#475569',
    fontSize: 15,
    lineHeight: 23,
  },
  section: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  emptyStateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyStateTitle: {
    marginTop: 14,
    textAlign: 'center',
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
  },
  emptyStateText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
  },
  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenantMeta: {
    marginLeft: 14,
    flex: 1,
  },
  tenantName: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  tenantLine: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 14,
  },
  tenantActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  paymentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMonth: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  paymentDate: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyListText: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  infoBorder: {
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'rgba(238, 242, 246, 0.96)',
    paddingTop: 12,
  },
  footerButton: {
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
