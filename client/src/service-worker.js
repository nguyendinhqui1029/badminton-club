// self.addEventListener('sync', event => {
//   if (event.tag === 'sync-data') {
//     event.waitUntil(
//       indexedDB.open('myDatabase').onsuccess = function(event) {
//         const db = event.target.result;
//         const transaction = db.transaction(['myStore'], 'readonly');
//         const store = transaction.objectStore('myStore');

//         const getAllRequest = store.getAll();

//         getAllRequest.onsuccess = function() {
//           const dataToSync = getAllRequest.result;
//           console.log('dataToSync', dataToSync)
//           // if (dataToSync.length > 0) {
//           //   fetch('/api/sync', {
//           //     method: 'POST',
//           //     body: JSON.stringify(dataToSync),
//           //     headers: {
//           //       'Content-Type': 'application/json'
//           //     }
//           //   }).then(response => response.json())
//           //   .then(data => {
//           //     console.log('Data synced successfully:', data);
//           //     // Xóa dữ liệu đã gửi từ IndexedDB
//           //     const deleteTransaction = db.transaction(['myStore'], 'readwrite');
//           //     const deleteStore = deleteTransaction.objectStore('myStore');

//           //     dataToSync.forEach(item => {
//           //       deleteStore.delete(item.id);
//           //     });
//           //   });
//           // }
//         };
//       }
//     );
//   }
// });