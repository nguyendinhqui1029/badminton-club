self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('Running background sync...');
  try {
    const response = await fetch('https://api.example.com/sync'); // Thay thế bằng API của bạn
    const data = await response.json();
    console.log('Data synced:', data);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}