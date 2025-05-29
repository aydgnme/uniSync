import { Platform, StyleSheet } from 'react-native';

export const SETTINGS_CONSTANTS = {
  CARD_BG: '#fff',
  CARD_RADIUS: 18,
  PRIMARY: 'rgb(0, 122, 255)',
  BG: '#f7f7fa',
  CARD_SHADOW: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SETTINGS_CONSTANTS.BG,
  },
  bg: {
    flex: 1,
    backgroundColor: SETTINGS_CONSTANTS.BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 8,
    backgroundColor: SETTINGS_CONSTANTS.BG,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    minHeight: 56,
  },
  card: {
    backgroundColor: SETTINGS_CONSTANTS.CARD_BG,
    borderRadius: SETTINGS_CONSTANTS.CARD_RADIUS,
    borderBottomLeftRadius: SETTINGS_CONSTANTS.CARD_RADIUS,
    borderBottomRightRadius: SETTINGS_CONSTANTS.CARD_RADIUS,
    marginBottom: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...SETTINGS_CONSTANTS.CARD_SHADOW,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: SETTINGS_CONSTANTS.CARD_BG,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
  },
}); 