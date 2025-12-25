"use client";

import { useCommitmentContext } from "./CommitmentContext";
import { CommitmentType } from "./actions";



export const CommitmentSkeleton = () => {
  const { bufferedAction, setBufferedAction } = useCommitmentContext();

  const handleReserve = (type: CommitmentType) => {
    if (bufferedAction) return;
    setBufferedAction(type);
  };

  const getButtonClass = (type: CommitmentType, baseColorClass: string) => {
    const isSelected = bufferedAction === type;
    const isOtherSelected = bufferedAction !== null && !isSelected;

    // 「入力を受け付けた感」を出します
    if (isSelected) return `${baseColorClass} opacity-70 ring-2 ring-offset-1 ring-indigo-500`;
    if (isOtherSelected) return `${baseColorClass} opacity-30 cursor-not-allowed`;
    
    return `${baseColorClass} hover:opacity-80`;
  };

  return (
    <div>
      {/* header */}
      <div className="mt-8 mb-6 p-5 bg-white shadow-xl rounded-xl border-t-4 border-indigo-500">
        <h2 className="text-xl font-bold text-gray-700">本日報告すべき商品</h2>
      </div>

      {/* product card skeleton */}
      <div className="mt-5">
        {/* product name: loading bar */}
        <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>


        {/* buttons: interactively operable */}
        <div className="mt-1 flex gap-2 md:gap-4 lg:gap-6">
          <button
            onClick={() => handleReserve("touched")}
            className={`flex-1 py-3 text-white rounded-lg text-sm font-medium transition shadow-md ${getButtonClass("touched", "bg-indigo-500")}`}
          >
            "今日触れた 🙌🏻"
          </button>

          <button
            onClick={() => handleReserve("potential_miss")}
            className={`flex-1 py-3 text-white rounded-lg text-sm font-medium transition shadow-md ${getButtonClass("potential_miss", "bg-yellow-600")}`}
          >
            "今日は触れないかも 🤔"
          </button>
            
          <button
            onClick={() => handleReserve("completed")}
            className={`py-3 px-3 text-white rounded-lg text-sm font-medium transition shadow-md ${getButtonClass("completed", "bg-gray-500")}`}
          >
            "完了！✅"
          </button>
        </div>
      </div>
    </div>
  );
};