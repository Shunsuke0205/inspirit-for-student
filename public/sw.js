self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { count: 1 };

  const badgePromise = navigator.setAppBadge
    ? navigator.setAppBadge(1).catch(error => console.error("Badge update failed:", error))
    : Promise.resolve();

  const title = "Inspirit Notification";
  const options = {
    body: data.message || "リマインド通知",
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png",
    data: data.data || { url: "/effort" }
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      badgePromise
    ])
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  if (navigator.clearAppBadge) {
    navigator.clearAppBadge();
  }

  event.waitUntil(
    clients.openWindow("/effort")
  );
});
