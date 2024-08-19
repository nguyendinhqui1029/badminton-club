export function getTimeDifference(date: Date) {
  const nowTime = new Date().getTime();
  const dateTime = date.getTime();
  const diff = nowTime - dateTime;

  if (diff < 0) {
    return '';
  }

  const minutes = Math.floor(diff / 1000 / 60); // Chuyển đổi thành phút
  const hours = Math.floor(minutes / 60); // Chuyển đổi thành giờ
  const days = Math.floor(hours / 24); // Chuyển đổi thành ngày
  const months = Math.floor(days / 30); // Chuyển đổi thành tháng (khoảng)
  const years = Math.floor(days / 365); // Chuyển đổi thành năm (khoảng)

  if (years > 0) {
    return `${years} năm`;
  } else if (months > 0) {
    return `${months} tháng`;
  } else if (days > 0) {
    return `${days} ngày`;
  } else if (hours > 0) {
    return `${hours} giờ`;
  } else if (minutes > 0) {
    return `${minutes} phút`;
  } else {
    return "Vừa xong";
  }
}