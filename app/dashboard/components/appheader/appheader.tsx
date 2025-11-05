"use client";
import * as React from "react";

type Props = {
  userName: string;
  userTitle?: string;                
  search?: string;                 
  onSearchChange?: (v: string) => void;
  onToggleSidebar?: () => void;
  onLogout?: () => void;             
};

export default function AppHeader({
  userName,
  userTitle = "IT Governance",
  search,
  onSearchChange,
  onToggleSidebar,
  onLogout,
}: Props) {
  const inputProps = onSearchChange
    ? { value: search ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value) }
    : { defaultValue: search ?? "" };

  return (
    <header className="bg-white h-[73px] border-b border-[#E0E0E0] flex items-center px-8 justify-between">
      {/* Left: Toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-6 h-6 flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
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
              {...inputProps}
            />
          </div>
        </div>
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-4">
        <button className="relative w-[35px] h-[35px] flex items-center justify-center" aria-label="Notifications">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15.0001 28.5667C15.525 28.5547 16.0288 28.3573 16.4222 28.0096C16.8157 27.6619 17.0735 27.1862 17.1501 26.6667H12.7667C12.8455 27.2003 13.1153 27.6872 13.5261 28.0367C13.937 28.3862 14.4607 28.5745 15.0001 28.5667Z" fill="#0072FF"/>
            <path d="M27.375 23.4417L27.0916 23.1917C26.2878 22.4756 25.5843 21.6543 25 20.7501C24.3618 19.5022 23.9793 18.1394 23.875 16.7417V12.6251C23.8716 12.125 23.827 11.6261 23.7416 11.1334C22.3301 10.8433 21.0621 10.0743 20.1525 8.95657C19.2428 7.83887 18.7474 6.44116 18.75 5.00008V4.47508C17.8799 4.04691 16.9451 3.76534 15.9833 3.64175V2.59175C15.9833 2.29669 15.8661 2.01373 15.6574 1.80509C15.4488 1.59646 15.1658 1.47925 14.8708 1.47925C14.5757 1.47925 14.2928 1.59646 14.0841 1.80509C13.8755 2.01373 13.7583 2.29669 13.7583 2.59175V3.68341C11.6047 3.98721 9.63377 5.05987 8.20931 6.70336C6.78485 8.34685 6.00307 10.4502 6.00829 12.6251V16.7417C5.90392 18.1394 5.52144 19.5022 4.88329 20.7501C4.30903 21.652 3.61679 22.4732 2.82496 23.1917L2.54163 23.4417V25.7917H27.375V23.4417Z" fill="#0072FF"/>
            <path d="M25 9.16658C27.3012 9.16658 29.1667 7.30111 29.1667 4.99992C29.1667 2.69873 27.3012 0.833252 25 0.833252C22.6989 0.833252 20.8334 2.69873 20.8334 4.99992C20.8334 7.30111 22.6989 9.16658 25 9.16658Z" fill="#FF4646"/>
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-gray-300 to-gray-400 overflow-hidden">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSI+CiAgPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNEOEQ4RDgiLz4KPC9zdmc+')] bg-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] text-[#404040]">{userName}</span>
            <span className="text-[12px] text-[#565656]">{userTitle}</span>
          </div>
          <button
            type="button"
            className="w-[30px] h-[30px] rounded-full border border-[#5c5c5c] flex items-center justify-center"
            aria-label="Profile menu"
            onClick={onLogout /* bisa ganti ke open menu nanti */}
            title={onLogout ? "Logout" : "Profile menu"}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M4 4.9692L1.227 1.7347C1.023 1.496 0.691 1.496 0.487 1.7347C0.282 1.9733 0.282 2.3602 0.487 2.5989L3.63 6.2656C3.834 6.5042 4.166 6.5042 4.37 6.2656L7.513 2.5989C7.718 2.3602 7.718 1.9733 7.513 1.7347C7.309 1.496 6.977 1.496 6.772 1.7347L4 4.9692Z" fill="#565656"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
