// Service Worker for ShiftPay Calculator
const CACHE_NAME = 'shiftpay-v1.0.0';
const STATIC_CACHE = 'shiftpay-static-v1.0.0';
const DYNAMIC_CACHE = 'shiftpay-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/pages/calendar.html',
  '/assets/css/main.css',
  '/assets/css/calendar.css',
  '/assets/js/modules/break_schedule.js',
  '/assets/js/modules/calendar.js',
  '/manifest.json',
  // Add Chart.js from CDN to cache
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Pre-caching static files');
        return cache.addAll(STATIC_FILES.map(url => {
          // Handle relative URLs properly
          return url.startsWith('/') ? url : '/' + url;
        }));
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all open clients
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response for caching
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                // Only cache certain file types to prevent cache bloat
                if (shouldCache(request.url)) {
                  console.log('Service Worker: Caching dynamic resource', request.url);
                  cache.put(request, responseToCache);
                }
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Network request failed', request.url, error);
            
            // Return offline fallback for HTML requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Return empty response for other failed requests
            return new Response('', {
              status: 408,
              statusText: 'Request timeout'
            });
          });
      })
  );
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  const cacheableExtensions = ['.js', '.css', '.html', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];
  const urlObj = new URL(url);
  
  // Cache if it matches our domain or is a CDN resource we use
  if (urlObj.origin === self.location.origin || 
      url.includes('cdnjs.cloudflare.com')) {
    
    // Check for cacheable file extensions
    return cacheableExtensions.some(ext => urlObj.pathname.includes(ext));
  }
  
  return false;
}

// Background sync for offline data persistence
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-shifts') {
    event.waitUntil(syncShiftData());
  }
});

// Function to sync shift data when back online
async function syncShiftData() {
  try {
    // Get pending sync data from IndexedDB or localStorage
    const pendingData = await getPendingSyncData();
    
    if (pendingData && pendingData.length > 0) {
      console.log('Service Worker: Syncing pending shift data', pendingData);
      
      // Process each pending item
      for (const item of pendingData) {
        await processPendingItem(item);
      }
      
      // Clear pending data after successful sync
      await clearPendingSyncData();
      
      // Notify clients about successful sync
      notifyClients({
        type: 'SYNC_SUCCESS',
        message: 'Shift data synchronized successfully'
      });
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
    
    notifyClients({
      type: 'SYNC_FAILED',
      message: 'Failed to synchronize shift data'
    });
  }
}

// Helper functions for background sync
async function getPendingSyncData() {
  // In this app, we use localStorage, so we'll check for pending data there
  try {
    const pendingSync = localStorage.getItem('pendingSync');
    return pendingSync ? JSON.parse(pendingSync) : [];
  } catch (error) {
    console.error('Service Worker: Failed to get pending sync data', error);
    return [];
  }
}

async function processPendingItem(item) {
  // Process individual sync items (e.g., save shift data)
  console.log('Service Worker: Processing pending item', item);
  // Implementation would depend on your specific sync requirements
}

async function clearPendingSyncData() {
  try {
    localStorage.removeItem('pendingSync');
  } catch (error) {
    console.error('Service Worker: Failed to clear pending sync data', error);
  }
}

// Notify all clients about events
function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'ShiftPay notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ShiftPay', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Script loaded successfully');