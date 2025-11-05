"use client";
import * as React from "react";

export default function HelpSection() {
  return (
    <div className="mt-6 bg-gradient-to-br from-white to-white/50 rounded-[14px] shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 18.333c4.603 0 8.333-3.731 8.333-8.333S14.603 1.667 10 1.667 1.667 5.397 1.667 10 5.397 18.333 10 18.333Z" stroke="#0A0A0A" strokeWidth="1.666" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.575 7.5c.196-.557.583-1.026 1.092-1.326.509-.299 1.107-.409 1.689-.309.582.1 1.11.402 1.49.854.38.451.588 1.023.587 1.613 0 1.667-2.5 2.5-2.5 2.5" stroke="#0A0A0A" strokeWidth="1.666" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 14.167H10.008" stroke="#0A0A0A" strokeWidth="1.666" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[16px] text-[#0a0a0a] tracking-[-0.312px]">What I Can Help You With</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Travel Request */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px] font-semibold">✈️&nbsp; Travel Request</span>
          </div>
          <ul className="space-y-1 text-[14px] text-[#717182]">
            <li>• Submit new travel requests</li>
            <li>• Edit or cancel existing bookings</li>
            <li>• Check approval status</li>
            <li>• View travel history</li>
          </ul>
        </div>

        {/* Claim & Reimburse */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px] font-semibold">💲&nbsp; Claim & Reimburse</span>
          </div>
          <ul className="space-y-1 text-[14px] text-[#717182]">
            <li>• Submit reimbursement requests</li>
            <li>• Upload receipts and supporting documents</li>
            <li>• Track reimbursement status</li>
            <li>• View past claims</li>
          </ul>
        </div>

        {/* Policies & Procedures */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px] font-semibold">📄&nbsp; Policies & Procedures</span>
          </div>
          <ul className="space-y-1 text-[14px] text-[#717182]">
            <li>• Company travel & accommodation policies</li>
            <li>• Allowance limits and claim rules</li>
            <li>• Refund and reschedule terms</li>
            <li>• Compliance info</li>
          </ul>
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px] font-semibold">👜&nbsp; Budget</span>
          </div>
          <ul className="space-y-1 text-[14px] text-[#717182]">
            <li>• View travel budget summary</li>
            <li>• Check remaining budget</li>
            <li>• Process refund or reimbursement</li>
            <li>• Track additional cost from reschedule</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
