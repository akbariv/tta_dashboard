import { ChatAction, ChatMsg } from "./types";

type Props = {
  msg: ChatMsg;
  onActionClick: (id: ChatAction["id"]) => void;
};

export default function MessageBubble({ msg, onActionClick }: Props) {
  if (msg.role === "bot") {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#031220] to-[#0072ff] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.99998 5.33341V2.66675H5.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5.33325H4.00002C3.26364 5.33325 2.66669 5.93021 2.66669 6.66659V11.9999C2.66669 12.7363 3.26364 13.3333 4.00002 13.3333H12C12.7364 13.3333 13.3334 12.7363 13.3334 11.9999V6.66659C13.3334 5.93021 12.7364 5.33325 12 5.33325Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="inline-block bg-[#e9ebef] rounded-[10px] px-4 py-3">
            <p className="text-[16px] text-[#030213] tracking-[-0.312px] leading-6 whitespace-pre-line">
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
    );
  }

  // user bubble
  return (
    <div className="flex gap-3 justify-end">
      <div className="flex-1 flex justify-end">
        <div className="inline-block bg-[#030213] text-white rounded-[10px] px-4 py-3 max-w-[75%]">
          <p className="text-[16px] tracking-[-0.312px] leading-6 whitespace-pre-line">
            {msg.text}
          </p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shrink-0" />
    </div>
  );
}
