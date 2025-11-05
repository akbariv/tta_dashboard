import { BotReply } from "./types";

export const INIT_PROMPT =
  "Please answer the question in below about travel request.\n\nModa Internal/External?";

export const getReplies = (text: string): BotReply[] => {
  const t = text.trim().toLowerCase();

  if (/\b(external|eksternal)\b/.test(t)) {
    return [
      "Ok, please fill the form in below first.\nDestination?\nDeparture Date?\nTransportation?\nEstimated Cost?",
    ];
  }

  if (t.includes("internal")) {
    return [
      "Checking transportation availability ...",
      "Your will using the transportation in this week or want to custom date?\nThis availability in this week:\nSunday - Thursday\nSedan: 07.00 - 21.30 WIB",
    ];
  }

  if (t.includes("travel request") || t.includes("submit travel")) {
    return ["Please fill in form submit travel request."];
  }

  if (t.includes("budget")) {
    return ["Here’s your budget summary (prototype view)."];
  }

  return ["Got it. (Prototype) I’ll respond with scripted info based on your keywords."];
};
