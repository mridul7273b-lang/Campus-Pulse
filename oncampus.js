/**
 * AIT PUNE — CAMPUSPULSE PLATFORM ENGINE
 * Connected to Firebase Backend (Auth & Firestore)
 * Configured according to ait-pune-—-campus-vision (1)
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  increment, 
  collection, 
  onSnapshot,
  runTransaction 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================================================
// 1. FIREBASE CONFIGURATION (Exact config from ait-pune-—-campus-vision (1))
// ============================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyCX-CYyC8bkCU3uR3mNUo1Q8kgwDlf4wuQ",
  authDomain: "campus-pluse.firebaseapp.com",
  projectId: "campus-pluse",
  storageBucket: "campus-pluse.firebasestorage.app",
  messagingSenderId: "224673219709",
  appId: "1:224673219709:web:7091479aa1cbe18a0f1d14"
};

// Initialize Firebase App & Services
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Expose instances globally for console diagnostics
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firestoreDb = db;
  console.log('%c🔥 Firebase Online:', 'color:#059669; font-weight:bold; font-size:12px;', firebaseConfig.projectId);
}

// ============================================================================
// 2. INITIAL SEED DATA (Curated real AIT Pune data)
// ============================================================================
export const INITIAL_POSTS = [
  {
    id: 'post-1',
    type: 'notice',
    title: 'Innerve 2026: 36-Hour Hackathon Registration is Live',
    content: 'All divisions are welcome. Hardware & AI tracks supported in Ramanujan Lab. Free midnight mess snacks included for shortlisted teams! Register on ERP portal link.',
    authorId: 'sys-devansh',
    author: 'Devansh (OSS Lead)',
    authorRole: 'Club Lead',
    authorEmail: 'oss@aitpune.edu.in',
    taggedClub: '@oss',
    category: 'Club Events',
    location: 'Ramanujan Block - Lab 3',
    timestamp: '25m ago',
    upvotes: 84,
    upvotedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'Secy Technical (Final Year)',
    commentsCount: 19
  },
  {
    id: 'post-2',
    type: 'lost_found',
    title: 'Found: Casio fx-991CW Calculator & Library ID',
    content: 'Left behind on Table 14 in Central Digital Library 2nd floor after 4 PM DSA class. Left with the library front-desk assistant.',
    authorId: 'sys-priya',
    author: 'Priya Nair',
    authorRole: 'Student',
    authorEmail: 'priya_24@aitpune.edu.in',
    category: 'Lost & Found',
    location: 'Central Digital Library',
    timestamp: '1h ago',
    upvotes: 42,
    upvotedBy: [],
    commentsCount: 6
  },
  {
    id: 'post-3',
    type: 'help',
    title: 'Advice needed: SPPU Autonomous Electives for 6th Sem',
    content: 'Confused between Cloud Native Arch vs Edge AI. Which one has better lab evaluation and syllabus relevance for Pune campus placements?',
    authorId: 'sys-rohan',
    author: 'Rohan Deshmukh',
    authorRole: 'Student',
    authorEmail: 'rohan_23@aitpune.edu.in',
    taggedClub: '@seniors',
    category: 'Academic Query',
    timestamp: '3h ago',
    upvotes: 31,
    upvotedBy: [],
    isVerifiedBySenior: true,
    verifiedBy: 'Aditya S. (Microsoft SDE)',
    commentsCount: 14
  },
  {
    id: 'post-4',
    type: 'peer_favor',
    title: 'Urgent: Sharing Uber/Ola cab to Pune Junction at 6:30 AM',
    content: 'Going home for midsem break. Split cab from Dighi Main Gate. 2 seats open, ping me before 10 PM.',
    authorId: 'sys-karan',
    author: 'Karan Mehra',
    authorRole: 'Senior',
    authorEmail: 'karan_22@aitpune.edu.in',
    category: 'Peer Favors',
    location: 'Dighi Gate Exit',
    timestamp: '5h ago',
    upvotes: 18,
    upvotedBy: [],
    commentsCount: 8
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'comm-1',
    postId: 'post-1',
    content: 'Are team formations allowed across first-year and second-year cohorts?',
    authorId: 'sys-rohan',
    authorName: 'Rohan Deshmukh',
    authorRole: 'Student',
    createdAt: '2026-10-24T12:00:00.000Z',
    timestamp: '2h ago'
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    content: 'Yes! Cross-batch teams are permitted. Make sure all members register with college email IDs.',
    authorId: 'sys-devansh',
    authorName: 'Devansh (OSS Lead)',
    authorRole: 'Club Lead',
    createdAt: '2026-10-24T13:00:00.000Z',
    timestamp: '1h ago'
  },
  {
    id: 'comm-3',
    postId: 'post-2',
    content: 'Collected it from the front desk just now. Thank you so much for returning it!',
    authorId: 'sys-arjun',
    authorName: 'Arjun K.',
    authorRole: 'Student',
    createdAt: '2026-10-24T14:30:00.000Z',
    timestamp: '30m ago'
  }
];

export const INITIAL_ISSUES = [
  {
    id: 'ISS-101',
    title: 'Severe packet drops & Wi-Fi mesh disconnection in H-3 Wing B',
    description: 'Access point on 2nd floor corridor keeps dropping connection every 10 mins during 8 PM - 11 PM study hours.',
    category: 'Wi-Fi',
    location: 'Hostel 3, 2nd Floor Corridor',
    facilityKey: 'hostel',
    status: 'In Progress',
    reporterId: 'sys-tushar',
    reporter: 'Tushar K.',
    reporterRole: 'Student',
    timestamp: '2h ago',
    upvotes: 49,
    duplicateNotice: '3 other students flagged AP-H3-04 today'
  },
  {
    id: 'ISS-102',
    title: 'Water filter low pressure & cooling coil failure near OAT',
    description: 'Drinking water dispenser near Open Air Amphitheatre is dispensing warm water with barely any flow.',
    category: 'Hostel & Water',
    location: 'OAT Quadrangle Water Point',
    facilityKey: 'sports',
    status: 'Assigned',
    reporterId: 'sys-manish',
    reporter: 'Manish S.',
    reporterRole: 'Senior',
    timestamp: '4h ago',
    upvotes: 28
  },
  {
    id: 'ISS-103',
    title: 'AC temperature control locked at 16°C in Library Reading Hall',
    description: 'Thermostat in the quiet reading zone is uncomfortably cold with no wall switch working.',
    category: 'Cleanliness',
    location: 'Central Digital Library - Quiet Hall',
    facilityKey: 'library',
    status: 'Fixed',
    reporterId: 'sys-sneha',
    reporter: 'Sneha R.',
    reporterRole: 'Student',
    timestamp: '1d ago',
    upvotes: 62
  }
];

export const INITIAL_MARKETPLACE = [
  {
    id: 'mkt-1',
    title: 'Higher Engineering Mathematics — B.S. Grewal (44th Edition)',
    price: 320,
    category: 'Textbooks',
    condition: 'Good',
    description: 'Standard textbook for SPPU Autonomous M-1 & M-2. No torn pages, pencil annotations included for endsem prep.',
    sellerId: 'sys-sameer',
    sellerName: 'Sameer J.',
    sellerRole: 'Senior',
    sellerContact: '9823411223',
    sellerLocation: 'H-2, Room 314',
    timestamp: '2h ago',
    isSold: false
  },
  {
    id: 'mkt-2',
    title: 'Official White Lab Coat (Size 40) + Chemistry Goggles',
    price: 180,
    category: 'Lab Equipment',
    condition: 'Like New',
    description: 'Used only for 1 semester in FE chemistry lab. Clean and washed.',
    sellerId: 'sys-kunal',
    sellerName: 'Kunal R.',
    sellerRole: 'Student',
    sellerContact: '9890123456',
    sellerLocation: 'H-3, Wing A',
    timestamp: '4h ago',
    isSold: false
  },
  {
    id: 'mkt-3',
    title: 'Prestige 1.5L Stainless Steel Electric Kettle',
    price: 450,
    category: 'Hostel Gear',
    condition: 'Like New',
    description: 'Lifesaver for night tea & Maggi during midsem weeks. Auto-cut switch works perfectly.',
    sellerId: 'sys-aniket',
    sellerName: 'Aniket V.',
    sellerRole: 'Senior',
    sellerContact: '9765432109',
    sellerLocation: 'H-1, Room 108',
    timestamp: '1d ago',
    isSold: false
  }
];

export const CAMPUS_FACILITIES = [
  { key: 'hostel', name: 'Hostels & Mess', activeIssues: 2, icon: '🏠' },
  { key: 'library', name: 'Digital Library', activeIssues: 1, icon: '📚' },
  { key: 'labs', name: 'Academic & Labs', activeIssues: 0, icon: '🔬' },
  { key: 'sports', name: 'Sports & OAT', activeIssues: 1, icon: '⚽' },
  { key: 'gate', name: 'Dighi Gate & Plazas', activeIssues: 0, icon: '📍' }
];

export const MOCK_CLUBS = [
  {
    id: 'club-oss',
    tag: '@oss',
    name: 'Open Source Software & Coding Club',
    domain: 'Technical',
    lead: 'Devansh & Ananya (4th Yr Comp)',
    membersCount: 420,
    description: 'Drives competitive programming sprints, Linux install fests, and annual Innerve hackathon.'
  },
  {
    id: 'club-robotics',
    tag: '@robotics',
    name: 'AIT Robotics Club',
    domain: 'Robotics',
    lead: 'Arjun K. (4th Yr ARE)',
    membersCount: 260,
    description: 'Constructs combat robots, pneumatic manipulators, and autonomous rovers for Robocon.'
  },
  {
    id: 'club-ecell',
    tag: '@ecell',
    name: 'AIT e-Cell (Entrepreneurship)',
    domain: 'Entrepreneurship',
    lead: 'Sarthak (4th Yr IT)',
    membersCount: 310,
    description: 'Incubation network supporting student founders with prototypes, pitch decks, and AWES grants.'
  },
  {
    id: 'club-cultural',
    tag: '@cultural',
    name: 'Cultural & Literary Guild',
    domain: 'Cultural',
    lead: 'Meera (4th Yr E&TC)',
    membersCount: 380,
    description: 'Organizers of AIT flagship inter-college festival PACE, music bands, and debate leagues.'
  },
  {
    id: 'club-gdsc',
    tag: '@gdsc',
    name: 'Google Developer Student Club (GDSC)',
    domain: 'Technical',
    lead: 'Rohan Deshmukh (4th Yr Comp)',
    membersCount: 350,
    description: 'Android study jams, Google Cloud skill badges, Solution Challenge mentorship & Web3 workshops.'
  },
  {
    id: 'club-sae',
    tag: '@sae',
    name: 'SAE Collegiate Club & Motorsports',
    domain: 'Robotics',
    lead: 'Vikram Joshi (4th Yr Mech)',
    membersCount: 210,
    description: 'Design and fabrication of all-terrain vehicles (ATVs) for BAJA SAE India & electric race-car prototypes.'
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'CampusLens: Autonomous SLAM Rover for Campus 3D Mapping',
    domain: 'Robotics',
    stage: 'Capstone In-Progress',
    leadName: 'Arjun Kulkarni',
    leadRole: 'Senior · BE ARE 2026',
    leadContact: '9876543210',
    leadEmail: 'arjun_are@aitpune.edu.in',
    abstract: 'Developing a ROS2-powered 4WD autonomous rover equipped with Livox LiDAR and stereo cameras for high-precision 3D point-cloud mapping of AIT Pune Ramanujan & Dighi grounds.',
    techStack: ['ROS2', 'Python', 'C++', 'LiDAR SLAM', 'Jetson Orin'],
    membersNeeded: 'Looking for 1x Embedded firmware developer (STM32/CAN bus) & 1x WebGL visualizer for campus dashboard.',
    helpNeeded: 'Seeking guidance from 4th-year seniors on sensor-fusion Kalman filters and faculty guide review for SPPU thesis format.',
    timestamp: '2h ago',
    upvotes: 38,
    reviews: [
      {
        id: 'rev-101',
        author: 'Siddharth Joshi',
        role: 'Senior Mentor · BE Comp 2025',
        rating: 5,
        comment: 'Brilliant sensor selection with the Livox mid-360. Make sure to implement RTAB-Map with loop-closure detection to prevent drift around the OAT perimeter.',
        timestamp: '1h ago'
      },
      {
        id: 'rev-102',
        author: 'Prof. Guide Reviewer',
        role: 'Faculty / Project Guide',
        rating: 4,
        comment: 'Strong hardware design. Focus your midsem presentation on the autonomous obstacle avoidance benchmark in crowded canteen corridors.',
        timestamp: '30m ago'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'CloudPulse: Distributed ERP Microservices & Gate Pass Automation',
    domain: 'Full-Stack',
    stage: 'Prototype In-Dev',
    leadName: 'Ayush Kaswa',
    leadRole: 'Junior · TE Comp 2027',
    leadContact: '9823011223',
    leadEmail: 'ayush_23100@aitpune.edu.in',
    abstract: 'High-throughput event-driven microservices architecture to automate hostel biometric gate passes, digital library book loans, and mess meal token reconciliation in real-time.',
    techStack: ['Go (Golang)', 'Next.js', 'PostgreSQL', 'Redis', 'Docker'],
    membersNeeded: 'Recruiting 1x Frontend React/Next engineer for responsive student pass interface & 1x QA tester for load simulation.',
    helpNeeded: 'Need senior guidance on JWT refresh-token rotation strategies under flaky mobile network handoffs at Dighi gate.',
    timestamp: '5h ago',
    upvotes: 27,
    reviews: [
      {
        id: 'rev-201',
        author: 'Rohan Sharma',
        role: 'Senior Mentor · BE IT 2026',
        rating: 5,
        comment: 'Golang concurrency channels will easily handle the 5:30 PM gate rush. Recommend caching active outpass tokens in Redis cluster with a 15-minute TTL.',
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'SmartGrid LoRaWAN: Campus Solar Telemetry & Energy Auditor',
    domain: 'IoT/Hardware',
    stage: 'Capstone In-Progress',
    leadName: 'Nikhil Patil',
    leadRole: 'Senior · BE E&TC 2026',
    leadContact: '9765431188',
    leadEmail: 'nikhil_etc@aitpune.edu.in',
    abstract: 'Long-range low-power sensor mesh monitoring rooftop photovoltaic arrays across AIT academic blocks, detecting panel dusting loss and inverter efficiency drops.',
    techStack: ['ESP32', 'LoRaWAN', 'InfluxDB', 'Grafana', 'MQTT'],
    membersNeeded: 'Seeking 1x Junior (SE/TE) interested in PCB routing with KiCAD and Grafana alerting pipeline setup.',
    helpNeeded: 'Advice on antenna radiation patterns on metal tin hostel roofs to maximize signal reach to Central Library gateway.',
    timestamp: '1d ago',
    upvotes: 34,
    reviews: [
      {
        id: 'rev-301',
        author: 'Ananya Verma',
        role: 'Senior Mentor · BE ARE 2025',
        rating: 5,
        comment: 'Tested similar LoRa modules on H-1 roof last year. Ground plane reflection from solar frames will cause multi-path fading; elevate antenna mast by 1.2m.',
        timestamp: '18h ago'
      },
      {
        id: 'rev-302',
        author: 'Devansh (OSS Lead)',
        role: 'Club Lead · OSS/Robotics',
        rating: 4,
        comment: 'Great initiative! We can host the Grafana dashboard on our OSS club local server rack for campus-wide visibility.',
        timestamp: '12h ago'
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'SentinelGuard: Zero-Trust Kerberos & Host-Based Intrusion Detection',
    domain: 'CyberSec',
    stage: 'Concept / Ideation',
    leadName: 'Tanvi Mehra',
    leadRole: 'Junior · TE IT 2027',
    leadContact: '9988776655',
    leadEmail: 'tanvi_it@aitpune.edu.in',
    abstract: 'Lightweight eBPF-based host security daemon detecting anomalous privilege escalation and unencrypted lateral movement across campus computer lab subnets.',
    techStack: ['Rust', 'eBPF', 'Linux Kernel', 'Prometheus'],
    membersNeeded: 'Urgent need for 2x teammates: 1x Systems programmer with Rust basics & 1x Technical documentation lead.',
    helpNeeded: 'Looking for a 4th-year senior who has cleared OSCP/CEH or has experience writing eBPF probes in Linux 6.x.',
    timestamp: '2d ago',
    upvotes: 19,
    reviews: [
      {
        id: 'rev-401',
        author: 'Karan Mehra',
        role: 'Senior Mentor · BE Comp 2026',
        rating: 4,
        comment: 'Using eBPF eliminates user-space overhead completely. Check Cilium architecture docs for inspiration on kernel tracepoint hooks.',
        timestamp: '1d ago'
      }
    ]
  }
];

// ============================================================================
// 3. APPLICATION STATE
// ============================================================================
let currentUser = null;
let userProfile = null;
let activeTab = 'feed'; // 'feed' | 'issues' | 'marketplace' | 'clubs' | 'seniors'
let searchQuery = '';
let feedCategoryFilter = 'all';
let issueStatusFilter = 'all';
let facilityFilter = 'all';
let marketCategoryFilter = 'all';

let projectDomainFilter = 'all';
let projectNeedFilter = 'all'; // 'all' | 'members' | 'help' | 'toprated'
let projectSortOrder = 'recent'; // 'recent' | 'upvotes' | 'rating'
function loadCachedArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map();
        fallback.forEach(item => map.set(item.id, item));
        parsed.forEach(item => map.set(item.id, item));
        return Array.from(map.values());
      }
    }
  } catch (_) {}
  return [...fallback];
}

let postsData = loadCachedArray('oncampus_posts_cache', INITIAL_POSTS);
let commentsData = loadCachedArray('oncampus_comments_cache', INITIAL_COMMENTS);
const openCommentPosts = new Set();
let issuesData = [...INITIAL_ISSUES];
let marketData = [...INITIAL_MARKETPLACE];
let projectsData = [...INITIAL_PROJECTS];

let selectedContactItem = null;
let currentModalPostType = 'help';
let clubSearchQuery = '';
let clubDomainFilter = 'all';
let clubNoticeFilter = 'all';

// ============================================================================
// 4. TOAST NOTIFICATION UTILITY
// ============================================================================
export function showToast(message) {
  let toast = document.getElementById('pulse-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pulse-toast';
    toast.className = 'pulse-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span class="toast-dot"></span>
    <span class="toast-msg">${message}</span>
  `;
  toast.classList.add('visible');
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

// ============================================================================
// 5. AUTHENTICATION LOGIC & FIRESTORE PROFILE SYNC
// ============================================================================
export async function initializeAuth() {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          userProfile = snap.data();
        } else {
          // Construct default profile
          const initialProfile = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'AIT Student',
            email: user.email || '',
            role: 'Student',
            branch: 'Computer Engineering',
            year: '3rd Year',
            postCount: 0,
            profileViews: 1,
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(userRef, initialProfile);
          } catch (_) {}
          userProfile = initialProfile;
        }
      } catch (err) {
        console.warn('Firestore profile fallback:', err);
        userProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Ayush Kaswa',
          email: user.email || 'student@aitpune.edu.in',
          role: 'Student',
          branch: 'Computer Engineering',
          year: '3rd Year',
          postCount: 2,
          profileViews: 24,
          createdAt: new Date().toISOString()
        };
      }
    } else {
      userProfile = null;
    }
    updateAuthUI();
    renderAllViews();
  });

  // Setup Firestore real-time snapshot listeners for posts, issues, marketplace
  setupFirestoreListeners();
}

function setupFirestoreListeners() {
  try {
    const postsRef = collection(db, 'posts');
    onSnapshot(postsRef, (snapshot) => {
      try {
        const fetched = snapshot.docs.map(d => {
          const data = d.data();
          const title = (data.title || '').trim();
          const content = (data.content || data['content '] || '').trim();
          const author = (data.author || data.authorName || 'Student').trim();
          const upvotes = typeof data.upvotes === 'number' ? data.upvotes : (parseInt(data.upvotes, 10) || 0);
          const commentsCount = typeof data.commentsCount === 'number' ? data.commentsCount : (parseInt(data.commentsCount, 10) || 0);

          return {
            id: d.id,
            type: data.type || 'help',
            title,
            content,
            authorId: data.authorId || '',
            author,
            authorName: author,
            authorRole: data.authorRole || 'Student',
            authorEmail: data.authorEmail || '',
            taggedClub: data.taggedClub || undefined,
            category: data.category || 'Peer Query',
            location: data.location || undefined,
            createdAt: data.createdAt || new Date().toISOString(),
            timestamp: data.timestamp || 'Recently',
            upvotes,
            upvotedBy: Array.isArray(data.upvotedBy) ? data.upvotedBy : [],
            commentsCount,
            isVerifiedBySenior: Boolean(data.isVerifiedBySenior),
            verifiedBy: data.verifiedBy || undefined
          };
        }).filter(p => p.title.length > 0 || p.content.length > 0);

        console.log(`🔥 [Firestore Posts] Synced ${fetched.length} live posts from cloud database`);

        // Merge with seed ensuring no duplicates
        const map = new Map();
        INITIAL_POSTS.forEach(p => map.set(p.id, p));
        fetched.forEach(p => map.set(p.id, p));
        postsData = Array.from(map.values()).sort((a,b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        try { localStorage.setItem('oncampus_posts_cache', JSON.stringify(postsData)); } catch (_) {}
        renderFeed();
      } catch (err) {
        console.error('❌ Error parsing posts snapshot:', err);
      }
    }, (err) => console.warn('Firestore posts note:', err.message));
  } catch (e) {
    console.error('Firestore posts listener error:', e);
  }

  try {
    const commentsRef = collection(db, 'comments');
    onSnapshot(commentsRef, (snapshot) => {
      try {
        const fetched = snapshot.docs.map(d => {
          const data = d.data();
          const content = (data.content || data['content '] || '').trim();
          const author = (data.authorName || data.author || 'Student').trim();
          return {
            id: d.id,
            postId: data.postId || '',
            content,
            authorId: data.authorId || '',
            authorName: author,
            authorRole: data.authorRole || 'Student',
            createdAt: data.createdAt || new Date().toISOString(),
            timestamp: data.timestamp || 'Recently'
          };
        }).filter(c => c.content.length > 0 && c.postId.length > 0);

        console.log(`💬 [Firestore Comments] Synced ${fetched.length} live comments`);

        const map = new Map();
        INITIAL_COMMENTS.forEach(c => map.set(c.id, c));
        fetched.forEach(c => map.set(c.id, c));
        commentsData = Array.from(map.values()).sort((a,b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeA - timeB;
        });
        try { localStorage.setItem('oncampus_comments_cache', JSON.stringify(commentsData)); } catch (_) {}
        renderFeed();
      } catch (err) {
        console.error('❌ Error parsing comments snapshot:', err);
      }
    }, (err) => console.warn('Firestore comments note:', err.message));
  } catch (e) {
    console.error('Firestore comments listener error:', e);
  }

  try {
    const issuesRef = collection(db, 'issues');
    onSnapshot(issuesRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            firestoreId: d.id,
            rawId: data.id || d.id,
            upvotes: typeof data.upvotes === 'number' ? data.upvotes : (parseInt(data.upvotes, 10) || 1)
          };
        });
        const map = new Map();
        INITIAL_ISSUES.forEach(i => map.set(i.id, i));
        fetched.forEach(i => map.set(i.rawId || i.id, i));
        issuesData = Array.from(map.values());
        renderIssues();
      }
    }, (err) => console.warn('Firestore issues note:', err.message));
  } catch (_) {}

  try {
    const marketRef = collection(db, 'marketplace');
    onSnapshot(marketRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            firestoreId: d.id,
            rawId: data.id || d.id
          };
        });
        const map = new Map();
        INITIAL_MARKETPLACE.forEach(m => map.set(m.id, m));
        fetched.forEach(m => map.set(m.id, m));
        marketData = Array.from(map.values());
        renderMarketplace();
      }
    }, (err) => console.warn('Firestore market note:', err.message));
  } catch (_) {}

  try {
    const projectsRef = collection(db, 'projects');
    onSnapshot(projectsRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            firestoreId: d.id,
            rawId: data.id || d.id,
            upvotes: typeof data.upvotes === 'number' ? data.upvotes : (parseInt(data.upvotes, 10) || 0),
            reviews: Array.isArray(data.reviews) ? data.reviews : [],
            techStack: Array.isArray(data.techStack) ? data.techStack : [data.domain || 'Tech']
          };
        });
        const map = new Map();
        INITIAL_PROJECTS.forEach(p => map.set(p.id, p));
        fetched.forEach(p => map.set(p.id, p));
        projectsData = Array.from(map.values());
        const countBadge = document.getElementById('senior-projects-count-badge');
        if (countBadge) countBadge.textContent = projectsData.length;
        renderProjects();
      }
    }, (err) => console.warn('Firestore projects note:', err.message));
  } catch (_) {}
}

// Sign in with credentials
export async function handleSignIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    showToast('Signed in to ON CAMPUS!');
    closeAuthModal();
  } catch (err) {
    console.error('Sign-in error:', err);
    throw new Error(err.message || 'Could not sign in. Verify email & password.');
  }
}

// Sign up with student role, branch, year
export async function handleSignUp(data) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
    const user = cred.user;
    const prof = {
      uid: user.uid,
      name: data.name.trim() || 'AIT Student',
      email: data.email.trim(),
      role: data.role || 'Student',
      branch: data.branch || 'Computer Engineering',
      year: data.year || '3rd Year',
      postCount: 0,
      profileViews: 1,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', user.uid), prof);
    } catch (_) {}
    userProfile = prof;
    showToast(`Welcome to ON CAMPUS, ${prof.name}!`);
    closeAuthModal();
  } catch (err) {
    console.error('Sign-up error:', err);
    throw new Error(err.message || 'Registration failed.');
  }
}

// Sign in with Google Account (Popup Provider)
export async function handleGoogleSignIn() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;

    // Check or create user profile in Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const prof = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'AIT Student',
          email: user.email || '',
          role: 'Student',
          branch: 'Computer Engineering',
          year: '3rd Year',
          postCount: 0,
          profileViews: 1,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, prof);
        userProfile = prof;
      } else {
        userProfile = snap.data();
      }
    } catch (dbErr) {
      console.warn('Firestore Google profile sync note:', dbErr);
    }

    showToast(`Signed in with Google as ${user.displayName || user.email}!`);
    closeAuthModal();
    return user;
  } catch (err) {
    console.error('Google Sign-In error:', err);
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      showToast('Google sign-in popup was closed.');
      return null;
    }
    const errBox = document.getElementById('auth-signin-error') || document.getElementById('auth-signup-error');
    if (errBox) {
      errBox.style.display = 'block';
      errBox.textContent = `Google Sign-In: ${err.message || 'Authentication failed'}`;
    }
    showToast(`Google Sign-In: ${err.message || 'Authentication failed'}`);
    throw err;
  }
}

// Fast 1-click Demo Profiles
export async function handleDemoSignIn(role = 'Student') {
  const demoEmail = role === 'Senior' ? 'senior.ait@aitpune.edu.in' : 'student.ait@aitpune.edu.in';
  const demoPass = 'CampusPulse@2026';
  try {
    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch (notFound) {
      const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
      const demoProf = {
        uid: cred.user.uid,
        name: role === 'Senior' ? 'Arjun Rathore (4th Yr BE)' : 'Ayush Kaswa (3rd Yr TE)',
        email: demoEmail,
        role: role,
        branch: 'Computer Engineering',
        year: role === 'Senior' ? 'Final Year' : '3rd Year',
        postCount: role === 'Senior' ? 5 : 2,
        profileViews: role === 'Senior' ? 48 : 24,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), demoProf);
      userProfile = demoProf;
    }
    showToast(`Signed in as Demo ${role}!`);
    closeAuthModal();
  } catch (err) {
    // Optimistic fallback for network restriction
    userProfile = {
      uid: `demo-${role.toLowerCase()}`,
      name: role === 'Senior' ? 'Arjun Rathore (4th Yr BE)' : 'Ayush Kaswa (3rd Yr TE)',
      email: demoEmail,
      role: role,
      branch: 'Computer Engineering',
      year: role === 'Senior' ? 'Final Year' : '3rd Year',
      postCount: role === 'Senior' ? 5 : 2,
      profileViews: role === 'Senior' ? 48 : 24,
      createdAt: new Date().toISOString()
    };
    currentUser = { uid: userProfile.uid, email: demoEmail };
    updateAuthUI();
    renderAllViews();
    showToast(`Loaded ${role} Profile.`);
    closeAuthModal();
  }
}

export async function handleSignOut() {
  await signOut(auth);
  currentUser = null;
  userProfile = null;
  updateAuthUI();
  renderAllViews();
  showToast('Signed out of ON CAMPUS.');
}

// ============================================================================
// 6. PROFILE MODAL & REAL-TIME VIEW INCREMENT COUNTER
// ============================================================================
export async function openStudentProfile(targetUserId, fallbackName, fallbackRole = 'Student') {
  const modal = document.getElementById('student-profile-modal');
  if (!modal) return;

  const isOwn = currentUser && currentUser.uid === targetUserId;
  let profile = {
    uid: targetUserId,
    name: fallbackName,
    email: `${fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '_')}@aitpune.edu.in`,
    role: fallbackRole,
    branch: 'Computer Engineering',
    year: '3rd Year',
    postCount: postsData.filter(p => p.authorId === targetUserId || p.author === fallbackName).length || 1,
    profileViews: 12
  };

  try {
    const userRef = doc(db, 'users', targetUserId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      profile = snap.data();
      // If another student views, increment profileViews live on Firestore!
      if (!isOwn && currentUser) {
        try {
          await updateDoc(userRef, { profileViews: increment(1) });
          profile.profileViews = (profile.profileViews || 0) + 1;
        } catch (_) {}
      }
    } else if (isOwn && userProfile) {
      profile = userProfile;
    }
  } catch (e) {
    if (isOwn && userProfile) profile = userProfile;
  }

  // Populate modal
  document.getElementById('prof-modal-avatar').textContent = profile.name ? profile.name[0] : 'A';
  document.getElementById('prof-modal-name').textContent = profile.name;
  document.getElementById('prof-modal-role').textContent = profile.role;
  document.getElementById('prof-modal-branch-year').textContent = `${profile.branch || 'Computer Engg'} • ${profile.year || '3rd Year'}`;
  document.getElementById('prof-modal-email').textContent = profile.email || 'student@aitpune.edu.in';
  document.getElementById('prof-modal-views').textContent = profile.profileViews || 0;
  document.getElementById('prof-modal-posts').textContent = profile.postCount || postsData.filter(p => p.authorId === targetUserId || p.author === fallbackName).length || 1;

  modal.classList.add('open');
}

export function closeStudentProfile() {
  const modal = document.getElementById('student-profile-modal');
  if (modal) modal.classList.remove('open');
}

// ============================================================================
// 7. CREATE POST / REPORT / SELL ITEM (FIRESTORE WRITE)
// ============================================================================
export async function createNewSubmission(formValues) {
  if (!currentUser) {
    openAuthModal();
    showToast('Please sign in to publish to ON CAMPUS.');
    return;
  }

  const { type, title, content, category, facilityKey, location, price, condition, taggedClub, isAnon } = formValues;

  if (!title || !title.trim()) {
    showToast('Post title cannot be empty.');
    return;
  }
  if (!content || !content.trim()) {
    showToast('Post content cannot be empty.');
    return;
  }

  const authorName = isAnon ? 'Anonymous Student' : (userProfile?.name || 'AIT Student');
  const authorRole = isAnon ? 'Student' : (userProfile?.role || 'Student');
  const authorEmail = isAnon ? 'anon@aitpune.edu.in' : (userProfile?.email || 'student@aitpune.edu.in');

  if (type === 'problem') {
    const newIssue = {
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: content.trim() || 'Dispatched via ON CAMPUS direct problem form.',
      category: category || 'Wi-Fi',
      location: location || 'Campus Enclave',
      facilityKey: facilityKey || 'hostel',
      status: 'Reported',
      reporterId: currentUser.uid,
      reporter: authorName,
      reporterRole: authorRole,
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      upvotes: 1
    };

    // Duplicate cluster detection
    const similar = issuesData.filter(i => 
      (i.category === newIssue.category && i.location.toLowerCase().includes(newIssue.location.toLowerCase().slice(0, 8))) ||
      (i.title.toLowerCase().includes(newIssue.title.toLowerCase().slice(0, 10)))
    );
    if (similar.length > 0) {
      newIssue.duplicateNotice = `${similar.length} other student(s) reported similar ${newIssue.category} issues in ${newIssue.location}`;
    }

    // Clean any undefined values before writing to Firestore
    const cleanIssue = {};
    for (const [k, v] of Object.entries(newIssue)) {
      if (v !== undefined) cleanIssue[k] = v;
    }

    try {
      const docRef = await addDoc(collection(db, 'issues'), cleanIssue);
      newIssue.id = docRef.id;
      newIssue.firestoreId = docRef.id;
      console.log('✅ Facility issue ticket dispatched to Firestore ID:', docRef.id);
    } catch (err) {
      console.warn('Firestore issue save note:', err);
    }

    issuesData.unshift(newIssue);
    renderIssues();
    showToast('Problem dispatched to Campus Admin!');
  } else if (type === 'market') {
    let cleanCategory = category;
    const validMarketCategories = ['Textbooks', 'Electronics', 'Hostel Gear', 'Lab Equipment'];
    if (!validMarketCategories.includes(cleanCategory)) {
      const t = (title || '').toLowerCase();
      if (t.includes('book') || t.includes('note') || t.includes('grewal') || t.includes('galvin')) cleanCategory = 'Textbooks';
      else if (t.includes('coat') || t.includes('lab') || t.includes('goggle') || t.includes('drafter')) cleanCategory = 'Lab Equipment';
      else if (t.includes('kettle') || t.includes('cycle') || t.includes('bed') || t.includes('mattress') || t.includes('iron')) cleanCategory = 'Hostel Gear';
      else cleanCategory = 'Electronics';
    }

    const newItem = {
      id: `mkt-${Date.now()}`,
      title: title.trim(),
      price: parseInt(price, 10) || 100,
      category: cleanCategory,
      condition: condition || 'Good',
      description: content.trim() || 'Available for pickup on campus.',
      sellerId: currentUser.uid,
      sellerName: authorName,
      sellerRole: authorRole,
      sellerContact: userProfile?.phone || userProfile?.email || 'devc45018@gmail.com',
      sellerLocation: location || 'Hostel 3',
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      isSold: false
    };

    try {
      const docRef = await addDoc(collection(db, 'marketplace'), newItem);
      newItem.id = docRef.id;
      newItem.firestoreId = docRef.id;
    } catch (err) {
      console.warn('Firestore marketplace save note:', err);
    }

    marketData.unshift(newItem);
    renderMarketplace();
    showToast('Item listed in Student Marketplace!');
  } else {
    // Normal feed post or club notice
    const isSenior = userProfile?.role === 'Senior' || userProfile?.role === 'Club Lead';
    const newPost = {
      type: type === 'notice' ? 'notice' : 'help',
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser.uid,
      author: authorName,
      authorName: authorName,
      authorRole: authorRole,
      authorEmail: authorEmail || '',
      taggedClub: taggedClub || '',
      category: type === 'notice' ? 'Club Events' : (category || 'Peer Query'),
      location: location || '',
      createdAt: new Date().toISOString(),
      timestamp: 'Just now',
      upvotes: 1,
      upvotedBy: [currentUser.uid],
      isVerifiedBySenior: isSenior,
      verifiedBy: isSenior ? `${userProfile?.name || 'Senior'} (${userProfile?.year || 'TE'})` : '',
      commentsCount: 0
    };

    // Clean any accidental undefined values before writing to Firestore
    const cleanedPost = {};
    for (const [k, v] of Object.entries(newPost)) {
      if (v !== undefined) cleanedPost[k] = v;
    }

    try {
      const docRef = await addDoc(collection(db, 'posts'), cleanedPost);
      newPost.id = docRef.id;
      console.log('✅ Post/Notice uploaded successfully to Firestore document ID:', docRef.id);
      if (userProfile) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          postCount: increment(1)
        });
      }
      showToast(type === 'notice' ? 'Club Announcement published live!' : 'Post published live to Firestore!');
    } catch (err) {
      console.error('❌ Firestore post save error:', err);
      newPost.id = `post-${Date.now()}`;
      showToast('Post saved (Firestore offline/rules error: ' + (err.code || err.message) + ')');
    }

    postsData.unshift(newPost);
    try { localStorage.setItem('oncampus_posts_cache', JSON.stringify(postsData)); } catch (_) {}
    if (userProfile) userProfile.postCount = (userProfile.postCount || 0) + 1;
    renderFeed();
    renderClubNotices();
    updateAuthUI();
  }

  closePostModal();
}

// ============================================================================
// 8. UPVOTING POSTS & BUMPING ISSUES
// ============================================================================
export async function toggleUpvotePost(postId) {
  if (!currentUser) {
    openAuthModal();
    showToast('Sign in to upvote campus posts.');
    return;
  }

  const post = postsData.find(p => p.id === postId);
  const postRef = doc(db, 'posts', postId);

  try {
    let finalUpvotes = post ? post.upvotes : 1;
    let hasUpvotedNow = false;

    // Use atomic Firestore transaction to prevent duplicate voting or race conditions
    await runTransaction(db, async (transaction) => {
      const postSnap = await transaction.get(postRef);
      if (!postSnap.exists()) {
        throw new Error('Post document does not exist in Firestore');
      }
      const data = postSnap.data();
      const upvotedByList = Array.isArray(data.upvotedBy) ? [...data.upvotedBy] : [];
      const alreadyUpvoted = upvotedByList.includes(currentUser.uid);

      let nextUpvotedBy;
      let nextUpvotes;

      if (alreadyUpvoted) {
        nextUpvotedBy = upvotedByList.filter(uid => uid !== currentUser.uid);
        nextUpvotes = Math.max(0, (data.upvotes || 1) - 1);
        hasUpvotedNow = false;
      } else {
        nextUpvotedBy = [...upvotedByList, currentUser.uid];
        nextUpvotes = (data.upvotes || 0) + 1;
        hasUpvotedNow = true;
      }

      transaction.update(postRef, {
        upvotes: nextUpvotes,
        upvotedBy: nextUpvotedBy
      });

      finalUpvotes = nextUpvotes;
    });

    if (post) {
      post.upvotes = finalUpvotes;
      post.upvotedBy = hasUpvotedNow
        ? [...(post.upvotedBy || []).filter(u => u !== currentUser.uid), currentUser.uid]
        : (post.upvotedBy || []).filter(u => u !== currentUser.uid);
    }
    try { localStorage.setItem('oncampus_posts_cache', JSON.stringify(postsData)); } catch (_) {}
    renderFeed();
    showToast(hasUpvotedNow ? 'Post upvoted (+1)' : 'Upvote removed');
  } catch (err) {
    console.warn('Transaction fallback to local state:', err.message);
    if (post) {
      const hasUpvoted = post.upvotedBy && post.upvotedBy.includes(currentUser.uid);
      post.upvotedBy = hasUpvoted
        ? (post.upvotedBy || []).filter(u => u !== currentUser.uid)
        : [...(post.upvotedBy || []), currentUser.uid];
      post.upvotes = hasUpvoted ? Math.max(0, post.upvotes - 1) : post.upvotes + 1;
      try { localStorage.setItem('oncampus_posts_cache', JSON.stringify(postsData)); } catch (_) {}
      renderFeed();
      showToast(hasUpvoted ? 'Upvote removed' : 'Post upvoted (+1)');
    }
  }
}

// Toggle comments drawer for a post
export function togglePostComments(postId) {
  if (openCommentPosts.has(postId)) {
    openCommentPosts.delete(postId);
  } else {
    openCommentPosts.add(postId);
  }
  renderFeed();
}

// Add a community comment/reply to a post
export async function addPostComment(postId) {
  if (!currentUser) {
    openAuthModal();
    showToast('Sign in to comment on campus posts.');
    return;
  }

  const inputEl = document.getElementById(`comment-input-${postId}`);
  const content = inputEl ? inputEl.value.trim() : '';

  if (!content) {
    showToast('Please enter a comment before replying.');
    return;
  }

  const authorName = userProfile?.name || currentUser.displayName || 'AIT Student';
  const authorRole = userProfile?.role || 'Student';

  const newComment = {
    postId,
    content,
    authorId: currentUser.uid,
    authorName,
    authorRole,
    createdAt: new Date().toISOString(),
    timestamp: 'Just now'
  };

  try {
    const docRef = await addDoc(collection(db, 'comments'), newComment);
    newComment.id = docRef.id;

    // Increment post commentsCount in Firestore
    try {
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });
    } catch (_) {}
  } catch (err) {
    console.warn('Firestore comment fallback:', err);
    newComment.id = `comm-${Date.now()}`;
  }

  // Update local comments collection
  commentsData.push(newComment);
  const targetPost = postsData.find(p => p.id === postId);
  if (targetPost) {
    targetPost.commentsCount = (targetPost.commentsCount || 0) + 1;
  }

  try { 
    localStorage.setItem('oncampus_comments_cache', JSON.stringify(commentsData));
    localStorage.setItem('oncampus_posts_cache', JSON.stringify(postsData));
  } catch (_) {}

  if (inputEl) inputEl.value = '';
  renderFeed();
  showToast('Reply posted to conversation!');
}

export async function bumpIssue(issueId) {
  if (!currentUser) {
    openAuthModal();
    showToast('Sign in to flag issue.');
    return;
  }

  const issue = issuesData.find(i => i.id === issueId || i.firestoreId === issueId || i.rawId === issueId);
  if (!issue) return;

  issue.upvotes = (issue.upvotes || 0) + 1;
  const docId = issue.firestoreId || issue.id;

  try {
    await updateDoc(doc(db, 'issues', docId), {
      upvotes: increment(1)
    });
  } catch (err) {
    console.warn('Issue upvote update note:', err);
    try {
      const cleanIssue = {
        title: issue.title || 'Campus Issue',
        description: issue.description || '',
        category: issue.category || 'Wi-Fi',
        location: issue.location || 'Campus Enclave',
        facilityKey: issue.facilityKey || 'hostel',
        status: issue.status || 'Reported',
        reporterId: currentUser.uid,
        reporter: issue.reporter || 'AIT Student',
        reporterRole: issue.reporterRole || 'Student',
        createdAt: issue.createdAt || new Date().toISOString(),
        timestamp: issue.timestamp || 'Just now',
        upvotes: issue.upvotes || 1
      };
      await setDoc(doc(db, 'issues', docId), cleanIssue);
    } catch (_) {}
  }

  renderIssues();
  showToast('Flagged as also affecting you (+1 bump)');
}

// ============================================================================
// 9. RENDER FUNCTIONS FOR ALL 5 TABS
// ============================================================================

// Tab 1: Student Feed
export function renderFeed() {
  const container = document.getElementById('pulse-feed-stream');
  if (!container) return;

  try {
    const query = (searchQuery || '').toLowerCase().trim();
    const filtered = postsData.filter(p => {
      const titleStr = (p.title || '').toLowerCase();
      const contentStr = (p.content || p['content '] || '').toLowerCase();
      const clubStr = (p.taggedClub || '').toLowerCase();
      const matchesSearch = !query || titleStr.includes(query) || contentStr.includes(query) || clubStr.includes(query);
      const matchesCat = feedCategoryFilter === 'all' || 
                         (feedCategoryFilter === 'verified' ? p.isVerifiedBySenior : p.type === feedCategoryFilter);
      return matchesSearch && matchesCat && !p.flagged;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="pulse-empty-state">
          <div class="empty-icon">⌘</div>
          <h4>No announcements found matching this filter</h4>
          <p>Try clearing search or be the first student to post about this topic.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(post => {
      const isUpvoted = currentUser && post.upvotedBy?.includes(currentUser.uid);
      const postComments = commentsData.filter(c => c.postId === post.id);
      const commentsCount = Math.max(post.commentsCount || 0, postComments.length);
      const isCommentsOpen = openCommentPosts.has(post.id);
      const postAuthor = post.author || post.authorName || 'AIT Student';
      const postAvatar = (postAuthor[0] || 'A').toUpperCase();
      const postContent = post.content || post['content '] || '';
      const safeAuthorJs = postAuthor.replace(/'/g, "\\'");

      return `
        <article class="pulse-card post-card" data-id="${post.id}">
          <div class="post-header">
            <div class="post-meta-left">
              <button class="author-pill-btn" onclick="window.CampusPulse.openStudentProfile('${post.authorId}', '${safeAuthorJs}', '${post.authorRole || 'Student'}')" title="Inspect verified student card">
                <span class="author-avatar">${postAvatar}</span>
                <span class="author-name">${postAuthor}</span>
              </button>
              <span class="meta-tag role-tag">${post.authorRole || 'Student'}</span>
              ${post.taggedClub ? `<span class="meta-tag club-tag">${post.taggedClub}</span>` : ''}
              <span class="meta-timestamp">• ${post.timestamp || 'Recently'}</span>
            </div>

            ${post.isVerifiedBySenior ? `
              <div class="senior-verified-badge" title="Verified by final year academic cohort">
                <span class="badge-icon">✦</span>
                <span>Senior Verified</span>
              </div>
            ` : ''}
          </div>

          <h3 class="post-title">${post.title || 'Untitled Post'}</h3>
          <p class="post-content">${postContent}</p>

        ${post.location ? `
          <div class="post-coordinate-badge">
            <span class="pin">📍</span>
            <span>${post.location}</span>
          </div>
        ` : ''}

        ${post.verifiedBy ? `
          <div class="verified-endorsement">
            <span class="endorse-icon">🛡️</span>
            <span>Verified answer endorsed by: <strong>${post.verifiedBy}</strong></span>
          </div>
        ` : ''}

        <div class="post-footer">
          <div class="post-actions-group">
            <button class="action-btn upvote-btn ${isUpvoted ? 'active' : ''}" onclick="window.CampusPulse.toggleUpvotePost('${post.id}')" title="Upvote post">
              <span class="thumb-icon">▲</span>
              <span class="count">${post.upvotes}</span>
            </button>
            <button class="action-btn replies-btn ${isCommentsOpen ? 'active' : ''}" onclick="window.CampusPulse.togglePostComments('${post.id}')" title="View & reply to comments">
              <span class="msg-icon">💬</span>
              <span>${commentsCount} ${commentsCount === 1 ? 'reply' : 'replies'}</span>
            </button>
          </div>

          <button class="flag-btn" onclick="window.CampusPulse.flagPost('${post.id}')" title="Flag inappropriate content">
            <span>⚐</span>
          </button>
        </div>

        ${isCommentsOpen ? `
          <div class="post-comments-drawer" id="comments-drawer-${post.id}">
            <div class="comments-drawer-header">
              <span class="comments-drawer-title">Community Discussion (${commentsCount})</span>
            </div>
            
            ${currentUser ? `
              <div class="comment-composer-row">
                <input type="text" id="comment-input-${post.id}" class="comment-composer-input" placeholder="Join the discussion... (Press Enter or click Reply)" onkeydown="if(event.key==='Enter') window.CampusPulse.addPostComment('${post.id}')" />
                <button type="button" class="comment-composer-submit" onclick="window.CampusPulse.addPostComment('${post.id}')">Reply</button>
              </div>
            ` : `
              <div class="comment-auth-prompt">
                <span>Sign in to participate in this discussion</span>
                <button type="button" class="comment-auth-btn" onclick="window.CampusPulse.openAuthModal()">Sign In</button>
              </div>
            `}

            <div class="comments-stream">
              ${postComments.length === 0 ? `
                <p class="comments-empty-text">No replies yet. Be the first to reply!</p>
              ` : postComments.map(c => `
                <div class="comment-bubble" data-comment-id="${c.id}">
                  <div class="comment-bubble-header">
                    <span class="comment-author-name">${c.authorName || 'Student'}</span>
                    ${c.authorRole ? `<span class="comment-author-role">${c.authorRole}</span>` : ''}
                    <span class="comment-timestamp">• ${c.timestamp || 'Recently'}</span>
                  </div>
                  <p class="comment-bubble-body">${c.content}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

    // Update right sidebar widgets
    const postCountStat = document.getElementById('stat-my-posts');
    const viewCountStat = document.getElementById('stat-my-views');
    if (postCountStat && userProfile) postCountStat.textContent = userProfile.postCount || 0;
    if (viewCountStat && userProfile) viewCountStat.textContent = userProfile.profileViews || 0;
  } catch (err) {
    console.error('❌ Error rendering student feed:', err);
  }
}

// Tab 2: Campus Facilities & Issues
export function renderIssues() {
  const container = document.getElementById('pulse-issues-stream');
  if (!container) return;

  const q = (searchQuery || '').toLowerCase().trim();
  const filtered = issuesData.filter(iss => {
    const titleStr = (iss.title || '').toLowerCase();
    const locStr = (iss.location || '').toLowerCase();
    const catStr = (iss.category || '').toLowerCase();
    const descStr = (iss.description || '').toLowerCase();
    const matchesSearch = !q || titleStr.includes(q) || locStr.includes(q) || catStr.includes(q) || descStr.includes(q);
    const matchesStatus = issueStatusFilter === 'all' || iss.status === issueStatusFilter;
    const matchesFacility = facilityFilter === 'all' || iss.facilityKey === facilityFilter;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="pulse-empty-state">
        <div class="empty-icon">✓</div>
        <h4>No issues reported in this state</h4>
        <p>All facilities in this zone are currently clear and operating normally.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(issue => {
    const getBadgeClass = (status) => {
      switch(status) {
        case 'Reported': return 'status-reported';
        case 'Assigned': return 'status-assigned';
        case 'In Progress': return 'status-progress';
        case 'Fixed': return 'status-fixed';
        default: return '';
      }
    };

    const displayId = issue.rawId || issue.id;

    return `
      <article class="pulse-card issue-card" data-id="${issue.id}">
        <div class="issue-header">
          <div class="issue-meta-left">
            <span class="issue-id-tag">${displayId}</span>
            <span class="meta-tag">${issue.category}</span>
            <span class="status-badge ${getBadgeClass(issue.status)}">${issue.status}</span>
            <span class="meta-timestamp">• ${issue.timestamp}</span>
          </div>
          <div class="issue-location">
            <span>📍 ${issue.location}</span>
          </div>
        </div>

        <h3 class="issue-title">${issue.title}</h3>
        <p class="issue-desc">${issue.description}</p>

        ${issue.duplicateNotice ? `
          <div class="duplicate-alert-strip">
            <span class="warn-glyph">⚠️</span>
            <span><strong>Duplicate Cluster:</strong> ${issue.duplicateNotice}</span>
          </div>
        ` : ''}

        <!-- 4-Stage Resolution Stepper -->
        <div class="resolution-stepper">
          <div class="step-cell active">
            <div class="step-dot">✓</div>
            <span>Reported</span>
          </div>
          <div class="step-cell ${issue.status === 'Assigned' || issue.status === 'In Progress' || issue.status === 'Fixed' ? 'active' : ''}">
            <div class="step-dot">✓</div>
            <span>Assigned</span>
          </div>
          <div class="step-cell ${issue.status === 'In Progress' || issue.status === 'Fixed' ? 'active' : ''}">
            <div class="step-dot">✓</div>
            <span>In Progress</span>
          </div>
          <div class="step-cell ${issue.status === 'Fixed' ? 'active fixed' : ''}">
            <div class="step-dot">✓</div>
            <span>Fixed</span>
          </div>
        </div>

        <div class="issue-footer">
          <button class="author-subtext" onclick="window.CampusPulse.openStudentProfile('${issue.reporterId}', '${(issue.reporter || 'Student').replace(/'/g, "\\'")}', '${issue.reporterRole || 'Student'}')">
            Reported by ${issue.reporter} (${issue.reporterRole})
          </button>
          <button class="action-btn bump-btn" onclick="window.CampusPulse.bumpIssue('${issue.id}')">
            <span>▲ Facing this too (${issue.upvotes})</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// Tab 3: Marketplace
export function renderMarketplace() {
  const container = document.getElementById('pulse-marketplace-stream');
  if (!container) return;

  const normalizeCategory = (item) => {
    let cat = item.category || 'Electronics';
    if (cat === 'Wi-Fi') {
      const t = (item.title || '').toLowerCase();
      if (t.includes('book') || t.includes('note') || t.includes('grewal') || t.includes('galvin')) return 'Textbooks';
      if (t.includes('coat') || t.includes('lab') || t.includes('goggle') || t.includes('drafter')) return 'Lab Equipment';
      if (t.includes('kettle') || t.includes('cycle') || t.includes('bed') || t.includes('mattress') || t.includes('iron')) return 'Hostel Gear';
      return 'Electronics';
    }
    return cat;
  };

  const filtered = marketData.filter(item => {
    const titleStr = (item.title || '').toLowerCase();
    const descStr = (item.description || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || titleStr.includes(q) || descStr.includes(q);

    const itemCat = normalizeCategory(item);
    const matchesCat = marketCategoryFilter === 'all' || itemCat.toLowerCase() === marketCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="pulse-empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🏷️</div>
        <h4>No marketplace items listed in this category</h4>
        <p>Be the first student to list your used textbooks or drafters here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const itemCat = normalizeCategory(item);
    const isOwner = currentUser && (currentUser.uid === item.sellerId);
    const safeTitle = (item.title || 'Untitled Item').replace(/"/g, '&quot;');
    const safeDesc = (item.description || 'Available for pickup on campus.').replace(/"/g, '&quot;');
    const safeLocation = (item.sellerLocation || 'AIT Campus').replace(/"/g, '&quot;');
    const safeCondition = item.condition || 'Good';

    return `
      <article class="pulse-card market-card" data-id="${item.id}">
        <div>
          <div class="market-top-row">
            <span class="meta-tag">${itemCat}</span>
            ${item.isSold ? `
              <span class="condition-tag tag-sold" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5; font-weight:700;">● SOLD</span>
            ` : `
              <span class="condition-tag ${safeCondition === 'Like New' ? 'condition-new' : ''}">${safeCondition}</span>
            `}
          </div>
          <h3 class="market-item-title">${safeTitle}</h3>
          <p class="market-item-desc">${safeDesc}</p>
          <div class="market-coordinate">
            <span>📍 Pickup: <strong>${safeLocation}</strong></span>
          </div>
        </div>

        <div class="market-bottom-row">
          <div class="market-price" style="${item.isSold ? 'text-decoration:line-through; opacity:0.6;' : ''}">₹${item.price}</div>
          <div style="display:flex; gap:0.4rem; align-items:center;">
            ${isOwner ? `
              <button class="btn-outline-dark" style="font-size:0.75rem; padding:0.4rem 0.6rem;" onclick="window.CampusPulse.toggleItemSold('${item.id}', ${!item.isSold})">
                ${item.isSold ? 'Mark Available' : 'Mark Sold'}
              </button>
            ` : ''}
            ${item.isSold ? `
              <button class="btn-outline-dark" disabled style="opacity:0.6; cursor:not-allowed;">Sold Out</button>
            ` : `
              <button class="btn-solid-dark contact-seller-btn" onclick="window.CampusPulse.openContactSellerModal('${item.id}')">
                Contact Seller
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Tab 4: Verified Clubs
export function renderClubs() {
  const container = document.getElementById('pulse-clubs-stream');
  if (!container) return;

  const query = (clubSearchQuery || searchQuery || '').toLowerCase().trim();
  const filtered = MOCK_CLUBS.filter(club => {
    const nameMatch = club.name.toLowerCase().includes(query);
    const tagMatch = club.tag.toLowerCase().includes(query);
    const descMatch = club.description.toLowerCase().includes(query);
    const leadMatch = (club.lead || '').toLowerCase().includes(query);
    const matchesSearch = !query || nameMatch || tagMatch || descMatch || leadMatch;

    const matchesDomain = clubDomainFilter === 'all' || club.domain === clubDomainFilter;
    return matchesSearch && matchesDomain;
  });

  let joinedClubs = [];
  if (currentUser) {
    try {
      joinedClubs = JSON.parse(localStorage.getItem(`joined_clubs_${currentUser.uid}`) || '[]');
    } catch (_) {}
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="pulse-empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🏛️</div>
        <h4>No guilds found matching this filter</h4>
        <p>Try clearing your search or domain filter.</p>
      </div>
    `;
    renderClubNotices();
    return;
  }

  container.innerHTML = filtered.map(club => {
    const isJoined = joinedClubs.includes(club.id);
    const clubNotices = postsData.filter(p => (p.taggedClub || '').toLowerCase() === club.tag.toLowerCase());
    const noticeCount = clubNotices.length;

    return `
      <div class="pulse-card club-card" data-id="${club.id}">
        <div>
          <div class="club-card-top">
            <span class="club-handle-tag">${club.tag}</span>
            <span class="club-member-count">${club.membersCount}+ Members</span>
          </div>
          <h3 class="club-name">${club.name}</h3>
          <p class="club-desc">${club.description}</p>
        </div>

        <div style="margin-top:0.5rem; margin-bottom:1rem; display:flex; align-items:center; justify-content:space-between; font-size:0.78rem;">
          <span style="color:var(--text-muted); font-family:var(--font-mono);">Lead: <strong>${club.lead}</strong></span>
          <span class="meta-tag" style="font-size:0.7rem; cursor:pointer;" onclick="window.CampusPulse.filterClubNotices('${club.tag}')">
            📢 ${noticeCount} Notice${noticeCount === 1 ? '' : 's'}
          </span>
        </div>

        <div class="club-card-bottom">
          <button class="${isJoined ? 'btn-outline-dark' : 'btn-solid-dark'}" style="${isJoined ? 'border-color:#10b981; color:#059669;' : ''}" onclick="window.CampusPulse.toggleJoinClub('${club.id}')">
            ${isJoined ? 'Joined ✓' : 'Join Guild +'}
          </button>
          <button class="btn-outline-dark" onclick="window.CampusPulse.quickTagClub('${club.tag}')">
            Post Notice ↗
          </button>
        </div>
      </div>
    `;
  }).join('');

  renderClubNotices();
}

// Render Live Club Announcements / Notices on clubs.html
export function renderClubNotices() {
  const container = document.getElementById('pulse-club-notices-stream');
  if (!container) return;

  const notices = postsData.filter(p => {
    const isNotice = p.type === 'notice' || p.category === 'Club Events' || Boolean(p.taggedClub);
    const matchesClub = clubNoticeFilter === 'all' || (p.taggedClub || '').toLowerCase() === clubNoticeFilter.toLowerCase();
    return isNotice && matchesClub && !p.flagged;
  });

  if (notices.length === 0) {
    container.innerHTML = `
      <div class="pulse-empty-state" style="grid-column: 1 / -1; padding: 2.5rem; text-align: center;">
        <div class="empty-icon">📢</div>
        <h4>No announcements dispatched yet</h4>
        <p>Verified club leads can publish hackathons, workshops, and team selections here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notices.map(post => {
    const isUpvoted = currentUser && post.upvotedBy?.includes(currentUser.uid);
    const commentsCount = (commentsData || []).filter(c => c.postId === post.id).length;

    return `
      <article class="pulse-card notice-card" style="padding: 1.5rem; border-left: 3px solid var(--accent-magenta);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            ${post.taggedClub ? `<span class="club-handle-tag" style="font-size:0.7rem;">${post.taggedClub}</span>` : ''}
            <span class="meta-tag" style="font-size:0.7rem;">${post.category || 'Club Notice'}</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${post.timestamp || 'Recent'}</span>
          </div>
          ${post.location ? `<span style="font-size:0.78rem; color:var(--text-secondary);">📍 ${post.location}</span>` : ''}
        </div>

        <h3 style="font-family:var(--font-display); font-size:1.15rem; margin-bottom:0.5rem; color:var(--text-primary);">${post.title}</h3>
        <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1rem;">${post.content}</p>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-hairline); padding-top:0.75rem;">
          <span style="font-size:0.78rem; color:var(--text-muted);">
            Dispatched by: <strong>${post.author || post.authorName || 'Guild Lead'}</strong> (${post.authorRole || 'Club Lead'})
          </span>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="action-btn upvote-btn ${isUpvoted ? 'active' : ''}" onclick="window.CampusPulse.toggleUpvotePost('${post.id}')" title="Upvote notice">
              <span class="thumb-icon">▲</span>
              <span class="count">${post.upvotes || 0}</span>
            </button>
            <a href="index.html" class="btn-outline-dark" style="font-size:0.72rem; padding:0.35rem 0.65rem; text-decoration:none;">
              Join Discussion (${commentsCount}) ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Tab 5: Seniors Hub & Collaborative Project Incubator
export function getProjectRatingSummary(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return { avg: 0, count: 0, display: 'No reviews yet', starsText: '☆☆☆☆☆' };
  }
  const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  const avg = (sum / reviews.length).toFixed(1);
  const rounded = Math.round(Number(avg));
  const starsText = '★'.repeat(rounded) + '☆'.repeat(Math.max(0, 5 - rounded));
  return {
    avg,
    count: reviews.length,
    display: `★ ${avg} (${reviews.length} review${reviews.length > 1 ? 's' : ''})`,
    starsText
  };
}

export function renderProjects() {
  const container = document.getElementById('pulse-projects-stream');
  if (!container) return;

  const filtered = projectsData.filter(proj => {
    // Search query with null-safety
    const q = (projectsSearchQuery || '').toLowerCase().trim();
    const titleStr = (proj.title || '').toLowerCase();
    const absStr = (proj.abstract || '').toLowerCase();
    const leadStr = (proj.leadName || '').toLowerCase();
    const searchMatch = !q ||
      titleStr.includes(q) ||
      absStr.includes(q) ||
      leadStr.includes(q) ||
      (Array.isArray(proj.techStack) && proj.techStack.some(t => (t || '').toLowerCase().includes(q)));

    // Domain filter
    const domainMatch = projectDomainFilter === 'all' || proj.domain === projectDomainFilter;

    // Need filter: 'all' | 'members' | 'help' | 'toprated'
    let needMatch = true;
    if (projectNeedFilter === 'members') {
      needMatch = Boolean(proj.membersNeeded && proj.membersNeeded.trim().length > 0);
    } else if (projectNeedFilter === 'help') {
      needMatch = Boolean(proj.helpNeeded && proj.helpNeeded.trim().length > 0);
    } else if (projectNeedFilter === 'toprated') {
      const summary = getProjectRatingSummary(proj.reviews);
      needMatch = Number(summary.avg) >= 4.5;
    }

    return searchMatch && domainMatch && needMatch;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (projectSortOrder === 'upvotes') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    } else if (projectSortOrder === 'rating') {
      const avgA = Number(getProjectRatingSummary(a.reviews).avg || 0);
      const avgB = Number(getProjectRatingSummary(b.reviews).avg || 0);
      return avgB - avgA;
    }
    return 0; // 'recent'
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="pulse-empty-state" style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: var(--bg-primary); border: 1px solid var(--border-hairline);">
        <div class="empty-icon" style="font-size: 2.2rem; margin-bottom: 0.8rem;">🚀</div>
        <h4 style="font-family: var(--font-display); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.4rem;">No matching projects found</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem auto;">
          Be the first junior or senior student to post your project, recruit teammates, and ask the senior panel for architecture feedback.
        </p>
        <button class="btn-solid-dark" onclick="window.OnCampus.openProjectCreateModal()" style="background:var(--accent-magenta); color:#fff; border:none; padding:0.75rem 1.4rem; font-weight:700; cursor:pointer;">
          + Post a Project Now →
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(proj => {
    const ratingSummary = getProjectRatingSummary(proj.reviews);
    const techPills = (proj.techStack || []).map(t => `<span class="tech-pill">${t}</span>`).join('');
    
    // Reviews HTML
    const reviewsListHtml = (proj.reviews && proj.reviews.length > 0)
      ? proj.reviews.map(r => `
          <div class="project-review-item" id="review-item-${r.id}">
            <div class="review-item-header">
              <span class="reviewer-identity">${r.author} <small style="color:var(--text-muted); font-size:0.68rem;">(${r.role})</small></span>
              <span class="review-stars-display" title="${r.rating} of 5 stars">${'★'.repeat(r.rating)}${'☆'.repeat(Math.max(0, 5 - r.rating))}</span>
            </div>
            <p class="review-comment-text">"${r.comment}"</p>
            <div class="review-item-footer">
              <span style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">${r.timestamp || 'Recently'}</span>
              <button type="button" class="btn-helpful-review ${r.helpful && r.helpful > 0 ? 'active' : ''}" onclick="window.OnCampus.upvoteReview('${proj.id}', '${r.id}')" title="Mark this review as helpful">
                👍 Helpful (${r.helpful || 0})
              </button>
            </div>
          </div>
        `).join('')
      : `<div style="font-family:var(--font-mono); font-size:0.76rem; color:var(--text-muted); padding:0.6rem 0; font-style:italic;">No reviews yet. Use the 1-click star rater above to post the first review!</div>`;

    // WhatsApp handshake link with formatted phone
    const cleanPhone = (proj.leadContact || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone || '919876543210');
    const waText = encodeURIComponent(`Hi ${proj.leadName}! Saw your project "${proj.title}" on ON CAMPUS Senior Hub. I would love to connect and collaborate.`);
    const connectLink = proj.leadContact && proj.leadContact.includes('@')
      ? `mailto:${proj.leadContact}?subject=${encodeURIComponent('Collaboration on ' + proj.title)}`
      : `https://wa.me/${phoneWithCountry}?text=${waText}`;

    return `
      <article class="project-card" id="proj-${proj.id}" data-project-id="${proj.id}">
        <div>
          <!-- Top Header: Domain, Stage, and Live Rating Badge -->
          <div class="project-top-header">
            <div class="project-meta-badges">
              <span class="project-domain-tag">${proj.domain}</span>
              <span class="project-stage-pill">${proj.stage}</span>
            </div>
            <div class="project-rating-badge" title="Live average community review score">
              <span>★</span>
              <span>${ratingSummary.avg > 0 ? ratingSummary.avg : 'New'}</span>
              <span style="font-size:0.68rem; font-weight:normal; opacity:0.85;">(${proj.reviews ? proj.reviews.length : 0})</span>
            </div>
          </div>

          <!-- Project Title & Lead Meta -->
          <h3 class="project-title">${proj.title}</h3>
          
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.75rem; flex-wrap:wrap;">
            <div class="project-lead-chip">
              <span class="lead-name">👤 ${proj.leadName}</span>
              <span class="lead-role-tag">• ${proj.leadRole}</span>
              <span style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-left:4px;">(${proj.timestamp})</span>
            </div>
          </div>

          <!-- Abstract -->
          <p class="project-desc">${proj.abstract}</p>

          <!-- Tech Stack -->
          <div class="project-tech-pills">
            ${techPills}
          </div>

          <!-- Dedicated Collaboration Callout Blocks with Direct Handshake Buttons -->
          <div class="project-collab-blocks">
            ${proj.membersNeeded ? `
              <div class="collab-block need-members">
                <span class="collab-label">⚡ Members Needed / Team Recruitment:</span>
                <p class="collab-text">${proj.membersNeeded}</p>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:0.4rem;">
                  <a href="${connectLink}&text=${encodeURIComponent(`Hi ${proj.leadName}! Saw your project "${proj.title}" on ON CAMPUS. I want to join as a teammate to help!`)}" target="_blank" class="collab-action-btn join-team-btn">
                    ⚡ Apply / Join Team →
                  </a>
                  <button type="button" class="btn-copy-contact" onclick="window.OnCampus.copyContact('${proj.leadContact}')" title="Copy lead contact">
                    📋 Copy Contact
                  </button>
                </div>
              </div>
            ` : ''}

            ${proj.helpNeeded ? `
              <div class="collab-block need-help">
                <span class="collab-label">🎓 Senior Help Needed / Mentor Guidance:</span>
                <p class="collab-text">${proj.helpNeeded}</p>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:0.4rem;">
                  <a href="${connectLink}&text=${encodeURIComponent(`Hi ${proj.leadName}! Saw your project "${proj.title}" on ON CAMPUS. I am a senior and can guide you on this blocker.`)}" target="_blank" class="collab-action-btn offer-help-btn">
                    🎓 Offer Senior Guidance →
                  </a>
                  <button type="button" class="btn-copy-contact" onclick="window.OnCampus.copyContact('${proj.leadContact}')" title="Copy lead contact">
                    📋 Copy Contact
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Review System: Fast Inline Review Composer & Reviews Feed -->
        <div class="project-reviews-container">
          <div class="reviews-header-bar">
            <span class="reviews-title-counter">Peer Reviews (${proj.reviews ? proj.reviews.length : 0})</span>
            <button class="btn-add-review" onclick="window.OnCampus?.openProjectReviewModal ? window.OnCampus.openProjectReviewModal('${proj.id}') : window.openProjectReviewModalDirect('${proj.id}', '${proj.title.replace(/'/g, "\\'")}')">
              ★ Modal Review
            </button>
          </div>

          <!-- Fast Inline Review Composer (Instant 1-Click Submission) -->
          <div class="inline-review-composer" id="inline-review-box-${proj.id}">
            <div class="composer-top-row">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Rate:</span>
                <div class="star-picker-widget" id="star-picker-${proj.id}" data-rating="5">
                  <span onclick="window.OnCampus.setStarPicker('${proj.id}', 1)" class="active">★</span>
                  <span onclick="window.OnCampus.setStarPicker('${proj.id}', 2)" class="active">★</span>
                  <span onclick="window.OnCampus.setStarPicker('${proj.id}', 3)" class="active">★</span>
                  <span onclick="window.OnCampus.setStarPicker('${proj.id}', 4)" class="active">★</span>
                  <span onclick="window.OnCampus.setStarPicker('${proj.id}', 5)" class="active">★</span>
                </div>
                <span class="star-score-indicator" id="star-label-${proj.id}">5/5 ★ Outstanding</span>
              </div>
              <input type="text" id="inline-review-author-${proj.id}" class="inline-author-input" placeholder="Your Name & Standing" value="${(userProfile && userProfile.name) ? (userProfile.name + ' (' + (userProfile.role || 'Student') + ')') : ''}">
            </div>
            
            <textarea id="inline-review-comment-${proj.id}" class="inline-comment-input" rows="2" placeholder="Leave quick critique, architecture advice, or testing feedback..."></textarea>
            
            <div class="composer-bottom-row">
              <div class="feedback-chips-strip">
                <span style="font-family:var(--font-mono); font-size:0.62rem; color:var(--text-muted); text-transform:uppercase;">Quick:</span>
                <button type="button" class="feedback-tag-chip" onclick="window.OnCampus.appendReviewTag('${proj.id}', '⚡ Solid Architecture')">+ Solid Arch</button>
                <button type="button" class="feedback-tag-chip" onclick="window.OnCampus.appendReviewTag('${proj.id}', '🛠 Add Unit Tests')">+ Add Tests</button>
                <button type="button" class="feedback-tag-chip" onclick="window.OnCampus.appendReviewTag('${proj.id}', '💡 Great UI & Concept')">+ Great UX</button>
                <button type="button" class="feedback-tag-chip" onclick="window.OnCampus.appendReviewTag('${proj.id}', '🎓 Faculty Guide Ready')">+ Guide Ready</button>
                <button type="button" class="feedback-tag-chip" onclick="window.OnCampus.appendReviewTag('${proj.id}', '🤝 Want to Collaborate')">+ Want to Join</button>
              </div>
              <button type="button" class="btn-inline-submit-review" onclick="window.OnCampus.submitInlineReview('${proj.id}')">
                ★ Post Review
              </button>
            </div>
          </div>

          <div class="project-reviews-list">
            ${reviewsListHtml}
          </div>
        </div>

        <!-- Project Card Bottom Actions -->
        <div class="project-card-footer">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <button class="action-btn" onclick="window.OnCampus.toggleUpvoteProject('${proj.id}')" style="font-family:var(--font-mono); font-size:0.75rem; font-weight:600; padding:6px 12px; background:var(--bg-secondary); border:1px solid var(--border-hairline); cursor:pointer;">
              ▲ Upvote (${proj.upvotes})
            </button>
            <button type="button" class="btn-copy-contact" onclick="window.OnCampus.shareProject('${proj.id}')" title="Share project link">
              🔗 Share
            </button>
          </div>

          <div class="project-action-buttons">
            <a href="${connectLink}" target="_blank" class="btn-solid-dark" style="font-size:0.75rem; padding:0.5rem 0.9rem; text-decoration:none; display:inline-flex; align-items:center; gap:5px; background:var(--text-primary); color:var(--bg-primary);">
              <span>💬 Direct Handshake</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

export function renderSeniorsHub() {
  renderProjects();
}

// ============================================================================
// PROJECT CREATION & REVIEW SYSTEM CONTROLLERS (FAST, SIMPLE & FUNCTIONAL)
// ============================================================================

export const PROJECT_TEMPLATES = {
  robotics: {
    title: 'Autonomous SLAM Rover for Campus 3D Mapping',
    domain: 'Robotics',
    stage: 'Capstone In-Progress',
    abstract: 'Developing a ROS2-powered 4WD autonomous rover equipped with Livox LiDAR & stereo cameras for high-precision 3D mapping of campus grounds.',
    members: 'Need 1x Embedded firmware developer (STM32/CAN) & 1x WebGL visualizer.',
    help: 'Need senior guidance on sensor-fusion Kalman filters and faculty thesis review.'
  },
  ai: {
    title: 'DeepVision: Real-Time Edge Video Analytics for Campus Surveillance',
    domain: 'AI/ML',
    stage: 'Prototype In-Dev',
    abstract: 'Deploying YOLOv10 and DeepSORT on NVIDIA Jetson Orin Nano at hostel perimeter cameras for vehicle tracking & crowd density telemetry.',
    members: 'Need 1x PyTorch model optimization engineer & 1x Python FastAPI backend dev.',
    help: 'Seeking senior mentor advice on ONNX runtime quantization and latency tuning.'
  },
  fullstack: {
    title: 'HostelHub: Real-Time Biometric Outpass & Mess Food Analytics',
    domain: 'Full-Stack',
    stage: 'Prototype In-Dev',
    abstract: 'Distributed event-driven microservices platform replacing manual paper registers for hostel gate passes and mess token reconciliation in real-time.',
    members: 'Need 1x React/Next frontend developer & 1x PostgreSQL/Go backend engineer.',
    help: 'Need senior guidance on Redis token caching and SMS/WhatsApp gateway webhooks.'
  },
  iot: {
    title: 'SmartGrid LoRaWAN: Academic Block Solar Array Power Auditor',
    domain: 'IoT/Hardware',
    stage: 'Capstone In-Progress',
    abstract: 'Mesh of low-power ESP32 sensor nodes tracking solar panel inverter voltage and irradiance across academic rooftops with InfluxDB & Grafana.',
    members: 'Need 1x KiCad PCB designer & 1x Grafana alerting dashboard specialist.',
    help: 'Seeking advice from final-year seniors on antenna RF elevation over tin hostel roofs.'
  }
};

export function applyProjectTemplate(key) {
  const form = document.getElementById('inline-project-form');
  if (!form) return;

  if (key === 'clear') {
    form.reset();
    showToast('Composer cleared.');
    return;
  }

  const tpl = PROJECT_TEMPLATES[key];
  if (!tpl) return;

  const titleEl = document.getElementById('inline-proj-title');
  const domainEl = document.getElementById('inline-proj-domain');
  const stageEl = document.getElementById('inline-proj-stage');
  const descEl = document.getElementById('inline-proj-desc');
  const membersEl = document.getElementById('inline-proj-members');
  const helpEl = document.getElementById('inline-proj-help');
  const leadEl = document.getElementById('inline-proj-lead');
  const contactEl = document.getElementById('inline-proj-contact');

  if (titleEl) titleEl.value = tpl.title;
  if (domainEl) domainEl.value = tpl.domain;
  if (stageEl) stageEl.value = tpl.stage;
  if (descEl) descEl.value = tpl.abstract;
  if (membersEl) membersEl.value = tpl.members;
  if (helpEl) helpEl.value = tpl.help;
  if (leadEl && !leadEl.value) {
    leadEl.value = (userProfile && userProfile.name) || 'Lead Student';
  }
  if (contactEl && !contactEl.value) {
    contactEl.value = (userProfile && userProfile.email) || 'ait@aitpune.edu.in';
  }

  showToast(`⚡ Loaded "${tpl.title.slice(0, 28)}..." template!`);
  if (titleEl) titleEl.focus();
}

export function setStarPicker(projectId, rating) {
  const picker = document.getElementById(`star-picker-${projectId}`);
  if (!picker) return;
  picker.setAttribute('data-rating', rating);
  const stars = picker.querySelectorAll('span');
  stars.forEach((s, idx) => {
    s.classList.toggle('active', idx < rating);
  });
  const labelEl = document.getElementById(`star-label-${projectId}`);
  if (labelEl) {
    const scoreMap = {
      5: '5/5 ★ Outstanding',
      4: '4/5 ★ Strong Build',
      3: '3/5 ★ Good Start',
      2: '2/5 ★ Needs Work',
      1: '1/5 ★ Concept Only'
    };
    labelEl.textContent = scoreMap[rating] || `${rating}/5 Stars`;
  }
}

export function appendReviewTag(projectId, tag) {
  const commentInput = document.getElementById(`inline-review-comment-${projectId}`);
  if (!commentInput) return;
  const current = commentInput.value.trim();
  if (!current) {
    commentInput.value = tag + ': ';
  } else if (!current.includes(tag)) {
    commentInput.value = current + ' | ' + tag;
  }
  commentInput.focus();
}

export async function upvoteReview(projectId, reviewId) {
  const proj = projectsData.find(p => p.id === projectId);
  if (!proj || !proj.reviews) return;
  const rev = proj.reviews.find(r => r.id === reviewId);
  if (!rev) return;
  rev.helpful = (rev.helpful || 0) + 1;
  renderProjects();
  showToast('Marked review as helpful!');

  try {
    const docId = proj.firestoreId || proj.id;
    const projDocRef = doc(db, "projects", docId);
    await updateDoc(projDocRef, { reviews: proj.reviews });
  } catch (err) {
    console.warn("Firestore sync fallback for helpful review:", err);
  }
}

export function copyContact(contact) {
  if (!contact) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(contact);
  }
  showToast(`📋 Copied "${contact}" to clipboard!`);
}

export function shareProject(projectId) {
  const proj = projectsData.find(p => p.id === projectId);
  const title = proj ? proj.title : 'Project on ON CAMPUS';
  const url = window.location.href.split('#')[0] + '#proj-' + projectId;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url);
    showToast(`🔗 Link for "${title.slice(0, 24)}..." copied!`);
  } else {
    showToast(`Project: ${url}`);
  }
}

export function setProjectSort(sortOrder) {
  projectSortOrder = sortOrder;
  renderProjects();
}

export async function submitInlineReview(projectId) {
  const proj = projectsData.find(p => p.id === projectId);
  if (!proj) return;

  const authorInput = document.getElementById(`inline-review-author-${projectId}`);
  const commentInput = document.getElementById(`inline-review-comment-${projectId}`);
  const picker = document.getElementById(`star-picker-${projectId}`);

  const author = authorInput ? authorInput.value.trim() : '';
  const comment = commentInput ? commentInput.value.trim() : '';
  const rating = picker ? Number(picker.getAttribute('data-rating') || 5) : 5;

  if (!comment) {
    showToast('Please type your review or guidance.');
    if (commentInput) commentInput.focus();
    return;
  }

  const reviewerName = author || (userProfile && userProfile.name) || 'Peer Reviewer';
  const role = (userProfile && userProfile.role) || 'Senior / Peer';

  if (!proj.reviews) proj.reviews = [];

  const newReview = {
    id: 'rev-' + Date.now(),
    author: reviewerName,
    role,
    rating,
    comment,
    helpful: 0,
    timestamp: 'Just now'
  };

  proj.reviews.unshift(newReview);
  renderProjects();
  showToast(`★ ${rating}-Star Review added for "${proj.title}"!`);

  // Sync to Firestore
  try {
    const docId = proj.firestoreId || proj.id;
    const projDocRef = doc(db, "projects", docId);
    await updateDoc(projDocRef, { reviews: proj.reviews });
  } catch (err) {
    console.warn("Firestore sync fallback for review:", err);
  }
}

export function toggleQuickComposer() {
  const form = document.getElementById('inline-project-form');
  const btn = document.getElementById('btn-toggle-quick-composer');
  if (!form) return;
  if (form.style.display === 'none') {
    form.style.display = 'flex';
    if (btn) btn.textContent = 'Hide Form ▴';
  } else {
    form.style.display = 'none';
    if (btn) btn.textContent = 'Open Form ▾';
  }
}

export async function handleInlineProjectSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const title = document.getElementById('inline-proj-title')?.value.trim();
  const domain = document.getElementById('inline-proj-domain')?.value || 'AI/ML';
  const stage = document.getElementById('inline-proj-stage')?.value || 'Capstone In-Progress';
  const abstract = document.getElementById('inline-proj-desc')?.value.trim();
  const membersNeeded = document.getElementById('inline-proj-members')?.value.trim();
  const helpNeeded = document.getElementById('inline-proj-help')?.value.trim();
  const leadName = document.getElementById('inline-proj-lead')?.value.trim();
  const leadRole = document.getElementById('inline-proj-role')?.value || 'Junior · TE Comp 2027';
  const leadContact = document.getElementById('inline-proj-contact')?.value.trim();

  if (!title || !abstract || !leadName) {
    showToast('Please fill out the project title, abstract, and your name.');
    return;
  }

  const newProject = {
    id: 'proj-' + Date.now(),
    title,
    domain,
    stage,
    abstract,
    techStack: [domain, 'Autonomous', 'AIT'],
    membersNeeded: membersNeeded || '',
    helpNeeded: helpNeeded || '',
    leadName,
    leadRole,
    leadContact: leadContact || 'ait@aitpune.edu.in',
    timestamp: 'Just now',
    upvotes: 1,
    reviews: []
  };

  projectsData.unshift(newProject);

  const countBadge = document.getElementById('senior-projects-count-badge');
  if (countBadge) countBadge.textContent = projectsData.length;

  renderProjects();

  const form = document.getElementById('inline-project-form');
  if (form) form.reset();

  showToast(`🚀 Project "${title}" published live to Senior Hub!`);

  // Clean any accidental undefined values
  const cleanProject = {};
  for (const [k, v] of Object.entries(newProject)) {
    if (v !== undefined) cleanProject[k] = v;
  }

  // Sync to Firestore
  try {
    const docRef = await addDoc(collection(db, "projects"), cleanProject);
    newProject.id = docRef.id;
    newProject.firestoreId = docRef.id;
    console.log("✅ Project synced live to Firestore with ID:", docRef.id);
  } catch (err) {
    console.warn("Firestore sync fallback for project:", err);
  }
}

export function openProjectCreateModal() {
  switchSeniorTab('projects');
  const composer = document.getElementById('project-quick-composer');
  const form = document.getElementById('inline-project-form');
  const inlineInput = document.getElementById('inline-proj-title');
  if (composer && inlineInput) {
    if (form) form.style.display = 'flex';
    const btn = document.getElementById('btn-toggle-quick-composer');
    if (btn) btn.textContent = 'Hide Form ▴';
    composer.classList.add('highlight-focus');
    composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      inlineInput.focus();
      setTimeout(() => composer.classList.remove('highlight-focus'), 1800);
    }, 400);
    showToast('Fill in details below to post your project!');
    return;
  }

  const modal = document.getElementById('project-create-modal');
  if (modal) {
    const leadInput = document.getElementById('project-form-lead');
    if (leadInput && userProfile && userProfile.name && !leadInput.value) {
      leadInput.value = userProfile.name;
    }
    modal.classList.add('open');
  }
}

export function closeProjectCreateModal() {
  const modal = document.getElementById('project-create-modal');
  if (modal) modal.classList.remove('open');
}

export function switchSeniorTab(tabName) {
  const projectsView = document.getElementById('senior-projects-view');
  const consensusView = document.getElementById('senior-consensus-view');
  const tabProjectsBtn = document.getElementById('tab-senior-projects');
  const tabConsensusBtn = document.getElementById('tab-senior-consensus');

  if (tabName === 'projects') {
    if (projectsView) projectsView.style.display = 'block';
    if (consensusView) consensusView.style.display = 'none';
    if (tabProjectsBtn) tabProjectsBtn.classList.add('active');
    if (tabConsensusBtn) tabConsensusBtn.classList.remove('active');
    renderProjects();
  } else if (tabName === 'consensus') {
    if (projectsView) projectsView.style.display = 'none';
    if (consensusView) consensusView.style.display = 'block';
    if (tabConsensusBtn) tabConsensusBtn.classList.add('active');
    if (tabProjectsBtn) tabProjectsBtn.classList.remove('active');
  }
}

export async function handleProjectSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const title = document.getElementById('project-form-title')?.value.trim();
  const domain = document.getElementById('project-form-domain')?.value || 'AI/ML';
  const stage = document.getElementById('project-form-stage')?.value || 'Capstone In-Progress';
  const abstract = document.getElementById('project-form-desc')?.value.trim();
  const stackInput = document.getElementById('project-form-stack')?.value.trim();
  const membersNeeded = document.getElementById('project-form-members')?.value.trim();
  const helpNeeded = document.getElementById('project-form-help')?.value.trim();
  const leadName = document.getElementById('project-form-lead')?.value.trim();
  const leadRole = document.getElementById('project-form-role')?.value;
  const leadContact = document.getElementById('project-form-contact')?.value.trim();

  if (!title || !abstract || !leadName) {
    showToast('Please fill out all required fields.');
    return;
  }

  const techStack = stackInput
    ? stackInput.split(',').map(s => s.trim()).filter(Boolean)
    : [domain];

  const newProject = {
    id: 'proj-' + Date.now(),
    title,
    domain,
    stage,
    abstract,
    techStack,
    membersNeeded: membersNeeded || '',
    helpNeeded: helpNeeded || '',
    leadName,
    leadRole,
    leadContact: leadContact || 'ait@aitpune.edu.in',
    timestamp: 'Just now',
    upvotes: 1,
    reviews: []
  };

  projectsData.unshift(newProject);
  
  // Update count badges
  const countBadge = document.getElementById('senior-projects-count-badge');
  if (countBadge) countBadge.textContent = projectsData.length;

  renderProjects();
  closeProjectCreateModal();

  const form = document.getElementById('project-create-form');
  if (form) form.reset();

  showToast('Project published to Senior Hub Incubator!');

  // Clean any accidental undefined values
  const cleanProject = {};
  for (const [k, v] of Object.entries(newProject)) {
    if (v !== undefined) cleanProject[k] = v;
  }

  // Sync to Firestore projects collection
  try {
    const docRef = await addDoc(collection(db, "projects"), cleanProject);
    newProject.id = docRef.id;
    newProject.firestoreId = docRef.id;
    console.log("✅ Project synced live to Firestore with ID:", docRef.id);
  } catch (err) {
    console.warn("Firestore sync offline fallback for project:", err);
  }
}

export function openProjectReviewModal(projectId) {
  const modal = document.getElementById('project-review-modal');
  if (!modal) return;

  const proj = projectsData.find(p => p.id === projectId);
  if (!proj) return;

  const titleEl = document.getElementById('review-modal-project-title');
  if (titleEl) titleEl.textContent = proj.title;

  const idInput = document.getElementById('review-form-project-id');
  if (idInput) idInput.value = projectId;

  const authorInput = document.getElementById('review-form-author');
  if (authorInput && userProfile && userProfile.name && !authorInput.value) {
    authorInput.value = userProfile.name;
  }

  modal.classList.add('open');
}

export function closeProjectReviewModal() {
  const modal = document.getElementById('project-review-modal');
  if (modal) modal.classList.remove('open');
}

export async function handleReviewSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const projectId = document.getElementById('review-form-project-id')?.value;
  const author = document.getElementById('review-form-author')?.value.trim();
  const role = document.getElementById('review-form-role')?.value || 'Senior Mentor · 4th Year';
  const comment = document.getElementById('review-form-comment')?.value.trim();
  
  const selectedRatingRadio = document.querySelector('input[name="project_rating"]:checked');
  const rating = selectedRatingRadio ? Number(selectedRatingRadio.value) : 5;

  if (!projectId || !author || !comment) {
    showToast('Please enter your name and review commentary.');
    return;
  }

  const proj = projectsData.find(p => p.id === projectId);
  if (!proj) return;

  if (!proj.reviews) proj.reviews = [];

  const newReview = {
    id: 'rev-' + Date.now(),
    author,
    role,
    rating,
    comment,
    timestamp: 'Just now'
  };

  proj.reviews.unshift(newReview);
  renderProjects();
  closeProjectReviewModal();

  const form = document.getElementById('project-review-form');
  if (form) form.reset();

  showToast(`Review submitted! "${proj.title}" rating updated live.`);

  // Attempt Firestore sync
  try {
    const docId = proj.firestoreId || proj.id;
    const projDocRef = doc(db, "projects", docId);
    await updateDoc(projDocRef, {
      reviews: proj.reviews
    });
  } catch (err) {
    console.warn("Firestore sync fallback for review:", err);
  }
}

export function toggleUpvoteProject(projectId) {
  const proj = projectsData.find(p => p.id === projectId);
  if (proj) {
    proj.upvotes = (proj.upvotes || 0) + 1;
    renderProjects();
    showToast(`Upvoted "${proj.title}"!`);

    try {
      const docId = proj.firestoreId || proj.id;
      const projDocRef = doc(db, "projects", docId);
      updateDoc(projDocRef, { upvotes: increment(1) });
    } catch (err) {
      console.warn("Firestore sync fallback for project upvote:", err);
    }
  }
}

// Master Render
export function renderAllViews() {
  renderFeed();
  renderIssues();
  renderMarketplace();
  renderClubs();
  renderClubNotices();
  renderSeniorsHub();
}

// ============================================================================
// 10. AUTH UI BAR & PROFILE VIEW COUNTER
// ============================================================================
function updateAuthUI() {
  const authBar = document.getElementById('pulse-auth-bar');
  if (!authBar) return;

  if (currentUser && userProfile) {
    const avatarHtml = userProfile.photoURL 
      ? `<img src="${userProfile.photoURL}" class="chip-avatar-img" alt="${userProfile.name}" style="width:28px;height:28px;border-radius:0 !important;object-fit:cover;">`
      : `<span class="chip-avatar">${userProfile.name ? userProfile.name[0] : 'U'}</span>`;

    authBar.innerHTML = `
      <div class="auth-logged-in-wrap">
        <div class="user-chip" onclick="window.CampusPulse.openStudentProfile('${currentUser.uid}', '${userProfile.name.replace(/'/g, "\\'")}', '${userProfile.role}')" title="Inspect your public student card">
          ${avatarHtml}
          <div class="chip-details">
            <span class="chip-name">${userProfile.name}</span>
            <span class="chip-sub">${userProfile.branch} • ${userProfile.year} (${userProfile.role})</span>
          </div>
        </div>

        <div class="profile-views-pill" title="Every time another student visits your account, this updates live on Firebase!">
          <span class="eye-glyph">👁️</span>
          <span class="views-text"><strong>${userProfile.profileViews || 0}</strong> Student Views</span>
        </div>

        <button class="btn-magenta-pill" onclick="window.CampusPulse.openPostModal('help')">
          <span>+ Dispatch Notice</span>
        </button>

        <button class="notif-bell-btn" onclick="window.CampusPulse.toggleNotifDrawer()" title="View ON CAMPUS Alerts">
          <span>🔔</span>
        </button>

        <button class="sign-out-btn" onclick="window.CampusPulse.handleSignOut()" title="Sign Out">
          <span>Log Out</span>
        </button>
      </div>
    `;
  } else {
    authBar.innerHTML = `
      <div class="auth-logged-out-wrap">
        <div class="auth-guest-notice">
          <span class="dot-indicator"></span>
          <span>Viewing as Guest // Sign in to post queries, list textbooks & track Wi-Fi tickets</span>
        </div>
        <div class="auth-actions-group">
          <button class="btn-outline-dark btn-google-quick" onclick="window.CampusPulse.signInWithGoogle()" title="Sign In with Google Account">
            <svg viewBox="0 0 24 24" width="13" height="13" style="vertical-align:middle; margin-right:4px;" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google
          </button>
          <button class="btn-outline-dark" onclick="window.CampusPulse.openAuthModal('signin')">Sign In</button>
          <button class="btn-magenta-pill" onclick="window.CampusPulse.openAuthModal('signup')">Create Account</button>
          <button class="btn-demo-quick" onclick="window.CampusPulse.handleDemoSignIn('Student')" title="1-Click Demo Profile">Demo Student</button>
          <button class="btn-demo-quick" onclick="window.CampusPulse.handleDemoSignIn('Senior')" title="1-Click Senior Mentor Profile">Demo Senior</button>
        </div>
      </div>
    `;
  }
}

// ============================================================================
// 11. MODAL CONTROLLERS
// ============================================================================

// Auth Modal
export function openAuthModal(tab = 'signin') {
  const modal = document.getElementById('pulse-auth-modal');
  if (!modal) return;
  modal.classList.add('open');
  switchAuthTab(tab);
}

export function closeAuthModal() {
  const modal = document.getElementById('pulse-auth-modal');
  if (modal) modal.classList.remove('open');
}

export function switchAuthTab(tab) {
  const tabSignin = document.getElementById('auth-tab-signin');
  const tabSignup = document.getElementById('auth-tab-signup');
  const formSignin = document.getElementById('form-auth-signin');
  const formSignup = document.getElementById('form-auth-signup');

  if (tab === 'signin') {
    tabSignin?.classList.add('active');
    tabSignup?.classList.remove('active');
    if (formSignin) formSignin.style.display = 'block';
    if (formSignup) formSignup.style.display = 'none';
  } else {
    tabSignup?.classList.add('active');
    tabSignin?.classList.remove('active');
    if (formSignup) formSignup.style.display = 'block';
    if (formSignin) formSignin.style.display = 'none';
  }
}

// Post Creation Modal
export function openPostModal(initialType = 'help') {
  if (!currentUser) {
    openAuthModal('signin');
    showToast('Sign in first to post notices or report issues.');
    return;
  }
  const modal = document.getElementById('pulse-post-modal');
  if (!modal) return;
  modal.classList.add('open');
  currentModalPostType = initialType;
  switchPostType(initialType);
}

export function closePostModal() {
  const modal = document.getElementById('pulse-post-modal');
  if (modal) modal.classList.remove('open');
}

export function switchPostType(type) {
  currentModalPostType = type;
  const tabs = document.querySelectorAll('.post-type-tab');
  tabs.forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-type') === type);
  });

  const categoryRow = document.getElementById('post-form-category-row');
  const locationRow = document.getElementById('post-form-location-row');
  const priceRow = document.getElementById('post-form-price-row');
  const clubTagRow = document.getElementById('post-form-clubtag-row');
  const titleLabel = document.getElementById('post-form-title-label');
  const titleInput = document.getElementById('post-form-title');

  // Reset conditional fields
  if (type === 'problem') {
    if (titleLabel) titleLabel.textContent = 'Problem Headline *';
    if (titleInput) titleInput.placeholder = 'e.g. Wi-Fi router flashing red in H-3 Wing B';
    if (categoryRow) {
      categoryRow.style.display = 'grid';
      const catSelect = document.getElementById('post-form-category');
      if (catSelect && !catSelect.querySelector('option[value="Wi-Fi"]')) {
        catSelect.innerHTML = `
          <option value="Wi-Fi" selected>Wi-Fi & Mesh</option>
          <option value="Hostel & Water">Hostel & Water Dispenser</option>
          <option value="Mess & Food">Mess & Food Hygiene</option>
          <option value="Labs">Labs & Hardware</option>
          <option value="Cleanliness">Cleanliness & AC</option>
        `;
      }
    }
    if (locationRow) locationRow.style.display = 'block';
    if (priceRow) priceRow.style.display = 'none';
    if (clubTagRow) clubTagRow.style.display = 'none';
  } else if (type === 'market') {
    if (titleLabel) titleLabel.textContent = 'Item Title & Model *';
    if (titleInput) titleInput.placeholder = 'e.g. Higher Engineering Mathematics — BS Grewal 44th Ed';
    if (categoryRow) {
      categoryRow.style.display = 'grid';
      const catSelect = document.getElementById('post-form-category');
      if (catSelect) {
        catSelect.innerHTML = `
          <option value="Electronics" selected>Electronics & Hardware</option>
          <option value="Textbooks">Textbooks & Notes</option>
          <option value="Hostel Gear">Hostel Essentials & Cycles</option>
          <option value="Lab Equipment">Lab Equipment</option>
        `;
      }
    }
    if (locationRow) locationRow.style.display = 'block';
    if (priceRow) priceRow.style.display = 'grid';
    if (clubTagRow) clubTagRow.style.display = 'none';
  } else if (type === 'notice') {
    if (titleLabel) titleLabel.textContent = 'Club Notice Title *';
    if (titleInput) titleInput.placeholder = 'e.g. Innerve 2026: 36-Hour Hackathon Registration is Live';
    if (categoryRow) categoryRow.style.display = 'none';
    if (locationRow) locationRow.style.display = 'block';
    if (priceRow) priceRow.style.display = 'none';
    if (clubTagRow) clubTagRow.style.display = 'block';
  } else {
    // Query / Help
    if (titleLabel) titleLabel.textContent = 'Query / Short Summary *';
    if (titleInput) titleInput.placeholder = 'e.g. Urgent advice for SPPU Autonomous Electives 6th Sem';
    if (categoryRow) categoryRow.style.display = 'none';
    if (locationRow) locationRow.style.display = 'block';
    if (priceRow) priceRow.style.display = 'none';
    if (clubTagRow) clubTagRow.style.display = 'block';
  }
}

// Toggle Item Sold State
export async function toggleItemSold(itemId, newSoldState) {
  if (!currentUser) {
    openAuthModal('signin');
    showToast('Sign in first to update listing status.');
    return;
  }
  const item = marketData.find(m => m.id === itemId);
  if (!item) return;

  const docId = item.firestoreId || item.id;
  try {
    await updateDoc(doc(db, 'marketplace', docId), {
      isSold: newSoldState
    });
    item.isSold = newSoldState;
    renderMarketplace();
    showToast(newSoldState ? 'Item marked as Sold!' : 'Item marked as Available!');
  } catch (err) {
    console.warn('Update item error:', err);
    item.isSold = newSoldState;
    renderMarketplace();
    showToast(newSoldState ? 'Marked as Sold!' : 'Marked as Available!');
  }
}

// Contact Seller Modal
export function openContactSellerModal(itemId) {
  const item = marketData.find(m => m.id === itemId);
  if (!item) return;

  selectedContactItem = item;
  const modal = document.getElementById('contact-seller-modal') || document.getElementById('pulse-contact-modal');
  if (!modal) return;

  const titleEl = document.getElementById('seller-modal-item-title') || document.getElementById('contact-modal-item-title');
  if (titleEl) titleEl.textContent = item.title;

  const priceEl = document.getElementById('seller-modal-item-price') || document.getElementById('contact-modal-item-price');
  if (priceEl) priceEl.textContent = `₹${item.price}`;

  const condEl = document.getElementById('seller-modal-item-cond');
  if (condEl) condEl.textContent = item.condition || 'Good';

  const locEl = document.getElementById('seller-modal-location') || document.getElementById('contact-modal-item-location');
  if (locEl) locEl.textContent = item.sellerLocation || 'AIT Campus';

  const sellerBtn = document.getElementById('seller-modal-seller-btn');
  if (sellerBtn) sellerBtn.textContent = `${item.sellerName || 'Student'} (${item.sellerRole || 'Student'})`;

  const waBtn = document.getElementById('seller-modal-wa-link') || document.getElementById('contact-modal-wa-link');
  if (waBtn) {
    const rawContact = String(item.sellerContact || '9823411223').replace(/\D/g, '');
    const cleanPhone = rawContact.length === 10 ? `91${rawContact}` : (rawContact || '919823411223');
    waBtn.href = `https://wa.me/${cleanPhone}?text=Hi!%20Saw%20your%20listing%20for%20${encodeURIComponent(item.title)}%20on%20ON%20CAMPUS%20AIT%20Pune.`;
  }

  modal.classList.add('open');
}

export function closeContactSellerModal() {
  const modal = document.getElementById('contact-seller-modal') || document.getElementById('pulse-contact-modal');
  if (modal) modal.classList.remove('open');
}

export function copySellerContact() {
  if (!selectedContactItem) return;
  navigator.clipboard.writeText(selectedContactItem.sellerContact);
  showToast(`Seller phone (${selectedContactItem.sellerContact}) copied!`);
}

// Quick action to tag a club
export function quickTagClub(tag) {
  const isClubsPage = !!document.getElementById('pulse-clubs-stream');
  openPostModal(isClubsPage ? 'notice' : 'help');
  const clubSelect = document.getElementById('post-form-clubtag');
  if (clubSelect) clubSelect.value = tag;
}

export function filterClubNotices(tag) {
  clubNoticeFilter = tag;
  renderClubNotices();
  const el = document.getElementById('pulse-club-notices-stream');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function toggleJoinClub(clubId) {
  if (!currentUser) {
    openAuthModal('signin');
    showToast('Sign in to join student guilds.');
    return;
  }
  const club = MOCK_CLUBS.find(c => c.id === clubId);
  if (!club) return;

  const storageKey = `joined_clubs_${currentUser.uid}`;
  let joinedClubs = [];
  try {
    joinedClubs = JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (_) {}

  const isJoined = joinedClubs.includes(clubId);
  if (isJoined) {
    joinedClubs = joinedClubs.filter(id => id !== clubId);
    club.membersCount = Math.max(0, (club.membersCount || 0) - 1);
    showToast(`Left ${club.name}`);
  } else {
    joinedClubs.push(clubId);
    club.membersCount = (club.membersCount || 0) + 1;
    showToast(`Joined ${club.name}! 🎉`);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(joinedClubs));
  } catch (_) {}

  renderClubs();
}

// Flag post for moderation
export function flagPost(postId) {
  const post = postsData.find(p => p.id === postId);
  if (post) {
    post.flagged = true;
    renderFeed();
    showToast('Notice flagged for moderator review.');
  }
}

// Notifications Drawer Toggle
export function toggleNotifDrawer() {
  const drawer = document.getElementById('pulse-notif-drawer');
  if (drawer) drawer.classList.toggle('open');
}

// ============================================================================
// 12. TAB SWITCHER & GLOBAL EXPORTS
// ============================================================================
export function switchTab(tabId) {
  activeTab = tabId;
  const tabBtns = document.querySelectorAll('.pulse-tab-trigger');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  const views = document.querySelectorAll('.pulse-tab-view');
  views.forEach(v => {
    v.classList.toggle('active', v.getAttribute('data-tab') === tabId);
  });

  renderAllViews();
}

export function switchTabAndScroll(tabId) {
  switchTab(tabId);
  const el = document.getElementById('campuspulse-platform');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Expose on window.CampusPulse for inline onclick handlers
window.CampusPulse = {
  firebaseConfig,
  app,
  auth,
  db,
  initializeAuth,
  handleSignIn,
  handleSignUp,
  handleGoogleSignIn,
  signInWithGoogle: handleGoogleSignIn,
  handleDemoSignIn,
  handleSignOut,
  openStudentProfile,
  closeStudentProfile,
  createNewSubmission,
  toggleUpvotePost,
  togglePostComments,
  addPostComment,
  bumpIssue,
  renderAllViews,
  switchTab,
  switchTabAndScroll,
  openAuthModal,
  closeAuthModal,
  switchAuthTab,
  openPostModal,
  closePostModal,
  switchPostType,
  openContactSellerModal,
  closeContactSellerModal,
  copySellerContact,
  quickTagClub,
  flagPost,
  toggleNotifDrawer,
  showToast,
  openProjectCreateModal,
  closeProjectCreateModal,
  handleProjectSubmit,
  handleInlineProjectSubmit,
  toggleQuickComposer,
  applyProjectTemplate,
  openProjectReviewModal,
  closeProjectReviewModal,
  handleReviewSubmit,
  submitInlineReview,
  setStarPicker,
  appendReviewTag,
  upvoteReview,
  copyContact,
  shareProject,
  toggleUpvoteProject,
  renderProjects,
  switchSeniorTab,
  setProjectSort,
  setProjectDomainFilter: (d) => { projectDomainFilter = d; renderProjects(); },
  setProjectNeedFilter: (n) => { projectNeedFilter = n; renderProjects(); },
  setProjectsSearchQuery: (q) => { projectsSearchQuery = q; renderProjects(); },
  setSearchQuery: (q) => { searchQuery = q; renderAllViews(); },
  setFeedCategory: (c) => { feedCategoryFilter = c; renderFeed(); },
  setIssueStatus: (s) => { issueStatusFilter = s; renderIssues(); },
  filterByFacility: (f) => { facilityFilter = f; renderIssues(); },
  setFacilityFilter: (f) => { facilityFilter = f; renderIssues(); },
  setMarketCategory: (m) => { marketCategoryFilter = m; renderMarketplace(); },
  toggleItemSold,
  setClubSearchQuery: (q) => { clubSearchQuery = q; renderClubs(); },
  setClubDomain: (d) => { clubDomainFilter = d; renderClubs(); },
  filterClubNotices,
  toggleJoinClub,
  renderClubNotices
};

// Aliased as OnCampus
window.OnCampus = window.CampusPulse;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderAllViews();
  initializeAuth();

  // Search input binding
  const searchInput = document.getElementById('pulse-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      window.CampusPulse.setSearchQuery(e.target.value);
    });
  }

  // Clear search button
  const clearBtn = document.getElementById('pulse-search-clear');
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      window.CampusPulse.setSearchQuery('');
    });
  }

  // Category filter clicks
  document.querySelectorAll('.filter-pill[data-feed-cat]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-feed-cat]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.CampusPulse.setFeedCategory(pill.getAttribute('data-feed-cat'));
    });
  });

  document.querySelectorAll('.filter-pill[data-issue-status]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-issue-status]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.CampusPulse.setIssueStatus(pill.getAttribute('data-issue-status'));
    });
  });

  document.querySelectorAll('.filter-pill[data-market-cat]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-market-cat]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.CampusPulse.setMarketCategory(pill.getAttribute('data-market-cat'));
    });
  });

  // Tab buttons binding
  document.querySelectorAll('.pulse-tab-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      window.CampusPulse.switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Post modal type switcher tabs
  document.querySelectorAll('.post-type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      window.CampusPulse.switchPostType(tab.getAttribute('data-type'));
    });
  });

  // Post form submit
  const postForm = document.getElementById('pulse-create-form');
  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeTypeTab = document.querySelector('.post-type-tab.active');
      const hiddenTypeInput = document.getElementById('post-form-type');
      const isMarketplacePage = !!document.getElementById('pulse-marketplace-stream');
      const isIssuesPage = !!document.getElementById('pulse-issues-stream');
      const isClubsPage = !!document.getElementById('pulse-clubs-stream');

      const type = activeTypeTab 
        ? activeTypeTab.getAttribute('data-type') 
        : (hiddenTypeInput?.value || currentModalPostType || (isMarketplacePage ? 'market' : (isIssuesPage ? 'problem' : (isClubsPage ? 'notice' : 'help'))));
      
      const title = document.getElementById('post-form-title')?.value || '';
      const content = document.getElementById('post-form-content')?.value || '';
      const category = document.getElementById('post-form-category')?.value || (type === 'market' ? 'Electronics' : (type === 'notice' ? 'Club Events' : 'Wi-Fi'));
      const facilityKey = document.getElementById('post-form-facility')?.value || 'hostel';
      const location = document.getElementById('post-form-location')?.value || 'Hostel 3';
      const price = document.getElementById('post-form-price')?.value || '';
      const condition = document.getElementById('post-form-condition')?.value || 'Good';
      const taggedClub = document.getElementById('post-form-clubtag')?.value || '';
      const isAnon = document.getElementById('post-form-anon')?.checked || false;

      window.CampusPulse.createNewSubmission({
        type,
        title,
        content,
        category,
        facilityKey,
        location,
        price,
        condition,
        taggedClub,
        isAnon
      });
      postForm.reset();
      window.CampusPulse.closePostModal();
    });
  }

  // Auth Sign-In Form Submit
  const signinForm = document.getElementById('form-auth-signin');
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-signin-email')?.value || '';
      const pass = document.getElementById('auth-signin-pass')?.value || '';
      const errBox = document.getElementById('auth-signin-error');
      if (errBox) errBox.textContent = '';
      try {
        await window.CampusPulse.handleSignIn(email, pass);
      } catch (err) {
        if (errBox) errBox.textContent = err.message;
      }
    });
  }

  // Auth Sign-Up Form Submit
  const signupForm = document.getElementById('form-auth-signup');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-signup-name')?.value || '';
      const email = document.getElementById('auth-signup-email')?.value || '';
      const branch = document.getElementById('auth-signup-branch')?.value || 'Computer Engineering';
      const year = document.getElementById('auth-signup-year')?.value || '3rd Year';
      const role = document.getElementById('auth-signup-role')?.value || 'Student';
      const password = document.getElementById('auth-signup-pass')?.value || '';
      const errBox = document.getElementById('auth-signup-error');
      if (errBox) errBox.textContent = '';
      try {
        await window.CampusPulse.handleSignUp({ name, email, branch, year, role, password });
      } catch (err) {
        if (errBox) errBox.textContent = err.message;
      }
    });
  }

  // Project Incubator: Search input binding
  const projSearchInput = document.getElementById('projects-search-input');
  if (projSearchInput) {
    projSearchInput.addEventListener('input', (e) => {
      window.OnCampus.setProjectsSearchQuery(e.target.value);
    });
  }

  // Club Search input binding
  const clubSearchInput = document.getElementById('pulse-club-search-input');
  if (clubSearchInput) {
    clubSearchInput.addEventListener('input', (e) => {
      window.OnCampus.setClubSearchQuery(e.target.value);
    });
  }

  // Clear club search button
  const clubClearBtn = document.getElementById('pulse-club-search-clear');
  if (clubClearBtn && clubSearchInput) {
    clubClearBtn.addEventListener('click', () => {
      clubSearchInput.value = '';
      window.OnCampus.setClubSearchQuery('');
    });
  }

  // Club domain filter chips
  document.querySelectorAll('#pulse-club-chips .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#pulse-club-chips .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.OnCampus.setClubDomain(pill.getAttribute('data-club-domain') || 'all');
    });
  });

  // Project Incubator: Domain filter buttons
  document.querySelectorAll('#project-domain-filters .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#project-domain-filters .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.OnCampus.setProjectDomainFilter(pill.getAttribute('data-project-domain') || 'all');
    });
  });

  // Project Incubator: Need filter buttons (Members vs Senior Help)
  document.querySelectorAll('#project-need-filters .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#project-need-filters .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.OnCampus.setProjectNeedFilter(pill.getAttribute('data-project-need') || 'all');
    });
  });

  // Project Incubator: Inline Quick Composer Form Submit
  const inlineProjForm = document.getElementById('inline-project-form');
  if (inlineProjForm) {
    inlineProjForm.addEventListener('submit', (e) => {
      window.OnCampus.handleInlineProjectSubmit(e);
    });
  }

  // Project Post Modal Form Submit
  const projectCreateForm = document.getElementById('project-create-form');
  if (projectCreateForm) {
    projectCreateForm.addEventListener('submit', (e) => {
      window.OnCampus.handleProjectSubmit(e);
    });
  }

  // Project Review Modal Form Submit
  const projectReviewForm = document.getElementById('project-review-form');
  if (projectReviewForm) {
    projectReviewForm.addEventListener('submit', (e) => {
      window.OnCampus.handleReviewSubmit(e);
    });
  }
});
