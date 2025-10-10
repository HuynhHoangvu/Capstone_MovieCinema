import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./slice";
export default function UpdateProfile() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.userReducer.data);

  const { loading, error } = useSelector((state) => state.updateReducer);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "", 
    maLoaiNguoiDung: "", 
    hoTen: "",
  });
  useEffect(() => {
    if (currentUser) {
      setFormData({
        taiKhoan: currentUser.taiKhoan || "",
        matKhau: "",
        email: currentUser.email || "",
        soDt: currentUser.soDT || "", 
        maNhom: currentUser.maNhom || "GP01",
        maLoaiNguoiDung: currentUser.maLoaiNguoiDung || "KhachHang",
        hoTen: currentUser.hoTen || "",
      });
    } else {
      setFormData({
        taiKhoan: "",
        matKhau: "",
        email: "",
        soDt: "",
        maNhom: "",
        maLoaiNguoiDung: "",
        hoTen: "",
      });
    }
  }, [currentUser]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const submissionData = { ...formData };

    if (!submissionData.matKhau) {
      delete submissionData.matKhau;
    }

    dispatch(updateUser(submissionData))
      .unwrap()
      .then(() => {
        alert("Cập nhật thông tin thành công!");
      })
      .catch((err) => {
        // Lỗi đã được xử lý trong slice và lưu vào state `error`
        // `unwrap()` sẽ throw lỗi ở đây để ta có thể bắt
        console.error("Lỗi khi cập nhật: ", err);
      });
  };

  return (
    <div className="p-8 mt-20">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Cột bên trái */}
          <div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                id="email"
                name="email" // Thêm name để handler hoạt động
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name@company.com"
                value={formData.email} // Gán value từ state
                onChange={handleChange} // Gán handler
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="hoTen"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Họ tên
              </label>
              <input
                type="text"
                id="hoTen"
                name="hoTen" // Thêm name
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Họ và tên"
                value={formData.hoTen} // Gán value
                onChange={handleChange} // Gán handler
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="soDt"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="soDt"
                name="soDt" // Thêm name
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="0123 456 789"
                value={formData.soDt} // Gán value
                onChange={handleChange} // Gán handler
              />
            </div>
          </div>

          {/* Cột bên phải */}
          <div>
            <div>
              <label
                htmlFor="taiKhoan"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tài khoản
              </label>
              <input
                type="text"
                id="taiKhoan"
                name="taiKhoan" // Thêm name
                className="bg-gray-200 border border-gray-300 text-gray-500 sm:text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                placeholder="Tên tài khoản"
                value={formData.taiKhoan} // Gán value
                disabled // Không cho phép sửa
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="matKhau"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Mật khẩu mới (bỏ trống nếu không đổi)
              </label>
              <input
                type="password"
                id="matKhau"
                name="matKhau" // Thêm name
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="••••••••"
                value={formData.matKhau} // Gán value
                onChange={handleChange} // Gán handler
              />
            </div>
          </div>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg">
            <p>
              <strong>Lỗi:</strong>{" "}
              {typeof error === "string" ? error : error.content}
            </p>
          </div>
        )}

        {/* Nút Cập Nhật */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={loading} // Vô hiệu hóa nút khi đang loading
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}
