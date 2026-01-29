"use client";

import { CommitmentButtonUI } from "./CommitmentButtonUI";
import { useCommitmentContext } from "./CommitmentContext";
import { CommitmentType } from "./actions";



export const CommitmentSkeleton = () => {
  const { bufferedAction, setBufferedAction } = useCommitmentContext();


  const handleReserve = (type: CommitmentType) => {
    if (bufferedAction) {
      return;
    }
    setBufferedAction(type);
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
        <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>


        {/* buttons: interactively operable */}
        <div className="mt-1 flex gap-2 md:gap-4 lg:gap-6">
          <CommitmentButtonUI
            variant="touched"
            onClick={() => handleReserve("touched")}
            disabled={false}
            isLoading={false}
          />

          <CommitmentButtonUI
            variant="potential_miss"
            onClick={() => handleReserve("potential_miss")}
            disabled={false}
            isLoading={false}
          />

          <CommitmentButtonUI
            variant="completed"
            onClick={() => handleReserve("completed")}
            disabled={false}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
};