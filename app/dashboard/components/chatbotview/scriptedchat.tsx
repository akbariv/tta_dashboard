import { BotReply } from "./types";

export const INIT_PROMPT =
  "Please answer the question in below about travel request.\n\nModa Internal/External?";

export const getReplies = (text: string): BotReply[] => {
  const t = text.trim().toLowerCase();

if (/\b(claim|claims|reimburse|reimbursement)\b/i.test(t)) {
  return [{
    text:
      "Please select the type of claim/reimbursement you wish to submit:\n" +
      "\u25A1  Hotel\n" +
      "\u25A1  Transportation\n" +
      "\u25A1  Others",
  }];
}


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
    return ["Please answer the question in below about travel request.\n\nModa Internal/External?"];
  }

  if (t.includes("budget")) {
    return ["Here’s your budget summary (prototype view)."];
  }
  if(t.includes("hotel")||t.includes("transportation")||t.includes("others")){
     return [{
    text:
      "Please answer the question and upload supporting documents such as receipts, invoices, or purchase notes.\n" +
      "\u25A1  Nominal\n" +
      "\u25A1  Date\n" +
      "\u25A1  Purpose of reimbursement\n",
  }];
  }

  return ["Got it. (Prototype) I’ll respond with scripted info based on your keywords."];
};
