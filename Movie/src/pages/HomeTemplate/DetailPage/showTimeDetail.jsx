import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// NHỚ ĐỔI ĐƯỜNG DẪN IMPORT TỚI SLICE MỚI CỦA BẠN
import { fetchShowtimeByMovie } from './showtimeDetailSlice'; 
// Nếu bạn có một file tiện ích riêng, hãy import các hàm vào đây:
// import { getImageUrl, formatTime, formatDate } from 'path/to/utils'; 

// --- HÀM TIỆN ÍCH (Giữ nguyên) ---
const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/default-movie.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = "https://movienew.cybersoft.edu.vn";
    const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${baseUrl}/${normalizedPath}`;
};

const formatTime = (isoTime) => {
    if (!isoTime) return "N/A";
    try {
        const date = new Date(isoTime);
        // Định dạng thành HH:mm CH/SA (Ví dụ: 08:30 SÁNG)
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return timeStr.replace('AM', 'SA').replace('PM', 'CH'); 
    } catch (e) { return "N/A"; }
};

const formatDate = (isoTime) => {
    if (!isoTime) return "N/A";
    try {
        return new Date(isoTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    } catch (e) { return "N/A"; }
};


// --- Component: Chi tiết Giờ Chiếu cho MỘT CỤM RẠP ---
const CumRapShowtimes = ({ cumRap, onSelectMaLichChieu  }) => {
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    const handleTimeClick = (lc) =>{
        onSelectMaLichChieu(lc.maLichChieu);
    }
    // Nhóm lịch chiếu (lichChieuPhim) theo ngày
    const groupedByDate = useMemo(() => {
        if (!cumRap?.lichChieuPhim?.length) return {};
        
        return cumRap.lichChieuPhim.reduce((acc, lc) => {
            const dateKey = formatDate(lc.ngayChieuGioChieu);
            if (!acc[dateKey]) { acc[dateKey] = []; }
            acc[dateKey].push({
                time: formatTime(lc.ngayChieuGioChieu),
                maLichChieu: lc.maLichChieu,
                giaVe: lc.giaVe,
                thoiLuong: lc.thoiLuong
            });
            return acc;
        }, {});
    }, [cumRap.lichChieuPhim]);
    
    // Sắp xếp ngày và giới hạn 7 ngày đầu
    const sortedDates = useMemo(() => {
        const dates = Object.keys(groupedByDate).sort((a, b) => {
            const [dayA, monthA] = a.split('/');
            const [dayB, monthB] = b.split('/');
            return new Date(`2000-${monthA}-${dayA}`) - new Date(`2000-${monthB}-${dayB}`);
        });
        return dates.slice(0, 7);
    }, [groupedByDate]);

    const getDayLabel = (dateStr) => {
        const [day, month] = dateStr.split('/');
        const date = new Date(`2000-${month}-${day}`);
        return daysOfWeek[date.getDay()];
    };

    if (sortedDates.length === 0) {
        return <p className="text-gray-400 text-sm italic py-4">Không có suất chiếu tại cụm rạp này.</p>;
    }


    return (
        <div className="border border-gray-200 rounded-lg shadow-sm mb-6 bg-white">
            {/* Header Cụm Rạp */}
            <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-red-600">{cumRap?.tenCumRap || 'Tên cụm rạp...'}</h3>
                <p className="text-xs text-gray-500">{cumRap?.diaChi || 'Địa chỉ...'}</p>
            </div>

            {/* Header Ngày Chiếu (7 cột) */}
            <div className="flex text-center text-xs font-semibold border-b border-gray-200 bg-gray-50">
                {sortedDates.map((dateStr, index) => (
                    <div 
                        key={index} 
                        className={`flex-1 p-2 cursor-default border-r border-gray-100 last:border-r-0`}
                    >
                        <p className='text-gray-600'>{getDayLabel(dateStr)}</p>
                        <p className="mt-1 font-bold text-gray-800">{dateStr}</p>
                    </div>
                ))}
            </div>

            {/* Khung Giờ Chiếu (Chỉ một dòng Phim) */}
            <div className="flex p-3">
                {/* Tên định dạng phim/công nghệ */}
                <div className="w-[80px] text-center flex-shrink-0 text-sm font-semibold text-gray-600 border-r pr-3 pt-2">
                    2D Digital
                </div>

                {/* Giờ Chiếu theo Cột Ngày */}
                <div className="flex flex-grow ml-3">
                    {sortedDates.map((dateKey, dateIndex) => {
                        const times = groupedByDate[dateKey] || [];
                        return (
                            <div key={dateIndex} className="flex-1 px-1">
                                <div className="flex flex-wrap gap-1 justify-start">
                                    {times.map((lc) => (
                                        <button
                                            key={lc.maLichChieu}
                                          className="text-xs font-semibold px-1.5 py-0.5 text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition duration-200 whitespace-nowrap"
                                            onClick={()=>handleTimeClick(lc)}
                                        >
                                            {/* Hiển thị Giờ và SA/CH */}
                                            <span className="font-bold">{lc.time.split(' ')[0]}</span>
                                            <span className="text-[10px] ml-1 opacity-70">{lc.time.split(' ')[1]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- Component Chính: MovieShowtimeDetail ---
export default function MovieShowtimeDetail({ maPhim , onSelectMaLichChieu}) {
    const dispatch = useDispatch();
    const { 
        loading, 
        data: contentData, // Dữ liệu từ API LayThongTinLichChieuPhim
        error 
    } = useSelector(state => state.showtimeDetail); // <== SỬ DỤNG KEY REDUX MỚI

    // Lấy mảng heThongRapChieu từ contentData
    const heThongRapChieuList = useMemo(() => {
        return contentData?.heThongRapChieu || [];
    }, [contentData]);

    const [selectedHeThongRap, setSelectedHeThongRap] = useState(null);

    // 1. Fetch data theo maPhim
    useEffect(() => {
        // Chỉ fetch khi maPhim tồn tại (không bị null/undefined)
        if (maPhim) {
            dispatch(fetchShowtimeByMovie(maPhim));
        }
    }, [dispatch, maPhim]); 

    // 2. Set hệ thống rạp mặc định
    useEffect(() => {
        if (heThongRapChieuList.length > 0) {
            setSelectedHeThongRap(prev => {
                const existingHeThong = heThongRapChieuList.find(ht => ht.maHeThongRap === prev?.maHeThongRap);
                return existingHeThong || heThongRapChieuList[0];
            });
        } else {
            setSelectedHeThongRap(null);
        }
    }, [heThongRapChieuList]);


    // --- Loading UI ---
    if (loading) {
        return (
            <div className="text-center p-8 bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg h-[700px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                <span className="ml-3 text-lg text-gray-600">Đang tải lịch chiếu của phim...</span>
            </div>
        );
    }
    
    // Xử lý lỗi
    if (error) {
        return (
            <div className="text-center p-8 text-red-600 bg-red-50 max-w-7xl mx-auto my-10 rounded-lg">
                <p className='font-bold text-xl'>Lỗi tải dữ liệu:</p>
                <p>{error.toString()}</p>
            </div>
        );
    }
    
    // Nếu không có dữ liệu (phim chưa chiếu hoặc hết suất)
    if (heThongRapChieuList.length === 0) {
        return (
            <div className="text-center p-8 text-gray-600 bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg">
                <p className='font-bold text-xl'>Phim chưa có lịch chiếu tại các rạp.</p>
            </div>
        );
    }


    // --- Main UI (Giao diện 2 cột) ---
    return (
        <div className="flex bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg overflow-hidden border border-gray-200 h-[700px]">
            
            {/* Cột 1: Hệ thống Rạp (Logo) */}
            <div className="w-[80px] flex-shrink-0 p-2 space-y-4 border-r border-gray-200 overflow-y-auto">
                {heThongRapChieuList.map((ht) => (
                    <div
                        key={ht?.maHeThongRap}
                        className={`flex justify-center p-2 cursor-pointer transition duration-150 rounded-lg ${
                            selectedHeThongRap?.maHeThongRap === ht?.maHeThongRap
                                ? 'shadow-md border border-red-600 bg-red-50'
                                : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedHeThongRap(ht)}
                    >
                        <img
                            src={getImageUrl(ht?.logo)} 
                            alt={ht?.tenHeThongRap || "Logo"}
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Cột 2: Chi tiết Cụm Rạp và Giờ Chiếu (Cuộn dọc) */}
            <div className="flex-grow p-6 overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">
                    {selectedHeThongRap?.tenHeThongRap || "Chọn Hệ Thống Rạp"}
                </h3>

                {selectedHeThongRap ? (
                    selectedHeThongRap.cumRapChieu.map((cumRap, index) => (
                        // Chỉ hiển thị cụm rạp có lịch chiếu
                        cumRap.lichChieuPhim.length > 0 && 
                        <CumRapShowtimes 
                        key={index} 
                        cumRap={cumRap}
                        onSelectMaLichChieu={onSelectMaLichChieu}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500 pt-10">
                        Vui lòng chọn một Hệ thống rạp để xem chi tiết.
                    </div>
                )}
            </div>
        </div>
    );
}