"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Guarded path
const PROTECTED_PATH = "/bright-first-step/application";
const TARGET_TAG = "commit-reminder";

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
        const allNotifications = await registration.getNotifications();
        const targetNotification = allNotifications.find(n => n.tag === TARGET_TAG);

        if (targetNotification) {
          for (const notification of allNotifications) {
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
