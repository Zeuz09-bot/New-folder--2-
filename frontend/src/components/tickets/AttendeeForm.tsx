import { PurchaseFormData } from '@/lib/types';
import { User, Mail, Phone } from 'lucide-react';

interface AttendeeFormProps {
  data: PurchaseFormData;
  onChange: (data: Partial<PurchaseFormData>) => void;
  errors: Partial<Record<keyof PurchaseFormData, string>>;
}

export default function AttendeeForm({ data, onChange, errors }: AttendeeFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-poppins)] text-white mb-6">
        Attendee Information
      </h2>
      
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-zinc-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="text"
              id="full_name"
              value={data.full_name}
              onChange={(e) => onChange({ full_name: e.target.value })}
              className={`w-full bg-dark-200 border ${errors.full_name ? 'border-red-500' : 'border-white/10 focus:border-gold'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-gold transition-colors`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.full_name && <p className="mt-1.5 text-xs text-red-500">{errors.full_name}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`w-full bg-dark-200 border ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-gold'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-gold transition-colors`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          <p className="mt-2 text-xs text-zinc-500">Your ticket QR code will be sent to this email.</p>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-zinc-300 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="tel"
              id="phone_number"
              value={data.phone_number}
              onChange={(e) => onChange({ phone_number: e.target.value })}
              className={`w-full bg-dark-200 border ${errors.phone_number ? 'border-red-500' : 'border-white/10 focus:border-gold'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-gold transition-colors`}
              placeholder="08012345678"
            />
          </div>
          {errors.phone_number && <p className="mt-1.5 text-xs text-red-500">{errors.phone_number}</p>}
        </div>
      </div>
    </div>
  );
}
