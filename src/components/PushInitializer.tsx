"use client";

import { saveSubscription } from "@/lib/notifications";
import { useState } from "react";

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
  const [subscriptionJson, setSubscriptionJson] = useState<string | null>(null);

  const startRegistration = async () => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      setSubscriptionJson(JSON.stringify(subscription));

      const subscriptionJSON = subscription.toJSON();
      if (subscriptionJSON.endpoint && subscriptionJSON.keys) {
        await saveSubscription({
          endpoint: subscriptionJSON.endpoint,
          keys: {
            p256dh: subscriptionJSON.keys.p256dh!,
            auth: subscriptionJSON.keys.auth!,
          }
        });
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-50">
      {!subscriptionJson ? (
        <button 
          onClick={startRegistration}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold"
        >
          通知を有効にする
        </button>
      ) : (
        <textarea 
          className="w-full h-24 text-[10px] font-mono p-2 border rounded"
          readOnly
          value={subscriptionJson}
        />
      )}
    </div>
  );
}
