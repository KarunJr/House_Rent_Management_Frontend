import { Fonts } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    color: '#333',
  },
  inputbox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  errorText: { color: 'red', fontSize: 12, marginTop: 2 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },

  registerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.sans,
  },
  registerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});
