import { Linking } from 'react-native';
import { toast } from '@/components/toast';
import { getTenantApi } from './tenant.api';

type ContactAction = 'tel' | 'sms' | 'mailto';

export async function openContact(action: ContactAction, value: string | null) {
  const recipient = value?.trim();
  if (!recipient) {
    toast.error(action === 'mailto' ? 'No email address provided.' : 'No phone number provided.');
    return;
  }
  try {
    await Linking.openURL(`${action}:${encodeURIComponent(recipient)}`);
  } catch {
    toast.error('Unable to open a contact app on this device.');
  }
}

export async function contactTenant(id: string, action: 'tel' | 'sms') {
  try {
    const { data } = await getTenantApi(id);
    await openContact(action, data.phone);
  } catch {
    toast.error('Unable to load tenant contact details. Please try again.');
  }
}
