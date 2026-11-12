import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  Building,
  Mail,
  Phone,
  User,
  HelpCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitWebsiteEnquiry } from '../../lib/api';
import { WebsiteType } from '../../types';

interface WebsiteEnquiryFormProps {
  initialWebsiteType?: WebsiteType;
  className?: string;
  onSuccess?: (enquiryId: string) => void;
}

const WEBSITE_TYPES: WebsiteType[] = [
  'Business Website',
  'Hotel Website',
  'E-commerce Website',
  'Portfolio Website',
  'Educational Website',
  'Custom Website',
  'Other',
];

const BUDGET_RANGES = [
  'Under ₹5,000',
  '₹5,000–₹10,000',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  'Above ₹50,000',
  'Not Decided',
];

const TIMELINE_OPTIONS = [
  'Urgent (Within 1–2 Weeks)',
  'Standard (2–4 Weeks)',
  'Flexible (1–2 Months)',
  'Planning Phase',
];

export const WebsiteEnquiryForm: React.FC<WebsiteEnquiryFormProps> = ({
  initialWebsiteType = 'Business Website',
  className = '',
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    email: '',
    organization: '',
    website_type: initialWebsiteType,
    budget: 'Not Decided',
    timeline: 'Standard (2–4 Weeks)',
    project_description: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};

    // 1. Mandatory: Full Name
    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Full name is required';
    } else if (formData.customer_name.trim().length < 2) {
      errs.customer_name = 'Name must be at least 2 characters';
    }

    // 2. Mandatory: Mobile Number
    const phoneDigits = formData.mobile_number.replace(/[^0-9]/g, '');
    if (!formData.mobile_number.trim()) {
      errs.mobile_number = 'Mobile number is required';
    } else if (phoneDigits.length < 10) {
      errs.mobile_number = 'Please enter a valid 10-digit mobile number';
    }

    // 3. Mandatory: Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.website_type) {
      errs.website_type = 'Please select a website or application type';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  // Final Step Submission (Appears ONLY on Step 4)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 4) return;

    setErrorMessage(null);

    // Bot honeypot check
    if (formData.honeypot) {
      setSubmittedId('LS-DEMO');
      return;
    }

    // Comprehensive validation of all required fields
    if (!validateStep1() || !validateStep2()) {
      setErrorMessage('Please complete all required fields before saving.');
      return;
    }

    // Anti-spam duplicate submission check
    const lastSubmitTime = sessionStorage.getItem('last_enquiry_submit');
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime, 10) < 10000) {
      setErrorMessage('Please wait a moment before submitting another request.');
      return;
    }

    setSubmitting(true);

    try {
      const fullDescription = formData.timeline 
        ? `[Timeline: ${formData.timeline}] ${formData.project_description}`.trim()
        : formData.project_description.trim();

      const res = await submitWebsiteEnquiry({
        customer_name: formData.customer_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        email: formData.email.trim(),
        organization: formData.organization.trim(),
        website_type: formData.website_type,
        budget: formData.budget,
        project_description: fullDescription,
      });

      if (res.success && res.enquiryId) {
        setSubmittedId(res.enquiryId);
        sessionStorage.setItem('last_enquiry_submit', Date.now().toString());

        try {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}

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
      organization: '',
      website_type: initialWebsiteType,
      budget: 'Not Decided',
      timeline: 'Standard (2–4 Weeks)',
      project_description: '',
      honeypot: '',
    });
    setErrors({});
    setSubmittedId(null);
    setErrorMessage(null);
    setCurrentStep(1);
  };

  // Success view
  if (submittedId) {
    return (
      <div className={`p-8 rounded-2xl bg-white border border-emerald-200/80 shadow-card text-center space-y-5 animate-fade-in ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Application Received
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Thank You, {formData.customer_name}!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your application for a <strong>{formData.website_type}</strong> has been logged in our system. A Luminosoft technical consultant will review your specifications and contact you shortly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-xs text-slate-700 space-y-1.5 font-mono">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Application Reference ID</div>
          <div className="font-bold text-slate-900 text-sm">{submittedId}</div>
          <div className="text-[11px] text-slate-500 font-sans">Registered in Supabase PostgreSQL</div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: 'Contact Info' },
    { num: 2, title: 'Project Scope' },
    { num: 3, title: 'Budget & Timeline' },
    { num: 4, title: 'Review & Save' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6 ${className}`}
      noValidate
    >
      {/* Bot Honeypot */}
      <input
        type="text"
        name="website_url_hp"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Top 4-Step Progress Indicator */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Application Wizard
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Step Tabs Visual */}
        <div className="grid grid-cols-4 gap-2">
          {stepsList.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div key={step.num} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-blue-600'
                      : 'bg-slate-200'
                  }`}
                />
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-600 truncate">
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : (
                    <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center ${isCurrent ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>
                      {step.num}
                    </span>
                  )}
                  <span className={`truncate ${isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* =========================================================================
          STEP 1: FIRST STEP – CONTACT DETAILS
          DO NOT show Save Application. DO NOT show Submit Application.
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Step 1: Your Contact Information
            </h3>
            <p className="text-xs text-slate-500">
              Please provide your direct contact details so our engineers can send your proposal and technical roadmap.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. Full Name */}
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

            {/* 2. Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
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

            {/* 3. Email Address */}
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
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: SECOND STEP – PROJECT & SCOPE
          DO NOT show Save Application. DO NOT show Submit Application.
          ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Step 2: Organization &amp; Project Requirements
            </h3>
            <p className="text-xs text-slate-500">
              Select the type of digital solution you require and your organization details.
            </p>
          </div>

          <div className="space-y-4">
            {/* Organization Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Organization / Company / Brand <span className="text-slate-400 text-[10px]">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Khan Electrics or Green Valley Hotel"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Website / Application Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type of Website or Software Solution <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WEBSITE_TYPES.map((type) => {
                  const isSelected = formData.website_type === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, website_type: type })}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{type}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: THIRD STEP – BUDGET & TIMELINE
          DO NOT show Save Application. DO NOT show Submit Application.
          ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Step 3: Approximate Budget &amp; Preferred Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Help us tailor the architecture and engineering scope to match your financial and launch targets.
            </p>
          </div>

          <div className="space-y-4">
            {/* Budget Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approximate Budget Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUDGET_RANGES.map((b) => {
                  const isSelected = formData.budget === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: b })}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Project Launch Timeline
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((t) => {
                  const isSelected = formData.timeline === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: t })}
                      className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: FINAL STEP – DESCRIPTION, REVIEW & SAVE APPLICATION
          NOW show Save Application.
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Step 4: Project Notes &amp; Final Review
            </h3>
            <p className="text-xs text-slate-500">
              Review your application details below and click <strong>Save Application</strong> to submit.
            </p>
          </div>

          {/* Review Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Application Summary
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Verified for Submission</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Client Name</span>
                <span className="font-semibold text-slate-900">{formData.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contact</span>
                <span className="font-semibold text-slate-900">{formData.mobile_number} • {formData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Solution Type</span>
                <span className="font-semibold text-slate-900">{formData.website_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Budget &amp; Target</span>
                <span className="font-semibold text-slate-900">{formData.budget} ({formData.timeline})</span>
              </div>
            </div>
          </div>

          {/* Project Description Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Specific Project Notes / Requirements <span className="text-slate-400 text-[10px]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about any specific pages, features, payment gateways, or integrations you require..."
              value={formData.project_description}
              onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          WIZARD ACTIONS FOOTER
          Step 1: Next only (NO Save Application, NO Submit Application)
          Step 2 & 3: Previous and Next only (NO Save Application)
          Step 4: Previous AND Save Application!
          ========================================================================= */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        {/* Previous Button (Hidden on Step 1) */}
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Confidential &amp; Encrypted</span>
          </div>
        )}

        {/* Next or Save Application Button */}
        {currentStep < 4 ? (
          /* Steps 1, 2, 3: NEXT ONLY. Strictly NO Save Application. */
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer ml-auto"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          /* Step 4: NOW show Save Application! */
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 cursor-pointer ml-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Application...</span>
              </>
            ) : (
              <>
                <span>Save Application</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
