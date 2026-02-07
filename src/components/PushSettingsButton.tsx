"use client";

import { saveSubscription } from "@/lib/notifications";
import { useEffect, useState } from "react";

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

export default function PushSettingsButton() {
  const [status, setStatus] = useState<"loading" | "default" | "granted" | "denied">("loading");
  // const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const logs: string[] = [];
    
    const hasSW = "serviceWorker" in navigator;
    // logs.push(`SW Support: ${hasSW}`);

    if (!hasSW) {
      setStatus("denied");
      // setDebugInfo(logs.join("\n"));
      return;
    }

    const hasNotif = "Notification" in window;
    // logs.push(`Notification Object: ${hasNotif}`);

    if (!hasNotif) {
      // logs.push("Error: Device does not support Notification API");
      setStatus("denied");
      // setDebugInfo(logs.join("\n"));
      return;
    }

    try {
      const perm = Notification.permission;
      // logs.push(`Permission Status: ${perm}`);
      
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      logs.push(`Standalone Mode: ${isStandalone}`);

      if (perm === "granted") {
        setStatus("granted");
      } else if (perm === "denied") {
        setStatus("denied");
      } else {
        setStatus("default");
      }
    } catch (e) {
      logs.push(`Error reading permission: ${e}`);
      console.error("Error reading notification permission:", e);
      setStatus("default");
    }
    
    // setDebugInfo(logs.join("\n"));
  }, []);

  const handleSubscribe = async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });
        const subscriptionJSON = subscription.toJSON();
        if (subscriptionJSON.endpoint && subscriptionJSON.keys) {
          await saveSubscription({
            endpoint: subscriptionJSON.endpoint,
            keys: {
              p256dh: subscriptionJSON.keys.p256dh!,
              auth: subscriptionJSON.keys.auth!,
            }
          });
          setStatus("granted");
        }
      } else {
        setStatus("denied");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("申し訳ございません。通知の登録に失敗しました。");
      setStatus("denied");
    }
  }

  if (status === "loading") {
    return null;
  }



  return (
    <div>
      {/* <div className="p-4 bg-black text-green-400 text-xs font-mono rounded overflow-scroll whitespace-pre-wrap border-2 border-green-600">
        <p className="font-bold border-b border-green-600 mb-2">DEBUG INFO</p>
        {debugInfo}
      </div> */}
      {status === "granted" ? (
        <button 
          disabled 
          className="mt-3 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold border cursor-not-allowed"
        >
          通知設定済み
        </button>
      ) : status === "denied" ? (
        <div className="text-sm text-center">
          <p>通知がブロックされているかもしれません。</p>
          <p>リマインド通知を受け取りたい場合は、ブラウザの設定から許可してください。</p>
        </div>
      ) : (
        <button 
          onClick={handleSubscribe}
          className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
        >
          リマインド通知を受け取る 🔔
        </button>
      )}
    </div>
  );
}
