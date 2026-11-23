import React, { useState } from 'react';
import {
  IdCard,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  QrCode,
  Lock,
  Wifi,
  Building2,
  Calendar,
  GraduationCap,
  RotateCw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface Student3DIdCardProps {
  user: UserProfile;
  name?: string;
  collegeId?: string;
  avatar?: string;
  course?: string;
}

export const Student3DIdCard: React.FC<Student3DIdCardProps> = ({
  user,
  name,
  collegeId,
  avatar,
  course,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const displayName = name || user.name || 'Janvi Mauka';
  const displayId = collegeId || user.collegeId || 'STU-2027-8891';
  const displayAvatar = avatar || user.avatar;
  const displayCourse = course || user.course || 'B.Tech - Computer Science & Engineering';

  return (
    <div className="relative mx-auto my-3 w-full max-w-md select-none perspective-1000">
      
      {/* 3D Container with hover tilt & flip */}
      <div
        className="group relative cursor-pointer transition-transform duration-700 ease-out"
        onClick={() => setIsFlipped(!isFlipped)}
        title="Click to Flip ID Card"
      >
        {/* Glow ambient background aura */}
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 opacity-30 blur-xl group-hover:opacity-55 transition-opacity duration-500 pointer-events-none" />

        {/* Lanyard Strap & Clip Simulation at Top */}
        <div className="relative z-20 flex flex-col items-center -mb-2">
          {/* Lanyard Fabric */}
          <div className="h-4 w-12 rounded-t-sm bg-gradient-to-r from-indigo-800 via-blue-700 to-indigo-900 border-x border-white/20 shadow-xs" />
          {/* Metal Lanyard Clip */}
          <div className="h-3 w-7 rounded-sm bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 border border-slate-300 shadow-sm" />
          {/* Punch Slot in Card */}
          <div className="h-2 w-8 -mt-1 rounded-full bg-slate-950/80 border border-white/30 shadow-inner" />
        </div>

        {/* ============================== FRONT FACE OF 3D ID CARD ============================== */}
        {!isFlipped ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#0B1528] via-[#102446] to-[#1E3A8A] p-5 text-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.6)] transition-all duration-500 group-hover:scale-[1.01] group-hover:-rotate-0.5">
            
            {/* Holographic Security Diagonal Sheen */}
            <div className="pointer-events-none absolute -inset-full rotate-45 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            {/* Background University Seal Watermark */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full border-8 border-white/[0.04] flex items-center justify-center">
              <Building2 className="h-32 w-32 text-white/[0.03]" />
            </div>

            {/* Top ID Card Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30">
                  <span className="font-black text-sm tracking-tighter">PZ</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                      National Institute of Technology
                    </span>
                    <BadgeCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-[9px] font-semibold tracking-widest uppercase text-slate-300">
                    Official Student Identity & Digital Wallet Card
                  </p>
                </div>
              </div>

              {/* RFID Contactless Wave Symbol */}
              <div className="flex items-center gap-1 text-slate-300">
                <Wifi className="h-4 w-4 rotate-90 text-cyan-400" />
              </div>
            </div>

            {/* Middle Section: Photo + Gold Microchip + Details */}
            <div className="mt-4 flex gap-4">
              
              {/* Left Column: Photo & Status */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-24 w-20 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-md shadow-black/40"
                  />
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-max rounded-full bg-emerald-500/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-xs">
                    ACTIVE
                  </div>
                </div>

                {/* Simulated EMV Smart Microchip */}
                <div className="mt-4 h-7 w-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-xs border border-amber-300/60">
                  <div className="h-full w-full rounded-xs border border-amber-700/30 grid grid-cols-2 gap-0.5 opacity-80">
                    <div className="border-r border-amber-700/40" />
                    <div />
                  </div>
                </div>
              </div>

              {/* Right Column: Student Credentials */}
              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Student Full Name
                  </span>
                  <h3 className="text-base font-black tracking-tight text-white leading-tight">
                    {displayName}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Student Roll / ID
                    </span>
                    <span className="font-mono text-xs font-black text-cyan-300">
                      {displayId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Valid Thru
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      06/2027
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Major / Department
                  </span>
                  <p className="text-xs font-bold text-slate-100 truncate">
                    {displayCourse}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="rounded-md bg-indigo-500/30 border border-indigo-400/30 px-2 py-0.5 text-[9px] font-bold text-indigo-200">
                    B.Tech 3rd Year
                  </span>
                  <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                    PIN 1507 Locked
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Bar: Holographic Strip + Barcode */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              
              {/* Realistic Code 128 Barcode Simulation */}
              <div className="space-y-0.5">
                <div className="flex h-5 items-end gap-[1.5px] bg-white px-2 py-0.5 rounded-sm">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-slate-400 tracking-widest block">
                  {displayId}
                </span>
              </div>

              {/* Holographic Security Foil Seal */}
              <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-cyan-400/20 border border-white/30 px-2.5 py-1 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-cyan-300 animate-spin" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-white">
                  GENUINE PZ ID
                </span>
              </div>

              {/* Click to Flip hint */}
              <button
                type="button"
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
              >
                <RotateCw className="h-3 w-3" />
                <span>Flip</span>
              </button>
            </div>

          </div>
        ) : (
          /* ============================== BACK FACE OF 3D ID CARD ============================== */
          <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0E1A] p-5 text-white shadow-2xl transition-all duration-500">
            
            {/* Magnetic Stripe on Back */}
            <div className="-mx-5 -mt-2 mb-4 h-10 bg-slate-950 border-y border-white/10 shadow-inner" />

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">CAMPUS ACCESS CARD</h4>
                  <p className="text-[9px] text-slate-400">Library • Hostel • Labs • Mess Tap-to-Pay</p>
                </div>
                <QrCode className="h-9 w-9 text-cyan-400 bg-white p-1 rounded-lg" />
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 space-y-1 text-[10px] text-slate-300">
                <p>• This digital identity card is non-transferable and issued to registered students.</p>
                <p>• Master Security PIN is permanently locked to <strong>1507</strong> for emergency campus verification.</p>
                <p>• If lost or damaged, report to Campus Student Affairs immediately.</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
                <span>Emergency: 1800-POCKETZAPP</span>
                <button
                  type="button"
                  className="flex items-center gap-1 font-bold text-cyan-300 hover:text-white"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Flip to Front</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
