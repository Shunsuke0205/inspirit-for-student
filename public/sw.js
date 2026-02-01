self.addEventListener('push', function(event) {
  // const data = event.data ? event.data.json() : { count: 1 };
  // const count = data.count || 1;

  if (navigator.setAppBadge) {
    navigator.setAppBadge(1).catch((error) => {
      console.error('Badge update failed:', error);
    });
  }

  const title = 'Inspirit Notification';
  const options = {
    body: "You are supposed to push the commitment buttons.",
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (navigator.clearAppBadge) {
    navigator.clearAppBadge();
  }

  event.waitUntil(
    clients.openWindow('/')
  );
});
