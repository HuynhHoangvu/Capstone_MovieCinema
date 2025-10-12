import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from './slice'; // Thay đổi đường dẫn import cho phù hợp
import { useNavigate } from 'react-router-dom';
import { deleteFilm } from '../DeleteFilm/slice';

export default function DashBoard() {
    // tạo navigate
    const navigate = useNavigate();
    // 1. Lấy dữ liệu từ Redux store
    const { data: movies, loading, error } = useSelector((state) => state.movieReducer); 
    const [deletingMaPhim, setDeletingMaPhim] = useState(null);
    const { loading: deleteLoading } = useSelector((state) => state.deleteFilmReducer); 

    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
const fetchMovies = () => {
        dispatch(fetchDashboard());
    };
    // 2. Gọi API khi component được mount
    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (maPhim) =>{
        navigate(`edit-film/${maPhim}`)
    }
  const handleShowTime = (maPhim) =>{
        navigate(`show-time/${maPhim}`)
    }
    if (loading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
                <p className="text-xl text-blue-500">Đang tải dữ liệu phim...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-semibold text-red-600 mb-6">Lỗi tải dữ liệu</h1>
                <p className="text-red-500">Đã xảy ra lỗi: {error.message || error}</p>
            </div>
        );
    }
    
    const filteredMovies = movies.filter(movie =>
        movie.tenPhim.toLowerCase().includes(searchTerm.toLowerCase())
    );

const handleDeleteFilm = async (maPhim, tenPhim) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa phim "${tenPhim}" (Mã: ${maPhim}) không?`);
    if (isConfirmed) {
        setDeletingMaPhim(maPhim);
        try {
            await dispatch(deleteFilm(maPhim)).unwrap(); 
            
            alert(`Xóa phim "${tenPhim}" thành công!`);
            fetchMovies(); 
        } catch (error) {
            const errorMessage = error.message || "Lỗi không xác định khi xóa phim";
            alert(`Xóa phim thất bại: ${errorMessage}`);
        } finally {
            setDeletingMaPhim(null);
        }
    }
}
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Quản Lý Phim</h1>

            <div className="mb-6">
                <button
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
                    onClick={() => navigate(`/admin/add-film`)}
                >
                    <i className="fas fa-plus mr-2"></i> 
                    Thêm phim
                </button>
            </div>

            <div className="mb-6 max-w-lg relative">
                <input
                    type="text"
                    placeholder="Input search text (Tìm theo Tên Phim)"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
                <button 
                    className="absolute inset-y-0 right-0 px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    onClick={() => console.log("Thực hiện tìm kiếm")}
                >
                    <i className="fas fa-search"></i>
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã phim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMovies.map((movie) => (
                            <tr key={movie.maPhim} className="hover:bg-gray-100 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {movie.maPhim}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img 
                                        src={movie.hinhAnh} 
                                        alt={movie.tenPhim} 
                                        className="h-12 w-12 object-cover rounded" 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://via.placeholder.com/50";
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {movie.tenPhim}
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
                                    {movie.moTa || "Không có mô tả"} 
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                            onClick={() => handleEdit(movie.maPhim)}
                                        >
                                            <i className="fas fa-pencil-alt"></i> 
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                            onClick={() => handleDeleteFilm(movie.maPhim, movie.tenPhim)}
                                        >
                                             {deletingMaPhim === movie.maPhim ? 
                                                <i className="fas fa-spinner fa-spin"></i> : 
                                                <i className="fas fa-trash-alt"></i> 
                                            }
                                        </button>
                                         <button 
                                            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100"
                                            onClick={() => handleShowTime(movie.maPhim)}
                                        >
                                            <i className="fas fa-calendar-alt"></i> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}