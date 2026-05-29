import { Document } from '../types';
import { X, FileText, Download, Printer, Share2, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
  onDownload: (doc: Document) => void;
}

export default function DocumentViewer({ document, onClose, onDownload }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleShare = () => {
    const docUrl = `${window.location.origin}/?document=${document.id}`;
    navigator.clipboard.writeText(docUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${document.title}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; line-height: 1.6; }
              h1 { color: #00288e; margin-bottom: 5px; }
              h3 { color: #555; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-top: 0; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; }
              .meta { font-size: 12px; transform: uppercase; color: #777; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${document.title}</h1>
            <div class="meta">${document.category} | File: ${document.filename} | Size: ${document.size} | Uploaded: ${document.date}</div>
            <pre>${document.content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in" id="pdf-viewer-overlay">
      <div className="bg-gray-100 flex flex-col w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-xl shadow-2xl overflow-hidden border border-gray-250">
        
        {/* VIEWER HEADER */}
        <div className="bg-blue-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="md:hidden text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <FileText className="h-5 w-5 text-blue-300 hidden sm:block" />
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight truncate max-w-[250px] sm:max-w-[450px]">
                {document.title}
              </h2>
              <p className="text-[10px] sm:text-xs text-blue-200">
                {document.filename} • {document.size}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onDownload(document)}
              className="p-1.5 sm:p-2 hover:bg-white/15 rounded-lg text-white/90 hover:text-white transition-all cursor-pointer"
              title="Download File"
            >
              <Download className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 sm:p-2 hover:bg-white/15 rounded-lg text-white/90 hover:text-white transition-all cursor-pointer"
              title="Print Document"
            >
              <Printer className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 hover:bg-white/15 rounded-lg text-white/90 hover:text-white transition-all cursor-pointer"
              title="Share Link"
            >
              {copied ? <Check className="h-4.5 w-4.5 text-green-300" /> : <Share2 className="h-4.5 w-4.5" />}
            </button>
            <div className="h-5 w-px bg-white/20 mx-1 hidden sm:block"></div>
            <button
              onClick={onClose}
              className="hidden sm:block p-1.5 sm:p-2 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-all cursor-pointer"
              title="Close View"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* DOCUMENT PREVIEW BODY */}
        <div className="flex-grow overflow-y-auto px-4 md:px-12 py-8 flex justify-center bg-gray-200">
          <div className="relative w-full max-w-2xl bg-white shadow-lg border border-gray-300 rounded-lg p-6 sm:p-12 min-h-[800px] flex flex-col justify-between text-gray-800 tracking-normal antialiased">
            
            {/* Background Watermark/Seal Pattern */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrKhEH7wZhofhZ5q1lLgKLWSsxyx0feoVKHDqOKLukykhnfgOu2N6IBdCzJDv3WA2wQiI7_1QuneaH1uClcIjiyiG_KMwZxixg-1L_jOlw16tw-EVuhIn5h9S1hKv-6Oj8TWmi43alwuu5JfRLSXNQ2z_LSIsynNQysyzI9tFwKfda_cExZgEbgEXaL5-DyzLeDsFZemjvEvsxiIjvu8ZDsrLbnf0LAs3EfhS0Dr1kfMHsH-oT93anx1QwAapYnC40G2ZMkZWvbGRV" 
                className="w-96 h-96 object-contain" 
                alt="Institutional Seal"
              />
            </div>

            {/* Document Content */}
            <div className="relative z-10">
              {/* Header inside simulated page */}
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrKhEH7wZhofhZ5q1lLgKLWSsxyx0feoVKHDqOKLukykhnfgOu2N6IBdCzJDv3WA2wQiI7_1QuneaH1uClcIjiyiG_KMwZxixg-1L_jOlw16tw-EVuhIn5h9S1hKv-6Oj8TWmi43alwuu5JfRLSXNQ2z_LSIsynNQysyzI9tFwKfda_cExZgEbgEXaL5-DyzLeDsFZemjvEvsxiIjvu8ZDsrLbnf0LAs3EfhS0Dr1kfMHsH-oT93anx1QwAapYnC40G2ZMkZWvbGRV" 
                    className="h-10 object-contain" 
                    alt="Logo"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-blue-900 uppercase border border-blue-900/20 px-2.5 py-1 rounded bg-blue-50/50">
                  {document.category}
                </span>
              </div>

              {/* RENDER BODY */}
              <div className="prose prose-blue max-w-none text-xs sm:text-sm">
                {document.content.trim().split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-xl sm:text-2xl font-bold text-blue-900 tracking-tight mt-6 mb-2">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-base sm:text-lg font-bold text-gray-800 tracking-tight mt-5 mb-2">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wide mt-4 mb-1.5 uppercase">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={idx} className="font-bold text-gray-900 my-2">{line.replaceAll('**', '')}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <ul key={idx} className="list-disc pl-5 my-1 text-gray-700">
                        <li>{line.replace('- ', '').split('**').map((chunk, cidx) => cidx % 2 === 1 ? <strong key={cidx} className="font-bold text-gray-900">{chunk}</strong> : chunk)}</li>
                      </ul>
                    );
                  }
                  if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
                    const numberText = line.substring(0, 3);
                    const restText = line.substring(3);
                    return (
                      <ol key={idx} className="list-decimal pl-5 my-1 text-gray-700">
                        <li>
                          <span className="font-semibold text-gray-900">{numberText}</span>
                          {restText.split('**').map((chunk, cidx) => cidx % 2 === 1 ? <strong key={cidx} className="font-bold text-gray-900">{chunk}</strong> : chunk)}
                        </li>
                      </ol>
                    );
                  }
                  if (line.trim().length === 0) {
                    return <div key={idx} className="h-3"></div>;
                  }
                  return (
                    <p key={idx} className="my-1.5 text-gray-700 leading-relaxed">
                      {line.split('**').map((chunk, cidx) => cidx % 2 === 1 ? <strong key={cidx} className="font-bold text-gray-950">{chunk}</strong> : chunk)}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Simulated footer section on the physical sheet */}
            <div className="border-t border-dashed mt-12 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400">
              <p>Downloaded from TKMIT Document Portal</p>
              <p>Ref: {document.id.toUpperCase()} • System Printed: {new Date().toLocaleDateString()}</p>
            </div>

          </div>
        </div>

        {/* BOTTOM UTILITY ACTIONS */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors active:scale-98 cursor-pointer"
          >
            Close View
          </button>
          <button
            onClick={() => onDownload(document)}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
