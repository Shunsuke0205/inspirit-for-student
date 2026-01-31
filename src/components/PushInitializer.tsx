"use client";

import { useEffect } from "react";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushInitializer() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then(async (registration) => {
        console.log("Service Worker registered");

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          try {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
            });

            console.log("↓↓↓ テスト送信用の宛先情報 ↓↓↓");
            console.log(JSON.stringify(subscription));
            console.log("↑↑↑↑↑↑");
            
          } catch (err) {
            console.error("Failed to subscribe:", err);
          }
        }
      });
    }
  }, []);

  return null;
}