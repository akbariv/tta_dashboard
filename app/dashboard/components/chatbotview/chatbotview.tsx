"use client";
import * as React from "react";
import ChatHeader from "./chatheader";
import ChatBox from "./chatbox";
import { Props, ChatMsg, ExternalDraft } from "./types";
import {
  nowTime,
  parseExternalForm,
  qaItems,
  validateDepartureDate,
} from "./scripts";
import { getReplies, INIT_PROMPT } from "./scriptedchat";
import HelpSection from "./helpsection";

export default function ChatbotView({
  autoplay = true,
  onQuickAction,
  showHelpSection = true, // dipertahankan untuk kompatibilitas, belum dipakai di layout ini
}: Props) {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  const [awaitingExternalForm, setAwaitingExternalForm] = React.useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = React.useState(false);
  const [lastExternalDraft, setLastExternalDraft] =
    React.useState<ExternalDraft | null>(null);

  const bodyRef = React.useRef<HTMLDivElement>(null!);

  // autoscroll
  React.useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // util: push balasan bot
  const pushBotReplies = async (replies: (string | { text: string })[]) => {
    setIsTyping(true);
    for (let i = 0; i < replies.length; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 350 : 600));
      const rpl = replies[i]!;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: typeof rpl === "string" ? rpl : rpl.text,
          time: nowTime(),
        },
      ]);
    }
    setIsTyping(false);
  };

  const pushBotWithActions = async (text: string) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 350));
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "bot",
        text,
        time: nowTime(),
        actions: [
          { id: "submit", label: "Submit" },
          { id: "cancel", label: "Cancel" },
        ],
      },
    ]);
    setIsTyping(false);
  };

  const ensureInitPrompt = async () => {
    if (started || isTyping) return;
    setStarted(true);
    await pushBotReplies([INIT_PROMPT]);
  };

  // -------- actions (submit/cancel button) --------
  const handleActionClick = async (action: "submit" | "cancel") => {
    setAwaitingConfirm(false);

    if (action === "cancel") {
      setLastExternalDraft(null);
      await pushBotReplies([
        "Request cancelled. You can start again by typing “internal” or “external”.",
      ]);
      return;
    }

    await pushBotReplies([
      "Ok, your request is being validated by the system...",
    ]);

    if (!lastExternalDraft) {
      await pushBotReplies([
        "Status: Rejected | No form data found. Please start again with “external”.",
      ]);
      return;
    }

    const v = validateDepartureDate(lastExternalDraft.date, ">=today");
    if (!v.ok) {
      await pushBotReplies([`Status: Rejected | ${v.reason}`]);
      return;
    }

    await pushBotReplies([`Status: Submitted | Departure Date: ${v.iso} ✓`]);
    setLastExternalDraft(null);
  };

  // -------- kirim chat --------
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text, time: nowTime() },
    ]);
    setInput("");

    // konfirmasi via teks
    if (awaitingConfirm) {
      const t = text.toLowerCase();
      if (t === "submit" || t === "cancel") {
        await handleActionClick(t as "submit" | "cancel");
        return;
      }
    }

    // mode isi form external
    if (awaitingExternalForm) {
      const parsed = parseExternalForm(text);
      if (parsed) {
        setAwaitingExternalForm(false);
        setAwaitingConfirm(true);
        setLastExternalDraft(parsed);

        const reviewText =
          `Destination? ${parsed.destination}\n` +
          `Departure Date? ${parsed.date}\n` +
          `Transportation? ${parsed.transport}\n` +
          `Estimated Cost? ${parsed.cost}`;

        await pushBotWithActions(reviewText);
        return;
      }
      await pushBotReplies([
        "Please provide details like:\nDestination: <city>\nDeparture Date: <date>\nTransportation: <type>\nEstimated Cost: <amount>",
      ]);
      return;
    }

    // balasan scripted
    const replies = getReplies(text);
    setIsTyping(true);
    for (let i = 0; i < replies.length; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 350 : 600));
      const rpl = replies[i]!;
      setMessages((prev) => [
        ...prev,
        typeof rpl === "string"
          ? { id: crypto.randomUUID(), role: "bot", text: rpl, time: nowTime() }
          : {
              id: crypto.randomUUID(),
              role: "bot",
              text: rpl.text,
              time: nowTime(),
              actions: rpl.actions,
            },
      ]);
    }
    setIsTyping(false);

    if (/\b(external|eksternal)\b/i.test(text) && !awaitingExternalForm) {
      setAwaitingExternalForm(true);
    }
  };

  // -------- quick actions --------
  const handleQuickAction = async (title: string) => {
    onQuickAction?.(title);
    if (title === "Submit Travel Request") await ensureInitPrompt();
  };

  return (
    <>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[32px] text-[#202224] tracking-[-0.114px] mb-2 font-semibold">
          AI Assistant
        </h1>

        {/* subtitle + badge di satu baris */}
        <div className="flex items-center gap-3 w-full flex-wrap">
          <p className="text-[16px] text-black tracking-[-0.114px]">
            Get instant help with TTA questions and tasks
          </p>

          {/* badge dorong ke kanan */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dcfce7] rounded-lg ml-auto">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M2 7c-.094.0003-.187-.0262-.267-.0765-.08-.0503-.144-.1223-.185-.2076-.041-.0854-.057-.1806-.046-.2746.011-.094.049-.1829.108-.2563L6.56 1.085c.037-.043.087-.072.143-.082.056-.01.114 0 .164.027.05.027.09.07.112.122.022.052.026.11.011.165L6.03 4.325c-.028.076-.038.157-.028.237.01.08.039.156.085.223.046.067.108.121.18.158.072.037.152.056.233.056H10c.095-.0003.188.0262.268.0765.08.0502.144.1222.185.2076.041.0853.057.1806.046.2746-.011.094-.049.1829-.108.2563L5.44 10.915c-.037.043-.087.072-.143.082-.056.01-.114 0-.164-.027-.05-.027-.09-.07-.112-.122-.022-.052-.026-.11-.011-.165l.96-3.01c.028-.076.038-.157.028-.237-.01-.08-.039-.156-.085-.223-.046-.067-.108-.121-.18-.158C5.12 7.01 5.04 6.99 4.96 6.99H2Z"
                stroke="#016630"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[12px] text-[#016630]">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Grid: kiri Quick Actions, kanan Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 mb-8">
        {/* Quick Actions */}
        <div className="w-full lg:w-[331px] bg-gradient-to-br from-white to-white/50 rounded-[14px] shadow-lg p-6">
          <div className="flex items-center gap-2 mb-8">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M12.5 11.6667C12.6667 10.8334 13.0833 10.2501 13.75 9.58341C14.5833 8.83341 15 7.75008 15 6.66675C15 5.34067 14.4732 4.0689 13.5355 3.13121C12.5979 2.19353 11.3261 1.66675 10 1.66675C8.67392 1.66675 7.40215 2.19353 6.46447 3.13121C5.52678 4.0689 5 5.34067 5 6.66675C5 7.50008 5.16667 8.50008 6.25 9.58341C6.83333 10.1667 7.33333 10.8334 7.5 11.6667"
                stroke="#0A0A0A"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 15H12.5"
                stroke="#0A0A0A"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.33334 18.3333H11.6667"
                stroke="#0A0A0A"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[16px] text-[#0a0a0a] tracking-[-0.312px]">
              Quick Actions
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {qaItems.map((it) => (
              <button
                key={it.title}
                onClick={() => handleQuickAction(it.title)}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className={`w-8 h-8 rounded-[10px] ${it.bg} flex items-center justify-center shrink-0`}
                >
                  {it.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] text-[#0a0a0a] tracking-[-0.15px]">
                    {it.title}
                  </div>
                  <div className="text-[12px] text-[#717182]">{it.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col bg-white rounded-[14px] shadow-lg h-[640px] lg:h-[680px]">
          <ChatHeader />
          <ChatBox
            messages={messages}
            isTyping={isTyping}
            onActionClick={handleActionClick}
            inputValue={input}
            onChangeInput={setInput}
            onSend={handleSend}
            scrollRef={bodyRef}
          />
        </div>
      </div>
      {showHelpSection && (
        <div className="mt-10 lg:mt-12">
          <HelpSection />
        </div>
      )}
    </>
  );
}
