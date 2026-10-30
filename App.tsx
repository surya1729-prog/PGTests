import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { ArrowLeft, ArrowRight, Bell, Bookmark, BookOpen, CheckCircle2, ChevronRight, Clock3, FileText, Home, Library, Search, SlidersHorizontal, UserRound, X } from 'lucide-react-native';

type Exam = { name: string; detail: string; count: string; accent: string };
type Paper = { title: string; type: string; date: string; color: string };

const exams: Exam[] = [
  { name: 'NEET PG', detail: 'National Eligibility cum Entrance Test', count: '2019–2025', accent: '#0f766e' },
  { name: 'INI-CET', detail: 'Institute of National Importance', count: '2021–2025', accent: '#24558b' },
  { name: 'FMGE', detail: 'Foreign Medical Graduate Examination', count: '2020–2025', accent: '#9a5a18' },
];

const recentPapers: Paper[] = [
  { title: 'NEET PG 2025', type: 'Question paper', date: 'Added 2 days ago', color: '#e7f3f1' },
  { title: 'INI-CET Nov 2024', type: 'Answer key', date: 'Added 5 days ago', color: '#e9eff8' },
  { title: 'FMGE June 2024', type: 'Solutions', date: 'Added 1 week ago', color: '#fbf0df' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const isDesktop = width >= 960;
  const filteredExams = useMemo(
    () => exams.filter((exam) => `${exam.name} ${exam.detail}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const filteredPapers = useMemo(
    () => recentPapers.filter((paper) => `${paper.title} ${paper.type}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const toggleSaved = (title: string) => {
    setSavedPapers((current) => current.includes(title) ? current.filter((paper) => paper !== title) : [...current, title]);
  };

  const openExam = (examName: string) => {
    setSelectedExam(examName);
    setActiveTab('Exams');
  };

  const openPaper = (title: string) => setSelectedPaper(title);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, isWide && styles.wideContent]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>+</Text></View>
            <View><Text style={styles.brandName}>MedArchive</Text><Text style={styles.brandSubline}>CLINICAL PAPER LIBRARY</Text></View>
          </View>
          <Pressable style={styles.headerButton} onPress={() => setShowNotifications((visible) => !visible)}><Bell size={19} color="#27445b" strokeWidth={1.8} /><View style={styles.notificationDot} /></Pressable>
          <Pressable style={styles.profileButton} onPress={() => setActiveTab('Profile')}><Text style={styles.profileButtonText}>S</Text></Pressable>
        </View>

        {showNotifications && <View style={styles.popover}><Text style={styles.popoverTitle}>Notifications</Text><Text style={styles.popoverText}>New papers will appear here when published.</Text><Pressable onPress={() => setShowNotifications(false)}><Text style={styles.popoverAction}>Dismiss</Text></Pressable></View>}

        {activeTab === 'Home' && !selectedPaper && <View style={styles.introRow}>
          <View><Text style={styles.eyebrow}>GOOD MORNING, STUDENT</Text><Text style={styles.title}>Your revision desk</Text></View>
          <View style={styles.studyStatus}><CheckCircle2 size={15} color="#157a70" /><Text style={styles.studyStatusText}>Ready to study</Text></View>
        </View>}

        {activeTab === 'Home' && !selectedPaper && <View style={styles.searchBox}>
          <Search size={19} color="#718296" strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by exam, year or subject"
            placeholderTextColor="#8b96a5"
            style={styles.searchInput}
          />
          <Pressable style={[styles.filterButton, showFilters && styles.filterButtonActive]} onPress={() => setShowFilters((visible) => !visible)}><SlidersHorizontal size={17} color="#37647e" /></Pressable>
        </View>}

        {showFilters && activeTab === 'Home' && <View style={styles.filterPanel}><Text style={styles.filterPanelTitle}>Filter papers</Text><View style={styles.filterOptions}><Pressable style={styles.filterChip} onPress={() => setShowFilters(false)}><Text style={styles.filterChipText}>All years</Text></Pressable><Pressable style={styles.filterChip} onPress={() => setShowFilters(false)}><Text style={styles.filterChipText}>Question papers</Text></Pressable><Pressable style={styles.filterChip} onPress={() => setShowFilters(false)}><Text style={styles.filterChipText}>Solutions</Text></Pressable></View></View>}

        {activeTab !== 'Home' && !selectedPaper && <WorkspaceView activeTab={activeTab} selectedExam={selectedExam} savedPapers={savedPapers} onBack={() => { setActiveTab('Home'); setSelectedExam(null); }} onOpenExam={openExam} onOpenPaper={openPaper} onToggleSaved={toggleSaved} />}
        {selectedPaper && <PaperView title={selectedPaper} isSaved={savedPapers.includes(selectedPaper)} onBack={() => setSelectedPaper(null)} onToggleSaved={() => toggleSaved(selectedPaper)} />}

        {activeTab === 'Home' && !selectedPaper && <><View style={styles.sectionHeading}><View><Text style={styles.sectionKicker}>BROWSE BY EXAM</Text><Text style={styles.sectionTitle}>Examination papers</Text></View><Pressable onPress={() => setActiveTab('Exams')} style={styles.textAction}><Text style={styles.sectionAction}>View all</Text><ArrowRight size={14} color="#0f766e" /></Pressable></View>
        <View style={[styles.examList, isWide && styles.examListWide, isDesktop && styles.examListDesktop]}>
          {filteredExams.map((exam) => (
            <Pressable key={exam.name} style={styles.examRow} onPress={() => openExam(exam.name)}>
              <View style={[styles.examIcon, { backgroundColor: exam.accent }]}><BookOpen size={18} color="#fff" strokeWidth={1.8} /></View>
              <View style={styles.examCopy}><Text style={styles.examName}>{exam.name}</Text><Text style={styles.examDetail}>{exam.detail}</Text><Text style={styles.examCount}>{exam.count} · papers available</Text></View>
              <ChevronRight size={19} color="#91a0ad" />
            </Pressable>
          ))}
        </View>

        <View style={[styles.sectionHeading, styles.recentHeading]}><View><Text style={styles.sectionKicker}>KEEP GOING</Text><Text style={styles.sectionTitle}>Recently added</Text></View><Pressable onPress={() => setActiveTab('Exams')} style={styles.textAction}><Text style={styles.sectionAction}>See all</Text><ArrowRight size={14} color="#0f766e" /></Pressable></View>
        <View style={styles.paperList}>
          {filteredPapers.map((paper) => (
            <Pressable key={paper.title} style={styles.paperRow} onPress={() => openPaper(paper.title)}>
              <View style={[styles.pdfBadge, { backgroundColor: paper.color }]}><FileText size={18} color="#356477" /></View>
              <View style={styles.paperInfo}><Text style={styles.paperTitle}>{paper.title}</Text><Text style={styles.paperMeta}>{paper.type} · {paper.date}</Text></View>
              <Pressable onPress={() => toggleSaved(paper.title)} hitSlop={10}><Bookmark size={18} color={savedPapers.includes(paper.title) ? '#0f766e' : '#9aa8b5'} fill={savedPapers.includes(paper.title) ? '#0f766e' : 'none'} strokeWidth={1.7} /></Pressable>
            </Pressable>
          ))}
        </View>

        <View style={styles.studyCard}>
          <View style={styles.studyCardIcon}><Clock3 size={19} color="#0f766e" /></View>
          <View style={styles.studyCardCopy}><Text style={styles.studyCardTitle}>Continue your preparation</Text><Text style={styles.studyCardText}>Save a paper to build your personal revision list.</Text></View>
          <ArrowRight size={18} color="#0f766e" />
        </View>
        </>}
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

function WorkspaceView({ activeTab, selectedExam, savedPapers, onBack, onOpenExam, onOpenPaper, onToggleSaved }: { activeTab: string; selectedExam: string | null; savedPapers: string[]; onBack: () => void; onOpenExam: (name: string) => void; onOpenPaper: (title: string) => void; onToggleSaved: (title: string) => void }) {
  const paperItems = recentPapers.filter((paper) => !selectedExam || paper.title.startsWith(selectedExam.split(' ')[0]));
  const visiblePapers = activeTab === 'Saved' ? recentPapers.filter((paper) => savedPapers.includes(paper.title)) : paperItems;
  const heading = activeTab === 'Saved' ? 'Saved papers' : activeTab === 'Profile' ? 'Your profile' : selectedExam || 'All examinations';
  const kicker = activeTab === 'Saved' ? 'YOUR LIBRARY' : activeTab === 'Profile' ? 'ACCOUNT' : 'EXAMINATION LIBRARY';

  return <View style={styles.workspace}>
    <Pressable style={styles.backButton} onPress={onBack}><ArrowLeft size={16} color="#0f766e" /><Text style={styles.backButtonText}>Back to home</Text></Pressable>
    <Text style={styles.eyebrow}>{kicker}</Text>
    <Text style={styles.workspaceTitle}>{heading}</Text>
    {activeTab === 'Profile' ? <ProfilePanel /> : <View style={styles.workspaceList}>
      {visiblePapers.map((paper) => <PaperRow key={paper.title} paper={paper} isSaved={savedPapers.includes(paper.title)} onOpen={() => onOpenPaper(paper.title)} onToggle={() => onToggleSaved(paper.title)} />)}
      {activeTab === 'Saved' && savedPapers.length === 0 && <Text style={styles.emptyText}>No saved papers yet. Tap the bookmark beside a paper to keep it here.</Text>}
      {activeTab === 'Exams' && !selectedExam && <View style={styles.examList}>{exams.map((exam) => <ExamRow key={exam.name} exam={exam} onOpen={() => onOpenExam(exam.name)} />)}</View>}
    </View>}
  </View>;
}

function PaperRow({ paper, isSaved, onOpen, onToggle }: { paper: Paper; isSaved: boolean; onOpen: () => void; onToggle: () => void }) {
  return <Pressable style={styles.paperRow} onPress={onOpen}><View style={[styles.pdfBadge, { backgroundColor: paper.color }]}><FileText size={18} color="#356477" /></View><View style={styles.paperInfo}><Text style={styles.paperTitle}>{paper.title}</Text><Text style={styles.paperMeta}>{paper.type} · {paper.date}</Text></View><Pressable onPress={onToggle} hitSlop={10}><Bookmark size={18} color={isSaved ? '#0f766e' : '#9aa8b5'} fill={isSaved ? '#0f766e' : 'none'} /></Pressable></Pressable>;
}

function ExamRow({ exam, onOpen }: { exam: Exam; onOpen: () => void }) {
  return <Pressable style={styles.examRow} onPress={onOpen}><View style={[styles.examIcon, { backgroundColor: exam.accent }]}><BookOpen size={18} color="#fff" /></View><View style={styles.examCopy}><Text style={styles.examName}>{exam.name}</Text><Text style={styles.examDetail}>{exam.detail}</Text><Text style={styles.examCount}>{exam.count} · papers available</Text></View><ChevronRight size={19} color="#91a0ad" /></Pressable>;
}

function ProfilePanel() {
  return <View style={styles.profilePanel}><View style={styles.largeAvatar}><Text style={styles.profileButtonText}>S</Text></View><Text style={styles.profileName}>Student account</Text><Text style={styles.profileMeta}>Sign in to sync your papers and progress.</Text><Pressable style={styles.primaryAction} onPress={() => Alert.alert('Sign in', 'Authentication will connect to Supabase in the next step.')}><Text style={styles.primaryActionText}>Sign in</Text></Pressable></View>;
}

function PaperView({ title, isSaved, onBack, onToggleSaved }: { title: string; isSaved: boolean; onBack: () => void; onToggleSaved: () => void }) {
  return <View style={styles.paperView}><Pressable style={styles.backButton} onPress={onBack}><ArrowLeft size={16} color="#0f766e" /><Text style={styles.backButtonText}>Back to papers</Text></Pressable><View style={styles.paperHero}><View style={styles.largePdfBadge}><FileText size={28} color="#0f766e" /></View><Text style={styles.workspaceTitle}>{title}</Text><Text style={styles.paperViewMeta}>PDF resource · Available to read</Text><View style={styles.paperActions}><Pressable style={styles.primaryAction} onPress={() => Alert.alert('Open paper', 'PDF viewing will load from Supabase Storage after the paper is published.')}><Text style={styles.primaryActionText}>Open paper</Text></Pressable><Pressable style={styles.secondaryAction} onPress={onToggleSaved}><Bookmark size={16} color="#0f766e" fill={isSaved ? '#0f766e' : 'none'} /><Text style={styles.secondaryActionText}>{isSaved ? 'Saved' : 'Save paper'}</Text></Pressable></View></View><View style={styles.viewerPlaceholder}><FileText size={28} color="#94a4b2" /><Text style={styles.viewerTitle}>PDF viewer ready</Text><Text style={styles.viewerText}>Connect this resource to Supabase Storage to load the document here.</Text></View></View>;
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
  popover: { position: 'absolute', top: 64, right: 20, zIndex: 5, width: 235, padding: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dfe8ed', shadowColor: '#17344c', shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  popoverTitle: { color: '#16364e', fontSize: 13, fontWeight: '800' },
  popoverText: { color: '#70808d', fontSize: 11, lineHeight: 16, marginTop: 6 },
  popoverAction: { color: '#0f766e', fontSize: 11, fontWeight: '800', marginTop: 10 },
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
  filterButtonActive: { backgroundColor: '#d9eeeb' },
  filterPanel: { padding: 13, marginTop: -20, marginBottom: 25, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dfe8ed' },
  filterPanelTitle: { color: '#16364e', fontSize: 12, fontWeight: '800', marginBottom: 10 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  filterChip: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#eff6f6' },
  filterChipText: { color: '#27666b', fontSize: 10, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13 },
  recentHeading: { marginTop: 29 },
  sectionKicker: { color: '#82919e', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginBottom: 5 },
  sectionTitle: { color: '#16364e', fontSize: 18, fontWeight: '800' },
  textAction: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 2 },
  sectionAction: { color: '#0f766e', fontSize: 11, fontWeight: '800' },
  examList: { gap: 9 },
  examListWide: { flexDirection: 'row', flexWrap: 'wrap' },
  examListDesktop: { gap: 12 },
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
  workspace: { paddingTop: 2, paddingBottom: 35 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 26 },
  backButtonText: { color: '#0f766e', fontSize: 12, fontWeight: '800' },
  workspaceTitle: { color: '#16364e', fontSize: 27, lineHeight: 33, fontWeight: '800', marginBottom: 22 },
  workspaceList: { gap: 9 },
  emptyText: { color: '#70808d', fontSize: 12, lineHeight: 18, padding: 16, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e3eaf0' },
  profilePanel: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e3eaf0', padding: 24 },
  largeAvatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#dcefeb', alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  profileName: { color: '#16364e', fontSize: 16, fontWeight: '800' },
  profileMeta: { color: '#70808d', fontSize: 12, marginTop: 6, textAlign: 'center' },
  primaryAction: { backgroundColor: '#0f766e', borderRadius: 9, paddingVertical: 11, paddingHorizontal: 22, marginTop: 18 },
  primaryActionText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  paperView: { paddingTop: 2, paddingBottom: 35 },
  paperHero: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e3eaf0', padding: 20, alignItems: 'center' },
  largePdfBadge: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#e7f3f1', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  paperViewMeta: { color: '#70808d', fontSize: 11, marginTop: -13, marginBottom: 18 },
  paperActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  secondaryAction: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#cfe2df', borderRadius: 9, paddingVertical: 10, paddingHorizontal: 12 },
  secondaryActionText: { color: '#0f766e', fontSize: 11, fontWeight: '800' },
  viewerPlaceholder: { alignItems: 'center', justifyContent: 'center', minHeight: 180, marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: '#e3eaf0', borderStyle: 'dashed', backgroundColor: '#f5f8fa' },
  viewerTitle: { color: '#506978', fontSize: 13, fontWeight: '800', marginTop: 10 },
  viewerText: { color: '#84939d', fontSize: 11, marginTop: 5, textAlign: 'center', maxWidth: 250 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e4ebef', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 },
  tab: { alignItems: 'center', width: 70, gap: 5 },
  tabLabel: { color: '#9aa7b4', fontSize: 10, fontWeight: '700' },
  tabLabelActive: { color: '#0f766e' },
});
