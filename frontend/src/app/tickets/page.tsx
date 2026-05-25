'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/Button';
import StepProgress from '@/components/tickets/StepProgress';
import TierSelector from '@/components/tickets/TierSelector';
import QuantitySelector from '@/components/tickets/QuantitySelector';
import AttendeeForm from '@/components/tickets/AttendeeForm';
import OrderSummary from '@/components/tickets/OrderSummary';

import { PurchaseFormData, TicketType } from '@/lib/types';
import { isValidEmail, isValidPhone } from '@/lib/utils';

// Wrapped in Suspense boundary for useSearchParams
function TicketPurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTier = (searchParams.get('tier') as TicketType) || null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PurchaseFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    ticket_type: initialTier || 'REGULAR',
    ticket_quantity: 1,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PurchaseFormData, string>>>({});

  const handleNext = () => {
    // Validate step 2
    if (step === 2) {
      const errors: Partial<Record<keyof PurchaseFormData, string>> = {};
      if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
      if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
      else if (!isValidPhone(formData.phone_number)) errors.phone_number = 'Invalid phone format (e.g., 08012345678)';

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
    }

    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ticket order');
      }

      // Redirect to payment upload page
      router.push(`/tickets/${data.data.id}/payment`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <StepProgress currentStep={step} totalSteps={3} />

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <TierSelector
              selected={formData.ticket_type}
              onSelect={(tier) => setFormData({ ...formData, ticket_type: tier })}
            />
          )}

          {step === 2 && (
            <div className="space-y-8">
              <QuantitySelector
                tierId={formData.ticket_type}
                quantity={formData.ticket_quantity}
                onChange={(q) => setFormData({ ...formData, ticket_quantity: q })}
              />
              <AttendeeForm
                data={formData}
                onChange={(updates) => setFormData({ ...formData, ...updates })}
                errors={formErrors}
              />
            </div>
          )}

          {step === 3 && <OrderSummary data={formData} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div /> // Spacer
        )}

        {step < 3 ? (
          <Button onClick={handleNext} disabled={!formData.ticket_type}>
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} className="px-8">
            Confirm & Proceed to Payment
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TicketPurchasePage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 px-4 sm:px-6 min-h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            </div>
          }
        >
          <TicketPurchaseContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
