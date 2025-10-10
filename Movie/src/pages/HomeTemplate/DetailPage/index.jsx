import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieDetail } from "./slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import MovieShowtimeDetail from "./showTimeDetail";
export default function DetailPage() {
  const state = useSelector((state) => state.detailReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  // Khai báo hàm chuyển hướng
  const navigate = useNavigate();
  // tạo state để lưu mã lịch chiếu
  const [selectedMaLichChieu, setSelectedMaLichChieu] = useState(null);
  // Tạo callback để nhận maLichChieu từ Detail
  const handleSelectMaLichChieu = (maLichChieu)=>{
    setSelectedMaLichChieu(maLichChieu);
    navigate(`/room/${maLichChieu}`);
  }
// Callback button mua ve ngay
  const handleBookingTicket = () =>{
    if(selectedMaLichChieu) {
      navigate(`/room/${selectedMaLichChieu}`);
    }else{
      alert("Vui lòng chọn một suất chiếu trước khi đặt vé.")
    }
  }
  useEffect(() => {
    dispatch(fetchMovieDetail(id));
  }, [id]);

  if (state.loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Đang tải chi tiết phim...</p>
      </div>
    );
  
  const movie = state.data;
  
  // --- Xử lý Dữ liệu từ JSON mới ---

  // 1. Format Ngày khởi chiếu
  const formattedDate = movie?.ngayKhoiChieu ? 
    new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : 
    "Đang cập nhật";

  // 2. Xử lý Mô tả (nếu rỗng)
  const descriptionText = movie?.moTa && movie.moTa.trim() !== "" 
    ? movie.moTa 
    : "Đang cập nhật mô tả chi tiết của phim...";
  
  // 3. Xử lý Đánh giá/Độ tuổi
  // Giả định: Trường 'danhGia' (10) là điểm số, không phải độ tuổi.
  // Giữ lại nội dung độ tuổi giả lập để giữ giao diện.
  const ageRatingText = "C18 - PHIM DÀNH CHO KHÁN GIẢ TỪ 18 TUỔI TRỞ LÊN";
  
  // 4. Xử lý Xem Trailer
  const handleWatchTrailer = () => {
    if (movie?.trailer) {
      window.open(movie.trailer, '_blank');
    } else {
      alert("Không có đường dẫn trailer!");
    }
  };
  // ------------------------------------

  // Style nền tối và hiệu ứng sao (giống hình ảnh)
  const backgroundStyle = {
    backgroundImage: "url('https://picsum.photos/1920/1080?blur=5&random=3')", 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backgroundBlendMode: 'overlay',
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white" style={backgroundStyle}>
      
      {/* Tiêu đề Trang chủ | Tên phim */}
      <h1 className="text-xl font-bold mb-8 text-gray-300">
        Trang chủ | {movie?.tenPhim || "Chi tiết Phim"}
      </h1>

      {/* --- Khu vực Nội dung chính --- */}
      <div className="flex flex-col lg:flex-row gap-8 bg-gray-900/70 p-6 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700">

        {/* Cột 1: Poster Phim */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="w-full h-auto shadow-2xl shadow-gray-900 rounded-lg overflow-hidden border border-gray-700">
            <img 
              // Dùng trường hinhAnh từ API
              src={movie?.hinhAnh || "https://placehold.co/400x600/1f2937/ffffff?text=Poster"} 
              alt={movie?.tenPhim}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Cột 2: Thông tin Phim */}
        <div className="lg:w-2/3">
          <h2 className="text-4xl font-extrabold text-white mb-4 uppercase">
            {/* Dùng trường tenPhim từ API */}
            {movie?.tenPhim || "Tên Phim"}
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed italic line-clamp-4">
            {/* Dùng mô tả đã xử lý (nếu rỗng) */}
            {descriptionText}
          </p>

          {/* Cảnh báo độ tuổi (Hardcoded/Fallback) */}
          <div className="inline-block bg-red-700/80 px-4 py-1 rounded-full text-sm font-semibold mb-6 shadow-md border border-yellow-400 text-yellow-300">
            {ageRatingText}
            {/* Có thể thêm điểm đánh giá: (movie?.danhGia ? ` | ${movie.danhGia}/10` : '') */}
          </div>

          {/* Chi tiết phim (Các trường bị thiếu dùng Fallback N/A) */}
          <div className="space-y-4 text-sm">
             <p>
                <span className="font-bold text-gray-400 w-28 inline-block">Đánh giá:</span> 
                <span className="font-semibold text-yellow-400 text-base">{movie?.danhGia} / 10</span> 
            </p>

            <p>
                <span className="font-bold text-gray-400 w-28 inline-block">Khởi chiếu:</span> 
                <span className="font-semibold text-white">{formattedDate}</span>
            </p>

          </div>

          {/* Các nút chức năng */}
          <div className="mt-8 flex gap-4">
            <button 
                type="button" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg uppercase transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-800"
                onClick={handleWatchTrailer} // Thêm action xem trailer
            >
              XEM TRAILER
            </button>
            
            <button 
                type="button" 
                onClick={handleBookingTicket}
              className={`font-bold px-8 py-3 rounded-lg shadow-lg uppercase transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 ${
                  selectedMaLichChieu
                      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-800'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}  
            >
              MUA VÉ NGAY
            </button>
          </div>
        </div>
      </div>
      
      {/* --- Khu vực Lịch Chiếu --- */}
       <div className="mt-12">
        <MovieShowtimeDetail maPhim={id}  onSelectMaLichChieu={handleSelectMaLichChieu}/> 
      </div>

    </div>
  );
}