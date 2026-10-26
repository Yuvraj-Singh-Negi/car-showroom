'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, Send } from 'lucide-react';
import Button from '@/components/ui/Button';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  model: string;
  date: string;
  message: string;
}

const EMPTY_FORM: BookingFormData = {
  name: '',
  email: '',
  phone: '',
  model: '',
  date: '',
  message: '',
};

export default function BookingPage() {
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    key: keyof BookingFormData,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address';
    }
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.model.trim()) next.model = 'Please select a model';
    if (!form.date.trim()) next.date = 'Please select a preferred date';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate frontend-only handling. No backend is connected.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="w-full h-full flex flex-col">
        <header className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 md:py-6 pointer-events-auto">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[14px] md:text-lg font-bold uppercase tracking-[0.04em] text-foreground hover:text-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            RETURN TO GALLERY
          </Link>
          <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted">
            BOOK A TEST DRIVE
          </div>
        </header>

        <main className="flex-1 relative flex items-center justify-center p-6 md:p-12">
          <div className="max-w-[560px] w-full text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <Send className="h-6 w-6 text-foreground" />
            </div>
            <h1 className="text-[28px] md:text-[40px] font-bold uppercase tracking-tight text-foreground mb-4">
              Request received
            </h1>
            <p className="text-[12px] md:text-lg text-muted mb-10 leading-relaxed">
              Thank you for your interest in the{' '}
              <span className="text-foreground font-medium">{form.model}</span>. Your booking request has been recorded locally.
              A member of the AURA team will be in touch to confirm your test drive.
            </p>
            <p className="text-[11px] md:text-sm text-muted mb-10">
              This is a front-end demonstration only; no data has been sent to an external service.
            </p>
            <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>
              BOOK ANOTHER
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <header className="relative z-40 flex items-center justify-between px-6 md:px-12 py-5 md:py-6 pointer-events-auto">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[14px] md:text-lg font-bold uppercase tracking-[0.04em] text-foreground hover:text-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          RETURN TO GALLERY
        </Link>
        <div className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted">
          BOOK A TEST DRIVE
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="max-w-[560px] w-full space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                FULL NAME
              </label>
              <input
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={[
                  'w-full h-10 rounded-none border border-border bg-background text-foreground px-3 text-[12px]',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
                  errors.name ? 'border-red-500' : '',
                ].join(' ')}
                required
              />
              {errors.name && (
                <p className="text-[10px] text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                EMAIL
              </label>
              <input
                name="email"
                autoComplete="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={[
                  'w-full h-10 rounded-none border border-border bg-background text-foreground px-3 text-[12px]',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
                  errors.email ? 'border-red-500' : '',
                ].join(' ')}
              />
              {errors.email && (
                <p className="text-[10px] text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
              PHONE
            </label>
            <input
              name="phone"
              autoComplete="tel"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={[
                'w-full h-10 rounded-none border border-border bg-background text-foreground px-3 text-[12px]',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
                errors.phone ? 'border-red-500' : '',
              ].join(' ')}
            />
            {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                MODEL
              </label>
              <select
                name="model"
                value={form.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className={[
                  'w-full h-10 rounded-none border border-border bg-background text-foreground px-3 text-[12px]',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
                  errors.model ? 'border-red-500' : '',
                ].join(' ')}
              >
                <option value="">Select a model</option>
                <option value="vantage">VANTAGE</option>
                <option value="model-two">MODEL TWO</option>
                <option value="model-three">MODEL THREE</option>
              </select>
              {errors.model && <p className="text-[10px] text-red-500">{errors.model}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                PREFERRED DATE
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={[
                  'w-full h-10 rounded-none border border-border bg-background text-foreground px-3 text-[12px]',
                  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
                  errors.date ? 'border-red-500' : '',
                ].join(' ')}
              />
              {errors.date && <p className="text-[10px] text-red-500">{errors.date}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
              MESSAGE
            </label>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className={[
                'w-full rounded-none border border-border bg-background text-foreground px-3 py-3 text-[12px]',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
              ].join(' ')}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <span className="relative h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-[spin_1s_linear_infinite]">
                    <span className="sr-only">Sending</span>
                  </span>
                  REQUESTING
                </>
              ) : (
                'REQUEST TEST DRIVE'
              )}
            </Button>
          </div>

          <p className="text-[10px] text-muted mt-2">
            This is a front-end demonstration only. No data is submitted to an
            external service and no booking is guaranteed.
          </p>
        </form>

        <aside className="mt-10 md:mt-0 md:absolute md:right-0 md:top-1/4 md:w-64">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  EMAIL
                </p>
                <p className="text-[12px] text-foreground">bookings@aura.example</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  PHONE
                </p>
                <p className="text-[12px] text-foreground">+1 (555) 0100</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  HOURS
                </p>
                <p className="text-[12px] text-foreground">
                  Mon–Fri, 9:00–18:00
                </p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
