import cron from 'node-cron';

export const startCronJobs = () => {
  // Nhắc nhở chơi cầu lông thứ 2 hàng tuần
  const notifyPlayBadminton = () => {
    console.log('Nhắc nhở chơi cầu lông thứ 2 hàng tuần!');
  };

  // Thiết lập cron job để chạy vào lúc 7:00 sáng mỗi Chủ Nhật
  cron.schedule('0 7 * * 0', () => {
    notifyPlayBadminton();
  });

  // Nhắc nhở đóng tiền quỹ
  const notifyCloseTheFund = () => {
    console.log('Nhắc nhở đóng tiền quỹ!');
  };

  // Thiết lập cron job để chạy vào lúc 7:00 sáng mỗi ngày 24
  cron.schedule('0 7 24 * *', () => {
    notifyCloseTheFund();
  });
};
