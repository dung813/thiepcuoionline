/* ================= DỮ LIỆU THIỆP — sửa tại đây =================
   Ảnh: đặt file vào assets/img/ rồi ghi đường dẫn. Ảnh nào chưa có
   sẽ tự hiện khung mạ vàng thay thế. */
window.INVITE = {
  groom: { name: 'Lê Tuấn Kiệt', nick: 'Tuấn Kiệt', father: 'Ông Lê Minh Châu', mother: 'Bà Đỗ Thị Nga',
           photo: 'assets/img/groom.jpg', bio: 'Trưởng nam của gia đình. Kỹ sư, thích chụp ảnh và những chuyến đi xa.' },
  bride: { name: 'Vũ Bảo Ngọc', nick: 'Bảo Ngọc', father: 'Ông Vũ Văn Thành', mother: 'Bà Hoàng Thị Thu',
           photo: 'assets/img/bride.jpg', bio: 'Út nữ của gia đình. Yêu hoa, yêu bếp và những buổi chiều có nắng.' },

  date: '2026-12-20T17:30:00',
  cover: 'assets/img/cover.jpg',

  quote: 'Hạnh phúc không phải là tìm được người hoàn hảo, mà là cùng nhau đi qua những ngày chưa hoàn hảo.',
  message: 'Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi trong ngày trọng đại. Sự hiện diện của quý khách là niềm vinh hạnh lớn lao cho hai gia đình.',

  events: [
    { title: 'Lễ Vu Quy',   time: '2026-12-19T09:00:00', place: 'Tư gia nhà gái', address: '12 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh' },
    { title: 'Lễ Thành Hôn', time: '2026-12-20T09:00:00', place: 'Tư gia nhà trai', address: '45 Lê Lợi, Quận 3, TP. Hồ Chí Minh' },
    { title: 'Tiệc Cưới',   time: '2026-12-20T17:30:00', place: 'Trung tâm Hội nghị Tiệc cưới', hall: 'Sảnh Hoa Hồng · Tầng 2',
      address: '88 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh' }
  ],

  story: [
    { date: '2021', title: 'Lần đầu gặp gỡ',   text: 'Một chiều mưa, quán cà phê kín chỗ, hai người lạ đành ngồi chung một bàn — và câu chuyện bắt đầu từ đó.' },
    { date: '2023', title: 'Chính thức hẹn hò', text: 'Hai năm làm bạn, một lời thương được nói ra, và mọi thứ trở nên dịu dàng hơn.' },
    { date: '2026', title: 'Lời cầu hôn',       text: 'Dưới trời đêm Đà Lạt, chiếc nhẫn nhỏ và một tiếng “Đồng ý” khẽ khàng.' }
  ],

  photos: [
    'assets/img/01.jpg', 'assets/img/02.jpg', 'assets/img/03.jpg', 'assets/img/04.jpg',
    'assets/img/05.jpg', 'assets/img/06.jpg', 'assets/img/07.jpg'
  ],

  gift: {
    groom: { label: 'Mừng cưới chú rể', bank: 'Vietcombank', acc: '0123456789', owner: 'LE TUAN KIET' },
    bride: { label: 'Mừng cưới cô dâu', bank: 'Techcombank', acc: '9876543210', owner: 'VU BAO NGOC' }
  },

  music: 'assets/music.mp3',   // để trống '' nếu không dùng nhạc nền
  thanks: 'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Xin chân thành cảm ơn!'
};
