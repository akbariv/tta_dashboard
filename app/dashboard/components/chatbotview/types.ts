import * as React from "react";

export type Props = {
  autoplay?: boolean;
  onQuickAction?: (id: string) => void;
  showHelpSection?: boolean;
};

export type ChatAction = { id: "submit" | "cancel"; label: string };

export type ChatMsg = {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  actions?: ChatAction[];
};

export type BotReply = string | { text: string; actions?: ChatAction[] };

export type QAItem = {
  title: string;
  desc: string;
  bg: string;
  icon: React.ReactNode;
};

export type ExternalDraft = {
  destination: string;
  date: string;
  transport: string;
  cost: string;
};
