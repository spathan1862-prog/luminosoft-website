import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Building,
  Mail,
  Phone,
  User,
  IndianRupee,
  Send,
  FileText,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitWebsiteEnquiry } from '../../lib/api';
import { WebsiteType } from '../../types';

interface WebsiteEnquiryFormProps {
  initialWebsiteType?: WebsiteType;
  className?: string;
  onSuccess?: (enquiryId: string) => void;
}

export const WebsiteEnquiryForm: React.FC<WebsiteEnquiryFormProps> = ({
  initialWebsiteType = 'Business Website',
  className = '',
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    email: '',
    business_name: '',
    budget: '',
    project_description: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Single-step validation: Only Full Name, Mobile Number, and Email Address are mandatory
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. Mandatory: Full Name (min 2 chars)
    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Full name is required';
    } else if (formData.customer_name.trim().length < 2) {
      errs.customer_name = 'Name must be at least 2 characters';
    }

    // 2. Mandatory: Mobile Number (10 digits)
    const phoneDigits = formData.mobile_number.replace(/[^0-9]/g, '');
    if (!formData.mobile_number.trim()) {
      errs.mobile_number = 'Mobile number is required';
    } else if (phoneDigits.length < 10) {
      errs.mobile_number = 'Please enter a valid 10-digit mobile number';
    }

    // 3. Mandatory: Email Address (standard email regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Business Name, Budget, Project Description are strictly OPTIONAL
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Bot honeypot check
    if (formData.honeypot) {
      setSubmittedId('LS-DEMO');
      return;
    }

    // Validate mandatory fields
    if (!validateForm()) {
      return;
    }

    // Anti-duplicate submission check (within 8 seconds)
    const lastSubmitTime = sessionStorage.getItem('last_enquiry_submit');
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime, 10) < 8000) {
      setErrorMessage('Please wait a moment before submitting another request.');
      return;
    }

    setSubmitting(true);

    try {
      const budgetValue = formData.budget.trim() || 'Flexible';
      const descriptionValue = formData.project_description.trim() || 'Website Development Inquiry';

      const res = await submitWebsiteEnquiry({
        customer_name: formData.customer_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        email: formData.email.trim(),
        business_name: formData.business_name.trim(),
        organization: formData.business_name.trim(),
        budget: budgetValue,
        project_description: descriptionValue,
        website_type: initialWebsiteType || 'Business Website',
      });

      if (res.success && res.enquiryId) {
        setSubmittedId(res.enquiryId);
        sessionStorage.setItem('last_enquiry_submit', Date.now().toString());

        try {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Graceful fallback if confetti fails
        }

        if (onSuccess) {
          onSuccess(res.enquiryId);
        }
      } else {
        setErrorMessage(res.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      customer_name: '',
      mobile_number: '',
      email: '',
      business_name: '',
      budget: '',
      project_description: '',
      honeypot: '',
    });
    setErrors({});
    setSubmittedId(null);
    setErrorMessage(null);
  };

  // Celebration / Success State View
  if (submittedId) {
    return (
      <div className={`p-8 rounded-2xl bg-white border border-emerald-200/80 shadow-card text-center space-y-5 animate-fade-in ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Enquiry Received
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Thank You, {formData.customer_name}!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your website development enquiry has been successfully logged in our system. A Luminosoft engineer will review your requirements and reach out to you within 24 hours.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs text-slate-700 space-y-1.5 font-mono">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Enquiry Reference ID</div>
          <div className="font-bold text-slate-900 text-base">{submittedId}</div>
          <div className="text-[11px] text-emerald-600 font-sans font-medium">✓ Logged in Supabase Database</div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  // Single-Page Enquiry Form (No wizard, No steps, No progress bar, No review screen)
  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6 ${className}`}
      noValidate
    >
      {/* Bot Honeypot (hidden from real users) */}
      <input
        type="text"
        name="website_url_hp"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Form Header */}
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Website Development Inquiry
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Confidential</span>
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Tell us about your project. We'll review your requirements and provide an architecture plan and transparent quotation.
        </p>
      </div>

      {/* Global Error Message Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* 2-Column Responsive Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Full Name (REQUIRED) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Samir Pathan"
              value={formData.customer_name}
              onChange={(e) => {
                setFormData({ ...formData, customer_name: e.target.value });
                if (errors.customer_name) setErrors({ ...errors, customer_name: '' });
              }}
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border transition-all ${
                errors.customer_name
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          {errors.customer_name && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.customer_name}</p>
          )}
        </div>

        {/* 2. Mobile Number (REQUIRED) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={formData.mobile_number}
              onChange={(e) => {
                setFormData({ ...formData, mobile_number: e.target.value });
                if (errors.mobile_number) setErrors({ ...errors, mobile_number: '' });
              }}
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border transition-all ${
                errors.mobile_number
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          {errors.mobile_number && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.mobile_number}</p>
          )}
        </div>

        {/* 3. Email Address (REQUIRED) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="e.g. contact@yourbusiness.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border transition-all ${
                errors.email
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600'
              }`}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.email}</p>
          )}
        </div>

        {/* 4. Business Name (OPTIONAL) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Business Name <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Khan Electrics / ABC Store"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
            <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. Website Budget (OPTIONAL - Manual / Free-text input, NO dropdown) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Website Budget <span className="text-slate-400 font-normal text-[11px]">(Optional — Manual / Free text)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. ₹25,000, ₹50,000–₹1,00,000, or Flexible"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
          <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Enter any estimated budget or leave blank if flexible.
        </p>
      </div>

      {/* 6. Project Description (OPTIONAL multiline textarea) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Project Description <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
        </label>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="Describe what website you need, required pages, features, or design inspirations..."
            value={formData.project_description}
            onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
            className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 leading-relaxed"
          />
        </div>
      </div>

      {/* Single Submit Button & Guarantee */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 order-2 sm:order-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No spam • Direct technical response within 24 hours</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer order-1 sm:order-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Website Enquiry</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
