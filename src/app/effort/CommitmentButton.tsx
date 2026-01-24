"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CommitmentType, recordCommitment } from "./actions";
import { useCommitmentContext } from "./CommitmentContext";

type Application = {
  id: string;
  itemName: string;
  commitmentType: CommitmentType | null;
};

type CommitmentButtonProps = {
  application: Application;
  autoExecuteAction?: CommitmentType | null;
  onAutoExecuteComplete?: () => void;
  index?: number;
}


export const CommitmentButton = ({
  application,
  autoExecuteAction = null,
  onAutoExecuteComplete,
  index = 0,
}: CommitmentButtonProps) => {
  const { bufferedAction, setBufferedAction } = useCommitmentContext();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoExecuting, setIsAutoExecuting] = useState(false);

  const actionToExecute = autoExecuteAction || (index === 0 && bufferedAction ? bufferedAction : null);


  const currentType = application.commitmentType;
  const isPotentialMiss = currentType === "potential_miss";
  const isCompleted = currentType === "completed";
  const isDisabled = isPending || isSubmitting || isAutoExecuting || isCompleted;

  const handleCommitment = async (type: CommitmentType) => {
    if (isCompleted || (currentType === "potential_miss" && type !== "touched")) {
      return;
    }

    if (!isAutoExecuting) {
      setIsSubmitting(true);
    }
    setStatusMessage(null);

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await recordCommitment(application.id, type);

        setIsSubmitting(false);
        resolve();

        if (result.error) {
          console.error("Error recording commitment:", result.error);
          setStatusMessage("コミットメントの記録に失敗しました。もう一度お試しください。");
        } else if (result.success) {
          setStatusMessage(`コミットメントを記録しました！`);
          setTimeout(() => setStatusMessage(null), 4000);
        }
      });
    });
  };

  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (actionToExecute) {
      if (hasExecutedRef.current) {
        return;
      }

      hasExecutedRef.current = true;
      setIsAutoExecuting(true);

      setTimeout(() => {
        handleCommitment(actionToExecute).then(() => {
          setIsAutoExecuting(false);
          if (bufferedAction && index === 0) {
            setBufferedAction(null);
          }
          if (onAutoExecuteComplete) {
            onAutoExecuteComplete();
          }
        });
      }, 50);
    }
  }, [actionToExecute]);

  const getButtonText = (type: CommitmentType) => {
    if (isSubmitting || isAutoExecuting) {
      return "記録中・・・";
    }
    switch (type) {
      case "touched": return "今日触れた 👍";
      case "potential_miss": return "今日は触れないかも 🤔";
      case "completed": return "完了！✅";
      default: return "記録";
    }
  };

  if (isCompleted) {
    return null;
  }


  return (
    <div key={application.id} className="mt-5">
      <h3 className="font-semibold text-gray-800 text-base">{application.itemName}</h3>

      {/* ⚠️ Temporary report state display */}
      {isPotentialMiss && (
        <p className="text-xs font-medium text-gray-500">
          「触れた」に更新することもできます。
        </p>
      )}
      {statusMessage && (
        <p className="text-xs text-green-600 font-medium">
          {statusMessage}
        </p>
      )}

      <div className="mt-1 flex gap-2 md:gap-4 lg:gap-6">
        {/* Touched today (always available) */}
        <button
          onClick={() => handleCommitment("touched")}
          className={`flex-1 py-3 text-white rounded-lg hover:bg-indigo-600 text-sm md:text-base font-medium transition shadow-md bg-indigo-500 cursor-pointer
              ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isDisabled}
        >
          {getButtonText("touched")}
        </button>

        {/* Potential miss button (changes color and disables after one press) */}
        <button
          onClick={() => handleCommitment("potential_miss")}
          className={`flex-1 py-3 rounded-lg text-xs md:text-base font-medium transition shadow-md cursor-pointer
              ${isPotentialMiss ? "bg-yellow-200 text-gray-400 cursor-not-allowed" : "bg-yellow-600 text-white hover:bg-yellow-700"}
              ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isDisabled || isPotentialMiss}
        >
          {getButtonText("potential_miss")}
        </button>
          
        {/* Completed button (disabled during potential miss or after completion) */}
        <button
          onClick={() => handleCommitment("completed")}
          className={`py-3 px-3 text-white rounded-lg text-xs md:text-base font-medium transition shadow-md cursor-pointer
                          ${isPotentialMiss || isCompleted ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}
                          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isDisabled || isPotentialMiss}
        >
          {getButtonText("completed")}
        </button>
      </div>
    </div>
  );
};
