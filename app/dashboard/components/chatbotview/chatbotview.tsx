// chatbotview.tsx
"use client";
import * as React from "react";
import ChatHeader from "./chatheader";
import ChatBox from "./chatbox";
import HelpSection from "./helpsection";
import { Props, ChatMsg, ExternalDraft, ChatAttachment } from "./types";
import {
  nowTime,
  parseExternalForm,
  qaItems,
  validateDepartureDate,
} from "./scripts";
import { getReplies, INIT_PROMPT } from "./scriptedchat";

const MAX_FILES = 3;
const MAX_SIZE_MB = 5;
const MAIN_MENU_GREETING =
  "Hello, I am TTA assistant ready to help you with travel request, booking changes, reimbursements, and budget updates. What would you like to do today?";

const INITIAL_BUDGET = 10_000_000;

const formatRupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const parseMoney = (s?: string) => {
  if (!s) return 0;
  const m =
    s.match(
      /(?:nominal|amount|cost|biaya|estimated\s*cost)?[^0-9]*(\d[\d.,]*)/i
    ) || s.match(/(\d[\d.,]+)/);
  if (!m) return 0;
  const cleaned = m[1].replace(/[^\d]/g, "");
  return parseInt(cleaned || "0", 10) || 0;
};

export default function ChatbotView({
  onQuickAction,
  showHelpSection = true,
}: Props) {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  // ===== Claim / Reimburse flow =====
  type ClaimStage = "idle" | "choose" | "details";
  const [claimStage, setClaimStage] = React.useState<ClaimStage>("idle");
  const [claimType, setClaimType] = React.useState<
    "hotel" | "transportation" | "others" | null
  >(null);

  // ===== Reschedule / Cancel flow =====
  type RescheduleStage = "idle" | "yesNo" | "askId" | "reviseDetails";
  const [rescheduleStage, setRescheduleStage] =
    React.useState<RescheduleStage>("idle");
  const [rescheduleId, setRescheduleId] = React.useState<string | null>(null);
  const [rescheduleMode, setRescheduleMode] = React.useState<
    "reschedule" | "cancel" | null
  >(null);

  // ===== Travel request (external) form flow =====
  const [awaitingExternalForm, setAwaitingExternalForm] = React.useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = React.useState(false);
  const [lastExternalDraft, setLastExternalDraft] =
    React.useState<ExternalDraft | null>(null);

  const bodyRef = React.useRef<HTMLDivElement>(null!);

  const [pendingAttachments, setPendingAttachments] = React.useState<
    ChatAttachment[]
  >([]);
  const [budgetUsed, setBudgetUsed] = React.useState(0);

  const askMainMenu = async (delayMs = 0) => {
    if (delayMs > 0) await delay(delayMs);
    await pushBotReplies([MAIN_MENU_GREETING]);

    // reset state
    setClaimStage("idle");
    setClaimType(null);

    setRescheduleStage("idle");
    setRescheduleId(null);
    setRescheduleMode(null);

    setAwaitingExternalForm(false);
    setAwaitingConfirm(false);
    setLastExternalDraft(null);
    setStarted(false);
  };

  React.useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, pendingAttachments.length]);

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

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;

    const existing = pendingAttachments.length;
    const slice = Array.from(files).slice(0, Math.max(0, MAX_FILES - existing));

    const next: ChatAttachment[] = [];
    for (const f of slice) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) continue;
      next.push({
        id: crypto.randomUUID(),
        kind: "image",
        name: f.name,
        url: URL.createObjectURL(f),
        file: f,
      });
    }
    if (next.length) setPendingAttachments((prev) => [...prev, ...next]);
  };

  const showBudgetSummary = async () => {
    const remaining = Math.max(0, INITIAL_BUDGET - budgetUsed);
    await pushBotReplies([
      `Based on your current travel budget:\n` +
        `• Initial Budget: ${formatRupiah(INITIAL_BUDGET)}\n` +
        `• Used Budget: ${formatRupiah(budgetUsed)}\n` +
        `• Remaining Budget: ${formatRupiah(remaining)}`,
    ]);
  };

  const onRemoveAttachment = (id: string) => {
    setPendingAttachments((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const showClaimTypePrompt = async () => {
    await pushBotReplies([
      "Please select the type of claim/reimbursement you wish to submit:\n▪︎ Hotel\n▪︎ Transportation\n▪︎ Others",
    ]);
  };

  const showClaimDetailsPrompt = async () => {
    await pushBotReplies([
      "Please answer the question and upload supporting documents such as receipts, invoices, or purchase notes.\nNominal:\nDate:\nPurpose of Reimbursement:",
    ]);
  };

  const startRescheduleFlow = async () => {
    setRescheduleStage("yesNo");
    setRescheduleId(null);
    setRescheduleMode(null);
    await pushBotReplies([
      "Please answer the question in below about reschedule/cancel trip.\nDo you want to reschedule/cancel? (Yes/No)",
    ]);
  };

  const askRescheduleId = async () => {
    setRescheduleStage("askId");
    await pushBotReplies([
      'State the ID number you want to reschedule/cancel "ID - Reschedule/Cancel":\nExample: AAA555S - Reschedule',
    ]);
  };

  const handleActionClick = async (action: "submit" | "cancel") => {
    setAwaitingConfirm(false);
    if (action === "cancel") {
      setLastExternalDraft(null);
      await pushBotReplies([
        "Request cancelled. You can start again by typing “internal” or “external”.",
      ]);
      await askMainMenu(3000);
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
    const addCost = parseMoney(lastExternalDraft?.cost);
    if (addCost > 0)
      setBudgetUsed((u) => Math.min(INITIAL_BUDGET, u + addCost));

    setLastExternalDraft(null);
    await askMainMenu(3000);
  };

  // ===== Send chat =====
  const handleSend = async () => {
    const text = input.trim();
    if (!text && pendingAttachments.length === 0) return;
    if (isTyping) return;

    const attSnapshot = pendingAttachments.slice();
    const t = text.toLowerCase();

    // 1) SELALU push bubble user lebih dulu
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: text || "",
        time: nowTime(),
        attachments: attSnapshot,
      },
    ]);
    setInput("");
    setPendingAttachments([]);

    // 2) Intent global
    if (/\b(menu|restart|start over|help)\b/.test(t)) {
      await askMainMenu(0);
      return;
    }

    // 3) Reschedule / Cancel Trip flow
    //    Step 1: answer Yes/No
    if (rescheduleStage === "yesNo") {
      if (/\b(yes|ya|y)\b/.test(t)) {
        await askRescheduleId();
      } else if (/\b(no|tidak|ga|gak|nggak|n)\b/.test(t)) {
        await pushBotReplies([
          "Okay, your current booking will remain unchanged.",
        ]);
        setRescheduleStage("idle");
        setRescheduleId(null);
        setRescheduleMode(null);
        await askMainMenu(3000);
      } else {
        await pushBotReplies([
          "Please answer with “Yes” if you want to reschedule/cancel, or “No” to keep your current booking.",
        ]);
      }
      return;
    }

    //    Step 2: ask for ID + action
    if (rescheduleStage === "askId") {
      const idMatch = text.match(/[A-Za-z0-9]{4,}/);
      const id = idMatch?.[0] ?? null;

      if (!id) {
        await pushBotReplies([
          "Please type the booking ID you want to change, e.g. AAA555S - Reschedule",
        ]);
        return;
      }

      const mode: "reschedule" | "cancel" =
        /\bcancel|batal\b/i.test(text) ? "cancel" : "reschedule";

      setRescheduleId(id);
      setRescheduleMode(mode);
      setRescheduleStage("reviseDetails");

      await pushBotReplies([
        `ID received: ${id} (${
          mode === "cancel" ? "Cancel Trip" : "Reschedule Trip"
        }).`,
        "Please revise the request in one message:\nDestination?\nDeparture Date?\nTransportation?\nEstimated Cost?",
      ]);
      return;
    }

    //    Step 3: user provides revised details
    if (rescheduleStage === "reviseDetails") {
      const parsed = parseExternalForm(text);
      if (!parsed) {
        await pushBotReplies([
          "Please include the updated details in this format:\nDestination: <city>\nDeparture Date: <date>\nTransportation: <type>\nEstimated Cost: <amount>",
        ]);
        return;
      }

      const additional = parseMoney(parsed.cost);
      if (additional > 0) {
        setBudgetUsed((u) => Math.min(INITIAL_BUDGET, u + additional));
      }

      const modeLabel =
        rescheduleMode === "cancel" ? "cancellation" : "reschedule";

      await pushBotReplies([
        "Check the available budget limit ...",
        `The ${modeLabel} request for ID ${
          rescheduleId ?? "-"
        } has been sent to your superior.`,
      ]);

      setRescheduleStage("idle");
      setRescheduleId(null);
      setRescheduleMode(null);

      await askMainMenu(3000);
      return;
    }

    //    Entry point: user ketik niat booking change
    if (
      rescheduleStage === "idle" &&
      /\b(booking change|booking changes|ubah booking|reschedule|cancel trip|cancel booking)\b/.test(
        t
      )
    ) {
      await startRescheduleFlow();
      return;
    }

    // 4) Flow Claim/Reimburse (intent awal)
    if (
      /\b(reimburse|reimbursement|claim|klaim)\b/.test(t) &&
      claimStage === "idle"
    ) {
      setClaimStage("choose");
      setClaimType(null);
      await showClaimTypePrompt();
      return;
    }

    // 5) Flow Travel Request (intent awal)
    if (
      /\b(travel request|submit travel|pengajuan perjalanan|perjalanan dinas)\b/.test(
        t
      )
    ) {
      await ensureInitPrompt();
      return;
    }

    // 6) CLAIM: tahap pilih tipe
    if (claimStage === "choose") {
      const picked = /hotel/.test(t)
        ? "hotel"
        : /transport/.test(t)
        ? "transportation"
        : /other|others/.test(t)
        ? "others"
        : null;

      if (picked) {
        setClaimType(picked as any);
        setClaimStage("details");
        await showClaimDetailsPrompt();
      } else {
        await showClaimTypePrompt();
      }
      return;
    }

    // 7) CLAIM: tahap isi detail + validasi lampiran
    if (claimStage === "details") {
      if (attSnapshot.length === 0) {
        await pushBotReplies([
          "Please upload document according to your reimbursement purpose such as receipt, bills, etc.",
        ]);
        return;
      }
      const addNominal = parseMoney(text);
      if (addNominal > 0)
        setBudgetUsed((u) => Math.min(INITIAL_BUDGET, u + addNominal));

      await pushBotReplies([
        "Your submission has been sent ✅\nCurrent status: Awaiting approval from the Head of Department.\n\nYou will receive a notification once this claim has been approved or rejected.",
      ]);
      setClaimStage("idle");
      setClaimType(null);
      await askMainMenu(3000);
      return;
    }

    // 8) External form confirm
    if (awaitingConfirm) {
      if (t === "submit" || t === "cancel") {
        await handleActionClick(t as "submit" | "cancel");
        return;
      }
    }

    // 9) External form parsing
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

    // 10) Scripted reply default
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

    if (/\b(budget|view budget|budget summary|summary)\b/.test(t)) {
      await showBudgetSummary();
      return;
    }
  };

  const handleQuickAction = async (title: string) => {
    onQuickAction?.(title);
    if (title === "Submit Travel Request") await ensureInitPrompt();
    if (title === "Claim & Reimburse") {
      setClaimStage("choose");
      setClaimType(null);
      await showClaimTypePrompt();
    }
    if (title === "Reschedule / Cancel Trip") {
      await startRescheduleFlow();
      return;
    }
    if (title === "View Budget Summary") {
      await showBudgetSummary();
      return;
    }
  };

  return (
    <>
      {/* Header + “AI Powered” dibiarkan seperti sebelumnya */}
      <div className="mb-8 flex flex-col items-start">
        <h1 className="text-[32px] text-[#202224] tracking-[-0.114px] mb-2 font-semibold">
          AI Assistant
        </h1>
        <div className="flex items-center justify-between w-full max-w-[980px]">
          <p className="text-[16px] text-black tracking-[-0.114px]">
            Get instant help with TTA questions and tasks
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dcfce7] rounded-lg">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M2 7c-.094.0003-.187-.0262-.267-.0765-.08-.0503-.144-.1223-.185-.2076-.041-.0854-.057-.1806-.046-.2746.011-.094.049-.1829.108-.2563L6.56 1.085..."
                stroke="#016630"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[12px] text-[#016630]">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[331px_minmax(0,1fr)] gap-6 mb-8">
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
                d="M12.5 11.6667..."
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
        <div className="flex flex-col bg-white rounded-[14px] shadow-lg h-[680px] min-w-0 overflow-hidden">
          <ChatHeader />
          <ChatBox
            messages={messages}
            isTyping={isTyping}
            onActionClick={handleActionClick}
            inputValue={input}
            onChangeInput={setInput}
            onSend={handleSend}
            scrollRef={bodyRef}
            pendingAttachments={pendingAttachments}
            onPickFiles={onPickFiles}
            onRemoveAttachment={onRemoveAttachment}
          />
        </div>
      </div>
      <div className="mt-6" />
      {showHelpSection && <HelpSection />}
    </>
  );
}
