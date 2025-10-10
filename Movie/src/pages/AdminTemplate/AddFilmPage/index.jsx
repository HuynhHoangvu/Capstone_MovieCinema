import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFilm, resetAddFilmState } from "./slice";
import { useNavigate } from "react-router-dom";

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-3 mb-4">
    <span className="text-gray-700 w-24 text-sm">{label}:</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const initialFormState = {
  tenPhim: "",
  trailer: "",
  moTa: "",
  ngayKhoiChieu: "",
  dangChieu: false,
  sapChieu: false,
  hot: false,
  danhGia: 0,
  maNhom: "GP01",
  hinhAnh: null,
  hinhAnhPreview: null,
};

export default function AddFilm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, data, error } = useSelector((state) => state.addFilmReducer);
  const [formState, setFormState] = useState({
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: false,
    sapChieu: false,
    hot: false,
    danhGia: 0,
    maNhom: "GP01",
    hinhAnh: null,
    hinhAnhPreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name === "soSao" ? "danhGia" : name]: value,
    });
  };

  const handleToggleChange = (name) => {
    setFormState({
      ...formState,
      [name]: !formState[name],
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormState({
        ...formState,
        hinhAnh: file,
        hinhAnhPreview: previewURL,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const dateInput = formState.ngayKhoiChieu;
    let formattedDate = "";
    if (dateInput) {
      const [year, month, day] = dateInput.split("-");

      formattedDate = `${day}/${month}/${year}`;
    }

    formData.append("tenPhim", formState.tenPhim);
    formData.append("trailer", formState.trailer);
    formData.append("moTa", formState.moTa);
    formData.append("maNhom", formState.maNhom);
    formData.append("ngayKhoiChieu", formattedDate);
    formData.append("danhGia", formState.danhGia);
    formData.append("dangChieu", formState.dangChieu);
    formData.append("sapChieu", formState.sapChieu);
    formData.append("hot", formState.hot);
    if (formState.hinhAnh) {
      formData.append("File", formState.hinhAnh, formState.hinhAnh.name);
    } else {
      alert("Vui long chon hinh anh");
      return;
    }

    dispatch(addFilm(formData));
  };
  useEffect(() => {
    if (error) {
      alert(
        `Thêm phim thất bại: ${
          error.data || error.message || "Lỗi không xác định"
        }`
      );
    }
    if (data) {
      alert("Thêm phim thành công!");
      setFormState(initialFormState);
      dispatch(resetAddFilmState());
      navigate("/admin/dashboard");

    }
    return () => {
      if (formState.hinhAnhPreview) {
        URL.revokeObjectURL(formState.hinhAnhPreview);
      }
    };
  }, [data, error, dispatch]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Thêm mới phim
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Tên phim:
          </label>
          <input
            type="text"
            name="tenPhim"
            value={formState.tenPhim}
            onChange={handleChange}
            className={
              "w-full border py-2.5 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Trailer:
          </label>
          <input
            type="url"
            name="trailer"
            value={formState.trailer}
            onChange={handleChange}
            className={
              "w-full py-2.5 pl-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 "
            }
            placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Mô tả:
          </label>
          <textarea
            name="moTa"
            rows="4"
            value={formState.moTa}
            onChange={handleChange}
            className={
              "w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            }
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Ngày khởi chiếu:
          </label>
          <input
            type="date"
            name="ngayKhoiChieu"
            value={formState.ngayKhoiChieu}
            onChange={handleChange}
            className={
              "w-full border py-2.5 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            }
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <ToggleSwitch
            label="Đang chiếu"
            checked={formState.dangChieu}
            onChange={() => handleToggleChange("dangChieu")}
          />
          <ToggleSwitch
            label="Sắp chiếu"
            checked={formState.sapChieu}
            onChange={() => handleToggleChange("sapChieu")}
          />
          <ToggleSwitch
            label="Hot"
            checked={formState.hot}
            onChange={() => handleToggleChange("hot")}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Số sao:
          </label>
          <input
            type="number"
            name="soSao"
            value={formState.danhGia}
            onChange={handleChange}
            min="0"
            max="10"
            className={
              "w-full max-w-xs py-2.5 px-3.5 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            }
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Hình ảnh:
          </label>
          <input
            type="file"
            name="hinhAnh"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formState.hinhAnhPreview && (
            <div className="mt-3">
              <img
                src={formState.hinhAnhPreview}
                alt="Hình ảnh phim"
                className="w-32 h-38 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            Thêm phim
          </button>
        </div>
      </form>
    </div>
  );
}
