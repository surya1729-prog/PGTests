import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { ArrowRight, Bell, Bookmark, BookOpen, CheckCircle2, ChevronRight, Clock3, FileText, Home, Library, Search, SlidersHorizontal, UserRound } from 'lucide-react-native';

const exams = [
  { name: 'NEET PG', detail: 'National Eligibility cum Entrance Test', count: '2019–2025', accent: '#0f766e' },
  { name: 'INI-CET', detail: 'Institute of National Importance', count: '2021–2025', accent: '#24558b' },
  { name: 'FMGE', detail: 'Foreign Medical Graduate Examination', count: '2020–2025', accent: '#9a5a18' },
];

const recentPapers = [
  { title: 'NEET PG 2025', type: 'Question paper', date: 'Added 2 days ago', color: '#e7f3f1' },
  { title: 'INI-CET Nov 2024', type: 'Answer key', date: 'Added 5 days ago', color: '#e9eff8' },
  { title: 'FMGE June 2024', type: 'Solutions', date: 'Added 1 week ago', color: '#fbf0df' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const filteredExams = useMemo(
    () => exams.filter((exam) => `${exam.name} ${exam.detail}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, isWide && styles.wideContent]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>+</Text></View>
            <View><Text style={styles.brandName}>MedArchive</Text><Text style={styles.brandSubline}>CLINICAL PAPER LIBRARY</Text></View>
          </View>
          <Pressable style={styles.headerButton}><Bell size={19} color="#27445b" strokeWidth={1.8} /><View style={styles.notificationDot} /></Pressable>
          <Pressable style={styles.profileButton} onPress={() => setActiveTab('Profile')}><Text style={styles.profileButtonText}>S</Text></Pressable>
        </View>

        <View style={styles.introRow}>
          <View><Text style={styles.eyebrow}>GOOD MORNING, STUDENT</Text><Text style={styles.title}>Your revision desk</Text></View>
          <View style={styles.studyStatus}><CheckCircle2 size={15} color="#157a70" /><Text style={styles.studyStatusText}>Ready to study</Text></View>
        </View>

        <View style={styles.searchBox}>
          <Search size={19} color="#718296" strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by exam, year or subject"
            placeholderTextColor="#8b96a5"
            style={styles.searchInput}
          />
          <Pressable style={styles.filterButton}><SlidersHorizontal size={17} color="#37647e" /></Pressable>
        </View>

        <View style={styles.sectionHeading}><View><Text style={styles.sectionKicker}>BROWSE BY EXAM</Text><Text style={styles.sectionTitle}>Examination papers</Text></View><Pressable onPress={() => setActiveTab('Exams')} style={styles.textAction}><Text style={styles.sectionAction}>View all</Text><ArrowRight size={14} color="#0f766e" /></Pressable></View>
        <View style={[styles.examList, isWide && styles.examListWide]}>
          {filteredExams.map((exam) => (
            <Pressable key={exam.name} style={styles.examRow} onPress={() => setActiveTab('Exams')}>
              <View style={[styles.examIcon, { backgroundColor: exam.accent }]}><BookOpen size={18} color="#fff" strokeWidth={1.8} /></View>
              <View style={styles.examCopy}><Text style={styles.examName}>{exam.name}</Text><Text style={styles.examDetail}>{exam.detail}</Text><Text style={styles.examCount}>{exam.count} · papers available</Text></View>
              <ChevronRight size={19} color="#91a0ad" />
            </Pressable>
          ))}
        </View>

        <View style={[styles.sectionHeading, styles.recentHeading]}><View><Text style={styles.sectionKicker}>KEEP GOING</Text><Text style={styles.sectionTitle}>Recently added</Text></View><Pressable onPress={() => setActiveTab('Exams')} style={styles.textAction}><Text style={styles.sectionAction}>See all</Text><ArrowRight size={14} color="#0f766e" /></Pressable></View>
        <View style={styles.paperList}>
          {recentPapers.map((paper) => (
            <Pressable key={paper.title} style={styles.paperRow} onPress={() => setActiveTab('Exams')}>
              <View style={[styles.pdfBadge, { backgroundColor: paper.color }]}><FileText size={18} color="#356477" /></View>
              <View style={styles.paperInfo}><Text style={styles.paperTitle}>{paper.title}</Text><Text style={styles.paperMeta}>{paper.type} · {paper.date}</Text></View>
              <Bookmark size={18} color="#9aa8b5" strokeWidth={1.7} />
            </Pressable>
          ))}
        </View>

        <View style={styles.studyCard}>
          <View style={styles.studyCardIcon}><Clock3 size={19} color="#0f766e" /></View>
          <View style={styles.studyCardCopy}><Text style={styles.studyCardTitle}>Continue your preparation</Text><Text style={styles.studyCardText}>Save a paper to build your personal revision list.</Text></View>
          <ArrowRight size={18} color="#0f766e" />
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        {['Home', 'Exams', 'Saved', 'Profile'].map((tab) => (
          <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            {tab === 'Home' && <Home size={20} color={activeTab === tab ? '#0f766e' : '#9aa7b4'} strokeWidth={activeTab === tab ? 2.2 : 1.8} />}
            {tab === 'Exams' && <Library size={20} color={activeTab === tab ? '#0f766e' : '#9aa7b4'} strokeWidth={activeTab === tab ? 2.2 : 1.8} />}
            {tab === 'Saved' && <Bookmark size={20} color={activeTab === tab ? '#0f766e' : '#9aa7b4'} strokeWidth={activeTab === tab ? 2.2 : 1.8} />}
            {tab === 'Profile' && <UserRound size={20} color={activeTab === tab ? '#0f766e' : '#9aa7b4'} strokeWidth={activeTab === tab ? 2.2 : 1.8} />}
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 },
  wideContent: { width: '100%', maxWidth: 820, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 34 },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#123b55', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#bce6df', fontSize: 23, fontWeight: '700', lineHeight: 26 },
  brandName: { color: '#16364e', fontSize: 16, fontWeight: '800', letterSpacing: 0.1 },
  brandSubline: { color: '#8392a1', fontSize: 7, fontWeight: '800', letterSpacing: 1.1, marginTop: 3 },
  headerButton: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5ebf0' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 5, height: 5, borderRadius: 3, backgroundColor: '#d16b56' },
  profileButton: { marginLeft: 9, width: 36, height: 36, borderRadius: 10, backgroundColor: '#dcefeb', alignItems: 'center', justifyContent: 'center' },
  profileButtonText: { color: '#176a68', fontWeight: '800', fontSize: 13 },
  introRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 },
  eyebrow: { color: '#0f766e', fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 7 },
  title: { color: '#16364e', fontSize: 27, lineHeight: 33, fontWeight: '800' },
  studyStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  studyStatusText: { color: '#157a70', fontSize: 10, fontWeight: '700' },
  searchBox: { height: 50, borderWidth: 1, borderColor: '#dde6ec', backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 6, marginBottom: 32 },
  searchInput: { flex: 1, color: '#16364e', fontSize: 13, marginLeft: 10 },
  filterButton: { width: 38, height: 38, borderRadius: 9, backgroundColor: '#eff6f6', alignItems: 'center', justifyContent: 'center' },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13 },
  recentHeading: { marginTop: 29 },
  sectionKicker: { color: '#82919e', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginBottom: 5 },
  sectionTitle: { color: '#16364e', fontSize: 18, fontWeight: '800' },
  textAction: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 2 },
  sectionAction: { color: '#0f766e', fontSize: 11, fontWeight: '800' },
  examList: { gap: 9 },
  examListWide: { flexDirection: 'row', flexWrap: 'wrap' },
  examRow: { minHeight: 76, flexGrow: 1, flexBasis: 240, backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e3eaf0', flexDirection: 'row', alignItems: 'center', padding: 12 },
  examIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  examCopy: { flex: 1, marginLeft: 12 },
  examName: { color: '#16364e', fontSize: 14, fontWeight: '800', marginBottom: 3 },
  examDetail: { color: '#6d7d8c', fontSize: 10, lineHeight: 14 },
  examCount: { color: '#0f766e', fontSize: 9, fontWeight: '700', marginTop: 4 },
  paperList: { gap: 8, marginBottom: 24 },
  paperRow: { minHeight: 66, backgroundColor: '#fff', borderRadius: 13, borderWidth: 1, borderColor: '#e3eaf0', flexDirection: 'row', alignItems: 'center', padding: 11 },
  pdfBadge: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  paperInfo: { flex: 1, marginLeft: 12 },
  paperTitle: { color: '#16364e', fontSize: 13, fontWeight: '800' },
  paperMeta: { color: '#82919e', fontSize: 10, marginTop: 4 },
  studyCard: { minHeight: 70, backgroundColor: '#eaf5f3', borderRadius: 13, padding: 13, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d4ebe6' },
  studyCardIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  studyCardCopy: { flex: 1, marginLeft: 11 },
  studyCardTitle: { color: '#164d55', fontSize: 12, fontWeight: '800' },
  studyCardText: { color: '#628189', fontSize: 10, marginTop: 4 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e4ebef', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  tab: { alignItems: 'center', width: 70, gap: 5 },
  tabLabel: { color: '#9aa7b4', fontSize: 10, fontWeight: '700' },
  tabLabelActive: { color: '#0f766e' },
});
