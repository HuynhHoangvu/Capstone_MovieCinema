import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingHistory } from "./slice";

export default function BookingInfo() {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.bookingReducer);

  const bookingHistory = data?.thongTinDatVe || [];

  useEffect(() => {
    dispatch(fetchBookingHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Đang tải lịch sử đặt vé...
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error.content || "Có lỗi xảy ra khi tải lịch sử đặt vé.";
    return (
      <div className="p-8 text-center text-red-600">Lỗi: {errorMessage}</div>
    );
  }

  if (bookingHistory.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Bạn chưa có lịch sử đặt vé nào.
      </div>
    );
  }

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm định dạng thời gian
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 space-y-6">
      {bookingHistory.map((item, index) => {
        // ... (Logic trích xuất dữ liệu giữ nguyên)
        const tenPhim = item.tenPhim;
        const hinhAnh = item.hinhAnh;
        const ngayDat = formatDate(item.ngayDat);
        const gioDat = formatTime(item.ngayDat);

        // Lấy thông tin cụm rạp và ghế từ danh sách ghế
        const chiTietDatVe = item.danhSachGhe[0];
        const tenCumRap = chiTietDatVe?.tenCumRap;
        const tenRap = chiTietDatVe?.tenRap;
        const danhSachGhe = item.danhSachGhe.map((g) => g.tenGhe).join(", ");

        return (
          <div
            key={index}
            className="flex border-2 border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="w-20 h-28 flex-shrink-0 mr-4">
              <img
                src={hinhAnh}
                alt={tenPhim}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://i.imgur.com/L4M3gM1.png";
                }}
              />
            </div>

            <div className="flex-grow">
              <p className="text-lg font-semibold text-blue-600 mb-1">
                {tenPhim}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Rạp:</strong> {tenCumRap} - {tenRap}
              </p>

              <div className="mt-2 p-3 bg-gray-50 border border-dashed border-gray-300 rounded text-sm">
                <p className="text-gray-900">
                  Ngày đặt: <span className="font-medium">{ngayDat}</span> -{" "}
                  {gioDat} - Rạp{" "}
                  <span className="font-medium">
                    {chiTietDatVe?.tenRap.match(/\d+/)
                      ? chiTietDatVe?.tenRap.match(/\d+/)[0]
                      : "1"}
                  </span>{" "}
                  - Ghế{" "}
                  <span className="font-bold text-red-500">{danhSachGhe}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
