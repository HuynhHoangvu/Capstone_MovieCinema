import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "./slice";
import { useNavigate } from "react-router-dom";
export default function ManageUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, data, error } = useSelector(
    (state) => state.manageUserSlice
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const handleAdd = () => {
    navigate("/admin/add-user");
  };
  const filteredUsers = data.filter(
    (user) =>
      user.taiKhoan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.soDT && user.soDT.includes(searchTerm))
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (taiKhoan) => {
    alert(`Sửa tài khoản: ${taiKhoan}`);
  };

  const handleDelete = (taiKhoan) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${taiKhoan}?`)) {
      alert(`Đã xóa tài khoản (giả lập): ${taiKhoan}`);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-xl text-indigo-600">
        Đang tải danh sách người dùng...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-xl text-red-600">
        Lỗi tải dữ liệu: {error}
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Quản Lý Người Dùng
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm Tài khoản, Họ tên, SĐT..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-3 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md w-full md:w-auto"
          onClick={handleAdd}
        >
          + Thêm Người Dùng
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Số ĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại User
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.taiKhoan} className="hover:bg-indigo-50/50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.taiKhoan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.hoTen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {user.soDT}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 rounded-full 
                                            ${
                                              user.maLoaiNguoiDung === "QuanTri"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                    >
                      {user.maLoaiNguoiDung === "QuanTri"
                        ? "Quản Trị"
                        : "Khách Hàng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(user.taiKhoan)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 p-2 rounded-lg transition duration-150"
                      title="Sửa thông tin"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.taiKhoan)}
                      className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-lg transition duration-150"
                      title="Xóa người dùng"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy kết quả phù hợp."
                    : "Danh sách người dùng trống."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const renderPageButton = (page) => {
    if (page === "...") {
      return (
        <span
          key={page}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        aria-current={page === currentPage ? "page" : undefined}
        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ${
          page === currentPage
            ? "z-10 bg-indigo-600 border-indigo-500 text-white"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    );
  };

  return (
    <nav
      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        prev
      </button>

      {startPage > 1 && renderPageButton(1)}
      {startPage > 2 && renderPageButton("...")}

      {pageNumbers.map(renderPageButton)}

      {endPage < totalPages - 1 && renderPageButton("...")}
      {endPage < totalPages && renderPageButton(totalPages)}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        next
      </button>
    </nav>
  );
};
