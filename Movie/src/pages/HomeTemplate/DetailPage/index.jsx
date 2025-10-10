import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieDetail } from "./slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import MovieShowtimeDetail from "./showTimeDetail";
export default function DetailPage() {
  const state = useSelector((state) => state.detailReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  //=lưu mã lịch chiếu
  const [selectedMaLichChieu, setSelectedMaLichChieu] = useState(null);
  // nhận maLichChieu từ Detail
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
 
  // Format Ngày khởi chiếu
  const formattedDate = movie?.ngayKhoiChieu ? 
    new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : 
    "Đang cập nhật";

  const descriptionText = movie?.moTa && movie.moTa.trim() !== "" 
    ? movie.moTa 
    : "Đang cập nhật mô tả chi tiết của phim...";
  
 
  const ageRatingText = "C18 - PHIM DÀNH CHO KHÁN GIẢ TỪ 18 TUỔI TRỞ LÊN";
  
  const handleWatchTrailer = () => {
    if (movie?.trailer) {
      window.open(movie.trailer, '_blank');
    } else {
      alert("Không có đường dẫn trailer!");
    }
  };

  // Style nền tối và hiệu ứng sao 
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
      
      <h1 className="text-xl font-bold mb-8 text-gray-300">
        Trang chủ | {movie?.tenPhim || "Chi tiết Phim"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 bg-gray-900/70 p-6 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-700">

        <div className="lg:w-1/3 flex-shrink-0">
          <div className="w-full h-auto shadow-2xl shadow-gray-900 rounded-lg overflow-hidden border border-gray-700">
            <img 
              src={movie?.hinhAnh} 
              alt={movie?.tenPhim}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="lg:w-2/3">
          <h2 className="text-4xl font-extrabold text-white mb-4 uppercase">
            {movie?.tenPhim || "Tên Phim"}
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed italic line-clamp-4">
            {descriptionText}
          </p>

          <div className="inline-block bg-red-700/80 px-4 py-1 rounded-full text-sm font-semibold mb-6 shadow-md border border-yellow-400 text-yellow-300">
            {ageRatingText}
          </div>

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

          <div className="mt-8 flex gap-4">
            <button 
                type="button" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg uppercase transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-800"
                onClick={handleWatchTrailer} 
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
      
       <div className="mt-12">
        <MovieShowtimeDetail maPhim={id}  onSelectMaLichChieu={handleSelectMaLichChieu}/> 
      </div>

    </div>
  );
}