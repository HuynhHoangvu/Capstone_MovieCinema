import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchHeThongRap,
  fetchCumRapTheoHeThong,
  clearCumRapList,
  createLichChieu,
  resetCreateScheduleStatus,
} from "./slice";

const ShowTime = () => {
  const dispatch = useDispatch();
  const { maPhim } = useParams();

  const {
    heThongRap: heThongRapState,
    cumRap: cumRapState,
    createSchedule: createScheduleState,
  } = useSelector((state) => state.schedule);

  const [formData, setFormData] = useState({
    selectedHeThongRap: "",
    selectedCumRap: "",
    ngayChieuGioChieu: "",
    giaVe: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newState = { ...prev, [name]: value };

      if (name === "selectedHeThongRap") {
        newState.selectedCumRap = "";
      }
      return newState;
    });
  };

  useEffect(() => {
    dispatch(fetchHeThongRap());
  }, [dispatch]);

  useEffect(() => {
    const maHeThongRap = formData.selectedHeThongRap;

    if (maHeThongRap) {
      dispatch(fetchCumRapTheoHeThong(maHeThongRap));
    } else {
      dispatch(clearCumRapList());
    }

  }, [formData.selectedHeThongRap, dispatch]);

  useEffect(() => {
    if (createScheduleState.success) {
      alert(createScheduleState.success);
      dispatch(resetCreateScheduleStatus());
    }

    if (createScheduleState.error) {
      alert(`Lỗi tạo lịch chiếu: ${createScheduleState.error}`);
      dispatch(resetCreateScheduleStatus());
    }
  }, [createScheduleState.success, createScheduleState.error, dispatch]);

  const formatDateTimeToApi = (isoString) => {
    if (!isoString) return "";

    const dateObj = new Date(isoString);

    const pad = (num) => String(num).padStart(2, "0");

    const day = pad(dateObj.getDate());
    const month = pad(dateObj.getMonth() + 1);
    const year = dateObj.getFullYear();
    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    const seconds = "00"; 

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const giaVeValue = parseInt(formData.giaVe);

    if (
      !formData.selectedCumRap ||
      !formData.ngayChieuGioChieu ||
      giaVeValue <= 0
    ) {
      alert("Vui lòng điền đầy đủ và chính xác thông tin.");
      return;
    }

    const ngayChieuGioChieuAPI = formatDateTimeToApi(
      formData.ngayChieuGioChieu
    );

    const lichChieuData = {
      maPhim: maPhim,
      ngayChieuGioChieu: ngayChieuGioChieuAPI,
      maRap: formData.selectedCumRap, 
      giaVe: giaVeValue,
    };

    console.log("Dữ liệu gửi lên API:", lichChieuData); 
    dispatch(createLichChieu(lichChieuData));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Tạo Lịch Chiếu - Phim ID: {maPhim || "N/A"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="selectedHeThongRap"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hệ thống rạp:
          </label>
          <select
            id="selectedHeThongRap"
            name="selectedHeThongRap"
            value={formData.selectedHeThongRap}
            onChange={handleChange}
            disabled={heThongRapState.loading}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border"
          >
            <option value="" disabled>
              {heThongRapState.loading ? "Đang tải..." : "Chọn hệ thống rạp"}
            </option>
            {heThongRapState.data.map((rap) => (
              <option key={rap.maHeThongRap} value={rap.maHeThongRap}>
                {rap.tenHeThongRap}
              </option>
            ))}
          </select>
          {heThongRapState.error && (
            <p className="mt-1 text-xs text-red-500">
              Lỗi tải hệ thống rạp: {heThongRapState.error}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="selectedCumRap"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cụm rạp:
          </label>
          <select
            id="selectedCumRap"
            name="selectedCumRap"
            value={formData.selectedCumRap}
            onChange={handleChange}
            disabled={!formData.selectedHeThongRap || cumRapState.loading}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md shadow-sm border ${
              !formData.selectedHeThongRap || cumRapState.loading
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          >
            <option value="" disabled>
              {cumRapState.loading ? "Đang tải..." : "Chọn cụm rạp"}
            </option>
            {cumRapState.data.map((cum) => (
              <option key={cum.maCumRap} value={cum.maCumRap}>
                {cum.tenCumRap}
              </option>
            ))}
          </select>
          {!formData.selectedHeThongRap && !cumRapState.loading && (
            <p className="mt-1 text-xs text-red-500">
              Vui lòng chọn Hệ thống rạp trước.
            </p>
          )}
          {cumRapState.error && (
            <p className="mt-1 text-xs text-red-500">
              Lỗi tải cụm rạp: {cumRapState.error}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="ngayChieuGioChieu"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ngày giờ chiếu:
          </label>
          <input
            type="datetime-local"
            id="ngayChieuGioChieu"
            name="ngayChieuGioChieu"
            value={formData.ngayChieuGioChieu}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="giaVe"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Giá vé:
          </label>
          <input
            type="number"
            id="giaVe"
            name="giaVe"
            value={formData.giaVe}
            onChange={handleChange}
            min="0"
            required
            placeholder="Nhập giá vé"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border"
          />
        </div>

        <button
          type="submit"
          disabled={createScheduleState.loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createScheduleState.loading ? "Đang tạo..." : "Tạo lịch chiếu"}
        </button>
      </form>
    </div>
  );
};

export default ShowTime;
