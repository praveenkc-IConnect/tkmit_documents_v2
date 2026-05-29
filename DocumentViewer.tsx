import { useState, useMemo, useEffect } from 'react';
import { Document, ActiveTab, AdminStats } from './types';
import { INITIAL_DOCUMENTS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import DocumentsScreen from './components/DocumentsScreen';
import AdminScreen from './components/AdminScreen';
import DocumentViewer from './components/DocumentViewer';
import { Bell, Check, Trash2, X, Archive, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation / Views State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Documents Local State
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('tkmit_portal_documents');
    if (saved) {
      try {
        const parsed: Document[] = JSON.parse(saved);
        // Clean out duplicates or stale IDs and auto-merge any new default files from INITIAL_DOCUMENTS that are missing
        const parsedIds = new Set(parsed.map((d) => d.id));
        const missingDefaults = INITIAL_DOCUMENTS.filter((d) => !parsedIds.has(d.id));
        if (missingDefaults.length > 0) {
          return [...parsed, ...missingDefaults];
        }
        return parsed;
      } catch (e) {
        console.error("Local storage document parse error:", e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  // Selected document for the modal preview viewer
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  // Search parameters for passing data from Home Screen -> Repository Screen
  const [searchParam, setSearchParam] = useState('');
  const [categoryParam, setCategoryParam] = useState('All Documents');

  // Admin authentication state
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  // Notifications Drawer States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('tkmit_portal_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage notifications parse error:", e);
      }
    }
    return [
      {
        id: 'notif-1',
        title: 'New supplementary timetables announced',
        body: 'S7 Supplementary Exam Schedules are published.',
        date: '2 hours ago',
        read: false
      },
      {
        id: 'notif-2',
        title: 'Attention: Scholarship forms extension',
        body: 'National Scholarship Portal Phase II desk submissions deadline is pushed to February 15.',
        date: '5 hours ago',
        read: false
      },
      {
        id: 'notif-3',
        title: 'Placement drives shortlisted listings',
        body: 'Verified candidates list for TechCorp Solutions released.',
        date: 'Yesterday',
        read: true
      }
    ];
  });

  // Write changes to localStorage whenever state modifies
  useEffect(() => {
    localStorage.setItem('tkmit_portal_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('tkmit_portal_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived Admin Storage Statistics
  const stats = useMemo<AdminStats>(() => {
    // Initial size is 4.2 GB. If documents are added or removed, sizes change.
    const initialCount = INITIAL_DOCUMENTS.length;
    const addedCount = documents.filter(d => !INITIAL_DOCUMENTS.some(id => id.id === d.id)).length;
    const deletedCount = initialCount - documents.filter(d => INITIAL_DOCUMENTS.some(id => id.id === d.id)).length;
    
    const calculatedUsage = Math.max(
      1.5, // minimum bounds
      4.2 + (addedCount * 0.15) - (deletedCount * 0.3)
    );

    return {
      usedStorage: calculatedUsage,
      totalStorage: 10.0,
      totalDocuments: documents.length
    };
  }, [documents]);

  // Count unread alerts
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handles deep linking document from URL query on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('document');
    if (docId) {
      const match = documents.find(d => d.id === docId);
      if (match) {
        setViewingDoc(match);
      }
    }
  }, [documents]);

  const handleNavigateWithFilter = (tab: ActiveTab, search?: string, category?: string) => {
    setSearchParam(search || '');
    setCategoryParam(category || 'All Documents');
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new document published by admin
  const handleAddDocument = (newDoc: Omit<Document, 'id'>) => {
    const id = `academic-custom-${Date.now()}`;
    const generated: Document = {
      ...newDoc,
      id
    };
    
    setDocuments((prev) => [generated, ...prev]);

    // Push live system alert
    setNotifications((prev) => [
      {
        id: `notif-user-${Date.now()}`,
        title: `Circular Update: ${generated.title}`,
        body: `Category match: ${generated.category} • File ${generated.filename} is now available in student storage nodes.`,
        date: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Edit document in admin panel
  const handleEditDocument = (id: string, updatedFields: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updatedFields } : doc))
    );
  };

  // Delete document in admin panel
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Reset repository state to default INITIAL_DOCUMENTS List
  const handleResetDocuments = () => {
    localStorage.removeItem('tkmit_portal_documents');
    setDocuments(INITIAL_DOCUMENTS);
  };

  // Real download trigger
  const handleDownloadDocument = (doc: Document) => {
    const element = window.document.createElement('a');
    const file = new Blob([doc.content.trim()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.filename;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans transition-colors" id="app-canvas">
      
      {/* GLOBAL BANNER HEADER */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigateWithFilter(tab)}
        unreadNotificationsCount={unreadCount}
        adminLoggedIn={adminLoggedIn}
        onLogoutAdmin={() => setAdminLoggedIn(false)}
        onShowNotifications={() => setShowNotifications(true)}
      />

      {/* CORE FRAME FOR VIEWS */}
      <main className="flex-grow pt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'home' && (
          <HomeScreen
            documents={documents}
            onViewDocument={setViewingDoc}
            onDownloadDocument={handleDownloadDocument}
            onNavigateToTab={handleNavigateWithFilter}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsScreen
            documents={documents}
            onViewDocument={setViewingDoc}
            onDownloadDocument={handleDownloadDocument}
            initialSearchQuery={searchParam}
            initialCategoryFilter={categoryParam}
          />
        )}

        {activeTab === 'admin' && (
          <AdminScreen
            documents={documents}
            onAddDocument={handleAddDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            adminLoggedIn={adminLoggedIn}
            onLoginAdmin={() => setAdminLoggedIn(true)}
            onLogoutAdmin={() => setAdminLoggedIn(false)}
            stats={stats}
            onViewDocument={setViewingDoc}
            onResetDocuments={handleResetDocuments}
          />
        )}

      </main>

      {/* FOOTER BLOCK */}
      <Footer />

      {/* RENDER MODAL: INTERACTIVE PDF READER VIEWPORTS */}
      <DocumentViewer
        document={viewingDoc}
        onClose={() => setViewingDoc(null)}
        onDownload={handleDownloadDocument}
      />

      {/* CONVENIENCE ALERT PANEL: NOTIFICATION TRAY DRAWER */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in" id="notification-tray-overlay">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative border-l border-gray-200">
            
            {/* Tray Header */}
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-300" />
                <h3 className="font-bold text-base">Campus Notices & Triggers</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
                title="Dismiss"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Tray Alert List */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between text-xs border-b pb-3 mb-2">
                <span className="text-gray-400 font-bold">Latest publications stream</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="text-blue-800 hover:text-blue-950 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Archive className="h-10 w-10 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-400">Notification stream is archived.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`relative p-4 rounded-xl border transition-all flex justify-between gap-3 ${
                      notif.read
                        ? 'bg-gray-50/50 border-gray-100 text-gray-500'
                        : 'bg-blue-50/60 border-blue-100 text-gray-800 font-medium'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-800 shrink-0" />
                        )}
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500">{notif.body}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{notif.date}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="text-gray-300 hover:text-red-700 p-1 self-start rounded hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Clear notifications"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Tray Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-150 text-center text-[10px] text-gray-400 font-semibold">
              <p>TKMIT Document Archival Services</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
