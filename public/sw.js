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
    data: data.data || { url: "/effort" },
    tag: "commit-reminder"
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      badgePromise
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/effort";

  const clearBadgePromise = navigator.clearAppBadge
    ? navigator.clearAppBadge().catch(e => console.error(e))
    : Promise.resolve();

  const windowClientPromise = clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then((clientList) => {
    for (const client of clientList) {
      if (client.url.includes(self.location.origin) && "focus" in client) {
        return client.focus().then(c => c.navigate(urlToOpen));
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(
    Promise.all([clearBadgePromise, windowClientPromise])
  );
});
