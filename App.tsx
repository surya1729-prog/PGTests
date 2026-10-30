import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const exams = [
  { name: 'NEET PG', detail: 'National Eligibility cum Entrance Test', papers: 'Explore papers', tone: '#e6f4f2' },
  { name: 'INI-CET', detail: 'Institute of National Importance', papers: 'Explore papers', tone: '#eaf0fb' },
  { name: 'FMGE', detail: 'Foreign Medical Graduate Examination', papers: 'Explore papers', tone: '#fff4df' },
  { name: 'Other exams', detail: 'More postgraduate entrance papers', papers: 'Browse collection', tone: '#f0edf8' },
];

const recentPapers = [
  { title: 'NEET PG 2025', type: 'Question paper', meta: 'Added recently' },
  { title: 'INI-CET Nov 2024', type: 'Answer key', meta: 'Added recently' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const filteredExams = useMemo(
    () => exams.filter((exam) => `${exam.name} ${exam.detail}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>+</Text></View>
          <View>
            <Text style={styles.brandName}>MedArchive</Text>
            <Text style={styles.brandSubline}>POSTGRADUATE PREP</Text>
          </View>
          <Pressable style={styles.profileButton} onPress={() => setActiveTab('Profile')}>
            <Text style={styles.profileButtonText}>S</Text>
          </Pressable>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.eyebrow}>YOUR STUDY LIBRARY</Text>
          <Text style={styles.title}>Find the paper that{ '\n' }moves you forward.</Text>
          <Text style={styles.subtitle}>Previous-year papers, answer keys and solutions in one focused place.</Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search exams, years or subjects"
            placeholderTextColor="#8b96a5"
            style={styles.searchInput}
          />
        </View>

        <SectionHeading title="Choose an examination" action="View all" onPress={() => setActiveTab('Exams')} />
        <View style={styles.examGrid}>
          {filteredExams.map((exam) => (
            <Pressable key={exam.name} style={[styles.examCard, { backgroundColor: exam.tone }]} onPress={() => setActiveTab('Exams')}>
              <View style={styles.examIcon}><Text style={styles.examIconText}>{exam.name === 'FMGE' ? 'F' : exam.name === 'INI-CET' ? 'I' : 'N'}</Text></View>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDetail}>{exam.detail}</Text>
              <Text style={styles.examAction}>{exam.papers}  →</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeading title="Recently added" action="See all" onPress={() => setActiveTab('Exams')} />
        <View style={styles.paperList}>
          {recentPapers.map((paper) => (
            <Pressable key={paper.title} style={styles.paperRow} onPress={() => setActiveTab('Exams')}>
              <View style={styles.pdfBadge}><Text style={styles.pdfBadgeText}>PDF</Text></View>
              <View style={styles.paperInfo}><Text style={styles.paperTitle}>{paper.title}</Text><Text style={styles.paperMeta}>{paper.type} · {paper.meta}</Text></View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.emptyPanel}>
          <Text style={styles.emptyEyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.emptyTitle}>Save papers for later.</Text>
          <Text style={styles.emptyCopy}>Sign in to sync favourites across your devices and keep your revision list close.</Text>
          <Pressable style={styles.outlineButton} onPress={() => setActiveTab('Profile')}><Text style={styles.outlineButtonText}>Open profile  →</Text></Pressable>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        {['Home', 'Exams', 'Saved', 'Profile'].map((tab) => (
          <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabIcon, activeTab === tab && styles.tabIconActive]}>{tab === 'Home' ? '⌂' : tab === 'Exams' ? '▦' : tab === 'Saved' ? '♡' : '◉'}</Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ title, action, onPress }: { title: string; action: string; onPress: () => void }) {
  return <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}</Text><Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}  →</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 112 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#12304a', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#b8e4dc', fontSize: 25, fontWeight: '700', lineHeight: 28 },
  brandName: { color: '#12304a', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
  brandSubline: { color: '#8190a0', fontSize: 8, fontWeight: '700', letterSpacing: 1.4, marginTop: 2 },
  profileButton: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: '#d8e9e7', alignItems: 'center', justifyContent: 'center' },
  profileButtonText: { color: '#176a68', fontWeight: '800' },
  welcomeBlock: { marginTop: 42, marginBottom: 23 },
  eyebrow: { color: '#208783', fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#12304a', fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#6f7d8c', fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 330 },
  searchBox: { height: 52, borderWidth: 1, borderColor: '#e2e8ef', backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 32 },
  searchIcon: { fontSize: 27, color: '#7f8e9d', marginRight: 9, marginTop: -4 },
  searchInput: { flex: 1, color: '#12304a', fontSize: 14 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: '#12304a', fontSize: 18, fontWeight: '800' },
  sectionAction: { color: '#208783', fontSize: 12, fontWeight: '700' },
  examGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  examCard: { width: '48%', minHeight: 177, borderRadius: 18, padding: 15 },
  examIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  examIconText: { color: '#12304a', fontSize: 15, fontWeight: '800' },
  examName: { color: '#12304a', fontSize: 16, fontWeight: '800', marginBottom: 5 },
  examDetail: { color: '#647384', fontSize: 11, lineHeight: 15, minHeight: 31 },
  examAction: { color: '#176a68', fontSize: 11, fontWeight: '800', marginTop: 13 },
  paperList: { gap: 10, marginBottom: 32 },
  paperRow: { minHeight: 69, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e7edf2', flexDirection: 'row', alignItems: 'center', padding: 12 },
  pdfBadge: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fbe9e5', alignItems: 'center', justifyContent: 'center' },
  pdfBadgeText: { color: '#b6534c', fontSize: 10, fontWeight: '900' },
  paperInfo: { flex: 1, marginLeft: 12 },
  paperTitle: { color: '#17344c', fontSize: 14, fontWeight: '800' },
  paperMeta: { color: '#8190a0', fontSize: 11, marginTop: 4 },
  chevron: { color: '#91a0ad', fontSize: 25, marginRight: 3 },
  emptyPanel: { backgroundColor: '#12304a', borderRadius: 20, padding: 20, marginTop: 2 },
  emptyEyebrow: { color: '#9fd4cc', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  emptyTitle: { color: '#fff', fontSize: 21, fontWeight: '800', marginTop: 10 },
  emptyCopy: { color: '#c4d2dc', fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 290 },
  outlineButton: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#638797', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10, marginTop: 17 },
  outlineButtonText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e7edf2', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  tab: { alignItems: 'center', width: 70 },
  tabIcon: { color: '#9aa7b4', fontSize: 21, height: 28 },
  tabIconActive: { color: '#208783' },
  tabLabel: { color: '#9aa7b4', fontSize: 10, fontWeight: '700' },
  tabLabelActive: { color: '#208783' },
});
