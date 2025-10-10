import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomFetch, bookTicket } from './slice';
import { useParams } from 'react-router-dom';
// --- Component Ghế Ngồi (Không thay đổi) ---
const Seat = ({ seat, isSelecting, onSelect }) => {
    let className = 'w-6 h-6 m-0.5 md:w-8 md:h-8 md:m-1 flex items-center justify-center text-xs font-semibold rounded transition-colors duration-150';

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

    // Ghế không hiển thị số để giữ nguyên kích thước nhỏ
    return (
        <div
            className={className}
            onClick={() => !isReserved && onSelect(seat)}
        >
            {/* <span className='text-white'>{seat.stt}</span> */}
        </div>
    );
};

// --- Component Chính: BookingRoom ---
const BookingRoom = () => {
    const dispatch = useDispatch();

    // Lấy state từ roomReducer & userReducer
    const { loading, data, error, bookingLoading, bookingError } = useSelector(state => state.roomReducer);
    const { maLichChieu } = useParams();
    const currentUser = useSelector(state => state.userReducer.data);
    const userAccount = currentUser?.taiKhoan;
    // ⭐ Đảm bảo lấy được userName cho thông báo thành công
    const userName = currentUser?.hoTen || 'Quý Khách';
    const isUserLoggedIn = !!currentUser;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [countdown, setCountdown] = useState(300);

    const danhSachGhe = data?.danhSachGhe || [];
    const thongTinPhim = data?.thongTinPhim;

    // --- useEffect: Lấy dữ liệu và Bắt đầu Timer ---
    useEffect(() => {
        // Lấy dữ liệu phòng vé
        if (maLichChieu) {
            dispatch(roomFetch(maLichChieu));
        }

        // Thiết lập bộ đếm thời gian
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev > 0) return prev - 1;
                // Có thể thêm logic tự động hủy chọn ghế hoặc thông báo hết giờ tại đây
                return 0; 
            });
        }, 1000);

        // Cleanup: Dừng timer khi component unmount
        return () => clearInterval(timer);
    }, [dispatch, maLichChieu]);

    // --- Chuyển đổi Danh Sách Ghế sang cấu trúc Hàng/Cột (Dùng useMemo) ---
    const seatsByRow = useMemo(() => {
        if (!danhSachGhe.length) return {};

        const seatsPerRow = 16;
        const groupedSeats = {};

        danhSachGhe.forEach((seat, index) => {
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
        const seatsPerRow = 16;
        const index = danhSachGhe.findIndex(g => g.maGhe === seat.maGhe);

        if (index === -1) return `${seat.tenGhe || seat.stt}`;

        const rowIndex = Math.floor(index / seatsPerRow);
        const rowChar = String.fromCharCode(65 + rowIndex);
        const seatNumberInRow = (index % seatsPerRow) + 1;

        return `${rowChar}${seatNumberInRow}`;
    };

    // Xử lý logic chọn/hủy chọn ghế
    const handleSeatSelect = (seat) => {
        const isSelected = selectedSeats.find(s => s.maGhe === seat.maGhe);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.maGhe !== seat.maGhe));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    // --- Xử lý tính toán và định dạng dữ liệu ---
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0);

    const formattedSelectedSeats = selectedSeats.map(s => {
        const seatDisplayName = getSeatDisplayName(s);
        return `${seatDisplayName} - ${s.giaVe.toLocaleString('vi-VN')} VNĐ`;
    }).join(', ');

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- HÀM XỬ LÝ ĐẶT VÉ (BOOKING TICKET) ĐÃ HOÀN THIỆN LOGIC ---
    const handleBooking = async () => {
        
        if (!isUserLoggedIn) {
            alert("Vui lòng đăng nhập để tiến hành đặt vé.");
            navigate('/login'); // Có thể dùng để chuyển hướng
            return;
        }
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế để đặt vé.");
            return;
        }
        if (bookingLoading) return; // Tránh bấm liên tục
        if (!userAccount) {
        alert("Lỗi hệ thống: Không tìm thấy thông tin tài khoản người đặt.");
        console.error("Lỗi đặt vé: userAccount là null/undefined.");
        return; 
    }
        // 1. Chuẩn bị dữ liệu
        const danhSachVe = selectedSeats.map(s => ({
            maGhe: s.maGhe,
            giaVe: s.giaVe,
        }));
        
        const bookingData = {
            maLichChieu: maLichChieu,
            danhSachVe: danhSachVe,
            taiKhoanNguoiDat: userAccount,
        };
        
        console.log("➡️ Bắt đầu gọi API đặt vé...", bookingData);
        
        // 2. Gọi API đặt vé và Xử lý kết quả
        try {
            // Hiển thị thông báo chờ (nếu cần, dùng toast/modal thay vì alert)
            console.log("✅ Đặt vé thành công, đang xử lý tiếp..."); // Giữ nguyên log cũ
            await dispatch(bookTicket(bookingData)).unwrap();
            // 3. Xử lý khi đặt vé THÀNH CÔNG
            const seatsInfo = selectedSeats.map(s => {
                const seatDisplayName = getSeatDisplayName(s);
                return `${seatDisplayName} (${s.giaVe.toLocaleString('vi-VN')} VNĐ)`;
            }).join(', ');
            
            const movieName = thongTinPhim?.tenPhim || 'Phim';
            const rapName = thongTinPhim?.tenRap || 'Rạp';
            
            const successMessage = `
CẢM ƠN ${userName.toUpperCase()} ĐÃ ĐẶT VÉ!
------------------------------------------
Phim: ${movieName}
Rạp: ${rapName}
------------------------------------------
Ghế đã chọn (${selectedSeats.length}): ${seatsInfo}
Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} VNĐ
            `;
            
            alert(`Đặt vé thành công! Chi tiết:\n${successMessage}`);

            // Reset ghế đã chọn trên client
            setSelectedSeats([]);
            
            // Tải lại danh sách phòng vé để cập nhật ghế đã đặt
            // ⭐ Cần thiết để hiển thị ghế vừa đặt thành màu 'đã đặt'
            dispatch(roomFetch(maLichChieu)); 

        } catch (err) {
            // 4. Xử lý khi đặt vé THẤT BẠI
            const errorMessage = (err.content || err.message) || "Đặt vé thất bại. Vui lòng thử lại.";
            alert(`Đặt vé thất bại: ${errorMessage}`);
            console.error("Lỗi đặt vé:", err);
        }
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

                    {/* Chú thích Ghế */}
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
                            <span className="text-gray-400 block mb-1">Ghế chọn ({selectedSeats.length})</span>
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
                        className={`w-full mt-6 py-3 rounded-lg font-bold transition duration-200 
                            ${selectedSeats.length > 0 && !bookingLoading ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 cursor-not-allowed'}
                        `}
                        disabled={selectedSeats.length === 0 || bookingLoading}
                        onClick={handleBooking}
                    >
                        {bookingLoading ? 'Đang Đặt Vé...' : 'BOOKING TICKET'}
                    </button>
                    {/* Hiển thị lỗi đặt vé từ Redux */}
                    {bookingError && <p className="text-red-500 text-xs mt-2 text-center">{bookingError.message || "Lỗi đặt vé: Vui lòng thử lại."}</p>}
                </div>
            </div>
        </div>
    );
};

export default BookingRoom;