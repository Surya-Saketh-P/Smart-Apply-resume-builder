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
    <Card className="p-6 border-l-4 border-l-black group">
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-4 flex-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black bg-white text-zinc-900">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-bold text-zinc-900 text-lg">{application.company}</h3>
            <p className="text-sm text-zinc-700 font-medium mt-1">{application.role}</p>
            <div className="mt-3 flex items-center gap-3">
              <Badge color={statusColors[application.status || 'Applied']}>{application.status || 'Applied'}</Badge>
              <span className="flex items-center gap-1 text-xs uppercase tracking-wider font-bold text-zinc-600">
                <Calendar className="h-3 w-3" />
                {application.createdAt ? format(application.createdAt.toDate(), 'MMM d') : 'Recently'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="text-4xl font-serif font-bold text-zinc-900">
            {application.matchScore}
          </div>
          <div className="text-xs text-zinc-600 uppercase tracking-wider font-bold">match</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select 
            value={application.status}
            onChange={(e) => onStatusUpdate(application.id, e.target.value as any)}
            className="text-xs font-bold bg-white border border-black py-1.5 px-2.5 focus:outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center gap-0 divide-x divide-black border border-black overflow-hidden">
          <button 
            onClick={() => onView(application)}
            className="p-2 bg-white hover:bg-zinc-100 text-zinc-900 transition-colors"
            title="View Details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(application.id)}
            className="p-2 bg-white hover:bg-red-50 text-red-900 transition-colors"
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
