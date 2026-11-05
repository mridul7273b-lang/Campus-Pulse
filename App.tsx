/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Bell, 
  Plus, 
  ThumbsUp, 
  MessageSquare, 
  Tag, 
  ShieldCheck, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Filter, 
  ChevronRight, 
  X, 
  Camera, 
  Radio, 
  Share2, 
  Flag, 
  Sparkles, 
  ExternalLink, 
  HelpCircle,
  GraduationCap,
  Wrench,
  Check,
  Send,
  Phone,
  Mail,
  UserCheck,
  Layers,
  ArrowUpRight,
  Eye,
  LogOut,
  Lock,
  User as UserIcon,
  BookOpen
} from 'lucide-react';

import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './firebase';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  increment, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

/* ==========================================================================
   INTERFACES & INITIAL SEED DATA
   ========================================================================== */

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  role: 'Student' | 'Senior' | 'Club Lead';
  branch: string;
  year: string;
  bio?: string;
  postCount: number;
  profileViews: number;
}

export interface PostItem {
  id: string;
  type: 'help' | 'notice' | 'lost_found' | 'peer_favor';
  title: string;
  content: string;
  authorId: string;
  author: string;
  authorRole: 'Student' | 'Senior' | 'Club Lead';
  authorEmail: string;
  taggedClub?: string;
  category: string;
  location?: string;
  timestamp: string;
  upvotes: number;
  upvotedBy?: string[];
  isVerifiedBySenior?: boolean;
  verifiedBy?: string;
  commentsCount: number;
  flagged?: boolean;
}

export interface CampusIssue {
  id: string;
  title: string;
  description: string;
  category: 'Wi-Fi' | 'Hostel & Water' | 'Mess & Food' | 'Labs' | 'Sports' | 'Cleanliness';
  location: string;
  facilityKey: string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Fixed';
  reporterId: string;
  reporter: string;
  reporterRole: string;
  timestamp: string;
  upvotes: number;
  duplicateNotice?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  category: 'Textbooks' | 'Hostel Gear' | 'Electronics' | 'Lab Equipment';
  condition: 'Like New' | 'Good' | 'Fair';
  description: string;
  sellerId: string;
  sellerName: string;
  sellerRole: string;
  sellerContact: string;
  sellerLocation: string;
  timestamp: string;
  isSold: boolean;
}

export const INITIAL_POSTS: PostItem[] = [
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

export const INITIAL_ISSUES: CampusIssue[] = [
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

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
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

export const MOCK_CLUBS = [
  {
    id: 'club-oss',
    tag: '@oss',
    name: 'Open Source Software & Coding Club',
    lead: 'Devansh & Ananya (4th Yr Comp)',
    membersCount: 420,
    description: 'Drives competitive programming sprints, Linux install fests, and annual Innerve hackathon.'
  },
  {
    id: 'club-robotics',
    tag: '@robotics',
    name: 'AIT Robotics Club',
    lead: 'Arjun K. (4th Yr ARE)',
    membersCount: 260,
    description: 'Constructs combat robots, pneumatic manipulators, and autonomous rovers for Robocon.'
  },
  {
    id: 'club-ecell',
    tag: '@ecell',
    name: 'AIT e-Cell (Entrepreneurship)',
    lead: 'Sarthak (4th Yr IT)',
    membersCount: 310,
    description: 'Incubation network supporting student founders with prototypes, pitch decks, and AWES grants.'
  },
  {
    id: 'club-cultural',
    tag: '@cultural',
    name: 'Cultural & Literary Guild',
    lead: 'Meera (4th Yr E&TC)',
    membersCount: 380,
    description: 'Organizers of AIT flagship inter-college festival PACE, music bands, and debate leagues.'
  }
];

export const CAMPUS_FACILITIES = [
  { key: 'hostel', name: 'Hostels & Mess', activeIssues: 2, icon: '🏠' },
  { key: 'library', name: 'Digital Library', activeIssues: 1, icon: '📚' },
  { key: 'labs', name: 'Academic & Labs', activeIssues: 0, icon: '🔬' },
  { key: 'sports', name: 'Sports & OAT', activeIssues: 1, icon: '⚽' },
  { key: 'gate', name: 'Dighi Gate & Plazas', activeIssues: 0, icon: '📍' }
];

/* ==========================================================================
   CAMPUSPULSE MAIN COMPONENT
   ========================================================================== */

export default function App() {
  // Navigation & Authentication
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<StudentProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Auth Modal (Sign In vs Sign Up)
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBranch, setAuthBranch] = useState('Computer Engineering');
  const [authYear, setAuthYear] = useState('3rd Year');
  const [authRole, setAuthRole] = useState<'Student' | 'Senior' | 'Club Lead'>('Student');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // App Tabs: 'feed' | 'issues' | 'marketplace' | 'clubs' | 'seniors'
  const [activeTab, setActiveTab] = useState<'feed' | 'issues' | 'marketplace' | 'clubs' | 'seniors'>('feed');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('all');
  const [issueStatusFilter, setIssueStatusFilter] = useState<string>('all');
  const [marketCategoryFilter, setMarketCategoryFilter] = useState<string>('all');

  // Live Data Lists (Synced with Firestore)
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [issues, setIssues] = useState<CampusIssue[]>(INITIAL_ISSUES);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);

  // Modals & Drawers
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalType, setPostModalType] = useState<'help' | 'problem' | 'market' | 'notice'>('help');
  const [viewedProfile, setViewedProfile] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [contactSellerModal, setContactSellerModal] = useState<MarketplaceItem | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Wi-Fi');
  const [newLocation, setNewLocation] = useState('Hostel 3');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState<'Like New' | 'Good' | 'Fair'>('Good');
  const [newTagClub, setNewTagClub] = useState('');
  const [postAsAnon, setPostAsAnon] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create user profile document in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as StudentProfile);
          } else {
            // Create default profile for newly registered user
            const initialProfile: StudentProfile = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'AIT Student',
              email: user.email || '',
              role: 'Student',
              branch: 'Computer Engineering',
              year: '3rd Year',
              postCount: 0,
              profileViews: 1,
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore:', err);
          // Fallback local profile
          setUserProfile({
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'AIT Student',
            email: user.email || '',
            role: 'Student',
            branch: 'Computer Engineering',
            year: '3rd Year',
            postCount: 0,
            profileViews: 1,
          });
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time sync for Posts from Firestore (with fallback to local seed data)
  useEffect(() => {
    if (!currentUser) return;

    try {
      const postsRef = collection(db, 'posts');
      const unsubscribe = onSnapshot(postsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedPosts: PostItem[] = snapshot.docs.map(d => ({
            id: d.id,
            ...(d.data() as any)
          }));
          setPosts(fetchedPosts);
        }
      }, (error) => {
        console.warn('Real-time posts subscription note:', error.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore onSnapshot init:', e);
    }
  }, [currentUser]);

  // Auth: Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      const user = userCred.user;

      const newProfile: StudentProfile = {
        uid: user.uid,
        name: authName.trim() || 'AIT Student',
        email: authEmail.trim(),
        role: authRole,
        branch: authBranch,
        year: authYear,
        postCount: 0,
        profileViews: 1,
      };

      // Store in Firestore /users/{userId}
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
      showToast(`Welcome to CampusPulse, ${newProfile.name}!`);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password must be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Could not complete registration.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Auth: Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      showToast('Signed in successfully!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please verify your credentials.');
      } else {
        setAuthError(err.message || 'Could not sign in.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Auth: Demo Sign-in for immediate testing
  const handleDemoSignIn = async (role: 'Student' | 'Senior' = 'Student') => {
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const demoEmail = role === 'Senior' ? 'senior.ait@aitpune.edu.in' : 'student.ait@aitpune.edu.in';
      const demoPass = 'CampusPulse@2026';
      
      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (notFound) {
        // Create the demo account if not exists
        const userCred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        const demoProf: StudentProfile = {
          uid: userCred.user.uid,
          name: role === 'Senior' ? 'Arjun Rathore (4th Yr)' : 'Ayush Kaswa',
          email: demoEmail,
          role: role,
          branch: 'Computer Engineering',
          year: role === 'Senior' ? 'Final Year' : '3rd Year',
          postCount: 3,
          profileViews: 24,
        };
        await setDoc(doc(db, 'users', userCred.user.uid), demoProf);
        setUserProfile(demoProf);
      }
      showToast(`Signed in with demo ${role} profile!`);
    } catch (e: any) {
      setAuthError(e.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Auth: Sign Out
  const handleSignOut = async () => {
    await signOut(auth);
    showToast('Signed out from CampusPulse.');
  };

  // View User Profile (Tracks how many other people view their account!)
  const handleOpenUserProfile = async (targetUserId: string, fallbackName: string, fallbackRole?: string) => {
    setIsProfileModalOpen(true);
    
    // Check if viewing own profile or another student's profile
    const isOwnProfile = currentUser?.uid === targetUserId;

    try {
      const userRef = doc(db, 'users', targetUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as StudentProfile;
        
        // If another authenticated student views this profile, increment profileViews!
        if (!isOwnProfile && currentUser) {
          try {
            await updateDoc(userRef, {
              profileViews: increment(1)
            });
            data.profileViews = (data.profileViews || 0) + 1;
          } catch (incErr) {
            console.warn('Could not increment view counter in Firestore:', incErr);
          }
        }
        setViewedProfile(data);
      } else {
        // Profile does not yet exist in Firestore, construct viewable data
        const fallbackProf: StudentProfile = {
          uid: targetUserId,
          name: fallbackName,
          email: `${fallbackName.toLowerCase().replace(/\s+/g, '_')}@aitpune.edu.in`,
          role: (fallbackRole as any) || 'Student',
          branch: 'Computer Engineering',
          year: '3rd Year',
          postCount: posts.filter(p => p.authorId === targetUserId || p.author === fallbackName).length || 1,
          profileViews: isOwnProfile ? 12 : 13
        };
        setViewedProfile(fallbackProf);
      }
    } catch (err) {
      console.warn('Error fetching profile:', err);
      setViewedProfile({
        uid: targetUserId,
        name: fallbackName,
        email: 'student@aitpune.edu.in',
        role: (fallbackRole as any) || 'Student',
        branch: 'Computer Engineering',
        year: '3rd Year',
        postCount: 1,
        profileViews: 10
      });
    }
  };

  // Create Post / Report Problem / Sell Item
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentUser || !userProfile) return;

    if (postModalType === 'problem') {
      const newIssue: CampusIssue = {
        id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
        title: newTitle,
        description: newContent || 'Reported via student quick report form.',
        category: newCategory as any,
        location: newLocation,
        facilityKey: 'hostel',
        status: 'Reported',
        reporterId: currentUser.uid,
        reporter: postAsAnon ? 'Anonymous Student' : userProfile.name,
        reporterRole: postAsAnon ? 'Student' : userProfile.role,
        timestamp: 'Just now',
        upvotes: 1
      };
      
      try {
        await addDoc(collection(db, 'issues'), newIssue);
      } catch (err) {
        console.warn('Firestore issues write fallback:', err);
      }
      setIssues([newIssue, ...issues]);
      showToast('Problem dispatched to Campus Admin!');
    } else if (postModalType === 'market') {
      const newItem: MarketplaceItem = {
        id: `mkt-${Date.now()}`,
        title: newTitle,
        price: parseInt(newPrice, 10) || 100,
        category: (newCategory as any) || 'Hostel Gear',
        condition: newCondition,
        description: newContent || 'Available on campus.',
        sellerId: currentUser.uid,
        sellerName: postAsAnon ? 'Campus Student' : userProfile.name,
        sellerRole: userProfile.role,
        sellerContact: userProfile.email,
        sellerLocation: newLocation,
        timestamp: 'Just now',
        isSold: false
      };
      
      try {
        await addDoc(collection(db, 'marketplace'), newItem);
      } catch (err) {
        console.warn('Firestore market write fallback:', err);
      }
      setMarketplace([newItem, ...marketplace]);
      showToast('Item listed in Student Marketplace!');
    } else {
      const newPost: PostItem = {
        id: `post-${Date.now()}`,
        type: postModalType === 'notice' ? 'notice' : 'help',
        title: newTitle,
        content: newContent,
        authorId: currentUser.uid,
        author: postAsAnon ? 'Anonymous Student' : userProfile.name,
        authorRole: userProfile.role,
        authorEmail: postAsAnon ? 'anon@aitpune.edu.in' : userProfile.email,
        taggedClub: newTagClub || undefined,
        category: postModalType === 'notice' ? 'Club Events' : 'Peer Query',
        location: newLocation,
        timestamp: 'Just now',
        upvotes: 1,
        upvotedBy: [currentUser.uid],
        isVerifiedBySenior: userProfile.role === 'Senior' || userProfile.role === 'Club Lead',
        verifiedBy: userProfile.role === 'Senior' ? `${userProfile.name} (${userProfile.year})` : undefined,
        commentsCount: 0
      };

      try {
        await addDoc(collection(db, 'posts'), newPost);
        // Increment author's post count in Firestore
        await updateDoc(doc(db, 'users', currentUser.uid), {
          postCount: increment(1)
        });
      } catch (err) {
        console.warn('Firestore post write fallback:', err);
      }

      setPosts([newPost, ...posts]);
      setUserProfile(prev => prev ? { ...prev, postCount: prev.postCount + 1 } : null);
      showToast('Post published to campus feed!');
    }

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewPrice('');
    setIsPostModalOpen(false);
  };

  // Upvote Post
  const handleUpvotePost = async (postId: string) => {
    if (!currentUser) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isUpvoted = p.upvotedBy?.includes(currentUser.uid);
        const nextUpvotes = isUpvoted ? p.upvotes - 1 : p.upvotes + 1;
        const nextUpvotedBy = isUpvoted 
          ? (p.upvotedBy || []).filter(u => u !== currentUser.uid)
          : [...(p.upvotedBy || []), currentUser.uid];

        // Firestore update if available
        try {
          updateDoc(doc(db, 'posts', postId), {
            upvotes: nextUpvotes,
            upvotedBy: nextUpvotedBy
          }).catch(() => {});
        } catch (_) {}

        return {
          ...p,
          upvotes: nextUpvotes,
          upvotedBy: nextUpvotedBy
        };
      }
      return p;
    }));
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.taggedClub && p.taggedClub.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = feedCategoryFilter === 'all' || 
                         (feedCategoryFilter === 'verified' ? p.isVerifiedBySenior : p.type === feedCategoryFilter);
      return matchesSearch && matchesCat && !p.flagged;
    });
  }, [posts, searchQuery, feedCategoryFilter]);

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return issues.filter(iss => {
      const matchesSearch = iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            iss.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = issueStatusFilter === 'all' || iss.status === issueStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [issues, searchQuery, issueStatusFilter]);

  // Filtered Marketplace
  const filteredMarket = useMemo(() => {
    return marketplace.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = marketCategoryFilter === 'all' || item.category === marketCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [marketplace, searchQuery, marketCategoryFilter]);

  const getStatusBadge = (status: CampusIssue['status']) => {
    switch (status) {
      case 'Reported':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">Reported</span>;
      case 'Assigned':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">Assigned</span>;
      case 'In Progress':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">In Progress</span>;
      case 'Fixed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">Fixed ✓</span>;
    }
  };

  // Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-[#e60050] rounded-full animate-spin" />
          <span className="font-mono text-xs text-neutral-500 tracking-wider">CONNECTING TO CAMPUSPULSE...</span>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MANDATORY AUTH GATE: SIGN IN / SIGN UP BEFORE VIEWING OR POSTING
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex flex-col items-center justify-center p-4 selection:bg-[#e60050] selection:text-white">
        
        {/* Campus Header Identity */}
        <div className="w-full max-w-md text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="p-2 bg-[#0a0b0d] text-white rounded">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="8" height="8" rx="1.5"/>
                <rect x="14" y="2" width="8" height="8" rx="1.5"/>
                <rect x="2" y="14" width="8" height="8" rx="1.5"/>
                <rect x="14" y="14" width="8" height="8" rx="1.5"/>
              </svg>
            </span>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
              Campus<span className="text-[#e60050]">Pulse</span>
            </h1>
          </div>
          <p className="font-mono text-xs text-neutral-500">
            AIT PUNE // "Onwards to Glory"
          </p>
          <p className="text-xs text-neutral-600 mt-2">
            Sign in with your college account to view campus notices, track Wi-Fi issues, or access the student marketplace.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="w-full max-w-md bg-white border border-black/10 rounded-xl shadow-2xl p-6 sm:p-8">
          
          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg mb-6 text-xs font-semibold">
            <button
              onClick={() => {
                setAuthTab('signin');
                setAuthError(null);
              }}
              className={`py-2 rounded transition-all cursor-pointer ${authTab === 'signin' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthTab('signup');
                setAuthError(null);
              }}
              className={`py-2 rounded transition-all cursor-pointer ${authTab === 'signup' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">College Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="student@aitpune.edu.in"
                    className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:border-black outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-black/10 rounded focus:border-black outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#0a0b0d] hover:bg-[#e60050] text-white rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{authSubmitting ? 'Authenticating...' : 'Sign In to CampusPulse'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Full Student Name *</label>
                <input 
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Ayush Kaswa"
                  className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">College Email Address *</label>
                <input 
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="ayush_23100@aitpune.edu.in"
                  className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Engineering Branch</label>
                  <select
                    value={authBranch}
                    onChange={(e) => setAuthBranch(e.target.value)}
                    className="w-full px-2 py-2 border border-black/10 rounded focus:border-black outline-none"
                  >
                    <option value="Computer Engineering">Computer Engg</option>
                    <option value="Automation & Robotics">Automation & Robotics</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics & Telecom">Electronics & Telecom</option>
                    <option value="Mechanical Engineering">Mechanical Engg</option>
                    <option value="M.Tech Data Science">M.Tech Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Academic Year</label>
                  <select
                    value={authYear}
                    onChange={(e) => setAuthYear(e.target.value)}
                    className="w-full px-2 py-2 border border-black/10 rounded focus:border-black outline-none"
                  >
                    <option value="1st Year">1st Year (FE)</option>
                    <option value="2nd Year">2nd Year (SE)</option>
                    <option value="3rd Year">3rd Year (TE)</option>
                    <option value="Final Year">Final Year (BE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Role Badge</label>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {(['Student', 'Senior', 'Club Lead'] as const).map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setAuthRole(r)}
                      className={`py-1.5 border rounded font-semibold transition-all ${authRole === r ? 'border-black bg-black text-white' : 'border-black/10 text-neutral-600'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Password (min 6 characters) *</label>
                <input 
                  type="password"
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-[#e60050] hover:bg-[#c90045] text-white rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>{authSubmitting ? 'Registering...' : 'Create Verified Student Account'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-black/10">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block text-center mb-3">
              Quick Test Profiles
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoSignIn('Student')}
                disabled={authSubmitting}
                className="py-2 px-3 border border-black/20 hover:border-black rounded font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Demo Student (3rd Yr)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('Senior')}
                disabled={authSubmitting}
                className="py-2 px-3 border border-black/20 hover:border-black rounded font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Demo Senior (4th Yr)
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================================================
  // AUTHENTICATED CAMPUSPULSE PLATFORM
  // ==========================================================================

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-[#0a0b0d] flex flex-col font-sans pb-24 md:pb-12 antialiased selection:bg-[#e60050] selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0c0d0e] text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#e60050]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#ffffff]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('feed')} 
              className="flex items-center gap-2 hover:opacity-85 text-left cursor-pointer"
            >
              <span className="p-1.5 bg-[#0a0b0d] text-white rounded">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="8" height="8" rx="1.5"/>
                  <rect x="14" y="2" width="8" height="8" rx="1.5"/>
                  <rect x="2" y="14" width="8" height="8" rx="1.5"/>
                  <rect x="14" y="14" width="8" height="8" rx="1.5"/>
                </svg>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-['Space_Grotesk'] font-bold text-lg tracking-tight">
                  Campus<span className="text-[#e60050]">Pulse</span>
                </span>
                <span className="font-mono text-[9px] text-neutral-400 tracking-wider">AIT PUNE</span>
              </div>
            </button>

            {/* Motto */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-black/5 rounded text-[11px] font-mono text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60050]" />
              <span>"Onwards to Glory"</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-2 relative hidden md:block">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search lost items, textbooks, Wi-Fi issues, or @clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 hover:bg-neutral-200/70 focus:bg-white text-xs rounded-full border border-black/5 focus:border-black outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Post Button */}
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="bg-[#e60050] hover:bg-[#c90045] text-white px-3 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#e60050]/20 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </button>

            {/* Alerts */}
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-full relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e60050] rounded-full animate-pulse" />
            </button>

            {/* User Profile Pill with View Count */}
            {userProfile && (
              <button
                onClick={() => handleOpenUserProfile(currentUser.uid, userProfile.name, userProfile.role)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 rounded-full border border-black/5 text-xs transition-colors cursor-pointer"
                title="View your account & how many people viewed you"
              >
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                  {userProfile.name[0]}
                </div>
                <div className="flex flex-col text-left leading-tight hidden sm:flex">
                  <span className="font-semibold text-[11px] truncate max-w-[100px]">{userProfile.name}</span>
                  <span className="text-[9px] font-mono text-neutral-500 flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> {userProfile.profileViews || 0} views
                  </span>
                </div>
              </button>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-2.5 md:hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search campus notices, items, issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-neutral-100 text-xs rounded-full border border-black/5 focus:bg-white focus:border-black outline-none"
            />
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex border-t border-black/5 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-6 w-full flex gap-8 text-xs font-semibold">
            {[
              { id: 'feed', label: 'Feed & Queries' },
              { id: 'issues', label: 'Campus Issues & Map' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'clubs', label: 'Verified Clubs' },
              { id: 'seniors', label: 'Senior Advice Hub' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 relative cursor-pointer transition-colors ${activeTab === tab.id ? 'text-[#e60050]' : 'text-neutral-600 hover:text-black'}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e60050]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS DROPDOWN */}
      {isNotifOpen && (
        <div className="max-w-sm w-full fixed right-4 top-16 z-40 bg-white border border-black/10 shadow-2xl rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center pb-2 border-b border-black/5 mb-3">
            <span className="font-['Space_Grotesk'] font-bold text-sm">Campus Pulse Alerts</span>
            <button onClick={() => setIsNotifOpen(false)} className="text-neutral-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900">Issue #ISS-101 Update</strong>
                <p className="text-amber-800 text-[11px]">Campus Network Admin marked "In Progress" for H-3 Wi-Fi.</p>
              </div>
            </div>
            <div className="p-2 bg-neutral-50 rounded flex gap-2">
              <Eye className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-800">Account Views</strong>
                <p className="text-neutral-600 text-[11px]">Students viewed your profile {userProfile?.profileViews || 0} times!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full">
        
        {/* ==================================================================
            TAB 1: STUDENT FEED & HELP QUERIES
            ================================================================== */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            
            <div className="space-y-5">
              
              {/* Quick Post Prompt */}
              <div 
                onClick={() => setIsPostModalOpen(true)}
                className="bg-white border border-black/10 p-3.5 rounded-lg shadow-sm hover:border-black/30 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    {userProfile?.name[0] || 'A'}
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-500">
                    Lost item? Need study notes or cab share? Post to campus...
                  </span>
                </div>
                <button className="bg-neutral-100 hover:bg-[#e60050] hover:text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
                  + Create
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
                {[
                  { id: 'all', label: 'All Updates' },
                  { id: 'verified', label: 'Verified by Senior ✦' },
                  { id: 'help', label: 'Help & Queries' },
                  { id: 'lost_found', label: 'Lost & Found' },
                  { id: 'notice', label: 'Club Notices' },
                  { id: 'peer_favor', label: 'Peer Favors' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFeedCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${feedCategoryFilter === cat.id ? 'bg-[#0a0b0d] text-white shadow-sm' : 'bg-white border border-black/10 text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Feed Stream */}
              {filteredPosts.length === 0 ? (
                <div className="bg-white border border-dashed border-black/20 p-12 text-center rounded-lg">
                  <HelpCircle className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-600 font-medium">No updates found for this query.</p>
                  <p className="text-xs text-neutral-400 mt-1">Be the first student to post about this!</p>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <article 
                    key={post.id} 
                    className="bg-white border border-black/10 rounded-lg p-5 sm:p-6 shadow-sm hover:border-black/25 transition-all"
                  >
                    {/* Post Meta */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        
                        {/* Author Link with Profile View Tracker */}
                        <button
                          onClick={() => handleOpenUserProfile(post.authorId, post.author, post.authorRole)}
                          className="font-semibold text-xs text-neutral-900 hover:text-[#e60050] transition-colors flex items-center gap-1 cursor-pointer"
                          title="Click to view student profile"
                        >
                          <span>{post.author}</span>
                          <Eye className="w-3 h-3 text-neutral-400" />
                        </button>

                        <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {post.authorRole}
                        </span>

                        {post.taggedClub && (
                          <span className="font-mono text-[10px] bg-[#e60050]/10 text-[#e60050] px-2 py-0.5 rounded font-semibold">
                            {post.taggedClub}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-400">• {post.timestamp}</span>
                      </div>

                      {/* Verified Badge */}
                      {post.isVerifiedBySenior && (
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Senior Verified</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-black mb-1.5 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {post.location && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded mb-4">
                        <MapPin className="w-3 h-3 text-[#e60050]" />
                        <span>{post.location}</span>
                      </div>
                    )}

                    {post.verifiedBy && (
                      <div className="text-[11px] text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-100 mb-4 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified by: <strong>{post.verifiedBy}</strong></span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs text-neutral-500">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleUpvotePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${post.upvotedBy?.includes(currentUser.uid) ? 'bg-[#e60050]/10 text-[#e60050] font-semibold' : 'hover:bg-neutral-100 text-neutral-700'}`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.upvotedBy?.includes(currentUser.uid) ? 'fill-[#e60050]' : ''}`} />
                          <span>{post.upvotes}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount} replies</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, flagged: true } : p));
                          showToast('Post flagged for review.');
                        }}
                        className="hover:text-red-600 transition-colors p-1"
                        title="Flag as spam"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))
              )}

            </div>

            {/* Right Widget Column */}
            <div className="space-y-6 hidden lg:block">
              
              {/* Account Views Overview Card */}
              {userProfile && (
                <div className="bg-white border border-black/10 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Space_Grotesk'] font-bold text-sm">Your Account Pulse</span>
                    <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 my-3">
                    <div className="p-3 bg-neutral-50 rounded border border-black/5 text-center">
                      <span className="font-['Space_Grotesk'] text-2xl font-bold text-black block">{userProfile.postCount}</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono">Posts Sent</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded border border-black/5 text-center">
                      <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#e60050] block">{userProfile.profileViews || 0}</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono">Account Views</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenUserProfile(currentUser.uid, userProfile.name, userProfile.role)}
                    className="w-full py-2 bg-neutral-100 hover:bg-black hover:text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Public Student Card</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Campus Issues Snapshot */}
              <div className="bg-white border border-black/10 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-['Space_Grotesk'] font-bold text-sm">Campus Issue Pipeline</span>
                  <span className="font-mono text-[10px] text-[#e60050] font-semibold">LIVE</span>
                </div>
                <div className="space-y-2 mb-4">
                  {issues.slice(0, 3).map(iss => (
                    <div key={iss.id} className="p-2.5 bg-neutral-50 rounded border border-black/5 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-[10px] text-neutral-500">{iss.id}</span>
                        {getStatusBadge(iss.status)}
                      </div>
                      <div className="font-medium text-neutral-800 truncate">{iss.title}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('issues')}
                  className="w-full py-2 bg-neutral-100 hover:bg-black hover:text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Open Issues Heatmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================================================================
            TAB 2: REPORTED CAMPUS PROBLEMS & INTERACTIVE MAP
            ================================================================== */}
        {activeTab === 'issues' && (
          <div className="space-y-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-black/10 p-6 rounded-lg shadow-sm">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#e60050] font-bold mb-1">
                  <span>PROBLEM TRIAGE // STATUS PIPELINE</span>
                </div>
                <h2 className="text-2xl font-bold font-['Space_Grotesk']">
                  Campus Facilities & Issues Tracker
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Reported &gt; Assigned &gt; In Progress &gt; Fixed. Avoid duplicates by bumping existing reports.
                </p>
              </div>

              <button
                onClick={() => {
                  setPostModalType('problem');
                  setIsPostModalOpen(true);
                }}
                className="bg-[#0a0b0d] hover:bg-[#e60050] text-white px-5 py-2.5 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Camera className="w-4 h-4" />
                <span>Report Problem</span>
              </button>
            </div>

            <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg">AIT 30-Acre Campus Spatial Hotspots</h3>
                  <span className="text-xs text-neutral-500">Click a sector to view active infrastructure notices</span>
                </div>
                
                <div className="flex bg-neutral-100 p-1 rounded gap-1 text-xs font-medium">
                  {['all', 'Reported', 'Assigned', 'In Progress', 'Fixed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setIssueStatusFilter(st)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${issueStatusFilter === st ? 'bg-white text-black shadow-sm font-semibold' : 'text-neutral-600 hover:text-black'}`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {CAMPUS_FACILITIES.map(fac => (
                  <div 
                    key={fac.key} 
                    className="p-3 bg-neutral-50 border border-black/5 rounded text-center hover:border-black/30 transition-all cursor-pointer"
                  >
                    <div className="text-xl mb-1">{fac.icon}</div>
                    <div className="text-xs font-bold text-neutral-800">{fac.name}</div>
                    <div className="text-[10px] font-mono mt-1 text-neutral-500">
                      {fac.activeIssues > 0 ? (
                        <span className="text-[#e60050] font-semibold">{fac.activeIssues} Open Issue(s)</span>
                      ) : (
                        <span className="text-emerald-600">All Clear ✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {filteredIssues.map(issue => (
                  <div 
                    key={issue.id} 
                    className="border border-black/10 rounded-lg p-5 hover:border-black/30 transition-all bg-[#fafafb]"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-neutral-500">{issue.id}</span>
                        <span className="font-mono text-[10px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
                          {issue.category}
                        </span>
                        {getStatusBadge(issue.status)}
                        <span className="text-xs text-neutral-400">• {issue.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 text-[#e60050]" />
                        <span className="font-medium">{issue.location}</span>
                      </div>
                    </div>

                    <h4 className="font-['Space_Grotesk'] text-base font-bold text-black mb-1.5">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      {issue.description}
                    </p>

                    {issue.duplicateNotice && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[11px] p-2.5 rounded mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><strong>Duplicate Cluster:</strong> {issue.duplicateNotice}</span>
                      </div>
                    )}

                    {/* Stepper */}
                    <div className="py-3 border-y border-black/5 my-3 grid grid-cols-4 text-center text-[10px] font-mono">
                      {[
                        { label: 'Reported', active: true },
                        { label: 'Assigned', active: issue.status === 'Assigned' || issue.status === 'In Progress' || issue.status === 'Fixed' },
                        { label: 'In Progress', active: issue.status === 'In Progress' || issue.status === 'Fixed' },
                        { label: 'Fixed', active: issue.status === 'Fixed' }
                      ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-3.5 h-3.5 rounded-full mb-1 flex items-center justify-center ${step.active ? 'bg-[#0a0b0d] text-white' : 'bg-neutral-200'}`}>
                            {step.active && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className={step.active ? 'text-black font-semibold' : 'text-neutral-400'}>{step.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-xs">
                      <button 
                        onClick={() => handleOpenUserProfile(issue.reporterId, issue.reporter, issue.reporterRole)}
                        className="text-neutral-500 hover:text-[#e60050] transition-colors"
                      >
                        Reported by {issue.reporter} ({issue.reporterRole})
                      </button>

                      <button 
                        onClick={() => {
                          setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, upvotes: i.upvotes + 1 } : i));
                          showToast('Flagged as also affecting you (+1 bump)');
                        }}
                        className="bg-white border border-black/10 hover:border-black px-3 py-1 rounded text-xs font-medium text-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-[#e60050]" />
                        <span>Facing this too ({issue.upvotes})</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ==================================================================
            TAB 3: STUDENT MARKETPLACE
            ================================================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-black/10 p-6 rounded-lg shadow-sm">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#e60050] font-bold mb-1">
                  <span>STUDENT PEER EXCHANGE // NO BROKERAGE</span>
                </div>
                <h2 className="text-2xl font-bold font-['Space_Grotesk']">
                  Student Marketplace
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Buy & sell used SPPU textbooks, drafters, white lab coats, cycles, and kettles with fellow AITians.
                </p>
              </div>

              <button
                onClick={() => {
                  setPostModalType('market');
                  setIsPostModalOpen(true);
                }}
                className="bg-[#0a0b0d] hover:bg-[#e60050] text-white px-5 py-2.5 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Sell an Item</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'Textbooks', label: 'Textbooks' },
                { id: 'Lab Equipment', label: 'Lab Coats & Drafters' },
                { id: 'Hostel Gear', label: 'Hostel Gear & Kettles' },
                { id: 'Electronics', label: 'Calculators & Electronics' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setMarketCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${marketCategoryFilter === cat.id ? 'bg-[#0a0b0d] text-white shadow-sm' : 'bg-white border border-black/10 text-neutral-600 hover:bg-neutral-100'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarket.map(item => (
                <article 
                  key={item.id} 
                  className="bg-white border border-black/10 rounded-lg p-5 flex flex-col justify-between shadow-sm hover:border-black/30 transition-all hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${item.condition === 'Like New' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-700'}`}>
                        {item.condition}
                      </span>
                    </div>

                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-black mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#e60050]" />
                      <span>{item.sellerLocation}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                    <span className="font-['Space_Grotesk'] text-2xl font-bold text-black">
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() => setContactSellerModal(item)}
                      className="bg-[#0c0d0e] hover:bg-[#e60050] text-white px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Contact Seller
                    </button>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================================
            TAB 4: VERIFIED CLUBS
            ================================================================== */}
        {activeTab === 'clubs' && (
          <div className="space-y-8">
            <div className="bg-white border border-black/10 p-6 rounded-lg shadow-sm">
              <div className="font-mono text-xs text-[#e60050] font-bold mb-1">
                STUDENT SOCIETIES // VERIFIED ANNOUNCEMENTS
              </div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk']">
                AIT Pune Student Club Registry
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Official clubs post verified notifications and workshops. Tag them on your posts using their handle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_CLUBS.map(club => (
                <div key={club.id} className="bg-white border border-black/10 rounded-lg p-6 shadow-sm hover:border-black/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-[#e60050] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded">
                        {club.tag}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {club.membersCount}+ Active Members
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-black mb-2">{club.name}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-4">{club.description}</p>
                  </div>

                  <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-medium">Lead: {club.lead}</span>
                    <button
                      onClick={() => {
                        setNewTagClub(club.tag);
                        setPostModalType('help');
                        setIsPostModalOpen(true);
                      }}
                      className="bg-black hover:bg-[#e60050] text-white px-3.5 py-1.5 rounded font-semibold transition-colors cursor-pointer"
                    >
                      Ask / Tag Club ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 5: SENIOR ADVICE
            ================================================================== */}
        {activeTab === 'seniors' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/10 p-6 rounded-lg shadow-sm">
              <div className="font-mono text-xs text-[#e60050] font-bold mb-1">
                PEER GUIDANCE // ALUMNI & 4TH YEAR BENCH
              </div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk']">
                Senior Mentorship & Academics Hub
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Verified advice regarding SPPU autonomous electives, internship prep, professor viva styles, and placement guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-black/10 p-5 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-[#e60050] block mb-2">FAQ // 01</span>
                <h3 className="font-bold text-base mb-2 font-['Space_Grotesk']">Autonomous Electives</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Which tracks in Computer Engineering & ARE offer best hands-on lab projects and relaxed attendance policies?
                </p>
                <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-700">
                  <strong>Senior Consensus:</strong> Cloud Native and Edge AI both score 90%+ in internal lab assessment.
                </div>
              </div>

              <div className="bg-white border border-black/10 p-5 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-[#e60050] block mb-2">FAQ // 02</span>
                <h3 className="font-bold text-base mb-2 font-['Space_Grotesk']">Placement Coding Prep</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  How many LeetCode problems should you solve before the July placement drive begins for Microsoft / Deutsche Bank?
                </p>
                <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-700">
                  <strong>Senior Consensus:</strong> 150-200 Mediums across DP, Graphs, and Tree structures is standard benchmark.
                </div>
              </div>

              <div className="bg-white border border-black/10 p-5 rounded-lg shadow-sm">
                <span className="font-mono text-xs font-bold text-[#e60050] block mb-2">FAQ // 03</span>
                <h3 className="font-bold text-base mb-2 font-['Space_Grotesk']">Hostel Mess Rules</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  How to request special diet for sports athletes or report hygiene problems directly to the AWES wardens?
                </p>
                <div className="bg-neutral-50 p-2.5 rounded text-[11px] text-neutral-700">
                  <strong>Senior Consensus:</strong> Post via the "Mess & Food" category on CampusPulse for rapid warden visibility.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-black/10 z-40 px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${activeTab === 'feed' ? 'text-[#e60050] font-bold' : 'text-neutral-500'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${activeTab === 'issues' ? 'text-[#e60050] font-bold' : 'text-neutral-500'}`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Issues</span>
        </button>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#e60050] text-white flex items-center justify-center -mt-5 shadow-lg shadow-[#e60050]/40 active:scale-95 transition-transform cursor-pointer"
          aria-label="Create Post"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${activeTab === 'marketplace' ? 'text-[#e60050] font-bold' : 'text-neutral-500'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Market</span>
        </button>

        <button
          onClick={() => setActiveTab('clubs')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${activeTab === 'clubs' ? 'text-[#e60050] font-bold' : 'text-neutral-500'}`}
        >
          <Users className="w-4 h-4" />
          <span>Clubs</span>
        </button>
      </nav>

      {/* ==================================================================
          MODAL: STUDENT PUBLIC PROFILE & VIEW TRACKER
          ================================================================== */}
      {isProfileModalOpen && viewedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-start pb-3 border-b border-black/10 mb-4">
              <div>
                <span className="font-mono text-[10px] text-[#e60050] font-bold tracking-wider">
                  STUDENT PROFILE CARD
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold">{viewedProfile.name}</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded font-semibold">
                  {viewedProfile.role}
                </span>
                <span className="text-neutral-500">• {viewedProfile.branch} ({viewedProfile.year})</span>
              </div>

              <div className="p-3 bg-neutral-50 border border-black/5 rounded space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono">{viewedProfile.email}</span>
                </div>
              </div>

              {/* Real-time Account Views Metric */}
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[#e60050] font-bold text-lg font-['Space_Grotesk']">
                    <Eye className="w-4 h-4" />
                    <span>{viewedProfile.profileViews || 0}</span>
                  </div>
                  <span className="text-[10px] text-neutral-600 block mt-0.5">Account Views</span>
                </div>

                <div className="p-3 bg-neutral-100 border border-black/5 rounded text-center">
                  <div className="flex items-center justify-center gap-1.5 text-black font-bold text-lg font-['Space_Grotesk']">
                    <Send className="w-4 h-4" />
                    <span>{viewedProfile.postCount || 0}</span>
                  </div>
                  <span className="text-[10px] text-neutral-600 block mt-0.5">Posts Sent</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 italic text-center">
                👁️ Every time another student visits this account, the profile view counter updates live on Firebase.
              </p>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded font-semibold text-xs transition-colors"
              >
                Close Student Card
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          MODAL: CREATE NEW POST / REPORT / MARKETPLACE ITEM
          ================================================================== */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-black/10 mb-4">
              <div>
                <span className="font-mono text-[10px] text-[#e60050] font-bold tracking-wider">
                  DISPATCH TO CAMPUS
                </span>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold">Create Campus Notice</h3>
              </div>
              <button onClick={() => setIsPostModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-semibold mb-4 text-center">
              <button
                type="button"
                onClick={() => setPostModalType('help')}
                className={`py-1.5 rounded transition-all cursor-pointer ${postModalType === 'help' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}
              >
                Query / Help
              </button>
              <button
                type="button"
                onClick={() => setPostModalType('problem')}
                className={`py-1.5 rounded transition-all cursor-pointer ${postModalType === 'problem' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}
              >
                Problem
              </button>
              <button
                type="button"
                onClick={() => setPostModalType('market')}
                className={`py-1.5 rounded transition-all cursor-pointer ${postModalType === 'market' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}
              >
                Marketplace
              </button>
              <button
                type="button"
                onClick={() => setPostModalType('notice')}
                className={`py-1.5 rounded transition-all cursor-pointer ${postModalType === 'notice' ? 'bg-white shadow text-black' : 'text-neutral-500'}`}
              >
                Club Notice
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  {postModalType === 'problem' ? 'Problem Headline *' : postModalType === 'market' ? 'Item Title (e.g. BS Grewal 44th Ed) *' : 'Title / Short Summary *'}
                </label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={postModalType === 'problem' ? 'e.g. Wi-Fi router flashing red in H-3 Wing B' : 'e.g. Urgent study buddy for DSA endsem / Lost calculator'}
                  className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none text-sm"
                />
              </div>

              {postModalType === 'problem' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none"
                    >
                      <option value="Wi-Fi">Wi-Fi & Network</option>
                      <option value="Hostel & Water">Hostel & Water Dispenser</option>
                      <option value="Mess & Food">Mess & Food Hygiene</option>
                      <option value="Labs">Labs & Prototyping Hardware</option>
                      <option value="Cleanliness">Cleanliness & Sanitation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Location / Zone</label>
                    <input 
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Hostel 3 - 2nd Floor"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none"
                    />
                  </div>
                </div>
              )}

              {postModalType === 'market' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Asking Price (₹) *</label>
                    <input 
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Condition</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value as any)}
                      className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none"
                    >
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>
              )}

              {(postModalType === 'help' || postModalType === 'notice') && (
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Tag a Club or Rep (Optional)</label>
                  <select
                    value={newTagClub}
                    onChange={(e) => setNewTagClub(e.target.value)}
                    className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none font-mono text-xs"
                  >
                    <option value="">No specific tag</option>
                    <option value="@oss">@oss (Coding & Hackathons)</option>
                    <option value="@robotics">@robotics (Mechatronics & Robocon)</option>
                    <option value="@ecell">@ecell (Startups & Incubation)</option>
                    <option value="@cultural">@cultural (PACE Festival & Music)</option>
                    <option value="@seniors">@seniors (Final Year Mentors)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Description / Additional Notes</label>
                <textarea 
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context so peers or admin can resolve quickly..."
                  className="w-full px-3 py-2 border border-black/10 rounded focus:border-black outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-neutral-100 rounded">
                <div className="text-xs">
                  <span className="font-semibold block text-neutral-800">Post Anonymously</span>
                  <span className="text-[10px] text-neutral-500">Hide your name for sensitive hostel/mess reports</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={postAsAnon}
                  onChange={(e) => setPostAsAnon(e.target.checked)}
                  className="w-4 h-4 text-[#e60050] rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 border border-black/10 rounded font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#0c0d0e] hover:bg-[#e60050] text-white rounded font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Publish to Firebase</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==================================================================
          MODAL: CONTACT MARKETPLACE SELLER
          ================================================================== */}
      {contactSellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6">
            <div className="flex justify-between items-center pb-2 border-b border-black/10 mb-3">
              <h3 className="font-['Space_Grotesk'] text-base font-bold">Contact Seller</h3>
              <button onClick={() => setContactSellerModal(null)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <span className="text-neutral-500 block">Item:</span>
                <strong className="text-neutral-900 text-sm">{contactSellerModal.title}</strong>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-neutral-500 block">Price:</span>
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e60050]">₹{contactSellerModal.price}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Condition:</span>
                  <span className="font-semibold">{contactSellerModal.condition}</span>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded border border-black/5">
                <span className="text-neutral-500 block mb-1">Pickup Coordinate:</span>
                <span className="font-mono text-black font-semibold">{contactSellerModal.sellerLocation}</span>
                <span className="text-neutral-500 block mt-2 mb-1">Seller:</span>
                <button 
                  onClick={() => {
                    handleOpenUserProfile(contactSellerModal.sellerId, contactSellerModal.sellerName, contactSellerModal.sellerRole);
                    setContactSellerModal(null);
                  }}
                  className="font-semibold text-neutral-800 hover:text-[#e60050] underline cursor-pointer"
                >
                  {contactSellerModal.sellerName} ({contactSellerModal.sellerRole})
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/91${contactSellerModal.sellerContact}?text=Hi!%20Saw%20your%20listing%20for%20${encodeURIComponent(contactSellerModal.title)}%20on%20CampusPulse.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat via WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contactSellerModal.sellerContact);
                  showToast('Seller contact copied to clipboard!');
                }}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-semibold transition-colors"
              >
                Copy Contact ({contactSellerModal.sellerContact})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT FOOTER */}
      <footer className="mt-auto border-t border-black/10 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-2 font-mono">
            <span>CampusPulse AIT Pune</span>
            <span>•</span>
            <span className="text-neutral-400">Connected to Firebase</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>AY 2025-26</span>
            <span>•</span>
            <button onClick={handleSignOut} className="hover:text-black underline cursor-pointer">
              Sign Out ({currentUser.email?.split('@')[0]})
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
