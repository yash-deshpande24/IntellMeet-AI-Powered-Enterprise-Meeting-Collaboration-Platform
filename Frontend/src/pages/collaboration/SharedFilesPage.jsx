import React, { useState } from 'react';
import { mockSharedFiles as initialFiles } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  FolderOpen,
  Upload,
  Search,
  Download,
  FileText,
  FileCode,
  Video,
  File,
  Trash2,
  Share2,
  Filter,
} from 'lucide-react';

export const SharedFilesPage = () => {
  const { success, info } = useNotification();
  const [files, setFiles] = useState(initialFiles);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [newFileForm, setNewFileForm] = useState({
    name: '',
    type: 'pdf',
    meeting: 'General Workspace Asset',
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-indigo-500" />;
      case 'json':
        return <FileCode className="w-5 h-5 text-purple-500" />;
      case 'presentation':
        return <FileText className="w-5 h-5 text-amber-500" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredFiles = files.filter((f) => {
    const matchesType = typeFilter === 'All' || f.type === typeFilter;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      f.meeting.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newFileForm.name.trim()) return;

    const uploaded = {
      id: 'f-' + Date.now(),
      name: newFileForm.name,
      type: newFileForm.type,
      size: '8.4 MB',
      uploadedBy: 'Alex Vance',
      meeting: newFileForm.meeting,
      updatedAt: 'Just now',
      downloads: 0,
    };

    setFiles([uploaded, ...files]);
    setUploadModalOpen(false);
    setNewFileForm({ name: '', type: 'pdf', meeting: 'General Workspace Asset' });
    success(`File "${uploaded.name}" uploaded successfully!`);
  };

  const handleDelete = (id, name) => {
    setFiles(files.filter((f) => f.id !== id));
    info(`File "${name}" removed from workspace`);
  };

  const handleDownload = (name) => {
    success(`Downloading "${name}"...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <FolderOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shared Meeting Files & Assets
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Meeting recordings, AI transcripts, slide decks, and architecture specifications
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Upload}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Asset
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> File Type:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Types ({files.length})</option>
            <option value="pdf">PDF Documents</option>
            <option value="video">MP4 Video Recordings</option>
            <option value="json">JSON AI Transcripts</option>
            <option value="presentation">Presentations</option>
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by file name or meeting..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Files List Card */}
      <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden shadow-xl">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-dark-surface/40 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Linked to: {file.meeting} • Uploaded by {file.uploadedBy}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{file.size}</p>
                <p className="text-[11px] text-slate-400">{file.updatedAt}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={Download}
                onClick={() => handleDownload(file.name)}
              >
                Download
              </Button>

              <button
                onClick={() => handleDelete(file.id, file.name)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* Upload File Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Shared Asset"
        subtitle="Add documents, slide decks, or meeting files to the workspace"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="File Name *"
            placeholder="e.g. Q4_Strategy_Roadmap.pdf"
            value={newFileForm.name}
            onChange={(e) => setNewFileForm({ ...newFileForm, name: e.target.value })}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                File Type
              </label>
              <select
                value={newFileForm.type}
                onChange={(e) => setNewFileForm({ ...newFileForm, type: e.target.value })}
                className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pdf">PDF Document</option>
                <option value="video">MP4 Video Recording</option>
                <option value="presentation">Presentation (.pptx)</option>
                <option value="json">JSON Transcript</option>
              </select>
            </div>

            <Input
              label="Associated Meeting"
              placeholder="e.g. Sprint 24 Architecture Sync"
              value={newFileForm.meeting}
              onChange={(e) => setNewFileForm({ ...newFileForm, meeting: e.target.value })}
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-dark-border rounded-2xl p-6 text-center space-y-2 hover:border-indigo-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-[11px] text-slate-400">
              Up to 500 MB per file • AES-256 encrypted at rest
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
