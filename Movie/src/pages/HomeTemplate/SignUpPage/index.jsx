import {useState} from "react"
import {useDispatch,useSelector} from "react-redux"
import { signUp } from "./slice";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(null); 
  const [user, setUser] = useState({
  taiKhoan: "",
  matKhau: "",
  email: "",
  soDt: "",
  maNhom: "GP01",
  hoTen: ""
});
const handleOnChange = (e) =>{
  const {name, value} = e.target;
  setUser({
    ...user,
    [name]:value,
  })
}
const handleLoginClick = () => {
  navigate('/login')
}
const handleSubmit = async (e) =>{
  e.preventDefault();
      setSuccessMessage(null)
      try {
      await dispatch(signUp(user)).unwrap(); 
      setSuccessMessage("Tạo tài khoản thành công! Bạn sẽ được chuyển đến trang Đăng nhập.");
      
      setTimeout(() => {
        navigate("/login"); 
      }, 3000); 

    } catch (error) {
      alert.error("Đăng ký thất bại:", error);
       setSuccessMessage("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    }
}
  return (
    <div  className="mt-20 mb-20">
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto"  >
         {successMessage && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${
            successMessage.includes("thành công") 
              ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
              : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400"
          }`} role="alert">
            <span className="font-medium">{successMessage.includes("thành công") ? "Thành công!" : "Lỗi!"}</span> {successMessage}
          </div>
        )}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Tài khoản
          </label>
          <input
          onChange={handleOnChange}
            name="taiKhoan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
          onChange={handleOnChange}

            type="password"
            name="matKhau"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
          onChange={handleOnChange}

            name="email"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Số điện thoại
          </label>
          <input
          onChange={handleOnChange}

            name="soDt"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
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
          />
        </div>
        <div className="flex  justify-between space-x-4 mb-5"> 
            <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
            >
                Submit
            </button>
            <button
                type="button"
                onClick={handleLoginClick}
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"> 
                Login
            </button>
        </div>
      </form>
    </div>
  );
}
