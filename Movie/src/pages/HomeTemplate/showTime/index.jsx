import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShow, fetchShowTimes } from './slice';

// Hàm xử lý URL hình ảnh
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/images/default-movie.jpg";
  
  // Nếu URL đã là full URL thì giữ nguyên
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Nếu là đường dẫn tương đối, thêm base URL
  // Thay đổi base URL này theo API của bạn
  const baseUrl = "https://movienew.cybersoft.edu.vn";
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// Hàm format giờ chiếu
const formatTime = (isoTime) => {
  if (!isoTime) return "N/A";
  
  try {
    const date = new Date(isoTime);
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return timeStr.replace('AM', 'SÁNG').replace('PM', 'CHIỀU');
  } catch (e) {
    return "N/A";
  }
};

// --- Component: Danh sách Phim + Giờ Chiếu ---
const MovieShowtimes = ({ cumRap }) => {
  if (!cumRap?.danhSachPhim?.length) {
    return (
      <div className="text-center text-gray-500 pt-10">
        Không có lịch chiếu cho cụm rạp này.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cumRap.danhSachPhim.map((phim, index) => {
        const times = phim?.lstLichChieuTheoPhim?.map(
          lc => formatTime(lc?.ngayChieuGioChieu)
        ) || [];

        const timeRows = [];
        for (let i = 0; i < times.length; i += 6) {
          timeRows.push(times.slice(i, i + 6));
        }

        return (
          <div key={phim?.maPhim || index} className="py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={phim?.hinhAnh}
                className="w-16 h-24 object-cover rounded-md shadow-md"
                
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {phim?.tenPhim || "Tên phim..."}
                </h3>
                <p className="text-sm text-gray-500">{cumRap?.diaChi || "Địa chỉ rạp"}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {timeRows.length > 0 ? (
                timeRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap gap-3">
                    {row.map((time, timeIndex) => (
                      <button
                        key={`${rowIndex}-${timeIndex}`}
                        className="px-3 py-1 text-sm font-semibold text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition duration-200"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Không có suất chiếu</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Component: Danh sách Cụm Rạp ---
const CinemaDetails = ({ cumRapList, selectedCumRap, setSelectedCumRap, currentLogo }) => {
  if (!cumRapList?.length) {
    return <div className="p-4 text-xs text-gray-400">Không có cụm rạp.</div>;
  }

  return (
    <div className="mt-2 space-y-1">
      {cumRapList.map((cumRap, index) => (
        <div
          key={cumRap?.maCumRap || index}
          className={`flex items-start space-x-3 p-2 cursor-pointer transition duration-150 ${
            cumRap?.maCumRap === selectedCumRap?.maCumRap
              ? 'bg-gray-100 border-l-4 border-red-600'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setSelectedCumRap(cumRap)}
        >
          <img
            src={getImageUrl(currentLogo)}
            alt="Cinema Icon"
            className="w-10 h-10 object-contain p-1"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800 leading-tight">
              {cumRap?.tenCumRap || "Tên cụm rạp..."}
            </p>
            <p className="text-xs text-gray-500">Cụm 66B</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Component chính ---
export default function InfoShow() {
  const dispatch = useDispatch();
  const {
    loading: loadingHeThong,
    loadingShowTimes,
    data: heThongRapList = [],
    showTimeData: allLichChieu = [],
  } = useSelector(state => state.showReducer);

  const [selectedMaHeThong, setSelectedMaHeThong] = useState(null);
  const [selectedCumRap, setSelectedCumRap] = useState(null);

  // Fetch data chỉ một lần khi component mount
  useEffect(() => {
    dispatch(fetchShow());
    dispatch(fetchShowTimes("GP01"));
  }, [dispatch]);

  // Tìm hệ thống rạp mặc định
  const defaultHeThongRap = useMemo(() => {
    return heThongRapList.find(ht => ht.maHeThongRap === 'BHDStar') || heThongRapList[0];
  }, [heThongRapList]);

  // Set default hệ thống rạp
  useEffect(() => {
    if (defaultHeThongRap && !selectedMaHeThong) {
      setSelectedMaHeThong(defaultHeThongRap.maHeThongRap);
    }
  }, [defaultHeThongRap, selectedMaHeThong]);

  // Tìm dữ liệu lịch chiếu hiện tại
  const lichChieuData = useMemo(() => {
    return allLichChieu.find(ht => ht.maHeThongRap === selectedMaHeThong);
  }, [allLichChieu, selectedMaHeThong]);

  // Tìm logo hiện tại
  const currentLogo = useMemo(() => {
    return heThongRapList.find(ht => ht.maHeThongRap === selectedMaHeThong)?.logo;
  }, [heThongRapList, selectedMaHeThong]);

  // Set cụm rạp mặc định khi lichChieuData thay đổi
  useEffect(() => {
    if (lichChieuData?.lstCumRap?.length > 0) {
      setSelectedCumRap(prev => {
        // Giữ lại cụm rạp đã chọn nếu nó vẫn tồn tại trong danh sách mới
        const existingCumRap = lichChieuData.lstCumRap.find(
          cr => cr.maCumRap === prev?.maCumRap
        );
        return existingCumRap || lichChieuData.lstCumRap[0];
      });
    } else {
      setSelectedCumRap(null);
    }
  }, [lichChieuData]);

  // Loading UI
  if (loadingHeThong || loadingShowTimes) {
    return (
      <div className="text-center p-8 bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg h-[700px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        <span className="ml-3 text-lg text-gray-600">Đang tải lịch chiếu rạp...</span>
      </div>
    );
  }

  // Kiểm tra nếu không có dữ liệu
  if (!heThongRapList.length || !allLichChieu.length) {
    return (
      <div className="text-center p-8 bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg h-[700px] flex items-center justify-center">
        <span className="text-lg text-gray-600">Không có dữ liệu lịch chiếu.</span>
      </div>
    );
  }

  // Main UI
  return (
    <div className="flex bg-white shadow-xl max-w-7xl mx-auto my-10 rounded-lg overflow-hidden border border-gray-200 h-[700px]">
      {/* Cột trái */}
      <div className="flex w-1/5 border-r border-gray-200">
        <div className="p-2 space-y-4 border-r border-gray-200">
          {heThongRapList?.map((ht) => (
            <div
              key={ht?.maHeThongRap}
              className={`flex justify-center p-2 cursor-pointer transition duration-150 rounded-lg ${
                selectedMaHeThong === ht?.maHeThongRap
                  ? 'shadow-md border border-gray-300'
                  : 'opacity-50 hover:opacity-100'
              }`}
              onClick={() => setSelectedMaHeThong(ht?.maHeThongRap)}
            >
              <img
                src={getImageUrl(ht?.logo)}
                alt={ht?.tenHeThongRap || "Logo"}
                className="w-10 h-10 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Danh sách cụm rạp */}
        <div className="flex-grow overflow-y-auto">
          <CinemaDetails
            cumRapList={lichChieuData?.lstCumRap || []}
            selectedCumRap={selectedCumRap}
            setSelectedCumRap={setSelectedCumRap}
            currentLogo={currentLogo}
          />
        </div>
      </div>

      {/* Cột phải */}
      <div className="w-4/5 p-6 overflow-y-auto">
        {selectedCumRap ? (
          <MovieShowtimes cumRap={selectedCumRap} />
        ) : (
          <div className="text-center text-gray-500 pt-10">
            Vui lòng chọn một cụm rạp để xem lịch chiếu.
          </div>
        )}
      </div>
    </div>
  );
}