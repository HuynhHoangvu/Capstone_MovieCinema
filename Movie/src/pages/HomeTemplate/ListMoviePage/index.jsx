import Movie from "./movie";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "./slice";
import Loader from "../../../components/Loader";
export default function ListMoviePage() {
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const state = useSelector((state) => state.listMovieReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  const renderListMovie = () => {
    const { data } = state;

    if (!data) return null;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    // Render danh sách phim đã lọc
    const currentMovies = data.slice(startIndex, endIndex);

    return currentMovies.map((item) => {
      return <Movie key={item.maPhim} data={item} />;
    });
  };
  // Tính toán số lượng trang

  const totalPages = state.data
    ? Math.ceil(state.data.length / ITEMS_PER_PAGE)
    : 0;
  // Tạo mảng các nút trang
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Hàm xử lý khi click vào nút trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (state.loading) return <Loader />;
  if (state.error)
    return (
      <div className="text-red-500 text-center p-4">
        Đã xảy ra lỗi khi tải dữ liệu.
      </div>
    );

  if (state.loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 mt-20">
      <h2 className="text-4xl font-extrabold text-center text-orange-400 dark:text-blue-400 mb-8 border-b-4 border-orange-400/50 pb-2">
        Danh Sách Phim Đang Chiếu
      </h2>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {renderListMovie()}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-4 cursor-pointer py-2 text-sm font-medium border rounded-lg transition duration-200
        ${
          currentPage === number
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
