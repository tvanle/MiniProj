import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bg: { flex: 1 },
  scroll: { padding: 20, paddingTop: 56, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  headerIcon: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#F8FAFC', letterSpacing: 0.5 },
  headerSub: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  card: {
    backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#3B82F6',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 8,
  },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A',
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#334155',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, color: '#F1F5F9', fontSize: 15 },
  row: { flexDirection: 'row' },
  radioRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A',
    borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: '#334155',
  },
  radioRowActive: { borderColor: '#3B82F6', backgroundColor: '#172554' },
  radioDot: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#475569',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  radioDotActive: { borderColor: '#3B82F6' },
  radioDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  radioLabel: { fontSize: 15, fontWeight: '600', color: '#CBD5E1' },
  radioLabelActive: { color: '#F8FAFC' },
  radioSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  radioPrice: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  radioPriceActive: { color: '#F59E0B' },
  bookBtn: {
    borderRadius: 14, height: 52, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
  },
  bookBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  resultCard: {
    backgroundColor: '#1E293B', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  resultHeader: {
    padding: 20, alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center', gap: 10,
  },
  resultTitle: { fontSize: 18, fontWeight: '800', color: '#F8FAFC' },
  resultBody: { padding: 20 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  resultLabel: { flex: 1, fontSize: 14, color: '#94A3B8', fontWeight: '500' },
  resultValue: { fontSize: 14, fontWeight: '700', color: '#F1F5F9' },
  totalText: { color: '#F59E0B', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
});
