"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'chatbot' | 'settings'>('chatbot');
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        router.replace("/");
        return;
      }
      setUser(JSON.parse(raw));
    } catch (e) {
      router.replace("/");
    }
  }, [router]);

  function logout() {
    try {
      localStorage.removeItem("authUser");
    } catch (e) {}
    router.push("/");
  }

  const handleMenuClick = (menu: 'dashboard' | 'chatbot' | 'settings' | 'logout') => {
    if (menu === 'logout') {
      logout();
      return;
    }
    setActiveMenu(menu);
  };

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white h-[73px] border-b border-[#E0E0E0] flex items-center px-8 justify-between">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <button className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                <text fill="#202224" fontFamily="LineAwesome" fontSize="22" fontWeight="500">☰</text>
              </svg>
            </button>
            <div className="relative w-[388px]">
              <div className="h-[38px] rounded-[19px] border-[0.6px] border-[#d5d5d5] bg-[#f5f6fa] flex items-center px-4 gap-3">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" opacity="0.5">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.1441 11.9861C11.8739 10.826 13.1464 7.67253 11.9863 4.94269C10.8261 2.21286 7.67265 0.940375 4.94281 2.10053C2.21297 3.26068 0.94049 6.41414 2.10064 9.14398C3.2608 11.8738 6.41426 13.1463 9.1441 11.9861Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.8408 10.8406L15.0061 15.0065" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#202224] placeholder:text-[#202224] placeholder:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Notification & Profile */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="relative w-[35px] h-[35px] flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15.0001 28.5667C15.525 28.5547 16.0288 28.3573 16.4222 28.0096C16.8157 27.6619 17.0735 27.1862 17.1501 26.6667H12.7667C12.8455 27.2003 13.1153 27.6872 13.5261 28.0367C13.937 28.3862 14.4607 28.5745 15.0001 28.5667Z" fill="#0072FF"/>
                <path d="M27.375 23.4417L27.0916 23.1917C26.2878 22.4756 25.5843 21.6543 25 20.7501C24.3618 19.5022 23.9793 18.1394 23.875 16.7417V12.6251C23.8716 12.125 23.827 11.6261 23.7416 11.1334C22.3301 10.8433 21.0621 10.0743 20.1525 8.95657C19.2428 7.83887 18.7474 6.44116 18.75 5.00008V4.47508C17.8799 4.04691 16.9451 3.76534 15.9833 3.64175V2.59175C15.9833 2.29669 15.8661 2.01373 15.6574 1.80509C15.4488 1.59646 15.1658 1.47925 14.8708 1.47925C14.5757 1.47925 14.2928 1.59646 14.0841 1.80509C13.8755 2.01373 13.7583 2.29669 13.7583 2.59175V3.68341C11.6047 3.98721 9.63377 5.05987 8.20931 6.70336C6.78485 8.34685 6.00307 10.4502 6.00829 12.6251V16.7417C5.90392 18.1394 5.52144 19.5022 4.88329 20.7501C4.30903 21.652 3.61679 22.4732 2.82496 23.1917L2.54163 23.4417V25.7917H27.375V23.4417Z" fill="#0072FF"/>
                <path d="M25 9.16658C27.3012 9.16658 29.1667 7.30111 29.1667 4.99992C29.1667 2.69873 27.3012 0.833252 25 0.833252C22.6989 0.833252 20.8334 2.69873 20.8334 4.99992C20.8334 7.30111 22.6989 9.16658 25 9.16658Z" fill="#FF4646"/>
              </svg>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-gray-300 to-gray-400 overflow-hidden">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSI+CiAgPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNEOEQ4RDgiLz4KPC9zdmc+')] bg-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Poppins:Bold',sans-serif] text-[14px] text-[#404040]">
                  {user?.name || "Alice Key"}
                </span>
                <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#565656]">
                  IT Governance
                </span>
              </div>
              <button className="w-[30px] h-[30px] rounded-full border border-[#5c5c5c] flex items-center justify-center">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M4 4.9692L1.227 1.7347C1.023 1.496 0.691 1.496 0.487 1.7347C0.282 1.9733 0.282 2.3602 0.487 2.5989L3.63 6.2656C3.834 6.5042 4.166 6.5042 4.37 6.2656L7.513 2.5989C7.718 2.3602 7.718 1.9733 7.513 1.7347C7.309 1.496 6.977 1.496 6.772 1.7347L4 4.9692Z" fill="#565656"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-8 py-6">
          {activeMenu === 'chatbot' && (
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
                    {/* Submit Travel Request */}
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

                    {/* Claim & Reimburse */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#dcfce7] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1.33325V14.6666" stroke="#016630" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.3333 3.33325H6.33333C5.71449 3.33325 5.121 3.57908 4.68342 4.01667C4.24583 4.45425 4 5.04775 4 5.66659C4 6.28542 4.24583 6.87892 4.68342 7.3165C5.121 7.75409 5.71449 7.99992 6.33333 7.99992H9.66667C10.2855 7.99992 10.879 8.24575 11.3166 8.68334C11.7542 9.12092 12 9.71441 12 10.3333C12 10.9521 11.7542 11.5456 11.3166 11.9832C10.879 12.4208 10.2855 12.6666 9.66667 12.6666H4" stroke="#016630" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          Claim & Reimburse
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          Submit travel expense
                        </div>
                      </div>
                    </button>

                    {/* Reschedule / Cancel Trip */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#f3e8ff] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 4V8L10.6667 9.33333" stroke="#6E11B0" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.00001 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00001 1.33325C4.31811 1.33325 1.33334 4.31802 1.33334 7.99992C1.33334 11.6818 4.31811 14.6666 8.00001 14.6666Z" stroke="#6E11B0" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          Reschedule / Cancel Trip
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          Adjust your existing booking
                        </div>
                      </div>
                    </button>

                    {/* Check Booking Status */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#ffedd4] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12.57 11.882L13.336 12.5245C13.8614 11.9039 14.2744 11.1962 14.5565 10.4335L13.6175 10.092C13.3753 10.7451 13.021 11.3508 12.5705 11.882H12.57Z" fill="#9F2D00"/>
                          <path d="M9 13.9051L9.2065 14.8891C10.0053 14.7507 10.7738 14.4735 11.477 14.0701L11 13.2046C10.378 13.5501 9.70163 13.7869 9 13.9051Z" fill="#9F2D00"/>
                          <path d="M8 11C7.85166 11 7.70666 11.044 7.58332 11.1264C7.45999 11.2088 7.36386 11.3259 7.30709 11.463C7.25032 11.6 7.23547 11.7508 7.26441 11.8963C7.29335 12.0418 7.36478 12.1754 7.46967 12.2803C7.57456 12.3852 7.7082 12.4567 7.85368 12.4856C7.99917 12.5145 8.14997 12.4997 8.28701 12.4429C8.42406 12.3861 8.54119 12.29 8.6236 12.1667C8.70601 12.0433 8.75 11.8983 8.75 11.75C8.75 11.5511 8.67098 11.3603 8.53033 11.2197C8.38968 11.079 8.19891 11 8 11Z" fill="#9F2D00"/>
                          <path d="M7.5 4H8.5V9.5H7.5V4Z" fill="#9F2D00"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          Check Booking Status
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          View your current trip and approval status
                        </div>
                      </div>
                    </button>

                    {/* Company Policies */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#cbfbf1] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3.99999 14.6666C3.64637 14.6666 3.30723 14.5261 3.05718 14.2761C2.80713 14.026 2.66666 13.6869 2.66666 13.3333V2.66659C2.66666 2.31297 2.80713 1.97383 3.05718 1.72378C3.30723 1.47373 3.64637 1.33325 3.99999 1.33325H9.33332C9.54436 1.33291 9.75338 1.37432 9.94834 1.4551C10.1433 1.53588 10.3204 1.65443 10.4693 1.80392L12.8613 4.19592C13.0112 4.34493 13.1301 4.52215 13.2111 4.71736C13.2921 4.91257 13.3337 5.1219 13.3333 5.33325V13.3333C13.3333 13.6869 13.1928 14.026 12.9428 14.2761C12.6927 14.5261 12.3536 14.6666 12 14.6666H3.99999Z" stroke="#005F5A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.33334 1.33325V4.66659C9.33334 4.8434 9.40358 5.01297 9.52861 5.13799C9.65363 5.26301 9.8232 5.33325 10 5.33325H13.3333" stroke="#005F5A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.66668 6H5.33334" stroke="#005F5A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.6667 8.66675H5.33334" stroke="#005F5A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.6667 11.3333H5.33334" stroke="#005F5A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          Company Policies
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          Access travel & accommodation rules
                        </div>
                      </div>
                    </button>

                    {/* View Budget Summary */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#fce7f3] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M10.6667 4.66675H14.6667V8.66675" stroke="#A3004C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.6667 4.66675L9.00001 10.3334L5.66668 7.00008L1.33334 11.3334" stroke="#A3004C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          View Budget Summary
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          Check your travel budget
                        </div>
                      </div>
                    </button>

                    {/* Travel History */}
                    <button className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-[10px] bg-[#e7f3fc] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 4V8L10.6667 9.33333" stroke="#005FA3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.00001 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00001 1.33325C4.31811 1.33325 1.33334 4.31802 1.33334 7.99992C1.33334 11.6818 4.31811 14.6666 8.00001 14.6666Z" stroke="#005FA3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-['Inter:Medium',sans-serif] text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                          Travel History
                        </div>
                        <div className="font-['Inter:Medium',sans-serif] text-[12px] text-[#717182]">
                          Review past trips and reimbursements
                        </div>
                      </div>
                    </button>
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
                    {/* AI Message 1 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.99998 5.33341V2.66675H5.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5.33325H4.00002C3.26364 5.33325 2.66669 5.93021 2.66669 6.66659V11.9999C2.66669 12.7363 3.26364 13.3333 4.00002 13.3333H12C12.7364 13.3333 13.3334 12.7363 13.3334 11.9999V6.66659C13.3334 5.93021 12.7364 5.33325 12 5.33325Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.33331 9.33325H2.66665" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.3333 9.33325H14.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
                          <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#030213] tracking-[-0.312px] leading-6">
                            Please fill in form submit travel request.
                          </p>
                        </div>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] mt-1">
                          09:00 AM
                        </p>
                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button className="px-3 py-1 bg-white border border-black/10 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] text-[#0a0a0a] hover:bg-gray-50">
                            Submit Travel Request
                          </button>
                          <button className="px-3 py-1 bg-white border border-black/10 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] text-[#0a0a0a] hover:bg-gray-50">
                            Reschedule / Cancel Trip
                          </button>
                          <button className="px-3 py-1 bg-white border border-black/10 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] text-[#0a0a0a] hover:bg-gray-50">
                            Claim & Reimburse
                          </button>
                          <button className="px-3 py-1 bg-white border border-black/10 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] text-[#0a0a0a] hover:bg-gray-50">
                            View Budget Summary
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3 justify-end">
                      <div className="flex-1 flex justify-end">
                        <div className="inline-block bg-[#030213] text-white rounded-[10px] px-4 py-3 max-w-[294px]">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-['Inter:Regular',sans-serif] text-[16px] tracking-[-0.312px] leading-6">
                              Moda Internal/External?
                            </p>
                            <div className="bg-white text-black px-3 py-2 rounded-[10px]">
                              <span className="font-['Inter:Regular',sans-serif] text-[16px] tracking-[-0.312px]">
                                Internal
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shrink-0" />
                    </div>
                    <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] text-right">
                      Form Travel Request - 12:36 AM
                    </p>

                    {/* AI Message 2 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.99998 5.33341V2.66675H5.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5.33325H4.00002C3.26364 5.33325 2.66669 5.93021 2.66669 6.66659V11.9999C2.66669 12.7363 3.26364 13.3333 4.00002 13.3333H12C12.7364 13.3333 13.3334 12.7363 13.3334 11.9999V6.66659C13.3334 5.93021 12.7364 5.33325 12 5.33325Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.33331 9.33325H2.66665" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.3333 9.33325H14.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
                          <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#030213] tracking-[-0.312px] leading-6">
                            Checking transportation availability ...
                          </p>
                        </div>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] mt-1">
                          09:00 AM
                        </p>
                      </div>
                    </div>

                    {/* AI Message 3 */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.99998 5.33341V2.66675H5.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5.33325H4.00002C3.26364 5.33325 2.66669 5.93021 2.66669 6.66659V11.9999C2.66669 12.7363 3.26364 13.3333 4.00002 13.3333H12C12.7364 13.3333 13.3334 12.7363 13.3334 11.9999V6.66659C13.3334 5.93021 12.7364 5.33325 12 5.33325Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.33331 9.33325H2.66665" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.3333 9.33325H14.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 8.66675V10.0001" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
                          <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[#030213] tracking-[-0.312px] leading-6">
                            Your will using the transportation in this week or want to custom date?<br />
                            This availability in this week:<br />
                            <span className="font-bold">Sunday - Thursday</span><br />
                            Sedan: 07.00 - 21.30 WIB
                          </p>
                        </div>
                        <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[#717182] mt-1">
                          09:00 AM
                        </p>
                      </div>
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

              {/* What I Can Help You With Section */}
              <div className="bg-gradient-to-br from-white to-white/50 rounded-[14px] shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99999 18.3334C14.6024 18.3334 18.3333 14.6025 18.3333 10.0001C18.3333 5.39771 14.6024 1.66675 9.99999 1.66675C5.39762 1.66675 1.66666 5.39771 1.66666 10.0001C1.66666 14.6025 5.39762 18.3334 9.99999 18.3334Z" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.57501 7.49999C7.77093 6.94304 8.15764 6.47341 8.66664 6.17426C9.17564 5.87512 9.77409 5.76577 10.356 5.86558C10.9379 5.96539 11.4657 6.26792 11.8459 6.71959C12.2261 7.17126 12.4342 7.74292 12.4333 8.33332C12.4333 9.99999 9.93335 10.8333 9.93335 10.8333" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14.1667H10.0083" stroke="#0A0A0A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-['Inter:Regular',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                    What I Can Help You With
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Travel Request */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M15.305 1.09675C15.0715 0.71725 14.6647 0.5 14.1885 0.5C13.9115 0.5 13.6265 0.573 13.3415 0.71675C12.3777 1.20375 11.151 2.08375 9.86374 3.1965L7.25224 2.90625L7.72549 2.43275L7.24824 1.95525L6.39274 2.8105L3.66999 2.50825L4.23749 1.94075L3.75974 1.463L2.81049 2.41275L0.817987 2.19125C0.325987 2.1365 0.420987 3.373 0.992987 3.63975L6.71024 6.30475C5.60824 7.536 4.12174 9.35375 3.57274 10.7475L1.06549 10.469C0.895987 10.4505 0.928487 10.8752 1.12524 10.967C2.39049 11.5565 3.05449 11.8663 3.40349 12.029C3.41149 12.0553 3.42224 12.0803 3.43249 12.1053C2.95149 12.686 2.68124 13.1265 2.77899 13.2235C2.87549 13.3197 3.31349 13.051 3.89174 12.5715C3.91774 12.5825 3.94474 12.5933 3.97374 12.6025L5.03274 14.8752C5.12474 15.0722 5.54974 15.104 5.53099 14.935L5.25374 12.4347C6.46899 11.9487 8.13399 10.708 9.69974 9.299L12.3595 15.0065C12.6265 15.5798 13.8635 15.6737 13.8087 15.1812L13.5872 13.1885L14.5365 12.2395L14.0587 11.7618L13.4917 12.329L13.1895 9.606L14.0442 8.7515L13.5665 8.2735L13.0937 8.7465L12.8037 6.13625C13.917 4.849 14.797 3.62225 15.2835 2.6585C15.5647 2.10025 15.5725 1.531 15.305 1.09675Z" fill="#030213"/>
                      </svg>
                      <h3 className="font-['Inter:Medium',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                        Travel Request
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Submit new travel requests
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Edit or cancel existing bookings
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Check approval status
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • View travel history
                      </li>
                    </ul>
                  </div>

                  {/* Claim & Reimburse */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.33325V14.6666" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.3333 3.33325H6.33333C5.71449 3.33325 5.121 3.57908 4.68342 4.01667C4.24583 4.45425 4 5.04775 4 5.66659C4 6.28542 4.24583 6.87892 4.68342 7.3165C5.121 7.75409 5.71449 7.99992 6.33333 7.99992H9.66667C10.2855 7.99992 10.879 8.24575 11.3166 8.68334C11.7542 9.12092 12 9.71441 12 10.3333C12 10.9521 11.7542 11.5456 11.3166 11.9832C10.879 12.4208 10.2855 12.6666 9.66667 12.6666H4" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="font-['Inter:Medium',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                        Claim & Reimburse
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Submit reimbursement requests
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Upload receipts and supporting documents
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Track reimbursement status
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • View past claims
                      </li>
                    </ul>
                  </div>

                  {/* Policies & Procedures */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.00002 14.6666C3.6464 14.6666 3.30726 14.5261 3.05721 14.2761C2.80716 14.026 2.66669 13.6869 2.66669 13.3333V2.66659C2.66669 2.31297 2.80716 1.97383 3.05721 1.72378C3.30726 1.47373 3.6464 1.33325 4.00002 1.33325H9.33335C9.54439 1.33291 9.75341 1.37432 9.94837 1.4551C10.1433 1.53588 10.3204 1.65443 10.4694 1.80392L12.8614 4.19592C13.0112 4.34493 13.1301 4.52215 13.2111 4.71736C13.2922 4.91257 13.3337 5.1219 13.3334 5.33325V13.3333C13.3334 13.6869 13.1929 14.026 12.9428 14.2761C12.6928 14.5261 12.3536 14.6666 12 14.6666H4.00002Z" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.33331 1.33325V4.66659C9.33331 4.8434 9.40355 5.01297 9.52858 5.13799C9.6536 5.26301 9.82317 5.33325 9.99998 5.33325H13.3333" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.66665 6H5.33331" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6666 8.66675H5.33331" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6666 11.3333H5.33331" stroke="#030213" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="font-['Inter:Medium',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                        Policies & Procedures
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Company travel & accommodation policies
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Allowance limits and claim rules
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Refund and reschedule terms
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Compliance info
                      </li>
                    </ul>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.7333 15.9839C11.2333 15.9946 9.98889 16 8 16C6.01111 16 4.76667 15.9946 4.26667 15.9839C2.85556 15.9517 1.79167 15.8604 1.075 15.71C0.358333 15.5596 0 15.3071 0 14.9527C0 14.7378 0.111111 14.3055 0.333333 13.6556C0.555556 13.0057 0.8 12.3236 1.06667 11.6093C1.33333 10.8949 1.57778 10.0732 1.8 9.14401C2.02222 8.21484 2.13333 7.40114 2.13333 6.70292C2.13333 4.64048 4.08889 3.60926 8 3.60926C11.9111 3.60926 13.8667 4.64048 13.8667 6.70292C13.8667 7.40114 13.9778 8.21484 14.2 9.14401C14.4222 10.0732 14.6667 10.8949 14.9333 11.6093C15.2 12.3236 15.4444 13.0057 15.6667 13.6556C15.8889 14.3055 16 14.7378 16 14.9527C16 15.3071 15.6417 15.5596 14.925 15.71C14.2083 15.8604 13.1444 15.9517 11.7333 15.9839Z" fill="black"/>
                      </svg>
                      <h3 className="font-['Inter:Medium',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
                        Budget
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • View travel budget summary
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Check remaining budget
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Process refund or reimbursement
                      </li>
                      <li className="font-['Inter:Regular',sans-serif] text-[14px] text-[#717182] tracking-[-0.15px]">
                        • Track additional cost from reschedule
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'dashboard' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-600">Dashboard View</h2>
              <p className="text-gray-500 mt-2">Dashboard content coming soon...</p>
            </div>
          )}

          {activeMenu === 'settings' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-600">Settings View</h2>
              <p className="text-gray-500 mt-2">Settings content coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
