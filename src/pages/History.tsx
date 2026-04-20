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
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 border-b border-black pb-8">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight flex items-center gap-3">
          <HistoryIcon className="h-8 w-8" />
          Application History
        </h1>
        <p className="mt-3 text-sm text-zinc-700">Manage and track all your applications.</p>
      </div>
        
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-black bg-white focus:outline-none focus:bg-zinc-100 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-black bg-white focus:outline-none focus:bg-zinc-100 transition-all appearance-none cursor-pointer font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {!filteredApps || filteredApps.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-2 border-black">
          <HistoryIcon className="h-12 w-12 mb-6 text-zinc-900" />
          <p className="text-lg font-serif font-bold text-zinc-900">No applications found</p>
          <p className="text-sm text-zinc-700 mt-2">Try adjusting your filters or start applying for jobs.</p>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl border-2 border-black relative my-auto"
            >
              <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 transition-colors z-10 text-zinc-900"
              >
                <XCircle className="h-6 w-6" />
              </button>

              <div className="grid lg:grid-cols-3 h-full max-h-[90vh]">
                <div className="p-8 border-r border-black bg-[#FAF9F6]">
                  <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold text-zinc-900 leading-tight">{selectedApp.company}</h2>
                    <p className="text-zinc-700 font-medium mt-1">{selectedApp.role}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-4 border border-black">
                      <p className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">Match Score</p>
                      <p className="text-3xl font-serif font-bold text-zinc-900">{selectedApp.matchScore}</p>
                    </div>
                    
                    <div className="border-t border-black pt-6">
                      <p className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-3">Tailored Bullets</p>
                      <ul className="space-y-2">
                        {selectedApp.resumeBullets.map((b, i) => (
                          <li key={i} className="text-xs text-zinc-700 flex gap-2">
                            <span className="font-bold">•</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 p-8 overflow-y-auto border-l border-black">
                  <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-4 border-b border-black pb-4">
                    Cover Letter
                  </h3>
                  <div className="bg-[#FAF9F6] p-6 border border-black text-zinc-900 leading-relaxed whitespace-pre-wrap text-sm mb-8">
                    {selectedApp.coverLetter}
                  </div>
                  
                  <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-4 border-b border-black pb-4">
                    Job Description
                  </h3>
                  <p className="text-xs font-mono text-zinc-600 whitespace-pre-wrap max-h-40 overflow-y-auto border border-black p-4 bg-white">
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
