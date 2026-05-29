import { Document } from '../types';
import { Search, FileText, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface DocumentsScreenProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onDownloadDocument: (doc: Document) => void;
  initialSearchQuery?: string;
  initialCategoryFilter?: string;
}

export default function DocumentsScreen({
  documents,
  onViewDocument,
  onDownloadDocument,
  initialSearchQuery = '',
  initialCategoryFilter = 'All Documents'
}: DocumentsScreenProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategoryFilter);
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync state if initial props change (e.g., navigated from Home Category clicks)
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setActiveCategory(initialCategoryFilter);
    setVisibleCount(6); // reset pagination on filter change
  }, [initialCategoryFilter]);

  const categories = [
    'All Documents',
    'Circulars',
    'Forms',
    'Notices',
    'Exam Schedules',
    'Syllabus',
    'Academic Calendar',
    'Scholarship',
    'Placement',
    'Industry Connect',
    'Wellness & Care',
    'Faculty'
  ] as const;

  // Filter Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category Match
      const matchesCategory =
        activeCategory === 'All Documents' ||
        doc.category.toLowerCase() === activeCategory.toLowerCase();

      // Search Query Match
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        searchLower === '' ||
        doc.title.toLowerCase().includes(searchLower) ||
        doc.filename.toLowerCase().includes(searchLower) ||
        doc.category.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  // Paginated files
  const paginatedDocs = useMemo(() => {
    return filteredDocuments.slice(0, visibleCount);
  }, [filteredDocuments, visibleCount]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filteredDocuments.length));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All Documents');
    setVisibleCount(6);
  };

  // Helper colors for badges
  const getBadgeStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('circular')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
    if (cat.includes('form')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (cat.includes('notice')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (cat.includes('exam') || cat.includes('schedule')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (cat.includes('syllabus')) {
      return 'bg-teal-50 text-teal-800 border-teal-200';
    }
    if (cat.includes('placement')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (cat.includes('scholarship')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (cat.includes('industry') || cat.includes('connect')) {
      return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    }
    if (cat.includes('wellness') || cat.includes('care')) {
      return 'bg-pink-50 text-pink-800 border-pink-200';
    }
    if (cat.includes('faculty')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16">
      
      {/* HEADER BAR AND SEARCH */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            Document Repository
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search and view academic files and administrative publications
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-96 group" id="search-bar-repository">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, IDs, or titles..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all text-sm font-medium placeholder-gray-400 text-gray-800"
          />
        </div>
      </section>

      {/* FILTER CHIPS ROW */}
      <section className="overflow-x-auto pb-3 w-full scrollbar-thin">
        <div className="flex space-x-2.5 min-w-max px-1" id="category-filter-bar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight border transition-all cursor-pointer ${
                  isActive
                    ? 'active-chip bg-blue-800 border-blue-800 text-white shadow-xs'
                    : 'bg-[#f3f4f6] text-gray-600 border-gray-200 hover:bg-gray-200/80 hover:text-blue-900'
                }`}
                id={`cat-chip-${cat.replace(' ', '-').toLowerCase()}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* CORE GRID */}
      {filteredDocuments.length === 0 ? (
        <section className="bg-white border border-gray-250 rounded-xl p-16 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
          <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">No Documents Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any results matching <span className="font-bold text-blue-900">"{searchQuery}"</span> under <span className="font-bold text-gray-800">"{activeCategory}"</span> category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-blue-50 text-blue-800 font-bold text-xs rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5 mx-auto active:scale-95 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </section>
      ) : (
        <section className="space-y-12">
          {/* Document list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="documents-grid-box">
            {paginatedDocs.map((doc) => {
              const badgeStyles = getBadgeStyles(doc.category);
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-200 hover:border-blue-400 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition-all h-full"
                  id={`doc-card-${doc.id}`}
                >
                  <div>
                    {/* Header with Category and Date */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeStyles}`}>
                        {doc.category}
                      </span>
                      <span className="text-gray-400 text-xs font-semibold">
                        {doc.date}
                      </span>
                    </div>

                    {/* Document Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-3 tracking-normal line-clamp-2" title={doc.title}>
                      {doc.title}
                    </h3>

                    {/* Metadata detail block */}
                    <div className="flex items-center gap-1.5 text-gray-400 font-medium text-xs mb-8">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{doc.filename}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-2.5 rounded font-bold text-xs active:scale-98 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => onDownloadDocument(doc)}
                      className="p-2 border border-blue-800 text-blue-800 hover:bg-blue-50/60 rounded flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      title={`Download ${doc.filename}`}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination loading bar */}
          {filteredDocuments.length > visibleCount && (
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Showing {paginatedDocs.length} of {filteredDocuments.length} documents
              </span>
              <button
                onClick={handleLoadMore}
                className="px-8 py-2.5 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white font-bold rounded-lg transition-all active:scale-95 cursor-pointer text-xs"
                id="btn-load-more"
              >
                Load More Documents
              </button>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
