"use client";

import React from "react";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function NotifyConfirmation({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[340px]">
        <h2 className="text-center font-semibold text-[16px]">
          Notify Employee About <br /> Accommodation Options?
        </h2>

        <p className="text-center text-sm mt-2 text-gray-600">
          A notification will be sent to the employee to review and confirm their travel options.
        </p>

        <div className="flex justify-between mt-5 gap-3">
          <button
            onClick={onClose}
            className="w-full py-2 border rounded-md text-gray-600"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-md bg-blue-500 text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
