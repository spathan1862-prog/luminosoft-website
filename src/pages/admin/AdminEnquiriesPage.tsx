import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  fetchWebsiteEnquiries, 
  updateEnquiryStatus, 
  deleteWebsiteEnquiry 
} from '../../lib/api';
import { WebsiteEnquiry, EnquiryStatus } from '../../types';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MessageSquare, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  Clock, 
  FileSpreadsheet, 
  Building, 
  ShieldAlert,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Quotation Sent',
  'Converted to Client',
  'Rejected',
  'Closed',
];

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [enquiries, setEnquiries] = useState<WebsiteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Selected Enquiry for Details Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<WebsiteEnquiry | null>(null);
  const [modalStatus, setModalStatus] = useState<EnquiryStatus>('New');
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadEnquiries = async () => {
    try {
      const data = await fetchWebsiteEnquiries();
      setEnquiries(data);

      // Check if URL has ?id=... parameter
      const paramId = searchParams.get('id');
      if (paramId) {
        const found = data.find((e) => e.id === paramId);
        if (found) {
          handleOpenDetails(found);
        }
      }
    } catch (err) {
      console.warn('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [searchParams]);

  const handleOpenDetails = (enquiry: WebsiteEnquiry) => {
    setSelectedEnquiry(enquiry);
    setModalStatus(enquiry.status);
    setInternalNotes(enquiry.internal_notes || '');

    // Mark as read if not already read
    if (!enquiry.is_read) {
      updateEnquiryStatus(enquiry.id, enquiry.status, enquiry.internal_notes, true);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, is_read: true } : e))
      );
    }
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    setModalStatus(newStatus);
    await updateEnquiryStatus(selectedEnquiry.id, newStatus, internalNotes, true);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status: newStatus } : e))
    );
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    await updateEnquiryStatus(selectedEnquiry.id, modalStatus, internalNotes, true);
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === selectedEnquiry.id ? { ...e, internal_notes: internalNotes, status: modalStatus } : e
      )
    );
    setSavingNotes(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete enquiry from "${name}"?`)) {
      await deleteWebsiteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      await loadEnquiries();
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.');
      return;
    }

    const headers = [
      'Enquiry ID',
      'Submission Date',
      'Status',
      'Customer Name',
      'Email',
      'Phone',
      'Business Name',
      'Website Type',
      'Required Services',
      'Budget',
      'Project Description',
      'Additional Message',
      'Internal Notes',
    ];

    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${e.created_at || ''}"`,
      `"${e.status}"`,
      `"${(e.customer_name || '').replace(/"/g, '""')}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${(e.business_name || '').replace(/"/g, '""')}"`,
      `"${e.website_type}"`,
      `"${(e.required_services || []).join(', ')}"`,
      `"${e.budget || ''}"`,
      `"${(e.project_description || '').replace(/"/g, '""')}"`,
      `"${(e.additional_message || '').replace(/"/g, '""')}"`,
      `"${(e.internal_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `luminosoft_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const phoneStr = e.phone || e.mobile_number || '';
    const typeStr = e.website_type || '';
    const matchesSearch =
      e.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.business_name && e.business_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.organization && e.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      typeStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesType = typeFilter === 'all' || e.website_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const unreadCount = enquiries.filter((e) => !e.is_read || e.status === 'New').length;

  return (
    <AdminLayout
      title="Website Enquiries Management"
      subtitle="Track, manage, and respond to incoming web development and custom software client inquiries."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Unread / New Notification Banner */}
        {unreadCount > 0 && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold">
                You have {unreadCount} unread or new website {unreadCount === 1 ? 'enquiry' : 'enquiries'} requiring attention.
              </span>
            </div>
            <button
              onClick={() => setStatusFilter('New')}
              className="text-xs font-bold text-blue-700 hover:underline shrink-0"
            >
              Filter New Only →
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-subtle flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by client, phone, email, business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter enquiry status"
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">All Statuses ({enquiries.length})</option>
                {ENQUIRY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st} ({enquiries.filter((e) => e.status === st).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Website:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter enquiry website type"
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">All Website Types</option>
                <option value="Business Website">Business Website</option>
                <option value="E-commerce Website">E-commerce Website</option>
                <option value="Hotel Website">Hotel Website</option>
                <option value="Portfolio Website">Portfolio Website</option>
                <option value="Custom Website">Custom Website</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enquiries Master Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Customer &amp; Business</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Website Type</th>
                  <th className="py-3.5 px-4 font-semibold">Services</th>
                  <th className="py-3.5 px-4 font-semibold">Budget</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enq) => {
                    const isNew = enq.status === 'New' || !enq.is_read;
                    return (
                      <tr
                        key={enq.id}
                        className={`transition-colors cursor-pointer ${
                          isNew ? 'bg-blue-50/30 font-medium hover:bg-blue-50/60' : 'hover:bg-slate-50/60'
                        }`}
                        onClick={() => handleOpenDetails(enq)}
                      >
                        {/* Customer & Business */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {isNew && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                            )}
                            <div>
                              <div className="font-bold text-slate-900">{enq.customer_name}</div>
                              {(enq.business_name || enq.organization) ? (
                                <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                                  <Building className="w-3 h-3 text-slate-400" />
                                  <span>{enq.business_name || enq.organization}</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-400 italic">Personal Client</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-mono text-[11px] font-semibold text-slate-800">
                            {enq.phone}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {enq.email}
                          </div>
                        </td>

                        {/* Website Type */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                            {enq.website_type}
                          </span>
                        </td>

                        {/* Required Services */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {(enq.required_services || [enq.website_type || 'Website']).slice(0, 2).map((srv: string) => (
                              <span
                                key={srv}
                                className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px]"
                              >
                                {srv}
                              </span>
                            ))}
                            {(enq.required_services || []).length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{(enq.required_services || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {enq.budget || 'Unspecified'}
                        </td>

                        {/* Submission Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              enq.status === 'New'
                                ? 'bg-rose-100 text-rose-800'
                                : enq.status === 'Converted to Client'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enq.status === 'Rejected'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1.5">
                            {/* WhatsApp link */}
                            <a
                              href={`https://wa.me/${(enq.phone || enq.mobile_number || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                enq.customer_name
                              )},%20this%20is%20Luminosoft%20regarding%20your%20website%20inquiry.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* Email link */}
                            <a
                              href={`mailto:${enq.email}?subject=Regarding%20your%20Luminosoft%20Website%20Enquiry`}
                              className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>

                            {/* View button */}
                            <button
                              onClick={() => handleOpenDetails(enq)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(enq.id, enq.customer_name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No enquiries match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FULL ENQUIRY DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-modal w-full max-w-2xl max-h-[90vh] flex flex-col my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Enquiry from {selectedEnquiry.customer_name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {selectedEnquiry.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Submitted on {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString() : 'N/A'}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Quick Actions Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${(selectedEnquiry.phone || selectedEnquiry.mobile_number || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      selectedEnquiry.customer_name
                    )},%20this%20is%20Luminosoft%20contacting%20you%20regarding%20your%20website%20development%20enquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Client</span>
                  </a>

                  <a
                    href={`tel:${(selectedEnquiry.phone || selectedEnquiry.mobile_number || '').replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Phone</span>
                  </a>

                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Regarding%20your%20Luminosoft%20Project%20Enquiry`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Send Email</span>
                  </a>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Status:</span>
                  <select
                    value={modalStatus}
                    onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                    aria-label="Update enquiry status"
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    {ENQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Customer Name</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiry.customer_name}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Company / Business</span>
                  <span className="font-semibold text-slate-900">{selectedEnquiry.business_name || selectedEnquiry.organization || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Website Type</span>
                  <span className="font-semibold text-blue-600">{selectedEnquiry.website_type || 'Website'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Phone Number</span>
                  <span className="font-mono text-slate-900">{selectedEnquiry.phone || selectedEnquiry.mobile_number}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
                  <span className="text-slate-900 break-all">{selectedEnquiry.email}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Approx. Budget</span>
                  <span className="font-mono text-slate-900">{selectedEnquiry.budget || 'Not specified'}</span>
                </div>
              </div>

              {/* Required Services */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Requested Services
                </span>
                <div className="flex flex-wrap gap-2">
                  {(selectedEnquiry.required_services || [selectedEnquiry.website_type || 'Custom Website Development']).map((srv: string) => (
                    <span
                      key={srv}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Project Description &amp; Scope
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedEnquiry.project_description || 'No additional project description provided.'}
                </div>
              </div>

              {/* Additional Message */}
              {selectedEnquiry.additional_message && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Additional Message
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 italic">
                    "{selectedEnquiry.additional_message}"
                  </div>
                </div>
              )}

              {/* Internal Admin Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Internal Engineering &amp; Sales Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Notes</span>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Record call logs, proposed quotes, client agreements, or follow-up notes here..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.customer_name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

