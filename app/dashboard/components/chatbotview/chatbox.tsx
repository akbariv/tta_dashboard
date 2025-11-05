import * as React from "react";
import { ChatAction, ChatMsg } from "./types";
import MessageBubble from "./messagebubble";

type DivRef =
  | React.MutableRefObject<HTMLDivElement | null>
  | React.RefObject<HTMLDivElement>;

type Props = {
  messages: ChatMsg[];
  isTyping: boolean;
  onActionClick: (id: ChatAction["id"]) => void;
  inputValue: string;
  onChangeInput: (v: string) => void;
  onSend: () => void;
  scrollRef: DivRef;
};

export default function ChatBox({
  messages,
  isTyping,
  onActionClick,
  inputValue,
  onChangeInput,
  onSend,
  scrollRef,
}: Props) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      {/* Messages */}
      <div
        ref={scrollRef as React.Ref<HTMLDivElement>}
        className="flex-1 min-h-0 p-6 space-y-4 overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} onActionClick={onActionClick} />
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] shrink-0" />
            <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3 max-w-[75%] break-words whitespace-pre-wrap">
              <span className="inline-block animate-pulse">Typing…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-black/10 p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#f3f3f5] rounded-lg px-3 py-2 min-w-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onChangeInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me about travel requests, budgets, or reimbursements…"
              className="flex-1 bg-transparent outline-none text-[14px] text-[#030213] placeholder:text-[#717182] tracking-[-0.15px]"
            />
          </div>
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-9 bg-[#030213] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9.6907 14.4572c.0253.0631.0693.117.1262.1544.0568.0373.1237.0564.1917.0547.068-.0017.1338-.0242.1887-.0644.0548-.0402.096-.0963.1181-.1606L14.6487 1.77454c.0213-.05907.0254-.123.0117-.1843-.0136-.0613-.0445-.11747-.0889-.16188-.0444-.04441-.1005-.07525-.1618-.08892-.0613-.01367-.1253-.0096-.1843.01121L1.5587 5.68454c-.06434.02206-.12038.06328-.16062.11812-.04023.05483-.06273.12066-.06447.18865-.00175.06799.01735.13488.05473.19226.03737.05738.09124.10141.15436.12674l5.28667 2.12c.16712.06691.31896.16697.44637.29415.12741.12718.22775.27884.29496.44585L9.6907 14.4572Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.5693 1.4314L7.276 8.72406" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-[12px] text-[#717182] mt-2 px-1">
          Ask about leave balances, policies, employee directory, payroll, and more
        </p>
      </div>
    </div>
  );
}
