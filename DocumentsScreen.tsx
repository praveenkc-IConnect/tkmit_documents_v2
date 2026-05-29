export interface Document {
  id: string;
  title: string;
  category: string; // 'Circulars' | 'Forms' | 'Notices' | 'Exam Schedules' | 'Syllabus' | 'Academic Calendar' | 'Placement' | 'Scholarship' | 'Industry Connect'
  filename: string;
  size: string;
  date: string;
  uploadedAt: string; // ISO date or "2 Hours Ago" format
  content: string; // Mock simulated document text/content for the viewer
  author?: string;
  isLatest?: boolean;
}

export type ActiveTab = 'home' | 'documents' | 'admin';

export interface AdminStats {
  usedStorage: number; // in GB (e.g. 4.2)
  totalStorage: number; // in GB (e.g. 10.0)
  totalDocuments: number;
}
