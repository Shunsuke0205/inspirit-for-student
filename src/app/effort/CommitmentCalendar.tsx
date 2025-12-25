interface CommitmentCalendarProps {
  commitMap: Map<string, number>;
  todayJst: string;
}

const CommitmentCalendar = ({ commitMap, todayJst } : CommitmentCalendarProps) => {
  const TODAY = new Date(todayJst);
  // let nextMonday = new Date(TODAY);
  // nextMonday.setDate(TODAY.getDate() + (8 - TODAY.getDay()) % 7);
  // console.log("Next Monday:", nextMonday.toISOString().substring(0, 10));
  // const lastMonday = new Date(TODAY);
  // lastMonday.setDate(TODAY.getDate() - ((TODAY.getDay() - 1 + 7) % 7));
  // console.log("Days since last Monday:", ((TODAY.getDay() - 1 + 7) % 7));
  // console.log("Last Monday:", lastMonday.toISOString().substring(0, 10));

  const WEEKS_TO_DISPLAY = 6;
  const DAYS_IN_WEEK = 7;
  const allDays = [];



  for (let i = (WEEKS_TO_DISPLAY * DAYS_IN_WEEK) - 1; i >= 0; i--) {
    const day = new Date(TODAY);
    day.setDate(TODAY.getDate() - i);
    const dateStr = day.toISOString().substring(0, 10);
    const count = commitMap.get(dateStr);

    let colorClass = "bg-gray-100 border border-gray-400"; // default
    if (count !== undefined && count > 0) {
      colorClass = "bg-sky-400";
    } else if (count !== undefined && count === 0) {
      colorClass = "bg-yellow-300";
    }

    const isToday = (i === 0);
    if (count === undefined && isToday) {
      colorClass = "red-ring-pulse";
    } else if (count !== undefined && isToday && count > 0) {
      colorClass = "rainbow-animate";
    }

    allDays.push({ dateStr, colorClass, count });
  }

  const placeholderDays = (7 - TODAY.getDay()) % 7;
  for (let i = 0; i < placeholderDays; i++) {
    allDays.push({ dateStr: "", colorClass: "bg-white", count: -1 });
  }



  const dayLabels = ["月", "火", "水", "木", "金", "土", "日"]; 

  const reversedDays = allDays.reverse();
  const weeks = [];
  
  // 週間データを新しい週から古い週の順序に並び替え
  for (let w = 0; w < WEEKS_TO_DISPLAY; w++) {
    const startIndex = w * DAYS_IN_WEEK;
    const weekDays = reversedDays.slice(startIndex, startIndex + DAYS_IN_WEEK).reverse(); // 週内の日付を新しいものから古いものへ並び替え
    weeks.push(weekDays);
  }


  
  return (
    <div className="flex flex-col"> 
      {/* ヘッダー: 曜日 */}
      <div className="grid grid-cols-8 text-xs font-semibold text-gray-500 mb-2">
        <div className="w-4 h-4"></div> {/* 左上の空白 */}
        {dayLabels.map(label => (
          <div key={label} className="text-center">{label}</div>
        ))}
      </div>

      {/* 週のデータ */}
      <div className="flex flex-col space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-8 items-center">
            {/* 週のラベル (新しい週が上に来る) */}
            <div className="text-xs text-gray-500 text-left pr-2 truncate">
              {weekIndex === 0 ? "今週" : `${weekIndex}週間前`} 
            </div>
            
            {/* 曜日のコミットマス */}
            {week.map((dayData, dayIndex) => {
              const tooltipText = `${dayData.dateStr}: ${(dayData.count !== undefined && dayData.count > 0) ? `${dayData.count} commits` : "No commit"}`;
              return (
                <div key={dayIndex} className="flex justify-center items-center">
                  <div 
                    title={tooltipText}
                    className={`w-4 h-4 rounded-sm transition-colors ${dayData.colorClass}`}
                  ></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitmentCalendar;
