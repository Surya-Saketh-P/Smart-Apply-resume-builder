import React, { useState } from 'react';
import { useApplications, Application } from '../hooks/useApplications';
import ApplicationCard from '../components/ApplicationCard';
import { Search, Filter, History as HistoryIcon, XCircle, FileText, ChevronRight } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion, AnimatePresence } from 'motion/react';

const History: React.FC = () => {
  const { applications, loading, deleteApplication, updateStatus } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = applications?.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent shadow-sm"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <HistoryIcon className="h-8 w-8 text-primary-500" />
            Application History
          </h1>
          <p className="mt-1 text-gray-500">Track and manage your AI-powered job applications.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none cursor-pointer bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {!filteredApps || filteredApps.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500 border-dashed border-2">
          <HistoryIcon className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg font-medium text-gray-900">No applications found</p>
          <p className="text-sm mt-1">Try adjusting your filters or apply for your first job!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={deleteApplication}
              onStatusUpdate={updateStatus}
              onView={setSelectedApp}
            />
          ))}
        </div>
      )}

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative my-auto"
            >
              <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <XCircle className="h-6 w-6 text-gray-400" />
              </button>

              <div className="grid lg:grid-cols-3 h-full max-h-[90vh]">
                <div className="p-8 border-r border-gray-100 bg-gray-50/50">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedApp.company}</h2>
                    <p className="text-gray-500 font-medium">{selectedApp.role}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Match Score</p>
                      <p className="text-3xl font-black text-primary-600">{selectedApp.matchScore}%</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tailored Bullets</p>
                      <ul className="space-y-2">
                        {selectedApp.resumeBullets.map((b, i) => (
                          <li key={i} className="text-xs text-gray-600 flex gap-2">
                            <span className="text-primary-500 font-bold">•</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 p-8 overflow-y-auto">
                  <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <FileText className="h-4 w-4" /> Cover Letter
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-2xl font-serif italic text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {selectedApp.coverLetter}
                  </div>
                  
                  <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">
                    Original JD
                  </h3>
                  <p className="text-[10px] font-mono text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-100 p-4 rounded-xl">
                    {selectedApp.jobDescription}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
