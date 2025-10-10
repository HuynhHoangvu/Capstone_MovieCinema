import React, { useEffect } from 'react'; // 👈 Cần thiết để khởi tạo Flowbite
import { Link } from 'react-router-dom';

// GIẢ ĐỊNH: Import hàm khởi tạo Flowbite (Thay thế bằng đường dẫn/tên hàm thực tế)
// Nếu bạn không import được, hãy đảm bảo Flowbite đã được load toàn cục qua CDN/script.

export default function Banner(props) {
 const { data } = props; 

 // 🛑 Dùng useEffect để khởi tạo lại Flowbite sau khi dữ liệu render
 useEffect(() => {
  if (data && data.length > 0) {
   try {
        // Hàm này bắt buộc phải được gọi để Flowbite nhận diện các Carousel mới
    if (typeof initCarousels === 'function') {
     initCarousels();
    } else {
            // Trường hợp Flowbite được load qua script file (ít dùng trong React)
            // Có thể thử gọi qua window nếu initCarousels không hoạt động.
            // if (window.Flowbite && window.Flowbite.initCarousels) { window.Flowbite.initCarousels(); }
            console.warn("Flowbite initCarousels not found. Check if Flowbite JS is loaded correctly.");
    }
   } catch (e) {
    console.error("Could not initialize Flowbite Carousel:", e);
   }
  }
 }, [data]); // Phụ thuộc vào `data` để đảm bảo chạy sau khi dữ liệu API được nạp

 // ... (Phần renderBannerItems và renderIndicators giữ nguyên) ...

 if (!data || data.length === 0) {
  return <div className="h-56 md:h-96 bg-gray-200 flex items-center justify-center">Không có Banner</div>;
 }

 const renderBannerItems = () => {
  // ... (Giữ nguyên)
  return data.map((item, index) => (
   <div 
    key={item.maBanner} 
    className={`duration-700 ease-in-out ${index === 0 ? '' : 'hidden'}`} 
    data-carousel-item
   >
    <Link to={`/detail/${item.maPhim}`}>
     <img
      src={item.hinhAnh} 
      className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      alt={`Banner phim ${item.maPhim}`}
     />
    </Link>
   </div>
  ));
 };

 const renderIndicators = () => {
  // ... (Giữ nguyên)
  return data.map((item, index) => (
   <button 
    key={item.maBanner} 
    type="button" 
    className="w-3 h-3 rounded-full" 
    aria-current={index === 0 ? "true" : "false"} 
    aria-label={`Slide ${index + 1}`} 
    data-carousel-slide-to={index} 
   />
  ));
 };

return (
  <div id="default-carousel" className="relative w-full" data-carousel="slide">
   {/* Carousel wrapper */}
   <div className="relative h-[100vh] overflow-hidden rounded-lg md:h-[100vh]">
    {renderBannerItems()} 
   </div>
   
   {/* Slider indicators */}
   <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
    {renderIndicators()}
   </div>
   
   {/* Slider controls (Giữ nguyên) */}
   <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
     <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
     </svg>
     <span className="sr-only">Previous</span>
    </span>
   </button>
   <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
     <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
     </svg>
     <span className="sr-only">Next</span>
    </span>
   </button>
  </div>
 )
}