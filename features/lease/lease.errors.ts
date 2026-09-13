import { isAxiosError } from 'axios';
import { handleError } from '@/helpers/axios.error';

type LeaseField = 'roomId' | 'tenantId' | 'startDate' | 'monthlyRent' | 'endDate';
const fieldNames: Record<string, LeaseField> = {
  roomid: 'roomId',
  tenantid: 'tenantId',
  startdate: 'startDate',
  monthlyrent: 'monthlyRent',
  enddate: 'endDate',
};

export function getLeaseError(error: unknown) {
  const failure = handleError(error);
  const fieldErrors: Partial<Record<LeaseField, string>> = {};
  const errors = isAxiosError(error) ? error.response?.data?.errors : undefined;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    for (const [key, messages] of Object.entries(errors)) {
      const field = fieldNames[key.split('.').pop()?.toLowerCase() ?? ''];
      if (field && Array.isArray(messages) && typeof messages[0] === 'string') {
        fieldErrors[field] = messages[0];
      }
    }
  }
  return { ...failure, fieldErrors };
}
