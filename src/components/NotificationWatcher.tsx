"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Guarded path
const PROTECTED_PATH = "/bright-first-step/application";

export default function NotificationWatcher() {
  const router = useRouter();
  
  // Lock to prevent multiple executions
  const isCheckingRef = useRef(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (window.location.pathname === PROTECTED_PATH) {
        return;
      }

      if (isCheckingRef.current) return; // prevent re-entry
      isCheckingRef.current = true;

      try {
        if (!("serviceWorker" in navigator)) return;

        if ("clearAppBadge" in navigator) {
          navigator.clearAppBadge().catch((e) => console.error("Badge clear failed", e));
        }

        const registration = await navigator.serviceWorker.ready;
        {
          // ① まずタグ指定なしで全部取ってみる
          const allNotifications = await registration.getNotifications();
          // アラートで確認（本番では消す）
          alert(`全通知数: ${allNotifications.length}`);
          // 全ての通知を alert で表示する
          alert(`全通知内容: ${allNotifications.map(n => JSON.stringify(n)).join("\n")}`);

          // ② 指定タグで取ってみる
          const notifications = await registration.getNotifications({ tag: "commit-reminder" });
          alert(`ターゲット通知数: ${notifications.length}`);
        }
        const notifications = await registration.getNotifications({ tag: "commit-reminder" });
        if (notifications.length > 0) {
          for (const notification of notifications) {
            notification.close();
          }

          router.push("/effort");
        }
      } catch (error) {
        console.error("Notification check failed:", error);
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Event listener: only triggers when returning from background
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndRedirect();
      }
    };

    // Also check once on app launch
    if (document.visibilityState === "visible") {
      checkAndRedirect();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    
  }, [router]);

  return null;
}
