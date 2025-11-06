// messagebubble.tsx
"use client";
import * as React from "react";
import { ChatAction, ChatMsg } from "./types";

export default function MessageBubble({
  msg,
  onActionClick,
}: {
  msg: ChatMsg;
  onActionClick: (id: ChatAction["id"]) => void;
}) {
  const isBot = msg.role === "bot";

  return isBot ? (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 5.333V2.667H5.333"
            stroke="white"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 5.333H4A1.333 1.333 0 0 0 2.667 6.667V12A1.333 1.333 0 0 0 4 13.333h8A1.333 1.333 0 0 0 13.333 12V6.667A1.333 1.333 0 0 0 12 5.333Z"
            stroke="white"
            strokeWidth="1.333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex-1">
        <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3 max-w-[75%] break-words">
          <p className="text-[16px] text-[#030213] tracking-[-0.312px] leading-6 whitespace-pre-line break-words">
            {msg.text}
          </p>

          {msg.actions && (
            <div className="flex gap-2 mt-2">
              {msg.actions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onActionClick(a.id)}
                  className={
                    a.id === "submit"
                      ? "px-3 h-8 rounded-md bg-[#0a0a0a] text-white text-[12px]"
                      : "px-3 h-8 rounded-md border border-black/10 text-[12px]"
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-[12px] text-[#717182] mt-1">{msg.time}</p>
      </div>
    </div>
  ) : (
    <div className="flex gap-3 justify-end">
      <div className="flex-1 flex justify-end">
        <div className="inline-block bg-[#030213] text-white rounded-[10px] px-4 py-3 max-w-[75%]">
          <p className="text-[16px] tracking-[-0.312px] leading-6 whitespace-pre-line">
            {msg.text}
          </p>

          {/* ⬇️ preview lampiran gambar untuk pesan user */}
          {msg.attachments?.length ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {msg.attachments.map((att) => (
                <img
                  key={att.id}
                  src={att.url}
                  alt={att.name}
                  className="rounded-lg max-h-40 object-cover border border-white/20"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shrink-0" />
    </div>
  );
}
