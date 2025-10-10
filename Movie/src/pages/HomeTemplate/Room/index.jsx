import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomFetch } from './slice'; // Giả sử roomSlice.js nằm ở thư mục slices
import { useParams } from 'react-router-dom';

// --- Component Ghế Ngồi ---
const Seat = ({ seat, isSelecting, onSelect }) => {
    let className = 'w-6 h-6 m-0.5 md:w-8 md:h-8 md:m-1 flex items-center justify-center text-xs font-semibold rounded transition-colors duration-150';

    // Xác định trạng thái ghế
    const isReserved = seat.daDat;
    const isVIP = seat.loaiGhe === 'Vip';

    if (isReserved) {
        // Ghế đã đặt (Đỏ/Xám có dấu X)
        className += ' bg-gray-500 cursor-not-allowed';
        return (
            <div className={className}>
                <span className="text-sm font-bold text-red-400">×</span>
            </div>
        );
    }
    
    if (isSelecting) {
        // Ghế đang chọn (Xanh lá)
        className += ' bg-green-500 border border-green-600 text-white cursor-pointer';
    } else if (isVIP) {
        // Ghế VIP (Cam)
        className += ' bg-orange-500 hover:bg-orange-400 cursor-pointer';
    } else {
        // Ghế Thường (Xám)
        className += ' bg-gray-600 hover:bg-gray-500 cursor-pointer';
    }

    const seatNameDisplay = `${seat.stt}`; // Hiển thị số ghế nếu muốn
    
    return (
        <div 
            className={className}
            onClick={() => !isReserved && onSelect(seat)}
        >
            {/* Nếu muốn hiển thị số ghế, bỏ comment dòng dưới */}
            {/* <span className='text-white'>{seatNameDisplay}</span> */}
        </div>
    );
};


// --- Component Chính: BookingRoom ---
const BookingRoom = () => {
    const dispatch = useDispatch();
    const { loading, data, error } = useSelector(state => state.roomReducer); // Lấy state từ roomReducer
    const { maLichChieu } = useParams();    
    // Lấy tên người dùng
    const currentUser = useSelector(state => state.userReducer.data);
    const userName = currentUser?.hoTen || 'Quý Khách';
    // State cho ghế đang chọn (client-side)
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây

    const danhSachGhe = data?.danhSachGhe || [];
    const thongTinPhim = data?.thongTinPhim;


     useEffect(() => {
        // 1. Gọi API khi component được mount
        // 🔥 CHỈ GỌI API KHI maLichChieu TỪ URL TỒN TẠI (Đã loại bỏ mã mặc định 15344)
        if (maLichChieu) {
            dispatch(roomFetch(maLichChieu)); 
        }
        
        // 2. Thiết lập bộ đếm thời gian
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    // 🔥 Sử dụng maLichChieu từ useParams làm dependency
    }, [dispatch, maLichChieu]); 
    // --- Chuyển đổi Danh Sách Ghế sang cấu trúc Hàng/Cột (RẤT QUAN TRỌNG) ---
    const seatsByRow = useMemo(() => {
        if (!danhSachGhe.length) return {};
        
        const seatsPerRow = 16; // Giả định 16 ghế/hàng như giao diện mẫu
        const groupedSeats = {};
        
        danhSachGhe.forEach((seat, index) => {
            // Logic phân nhóm để tạo tên hàng A, B, C,...
            const rowIndex = Math.floor(index / seatsPerRow);
            const rowChar = String.fromCharCode(65 + rowIndex); // A, B, C, ...
            
            if (!groupedSeats[rowChar]) {
                groupedSeats[rowChar] = [];
            }
            groupedSeats[rowChar].push(seat);
        });
        
        return groupedSeats;
    }, [danhSachGhe]);

    // Hàm tiện ích để lấy tên ghế có hàng (A1, B16)
    const getSeatDisplayName = (seat) => {
        const index = danhSachGhe.findIndex(g => g.maGhe === seat.maGhe);
        if (index === -1) return `${seat.tenGhe || seat.stt}`; 

        const seatsPerRow = 16;
        const rowIndex = Math.floor(index / seatsPerRow);
        const rowChar = String.fromCharCode(65 + rowIndex); // A, B, C, ...
        const seatNumberInRow = (index % seatsPerRow) + 1; 
        
        return `${rowChar}${seatNumberInRow}`;
    };


    useEffect(() => {
        // 1. Gọi API khi component được mount
        dispatch(roomFetch(maLichChieu || 15344)); // Dùng mã mặc định nếu không truyền
        
        // 2. Thiết lập bộ đếm thời gian
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [dispatch, maLichChieu]);

    // Xử lý logic chọn/hủy chọn ghế
    const handleSeatSelect = (seat) => {
        const isSelected = selectedSeats.find(s => s.maGhe === seat.maGhe);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.maGhe !== seat.maGhe)); // Hủy chọn
        } else {
            setSelectedSeats([...selectedSeats, seat]); // Chọn
        }
    };
    
    
    // --- Xử lý tính toán và định dạng dữ liệu ---
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);

    // CẬP NHẬT: Hiển thị tên ghế có hàng (A1, B2)
    const formattedSelectedSeats = selectedSeats.map(s => {
        const seatDisplayName = getSeatDisplayName(s);
        return `${seatDisplayName} - ${s.giaVe.toLocaleString('vi-VN')} VNĐ`;
    }).join(', ');
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- HÀM XỬ LÝ ĐẶT VÉ (BOOKING TICKET) ---
    const handleBooking = () => {
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế để đặt vé.");
            return;
        }
        const hoTen = userName; 
        // Lấy thông tin ghế đã chọn với tên ghế đã được định dạng (A1, B2)
        const seatsInfo = selectedSeats.map(s => {
            const seatDisplayName = getSeatDisplayName(s);
            return `${seatDisplayName} (${s.giaVe.toLocaleString('vi-VN')} VNĐ)`;
        }).join(', ');

        const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);
        const movieName = thongTinPhim?.tenPhim || 'Phim';
        const rapName = thongTinPhim?.tenRap || 'Rạp';
        
        const message = `
            CẢM ƠN ${hoTen.toUpperCase()} ĐÃ ĐẶT VÉ!
            ------------------------------------------
            Phim: ${movieName}
            Rạp: ${rapName}
            ------------------------------------------
            Ghế đã chọn (${selectedSeats.length}): ${seatsInfo}
            Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VNĐ
           
        `;

        // Hiển thị thông báo
        alert(message);

        // Xóa danh sách ghế đang chọn trên client (giả lập hoàn tất)
        setSelectedSeats([]);
        
        // TODO: Thêm logic gọi API đặt vé tại đây
    };


    // --- Hiển thị UI khi Loading/Error ---
    if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8 text-center text-xl">Đang tải thông tin phòng vé...</div>;
    if (error) return <div className="min-h-screen bg-gray-900 text-red-500 p-8 text-center text-xl">Lỗi: {error.message || "Không thể tải dữ liệu phòng vé."}</div>;
    if (!thongTinPhim) return <div className="min-h-screen bg-gray-900 text-white p-8 text-center text-xl">Không tìm thấy thông tin phim/lịch chiếu.</div>;

    // --- Render Giao Diện Chính ---
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            {/* Header - Thời gian ghé */}
            <div className="flex justify-between items-center mb-6 text-sm md:text-base">
                <p className="text-gray-400">{thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu} - {thongTinPhim.tenRap}</p>
                <div className="flex items-center space-x-2">
                    <p className="text-gray-400">Thời gian giữ vé</p>
                    <div className={`text-lg font-bold ${countdown <= 60 ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>
                        {formatTime(countdown)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột 1: Sơ đồ Ghế */}
                <div className="lg:col-span-2">
                    {/* Màn hình */}
                    <div className="w-[300px] bg-orange-600 h-5 mb-1 rounded-t-lg mx-auto"></div>
                    <p className="text-center mb-4 text-sm font-semibold">Màn hình</p>
                    
                    {/* Sơ đồ Ghế */}
                    <div className="flex flex-col items-center overflow-x-auto p-2">
                        {Object.entries(seatsByRow).map(([row, seats]) => (
                            <div key={row} className="flex items-center mb-1">
                                <span className="w-6 text-center mr-2 font-bold text-gray-400">{row}</span>
                                <div className="flex">
                                    {seats.map((seat) => (
                                        <Seat 
                                            key={seat.maGhe} 
                                            seat={seat} 
                                            isSelecting={selectedSeats.some(s => s.maGhe === seat.maGhe)}
                                            onSelect={handleSeatSelect}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chú thích Ghế (Giữ nguyên như mẫu) */}
                    <div className="flex flex-wrap justify-center mt-6 text-xs md:text-sm space-x-4 md:space-x-8">
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-600 rounded"></div>
                            <span>Ghế thường</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span>Ghế VIP</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-green-500 rounded border border-green-600"></div>
                            <span>Ghế đang chọn</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-red-400">×</span>
                            </div>
                            <span>Ghế đã đặt / Ghế có người chọn</span>
                        </div>
                    </div>
                </div>
                
                {/* Cột 2: Thông tin Chi tiết và Thanh toán */}
                <div className="p-4 bg-gray-800 rounded-lg shadow-xl self-start lg:col-span-1">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">{thongTinPhim.tenPhim}</h2>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Ngày chiếu giờ chiếu</span>
                            <span className="font-semibold">{thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Cụm rạp</span>
                            <span className="font-semibold">{thongTinPhim.tenCumRap}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Rạp</span>
                            <span className="font-semibold">{thongTinPhim.tenRap}</span>
                        </div>
                        <div className="">
                            {/* CẬP NHẬT: Hiển thị số lượng ghế */}
                            <span className="text-gray-400 block mb-1">Ghế chọn ({selectedSeats.length})</span> 
                            {/* CẬP NHẬT: Hiển thị tên ghế có hàng (A1, B2) */}
                            <span className="font-semibold text-orange-400 break-words">
                                {formattedSelectedSeats || 'Chưa chọn ghế nào'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Đường phân cách */}
                    <div className="my-4 border-t border-gray-700"></div>

                    {/* Tổng tiền và Ưu đãi */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Ưu đãi</span>
                            <span className="font-semibold">0%</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Tổng tiền</span>
                            <span className="text-orange-400">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    </div>
                    
                    {/* Nút Đặt vé */}
                    <button 
                        className={`w-full mt-6 py-3 rounded-lg font-bold transition duration-200 ${selectedSeats.length > 0 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 cursor-not-allowed'}`}
                        disabled={selectedSeats.length === 0}
                        onClick={handleBooking} // <-- GÁN HÀM XỬ LÝ ĐẶT VÉ
                    >
                        BOOKING TICKET
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingRoom;