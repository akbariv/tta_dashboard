// chatbox.tsx
"use client";
import * as React from "react";
import { ChatAction, ChatMsg, ChatAttachment } from "./types";
import cleaBubble from "./messagebubble";
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

  pendingAttachments: ChatAttachment[];
  onPickFiles: (files: FileList | null) => void;
  onRemoveAttachment: (id: string) => void;
};

export default function ChatBox({
  messages,
  isTyping,
  onActionClick,
  inputValue,
  onChangeInput,
  onSend,
  scrollRef,

  pendingAttachments,
  onPickFiles,
  onRemoveAttachment,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full min-w-0">
      {/* Panel pesan (satu-satunya area yang scroll) */}
      <div
        ref={scrollRef as React.Ref<HTMLDivElement>}
        className="flex-1 p-6 space-y-4 overflow-y-auto overscroll-contain overflow-x-hidden w-full min-w-0 break-words"
      >
        {messages.map((m) => (
          <div key={m.id} className="min-w-0">
            <MessageBubble msg={m} onActionClick={onActionClick} />
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] shrink-0" />
            <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
              <span className="inline-block animate-pulse">Typing…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input + attachments */}
      <div className="border-t border-black/10 p-4 w-full min-w-0">
        {pendingAttachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 min-w-0">
            {pendingAttachments.map((att) => (
              <div key={att.id} className="relative">
                <img
                  src={att.url}
                  alt={att.name}
                  className="h-16 w-16 object-cover rounded-lg border max-w-full"
                />
                <button
                  onClick={() => onRemoveAttachment(att.id)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/80 text-white text-xs"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-1 flex items-center gap-2 bg-[#f3f3f5] rounded-lg px-3 py-2 min-w-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onChangeInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me about travel requests, budgets, or reimbursements…"
              className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-[#030213] placeholder:text-[#717182] tracking-[-0.15px]"
            />
          </div>

          {/* Attach */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-9 rounded-lg flex items-center justify-center border border-black/10 hover:bg-gray-50 shrink-0"
            title="Attach image"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5.333 8.667l4-4a2.333 2.333 0 1 1 3.3 3.3l-5.2 5.2a3.333 3.333 0 1 1-4.714-4.714l5.2-5.2"
                stroke="#0A0A0A"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={(e) => onPickFiles(e.target.files)}
          />

          {/* Send */}
          <button
            onClick={onSend}
            disabled={
              (inputValue.trim() === "" && pendingAttachments.length === 0) ||
              isTyping
            }
            className="w-10 h-9 bg-[#030213] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40 shrink-0"
            title="Send"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M9.69 14.457c.025.063.07.117.126.154.057.037.124.056.192.055.067-.002.133-.025.188-.065.055-.041.096-.097.118-.161L14.649 1.775a.333.333 0 0 0-.24-.436L1.559 5.685a.333.333 0 0 0-.171.497.333.333 0 0 0 .155.123l5.287 2.12c.167.067.32.167.447.294.127.127.228.28.295.447l2.118 5.291Z"
                stroke="white"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.569 1.431 7.276 8.724"
                stroke="white"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p className="text-[12px] text-[#717182] mt-2 px-1">
          Ask about leave balances, policies, employee directory, payroll, and
          more
        </p>
      </div>
    </div>
  );
}
