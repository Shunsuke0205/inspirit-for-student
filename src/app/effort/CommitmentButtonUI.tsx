
export type ButtonVariant = "touched" | "potential_miss" | "completed";

type CommitmentButtonUIProps = {
  variant: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
};

const VARIANT_LABELS: Record<ButtonVariant, string> = {
  touched: "今日触れた 👍",
  potential_miss: "今日は触れないかも 🤔",
  completed: "完了！✅",
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  touched: "flex-1 py-3 text-white text-sm md:text-base font-medium rounded-lg bg-indigo-500 shadow-md transition hover:bg-indigo-600",
  potential_miss: `flex-1 py-3 rounded-lg text-xs md:text-base font-medium transition shadow-md bg-yellow-600 text-white hover:bg-yellow-700`,
          // className={`flex-1 py-3 rounded-lg text-xs md:text-base font-medium transition shadow-md cursor-pointer
          //     ${isPotentialMiss ? "bg-yellow-200 text-gray-400 cursor-not-allowed" : "bg-yellow-600 text-white hover:bg-yellow-700"}
          //     ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}

  completed: "px-3 py-3 text-white text-sm font-medium rounded-lg bg-gray-500 shadow-md transition hover:bg-gray-600"
          // className={`py-3 px-3 text-white rounded-lg text-xs md:text-base font-medium transition shadow-md cursor-pointer
          //                 ${isPotentialMiss || isCompleted ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}
          //                 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            // className={`py-3 px-3 text-white rounded-lg text-sm font-medium transition shadow-md ${getButtonClass("completed", "bg-gray-500")}`}
};

export const CommitmentButtonUI = ({
  variant,
  onClick,
  disabled = false,
  className = "",
  isLoading = false,
}: CommitmentButtonUIProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const displayText = isLoading ? "記録中・・・" : VARIANT_LABELS[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyle}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {displayText}
    </button>
  );
};
