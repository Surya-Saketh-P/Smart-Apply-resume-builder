import React from 'react';
import { Card, Badge, Button } from './ui';
import { Application } from '../hooks/useApplications';
import { Building2, Calendar, FileText, ChevronRight, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  application: Application;
  onStatusUpdate: (id: string, status: Application['status']) => void;
  onDelete: (id: string) => void;
  onView: (app: Application) => void;
}

const ApplicationCard: React.FC<Props> = ({ application, onStatusUpdate, onDelete, onView }) => {
  const statusColors = {
    Applied: 'blue',
    Interview: 'orange',
    Offer: 'green',
    Rejected: 'red'
  } as const;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{application.company}</h3>
            <p className="text-sm text-gray-500 font-medium">{application.role}</p>
            <div className="mt-2 flex items-center gap-3">
              <Badge color={statusColors[application.status || 'Applied']}>{application.status || 'Applied'}</Badge>
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                <Calendar className="h-3 w-3" />
                {application.createdAt ? format(application.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xl font-black text-gray-300 group-hover:text-primary-600/20 transition-colors">
            {application.matchScore}%
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select 
            value={application.status}
            onChange={(e) => onStatusUpdate(application.id, e.target.value as any)}
            className="text-xs font-semibold bg-gray-50 border-none rounded-lg py-1 px-2 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-1 shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <button 
            onClick={() => onView(application)}
            className="p-2 bg-white hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
            title="View Details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(application.id)}
            className="p-2 bg-white hover:bg-red-50 text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;
