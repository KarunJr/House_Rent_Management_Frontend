import { useRef, useState } from 'react';
import { contactTenant } from '@/features/tenant/contact';
import { useDatePreferenceStore } from '@/features/settings/date-preference.store';
import { formatCanonicalDateForMode } from '@/features/settings/date.utils';
import { formatFloor } from '../utils/format';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from './ui/Avatar';
import { RoomCardDetails } from '@/features/room/room.types';

interface RoomDetailScreenProps {
  room: RoomCardDetails;
  onBack: () => void;
  onEdit: () => void;
  onEndLease: () => void;
  onTenantPress: (tenantId: string) => void;
}

const formatCurrency = (amount: number) => `रू ${amount.toLocaleString('en-IN')}`;

const getAccentColor = (status: RoomCardDetails['status']) => {
  switch (status) {
    case 'Occupied':
      return '#22C7B8';
    case 'Available':
      return '#F59E0B';
    case 'Maintenance':
      return '#F97316';
    default:
      return '#64748B';
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
  onBack,
  onEdit,
  onEndLease,
  onTenantPress,
}: RoomDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const calendarMode = useDatePreferenceStore((state) => state.calendarMode);
  const [isContacting, setIsContacting] = useState(false);
  const contactInProgress = useRef(false);
  const handleContact = async (action: 'tel' | 'sms') => {
    if (!room.activeLease || contactInProgress.current) return;
    contactInProgress.current = true;
    setIsContacting(true);
    try {
      await contactTenant(room.activeLease.tenant.id, action);
    } finally {
      contactInProgress.current = false;
      setIsContacting(false);
    }
  };
  const accentColor = getAccentColor(room.status);
  const activeLease = room.activeLease;
  const tenant = activeLease?.tenant;
  const isReserved = room.hasLease && !activeLease;
  const isVacant = room.status === 'Available' && !room.hasLease && room.activeLease === null;
  const isMaintenance = room.status === 'Maintenance';
  const currentRent = room.activeLease?.monthlyRent ?? room.baseRentAmount;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: activeLease
              ? Math.max(insets.bottom + 96, 118)
              : Math.max(insets.bottom + 24, 32),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.heroShell}>
              <View style={styles.heroHeader}>
                <View style={styles.heroTopBar}>
                  <Pressable onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={18} color="#0F172A" />
                  </Pressable>

                  <View style={styles.heroActions}>
                    <View style={[styles.floorChip, { backgroundColor: accentColor }]}>
                      <Text style={styles.floorChipText}>{formatFloor(room.floorId)}</Text>
                    </View>
                    <Pressable onPress={onEdit} style={styles.editButton}>
                      <Ionicons name="pencil-outline" size={18} color="#0F172A" />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.heroTitleBlock}>
                  <Text style={styles.heroTitle}>Room {room.roomName}</Text>
                  <Text style={styles.heroSubtitle}>
                    {isMaintenance
                      ? 'Maintenance in progress'
                      : isVacant
                        ? 'Available for new tenant'
                        : isReserved ? 'Reserved for a tenant' : activeLease ? 'Active rental unit' : 'Room unavailable'}
                  </Text>
                </View>
              </View>

              <View style={styles.heroCard}>
                <View style={styles.specRow}>
                  <SpecItem icon="layers-outline" value={room.floorId} label="Floor" />
                  <SpecItem icon="person-outline" value={activeLease ? '1' : '0'} label="Tenant" />
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

              {!activeLease ? (
                <View style={styles.card}>
                  <View style={styles.emptyStateIcon}>
                    <Ionicons name="person-add-outline" size={24} color={accentColor} />
                  </View>
                  <Text style={styles.emptyStateTitle}>
                    {isMaintenance ? 'Room unavailable right now' : isReserved ? 'Room reserved' : 'No tenant assigned'}
                  </Text>
                  <Text style={styles.emptyStateText}>
                    {isMaintenance
                      ? 'Assigning a tenant will make sense after maintenance is complete.'
                      : isReserved ? 'This room already has a lease reservation.'
                        : isVacant ? 'This room is open and ready for a new lease.' : 'This room is not available for a new lease.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.card}>
                  <Pressable
                    onPress={() => onTenantPress(activeLease.tenant.id)}
                    style={styles.tenantHeader}
                  >
                    <Avatar name={activeLease.tenant.name} size={50} />

                    <View style={styles.tenantMeta}>
                      <Text style={styles.tenantName}>{tenant?.name}</Text>
                      <Text style={styles.tenantLine}>
                        Tenant since {formatCanonicalDateForMode(activeLease.startDate, calendarMode)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </Pressable>

                  <View style={styles.tenantActions}>
                    <Pressable accessibilityRole="button" disabled={isContacting} onPress={() => handleContact('tel')} style={[styles.primaryAction, { opacity: isContacting ? 0.5 : 1 }]}>
                      <Ionicons name="call-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Call</Text>
                    </Pressable>

                    <Pressable accessibilityRole="button" disabled={isContacting} onPress={() => handleContact('sms')} style={[styles.secondaryAction, { borderColor: accentColor, opacity: isContacting ? 0.5 : 1 }]}>
                      <Ionicons name="chatbubble-outline" size={16} color={accentColor} />
                      <Text style={[styles.secondaryActionText, { color: accentColor }]}>
                        Message
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

          </View>
        </ScrollView>

        {activeLease ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <View style={styles.footerActions}>
              <Pressable onPress={onEndLease} style={styles.endLeaseButton}>
                <Ionicons name="log-out-outline" size={17} color="#B91C1C" />
                <Text style={styles.endLeaseButtonText}>End Lease</Text>
              </Pressable>
            </View>
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
  heroHeader: {
    height: 220,
    borderRadius: 30,
    backgroundColor: '#0D1F3C',
    justifyContent: 'space-between',
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
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'rgba(238, 242, 246, 0.96)',
    paddingTop: 12,
  },
  footerActions: {
    gap: 10,
  },
  endLeaseButton: {
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  endLeaseButtonText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '800',
  },
});
