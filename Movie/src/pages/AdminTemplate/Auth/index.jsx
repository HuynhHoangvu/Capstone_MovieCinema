import {useState, useEffect} from "react";
import {authLogin} from "./slice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function Auth() {
    const error = useSelector((state) => state.authReducer.error);
    const data = useSelector((state) => state.authReducer.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [user, setUser] = useState({
        taiKhoan: "",
        matKhau: "",
    });

    useEffect(() => {
        if (data) {
            navigate("/admin/dashboard");
        }
    }, [data, navigate]);

    const handleOnChange = (e) => {
        const {value, name} = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(authLogin(user));
    };

    const getErrorMessage = (error) => {
        if (error?.response?.data?.content) {
            return error.response.data.content;
        }
        if (error?.message) {
            return error.message;
        }
        return "Không có quyền truy cập";
    };

    return (
        <>
            {error && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    {getErrorMessage(error)}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tài khoản</label>
                    <input 
                        onChange={handleOnChange}
                        name="taiKhoan"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input 
                        onChange={handleOnChange}
                        type="password"
                        name="matKhau" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                    />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
            </form>
        </>
    );
}