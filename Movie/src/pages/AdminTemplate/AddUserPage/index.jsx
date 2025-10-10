import { useState } from "react"
import { useDispatch, useSelector } from "react-redux" 
import { addUser } from "./slice";
import { useNavigate } from "react-router-dom";

export default function AddUserPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.addReducer);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    maLoaiNguoiDung: "KhachHang",
    hoTen: ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    })
  }
const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(""); 

    dispatch(addUser(user))
      .finally(() => {
        setTimeout(() => {
          setSuccessMessage("Thêm người dùng mới thành công!");
          
          setTimeout(() => {
            setSuccessMessage(""); 
            navigate("/admin/manage-user"); 
          }, 2000);
          setUser({
            taiKhoan: "",
            matKhau: "",
            email: "",
            soDt: "",
            maNhom: "GP01",
            maLoaiNguoiDung: "KhachHang",
            hoTen: "",
          });
        }, 1000); 
      });
  };
 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Thêm Người Dùng Mới</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tài khoản
          </label>
          <input
            onChange={handleOnChange}
            name="taiKhoan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={user.taiKhoan}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mật khẩu
          </label>
          <input
            onChange={handleOnChange}
            type="password"
            name="matKhau"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={user.matKhau}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            onChange={handleOnChange}
            name="email"
           
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={user.email}
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Số điện thoại
          </label>
          <input
            onChange={handleOnChange}
            name="soDt"
            type="tel" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={user.soDt}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="maLoaiNguoiDung" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chọn loại người dùng
          </label>
          <select
            id="maLoaiNguoiDung"
            name="maLoaiNguoiDung"
            onChange={handleOnChange}
            value={user.maLoaiNguoiDung}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="KhachHang">Khách Hàng</option>
            <option value="QuanTri">Quản Trị</option>
          </select>
        </div>


        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Họ tên
          </label>
          <input
            onChange={handleOnChange}
            name="hoTen"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            value={user.hoTen}
          />
        </div>
        <button
          type="submit"
          disabled={loading} 
          className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-opacity ${loading
            ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed'
            : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            }`}
        >
          {loading ? 'Đang Xử Lý...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}