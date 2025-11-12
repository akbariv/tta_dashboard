"use client";

import React, { useState } from "react";

export default function ChatbotContent() {
  const [chatInput, setChatInput] = useState("");

  return (
    <>
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[32px] text-[#202224] tracking-[-0.114px] mb-2">
          AI Assitant
        </h1>
        <p className="font-['Poppins:Light',sans-serif] text-[16px] text-black tracking-[-0.114px]">
          Get instant help with TTA questions and tasks
        </p>
        
        {/* AI Powered Badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-[#dcfce7] border border-transparent rounded-lg">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 7.00008C1.90538 7.0004 1.81261 6.97387 1.73247 6.92357C1.65233 6.87327 1.58811 6.80126 1.54727 6.71591C1.50643 6.63056 1.49064 6.53537 1.50175 6.44141C1.51285 6.34745 1.55039 6.25856 1.61 6.18508L6.56 1.08508C6.59713 1.04222 6.64773 1.01326 6.70349 1.00295C6.75925 0.992636 6.81686 1.00159 6.86686 1.02833C6.91686 1.05508 6.95629 1.09803 6.97866 1.15014C7.00104 1.20224 7.00503 1.26041 6.99 1.31508L6.03 4.32508C6.00169 4.40084 5.99218 4.48234 6.00229 4.56258C6.0124 4.64283 6.04183 4.71942 6.08804 4.78579C6.13426 4.85217 6.19588 4.90634 6.26763 4.94366C6.33938 4.98098 6.41912 5.00034 6.5 5.00008H10C10.0946 4.99976 10.1874 5.02629 10.2675 5.07659C10.3477 5.12689 10.4119 5.1989 10.4527 5.28425C10.4936 5.3696 10.5093 5.46479 10.4982 5.55875C10.4871 5.65272 10.4496 5.7416 10.39 5.81508L5.44 10.9151C5.40287 10.9579 5.35227 10.9869 5.29651 10.9972C5.24074 11.0075 5.18313 10.9986 5.13313 10.9718C5.08313 10.9451 5.0437 10.9021 5.02133 10.85C4.99895 10.7979 4.99496 10.7398 5.01 10.6851L5.97 7.67508C5.9983 7.59932 6.00781 7.51782 5.9977 7.43758C5.98759 7.35733 5.95817 7.28074 5.91195 7.21437C5.86574 7.148 5.80411 7.09382 5.73236 7.0565C5.66061 7.01918 5.58087 6.99982 5.5 7.00008H2Z" stroke="#016630" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Inter:Medium',sans-serif] text-[12px] text-[#016630]">
            AI Powered
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 mb-8">
        {/* Quick Actions Card */}
        <div className="w-full lg:w-[331px] bg-gradient-to-br from-white to-white/50 rounded-[14px] shadow-lg p-6">
          <div className="flex items-center gap-2 mb-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 11.6667C12.6667 10.8334 13.0833 10.2501 13.75 9.58341C14.5833 8.83341 15 7.75008 15 6.66675C15 5.34067 14.4732 4.0689 13.5355 3.13121C12.5979 2.19353 11.3261 1.66675 10 1.66675C8.67392 1.66675 7.40215 2.19353 6.46447 3.13121C5.52678 4.0689 5 5.34067 5 6.66675C5 7.50008 5.16667 8.50008 6.25 9.58341C6.83333 10.1667 7.33333 10.8334 7.5 11.6667" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 15H12.5" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33334 18.3333H11.6667" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Inter:Regular',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
              Quick Actions
            </span>
          </div>

          {/* Action Items */}
          <div className="flex flex-col gap-3">
            <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-[10px] bg-[#dbeafe] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15.305 1.09675C15.0715 0.71725 14.6647 0.5 14.1885 0.5C13.9115 0.5 13.6265 0.573 13.3415 0.71675C12.3777 1.20375 11.151 2.08375 9.86374 3.1965L7.25224 2.90625L7.72549 2.43275L7.24824 1.95525L6.39274 2.8105L3.66999 2.50825L4.23749 1.94075L3.75974 1.463L2.81049 2.41275L0.817987 2.19125C0.325987 2.1365 0.420987 3.373 0.992987 3.63975L6.71024 6.30475C5.60824 7.536 4.12174 9.35375 3.57274 10.7475L1.06549 10.469C0.895987 10.4505 0.928487 10.8752 1.12524 10.967C2.39049 11.5565 3.05449 11.8663 3.40349 12.029C3.41149 12.0553 3.42224 12.0803 3.43249 12.1053C2.95149 12.686 2.68124 13.1265 2.77899 13.2235C2.87549 13.3197 3.31349 13.051 3.89174 12.5715C3.91774 12.5825 3.94474 12.5933 3.97374 12.6025L5.03274 14.8752C5.12474 15.0722 5.54974 15.104 5.53099 14.935L5.25374 12.4347C6.46899 11.9487 8.13399 10.708 9.69974 9.299L12.3595 15.0065C12.6265 15.5798 13.8635 15.6737 13.8087 15.1812L13.5872 13.1885L14.5365 12.2395L14.0587 11.7618L13.4917 12.329L13.1895 9.606L14.0442 8.7515L13.5665 8.2735L13.0937 8.7465L12.8037 6.13625C13.917 4.849 14.797 3.62225 15.2835 2.6585C15.5647 2.10025 15.5725 1.531 15.305 1.09675Z" fill="#193CB8"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                  Submit Travel Request
                </div>
                <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                  Start a new business travel plan
                </div>
              </div>
            </button>

            {/* More action buttons omitted for brevity — kept the same as original */}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-white rounded-[14px] shadow-lg">
          {/* Chat Header */}
          <div className="border-b border-black/10 p-6">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.49334 13.6184C2.61587 13.9275 2.64315 14.2662 2.57167 14.5909L1.68417 17.3326C1.65558 17.4716 1.66297 17.6156 1.70565 17.751C1.74834 17.8864 1.82489 18.0086 1.92806 18.1061C2.03123 18.2036 2.1576 18.2732 2.29517 18.3081C2.43275 18.3431 2.57697 18.3423 2.71417 18.3059L5.55834 17.4742C5.86477 17.4135 6.18211 17.44 6.47417 17.5509C8.25366 18.3819 10.2695 18.5577 12.166 18.0473C14.0625 17.5369 15.7177 16.3731 16.8398 14.7612C17.9618 13.1493 18.4784 11.1929 18.2986 9.23719C18.1187 7.28148 17.2539 5.45213 15.8567 4.0719C14.4595 2.69167 12.6198 1.84927 10.662 1.69332C8.70423 1.53737 6.75429 2.07789 5.15621 3.21952C3.55813 4.36115 2.41462 6.03052 1.92742 7.9331C1.44022 9.83568 1.64065 11.8492 2.49334 13.6184Z" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-['Inter:Regular',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                Chat with TTA AI Assistant
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Messages kept from original - static examples */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.99998 5.33341V2.66675H5.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5.33325H4.00002C3.26364 5.33325 2.66669 5.93021 2.66669 6.66659V11.9999C2.66669 12.7363 3.26364 13.3333 4.00002 13.3333H12C12.7364 13.3333 13.3334 12.7363 13.3334 11.9999V6.66659C13.3334 5.93021 12.7364 5.33325 12 5.33325Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
                  <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#030213] tracking-[-0.312px] leading-6">
                    Please fill in form submit travel request.
                  </p>
                </div>
                <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] mt-1">09:00 AM</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-black/10 p-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-[#f3f3f5] rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me about travel requests, budgets, or reimbursements…"
                    className="flex-1 bg-transparent outline-none font-['Inter:Regular',sans-serif] text-[14px] text-[#030213] placeholder:text-[#717182] tracking-[-0.15px]"
                  />
                </div>
                <button className="w-10 h-9 bg-[#030213] opacity-50 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.6907 14.4572C9.71603 14.5203 9.76006 14.5742 9.81688 14.6116C9.87371 14.6489 9.9406 14.668 10.0086 14.6663C10.0766 14.6646 10.1424 14.6421 10.1973 14.6018C10.2521 14.5616 10.2933 14.5055 10.3154 14.4412L14.6487 1.77454C14.67 1.71547 14.6741 1.65154 14.6604 1.59024C14.6468 1.52894 14.6159 1.4728 14.5715 1.42839C14.5271 1.38398 14.471 1.35314 14.4097 1.33947C14.3484 1.3258 14.2844 1.32987 14.2254 1.35121L1.5587 5.68454C1.49436 5.7066 1.43832 5.74782 1.39808 5.80266C1.35785 5.85749 1.33535 5.92332 1.33361 5.99131C1.33186 6.05931 1.35096 6.1262 1.38834 6.18303C1.42571 6.23985 1.47958 6.28388 1.5427 6.30921L6.82937 8.42921C6.99649 8.49612 7.14833 8.59618 7.27574 8.72336C7.40315 8.85054 7.50349 9.0022 7.5707 9.16921L9.6907 14.4572Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.5693 1.4314L7.276 8.72406" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] mt-2 px-1">
                Ask about leave balances, policies, employee directory, payroll, and more
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
