
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
  touched: "bg-indigo-500",
  potential_miss: "bg-yellow-600",
  completed: "bg-gray-500",
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
