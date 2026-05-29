import { Document, AdminStats } from '../types';
import { 
  Lock, KeyRound, Mail, CloudUpload, HardDrive, 
  Trash2, Edit, RefreshCw, Filter, FileText, Check, 
  User, CheckCircle, HelpCircle, ArrowRight, Eye, Plus, Send, Search
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface AdminScreenProps {
  documents: Document[];
  onAddDocument: (doc: Omit<Document, 'id'>) => void;
  onEditDocument: (id: string, updated: Partial<Document>) => void;
  onDeleteDocument: (id: string) => void;
  adminLoggedIn: boolean;
  onLoginAdmin: () => void;
  onLogoutAdmin: () => void;
  stats: AdminStats;
  onViewDocument: (doc: Document) => void;
  onResetDocuments?: () => void;
}

export default function AdminScreen({
  documents,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  adminLoggedIn,
  onLoginAdmin,
  onLogoutAdmin,
  stats,
  onViewDocument,
  onResetDocuments
}: AdminScreenProps) {
  // Login Form States
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Secondary sub-tab within dashboard ('overview' | 'profile')
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'profile'>('overview');

  // New Document Upload States
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic Calendar');
  const [simulatedFile, setSimulatedFile] = useState<{ name: string; size: string; content: string } | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Table Search / Filter
  const [tableQuery, setTableQuery] = useState('');

  // Editing Modal States
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Password Update Form States
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId.trim().toLowerCase() === 'admin' && password === 'Praveenadmin123') {
      onLoginAdmin();
      setLoginError('');
      setAdminId('');
      setPassword('');
    } else {
      setLoginError('Invalid Administrator ID or password credentials');
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file reading and size calculations
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      
      setSimulatedFile({
        name: file.name,
        size: sizeStr,
        content: `
# INSTITUTIONAL ARCHIVE DOCUMENT
### ${file.name.toUpperCase()}

**Attached to: ${newTitle || 'Untitled Publication'}**  
**Category: ${newCategory}**  
**Read-Log: Published via Administrator Portal**

This document was successfully verified and cataloged under academic reference systems of TKM Institute of Technology. Regular departmental circular processes apply.

*Verified System Archival Stamp*
        `
      });
    }
  };

  // Generate an automated simulated file if none selected
  const handleSubmitNewDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fileDetails = simulatedFile || {
      name: `${newTitle.trim().toUpperCase().replaceAll(' ', '_')}.pdf`,
      size: '250 KB',
      content: `
# TKM INSTITUTE OF TECHNOLOGY
### OFFICE OF THE GENERAL ADMINISTRATION

**Ref No: TKMIT/ADM-UPLOAD/${Math.floor(1000 + Math.random() * 9000)}**  
**Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}**

## ${newTitle.trim().toUpperCase()}

This document registers official procedural mandates corresponding to the chosen institutional criteria. Under corresponding provisions, all department entities are requested to file guidelines accordingly.

### GENERAL COMPLIANCES:
1. Procedures specified take immediate effect upon submission.
2. Verified guidelines remain archived in student repository nodes.
3. Strict regulatory follow-up is expected across corresponding files.

*By Order,*  
**TKMIT Administration Cell**
      `
    };

    onAddDocument({
      title: newTitle.trim(),
      category: newCategory,
      filename: fileDetails.name,
      size: fileDetails.size,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      uploadedAt: new Date().toISOString(),
      content: fileDetails.content,
      isLatest: true // flag as newest
    });

    setUploadSuccessMessage('Document published successfully and made live!');
    setNewTitle('');
    setSimulatedFile(null);
    setTimeout(() => setUploadSuccessMessage(''), 4000);
  };

  const startEditing = (doc: Document) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc && editTitle.trim()) {
      onEditDocument(editingDoc.id, {
        title: editTitle.trim(),
        category: editCategory
      });
      setEditingDoc(null);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      setPasswordError('Please fill out all fields');
      return;
    }
    if (currentPass !== 'Praveenadmin123') {
      setPasswordError('Current credentials do not match administrative records');
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordError('New password and confirmation fields do not match');
      return;
    }
    if (newPass.length < 6) {
      setPasswordError('Password length must be at least 6 characters');
      return;
    }

    setPasswordMessage('Administrative password updated successfully!');
    setPasswordError('');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPasswordMessage(''), 4000);
  };

  // Filter documents listed in dashboard table
  const filteredTableDocs = useMemo(() => {
    return documents.filter((doc) => {
      const query = tableQuery.toLowerCase().trim();
      return (
        query === '' ||
        doc.title.toLowerCase().includes(query) ||
        doc.filename.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query)
      );
    });
  }, [documents, tableQuery]);

  return (
    <div className="animate-fade-in min-h-[60vh] flex flex-col justify-center">
      
      {/* 1. PUBLIC ADMINISTRATOR LOGIN VIEW */}
      {!adminLoggedIn ? (
        <main className="w-full flex justify-center py-12 px-4" id="login-view">
          <div className="w-full max-w-md bg-white border border-gray-200 p-8 shadow-md rounded-xl space-y-6">
            
            {/* TKMIT Branding header */}
            <div className="text-center space-y-2">
              <img 
                alt="TKMIT Logo" 
                className="h-14 mx-auto object-contain select-none pointer-events-none" 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrKhEH7wZhofhZ5q1lLgKLWSsxyx0feoVKHDqOKLukykhnfgOu2N6IBdCzJDv3WA2wQiI7_1QuneaH1uClcIjiyiG_KMwZxixg-1L_jOlw16tw-EVuhIn5h9S1hKv-6Oj8TWmi43alwuu5JfRLSXNQ2z_LSIsynNQysyzI9tFwKfda_cExZgEbgEXaL5-DyzLeDsFZemjvEvsxiIjvu8ZDsrLbnf0LAs3EfhS0Dr1kfMHsH-oT93anx1QwAapYnC40G2ZMkZWvbGRV"
              />
              <p className="text-xs font-bold text-gray-400 capitalize tracking-wide select-none">
                Administrator access gateway
              </p>
            </div>

            {/* Error alerts */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg text-center animate-pulse">
                {loginError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email-input">
                  Admin ID / Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-450">
                    <User className="h-4.5 w-4.5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    id="email-input"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Admin"
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all font-medium text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password-input">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-450">
                    <KeyRound className="h-4.5 w-4.5 text-gray-400" />
                  </span>
                  <input
                    type="password"
                    id="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2.5 rounded font-bold text-sm tracking-wide active:scale-98 transition-transform cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            </form>

            <div className="text-center pt-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('Demo administrator system overrides bypass key replacement parameters to: Praveenadmin123'); }}
                className="text-xs font-medium text-blue-800 hover:underline hover:text-blue-950"
              >
                Forgot password?
              </a>
            </div>

          </div>
        </main>
      ) : (
        
        // 2. PRIVILEGED ADMIN DASHBOARD
        <div className="space-y-8" id="dashboard-view">
          
          {/* Dashboard Title Block and tab togglers */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage publications, upload documents, and track institutional repository parameters.
              </p>
            </div>

            {/* Inner Sub-navigation selector */}
            <div className="flex bg-[#f3f4f6] p-1 rounded-lg border border-gray-200 self-start">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`px-4 py-2 rounded font-bold text-xs transition-all cursor-pointer ${
                  activeSubTab === 'overview'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-blue-900 hover:bg-gray-200/50'
                }`}
                id="btn-tab-overview"
              >
                Overview Dashboard
              </button>
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`px-4 py-2 rounded font-bold text-xs transition-all cursor-pointer ${
                  activeSubTab === 'profile'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-blue-900 hover:bg-gray-200/50'
                }`}
                id="btn-tab-settings"
              >
                Profile & Settings
              </button>
            </div>
          </section>

          {/* BLOCK A: OVERVIEW PANEL WITH PUBLISHER CARD */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SIDE: PUBLISHER FORMS AREA */}
              <section className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Upload Form Panel */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b pb-3 mb-4 text-blue-900">
                    <CloudUpload className="h-5.5 w-5.5" />
                    <h3 className="font-extrabold text-base tracking-tight">Upload New PDF</h3>
                  </div>

                  {uploadSuccessMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-lg flex items-center gap-2 animate-fade-in shadow-xs">
                      <CheckCircle className="h-4.5 w-4.5 text-green-600" />
                      <span>{uploadSuccessMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitNewDocument} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. S5 Examination Schedule"
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none font-medium text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none font-semibold text-gray-700"
                      >
                        <option value="Academic Calendar">Academic Calendar</option>
                        <option value="Circulars">Circulars</option>
                        <option value="Forms">Forms</option>
                        <option value="Notices">Notices</option>
                        <option value="Exam Schedules">Exam Schedules</option>
                        <option value="Syllabus">Syllabus</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Placement">Placement</option>
                        <option value="Industry Connect">Industry Connect</option>
                        <option value="Wellness & Care">Wellness & Care</option>
                        <option value="Faculty">Faculty</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        File Selection (PDF)
                      </label>
                      <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-800 hover:bg-blue-50/30 rounded-xl p-6 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="h-10 w-10 text-gray-300 group-hover:text-blue-800 mx-auto mb-2.5 transition-colors" />
                        <p className="text-xs font-bold text-gray-700 group-hover:text-blue-900 transition-colors">
                          {simulatedFile ? (
                            <span className="text-green-700 block max-w-[200px] truncate mx-auto">
                              ✓ {simulatedFile.name} ({simulatedFile.size})
                            </span>
                          ) : (
                            <span>Drag and drop PDF or <span className="text-blue-800 underline">Browse</span></span>
                          )}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">Only PDF formats supported up to 10 MB</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CloudUpload className="h-4 w-4" />
                      <span>Submit Document</span>
                    </button>
                  </form>
                </div>

                {/* storage meter bar */}
                <div className="bg-blue-900 text-white rounded-xl p-5 shadow-xs relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                      Storage Quota Capacity
                    </h4>
                    <div>
                      <p className="font-extrabold text-3xl tracking-tight">
                        {stats.usedStorage.toFixed(2)} GB
                      </p>
                      <p className="text-[10px] text-blue-200">Used of {stats.totalStorage} GB institution allotment</p>
                    </div>
                    
                    {/* dynamic width bar */}
                    <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(stats.usedStorage / stats.totalStorage) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-blue-100 font-semibold pt-1">
                      <span>{(stats.totalStorage - stats.usedStorage).toFixed(2)} GB Available</span>
                      <span>{((stats.usedStorage / stats.totalStorage) * 100).toFixed(0)}% Consumed</span>
                    </div>
                  </div>
                  
                  {/* Background icon badge */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.08]">
                    <HardDrive className="w-32 h-32" />
                  </div>
                </div>

                {/* Reset to Default */}
                {onResetDocuments && (
                  <div className="bg-gray-100/50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 mt-4">
                    <p className="text-[11px] text-gray-500 font-bold">Testing or need default files back?</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to restore the repository to default documents? All uploaded documents will be reset.")) {
                          onResetDocuments();
                        }
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-lg text-xs font-bold text-gray-700 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3 text-gray-500 hover:rotate-180 transition-all duration-300" />
                      <span>Restore Default Repository</span>
                    </button>
                  </div>
                )}

              </section>

              {/* RIGHT SIDE: DOCUMENT MANAGEMENT DATA-TABLE */}
              <section className="lg:col-span-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
                  
                  {/* Table search utility banner bar */}
                  <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 tracking-tight text-sm sm:text-base">
                      Manage Documents ({filteredTableDocs.length})
                    </h3>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Search className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={tableQuery}
                          onChange={(e) => setTableQuery(e.target.value)}
                          placeholder="Search files..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-800"
                        />
                      </div>
                      <button 
                        onClick={() => { setTableQuery(''); }}
                        className="p-1.5 hover:bg-gray-150 rounded border border-gray-200 text-gray-500 hover:text-blue-900 transition-colors cursor-pointer"
                        title="Refresh Table View"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* HTML TABLE RENDER */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f3f4f6] text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                          <th className="px-5 py-3 ml-2">Document Title</th>
                          <th className="px-5 py-3">Category</th>
                          <th className="px-5 py-3">Date Uploaded</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTableDocs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-16 text-center text-xs text-gray-400 font-medium">
                              No matching document entries registered.
                            </td>
                          </tr>
                        ) : (
                          filteredTableDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4.5 w-4.5 text-red-650 shrink-0 text-red-700" />
                                  <button
                                    onClick={() => onViewDocument(doc)}
                                    className="font-bold text-xs sm:text-sm text-gray-800 hover:text-blue-900 text-left line-clamp-1 max-w-[150px] sm:max-w-[280px]"
                                    title="View this document"
                                  >
                                    {doc.title}
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="px-2.5 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600">
                                  {doc.category}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-500 font-semibold select-none">
                                {doc.date}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex justify-end gap-1.5 sm:gap-2">
                                  <button
                                    onClick={() => onViewDocument(doc)}
                                    className="p-1.5 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded transition-all cursor-pointer"
                                    title="View Publication"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => startEditing(doc)}
                                    className="p-1.5 text-gray-400 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                                    title="Edit Details"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-all cursor-pointer"
                                    title="Delete Circular"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table paging parameters footer mockup */}
                  <div className="mt-auto p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-gray-500 font-medium bg-gray-50/50">
                    <span>Showing {filteredTableDocs.length} of {documents.length} published references</span>
                    <div className="flex gap-1.5">
                      <button className="px-2.5 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-not-allowed text-[10px]">Previous</button>
                      <button className="px-2.5 py-1 bg-blue-800 text-white rounded font-bold text-[10px]">1</button>
                      <button className="px-2.5 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 text-[10px]">2</button>
                      <button className="px-2.5 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 text-[10px]">Next</button>
                    </div>
                  </div>

                </div>
              </section>

            </div>
          )}

          {/* BLOCK B: PROFILE & SETTINGS PANEL */}
          {activeSubTab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Profile Card Summary */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center border-2 border-blue-200 shadow-inner">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-9900 text-blue-950 tracking-tight leading-normal">System Administrator</h3>
                    <p className="text-xs text-gray-500">Principal Academic Identity Portal</p>
                    <p className="text-xs font-bold text-indigo-700 mt-1 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full w-max mx-auto sm:mx-0">
                      <span>id: admin_primary_tkmit</span>
                    </p>
                  </div>
                </div>

                {/* Profile Information Set */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Authorized Administrator Email</p>
                      <p className="text-gray-800 font-bold mt-1">admin@tkmit.edu.in</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Last Admin Session Login</p>
                      <p className="text-gray-800 font-bold mt-1">{new Date().toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Assigned College Office</p>
                      <p className="text-gray-800 font-bold mt-1">Registrar and Academics Wing</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">System Security Permissions</p>
                      <p className="text-green-700 font-bold mt-1 flex items-center gap-1 shadow-inner bg-green-50 px-2.5 py-0.5 w-max rounded-full text-xs">
                        <span>FULL_ACCESS_ADMIN</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Credentials Update Form Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-6 space-y-6">
                <div className="border-b pb-3 mb-4">
                  <h4 className="font-extrabold text-base text-gray-900 tracking-tight">Security Credentials Settings</h4>
                  <p className="text-xs text-gray-400">Regularly update your administrative credentials to uphold secure parameters.</p>
                </div>

                {passwordMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-4.5 w-4.5 text-green-600" />
                    <span>{passwordMessage}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg my-3">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="e.g. Praveenadmin123"
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 outline-none text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      New Security Password
                    </label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 outline-none text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 outline-none text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-800 text-white font-bold text-xs rounded hover:bg-blue-900 tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    Update Password Verification
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* EDIT DETAILS MODAL OVERLAY */}
          {editingDoc && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 relatve space-y-6">
                <div className="border-b pb-3">
                  <h3 className="text-base sm:text-lg font-extrabold text-blue-900 tracking-tight">Edit Document Metadata</h3>
                  <p className="text-xs text-gray-400">Modify title descriptions for reference matching</p>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Document Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 outline-none font-semibold text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Category Class</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-800 outline-none font-bold text-gray-700"
                    >
                      <option value="Academic Calendar">Academic Calendar</option>
                      <option value="Circulars">Circulars</option>
                      <option value="Forms">Forms</option>
                      <option value="Notices">Notices</option>
                      <option value="Exam Schedules">Exam Schedules</option>
                      <option value="Syllabus">Syllabus</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Placement">Placement</option>
                      <option value="Industry Connect">Industry Connect</option>
                      <option value="Wellness & Care">Wellness & Care</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setEditingDoc(null)}
                      className="px-4 py-2 border rounded text-xs font-bold text-gray-650 hover:bg-gray-50 cursor-pointer text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Save Modifications
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
