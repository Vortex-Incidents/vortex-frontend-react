import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, User, CheckCircle, Tag, Save } from 'lucide-react';
import { Incident, Role, Status } from '../types';
import { updateIncidentStatus } from '../services/incidentService';

interface IncidentModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: Role;
  onUpdate: () => void;
}

const IncidentModal: React.FC<IncidentModalProps> = ({ incident, isOpen, onClose, userRole, onUpdate }) => {
  const [status, setStatus] = useState<Status>('Open');

  useEffect(() => {
    if (incident) {
      setStatus(incident.status);
    }
  }, [incident]);

  if (!isOpen || !incident) return null;

  const canEdit = userRole === 'support' || userRole === 'admin';

  const handleSave = () => {
    updateIncidentStatus(incident.id, status);
    onUpdate();
    onClose();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'Medium': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg md:max-w-2xl bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50 dark:bg-dark-900/50">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-700 px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
              {incident.id}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(incident.priority)}`}>
              {incident.priority}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{incident.title}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
             <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Reported Date</p>
                   <p className="text-gray-900 dark:text-gray-200 text-sm">{incident.createdAt.toLocaleDateString()} {incident.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
             </div>
             <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">SLA Deadline</p>
                   <p className={`font-medium text-sm ${incident.slaDeadline < new Date() ? 'text-red-500' : 'text-gray-900 dark:text-gray-200'}`}>
                      {incident.slaDeadline.toLocaleDateString()} {incident.slaDeadline.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </p>
                </div>
             </div>
             <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
                   <p className="text-gray-900 dark:text-gray-200 text-sm">{incident.category}</p>
                </div>
             </div>
             <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Reporter</p>
                   <p className="text-gray-900 dark:text-gray-200 text-sm">{incident.reporter}</p>
                </div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-900/50 p-4 rounded-xl border border-gray-100 dark:border-dark-700 mb-6">
             <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Description</p>
             <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {incident.description}
             </p>
          </div>

          {/* Technician Controls */}
          <div className="border-t border-gray-100 dark:border-dark-700 pt-6">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Current Status</label>
                    {canEdit ? (
                        <select 
                           value={status}
                           onChange={(e) => setStatus(e.target.value as Status)}
                           className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    ) : (
                        <div className="px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg text-gray-900 dark:text-white inline-block font-medium w-full sm:w-auto text-center sm:text-left">
                            {incident.status}
                        </div>
                    )}
                </div>

                {canEdit && status !== incident.status && (
                    <button 
                        onClick={handleSave}
                        className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/30 flex items-center justify-center font-medium transition animate-pulse-slow"
                    >
                        <Save size={18} className="mr-2" />
                        Update Status
                    </button>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IncidentModal;