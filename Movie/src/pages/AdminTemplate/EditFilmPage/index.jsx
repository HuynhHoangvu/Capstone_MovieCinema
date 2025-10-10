import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { editFilm, fetchFilmDetail } from './slice'; 

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
  maPhim: 0, 
  tenPhim: '',
  trailer: '',
  moTa: '',
  ngayKhoiChieu: '',
  dangChieu: false,
  sapChieu: false,
  hot: false,
  danhGia: 0, 
  maNhom: 'GP01', 
  hinhAnh: null, 
  hinhAnhPreview: null, 
  hinhAnhCu: null, 
};

export default function EditFilm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { maPhim } = useParams(); 
  const { loading, data, filmDetail, detailLoading, detailError } = useSelector(state => state.editFilmReducer);
  
  const [formState, setFormState] = useState(initialFormState);
  const [nameError, setNameError] = useState(''); 
  
  console.log("✅ Form state:", formState);
  
  useEffect(() => {
    if (maPhim) {
      dispatch(fetchFilmDetail(maPhim));
    }
  }, [maPhim, dispatch]);

useEffect(() => {
  if (filmDetail) {
    let ngayKhoiChieuDateInput = '';
    
    if (filmDetail.ngayKhoiChieu) {
      const fullDateString = filmDetail.ngayKhoiChieu;
      
      if (fullDateString.includes('T')) {
        ngayKhoiChieuDateInput = fullDateString.split('T')[0]; 
      } 
      else if (fullDateString.includes('/')) {
        const dateOnlyPart = fullDateString.split(' ')[0]; 
        const [day, month, year] = dateOnlyPart.split('/');
        ngayKhoiChieuDateInput = `${year}-${month}-${day}`;
      }
    }

    setFormState({
      maPhim: filmDetail.maPhim, 
      tenPhim: filmDetail.tenPhim,
      trailer: filmDetail.trailer,
      moTa: filmDetail.moTa,
      ngayKhoiChieu: ngayKhoiChieuDateInput, 
      dangChieu: filmDetail.dangChieu,
      sapChieu: filmDetail.sapChieu,
      hot: filmDetail.hot,
      danhGia: filmDetail.danhGia,
      maNhom: filmDetail.maNhom,
      hinhAnh: null, 
      hinhAnhPreview: filmDetail.hinhAnh,
      hinhAnhCu: filmDetail.hinhAnh, 
    });
  }
}, [filmDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name === 'soSao' ? 'danhGia' : name]: value,
    }));
    if (name === 'tenPhim') {
      setNameError('');
    }
  };

  const handleToggleChange = (name) => {
    setFormState(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formState.hinhAnhPreview && formState.hinhAnh) { // Chỉ revoke nếu preview là từ file đã chọn trước đó
        URL.revokeObjectURL(formState.hinhAnhPreview);
      }
      const previewURL = URL.createObjectURL(file);
      setFormState(prev => ({
        ...prev,
        hinhAnh: file, 
        hinhAnhPreview: previewURL, 
      }));
    } else {
      if (formState.hinhAnhPreview && formState.hinhAnh) {
        URL.revokeObjectURL(formState.hinhAnhPreview);
      }
      setFormState(prev => ({
        ...prev,
        hinhAnh: null,
        hinhAnhPreview: prev.hinhAnhCu, 
      }));
    }
  };

  const checkDuplicateName = (newTenPhim, currentMaPhim) => {
    const mockFilmList = [
      { maPhim: 1, tenPhim: 'Phim A' },
      { maPhim: 2, tenPhim: 'Phim B' },
      { maPhim: 3, tenPhim: 'Phim C' },
      { maPhim: filmDetail.maPhim, tenPhim: filmDetail.tenPhim } 
    ]; 

    return mockFilmList.some(film => 
      film.tenPhim.toLowerCase() === newTenPhim.toLowerCase() && 
      film.maPhim !== currentMaPhim
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra trùng tên
    if (checkDuplicateName(formState.tenPhim, formState.maPhim)) {
      setNameError(`Tên phim "${formState.tenPhim}" đã tồn tại. Vui lòng chọn tên khác.`);
      return;
    }
    setNameError('');

    const formData = new FormData();

    // 1. Định dạng ngày
    const dateInput = formState.ngayKhoiChieu;
    let formattedDate = '';
    if (dateInput){
      const [year, month, day] = dateInput.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }
    
    // 2. Append các trường dữ liệu text
    formData.append("maPhim", formState.maPhim); 
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
    } else if (formState.hinhAnhCu) {
    
      try {
        const response = await fetch(formState.hinhAnhCu);
        const blob = await response.blob();
        const fileName = formState.hinhAnhCu.substring(formState.hinhAnhCu.lastIndexOf('/') + 1) || "oldImage.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        formData.append("File", file);
      } catch (error) {
        console.warn("Không thể tạo File từ ảnh cũ. Có thể ảnh cũ không hợp lệ hoặc CORS:", error);
        
      }
    }

    try {
      await dispatch(editFilm(formData)).unwrap();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert(` Cập nhật phim thất bại: ${err.message || "Lỗi không xác định"}`);
    } 
  };

  useEffect(()=>{
    if (data){
      alert("Cập nhật phim thành công!");
      navigate('/admin/dashboard'); 
    }
    
    return () =>{
      if(formState.hinhAnhPreview && formState.hinhAnh){
        URL.revokeObjectURL(formState.hinhAnhPreview);
      }
    }
  },[data, navigate, formState.hinhAnh, formState.hinhAnhPreview]) 

  if (detailLoading) {
    return <div className="p-8 text-center text-blue-500">Đang tải thông tin phim...</div>;
  }

  if (detailError) {
    return <div className="p-8 text-center text-red-500">Lỗi tải chi tiết phim: {detailError}</div>;
  }
  
  if (!filmDetail) {
    return <div className="p-8 text-center text-gray-500">Đang chờ thông tin phim...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Chỉnh Sửa Phim: {formState.tenPhim || filmDetail.tenPhim}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto"> 
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Tên phim:</label>
          <input
            type="text"
            name="tenPhim"
            value={formState.tenPhim}
            onChange={handleChange}
            className={`w-full border py-2.5 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${nameError ? 'border-red-500' : ''}`}
            required
          />
          {nameError && <p className="text-red-500 text-xs italic mt-1">{nameError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Trailer:</label>
          <input
            type="url"
            name="trailer"
            value={formState.trailer}
            onChange={handleChange}
            className={"w-full py-2.5 pl-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 "}
            placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Mô tả:</label>
          <textarea
            name="moTa"
            rows="4"
            value={formState.moTa}
            onChange={handleChange}
            className={"w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Ngày khởi chiếu:</label>
          <input
            type="date"
            name="ngayKhoiChieu"
            value={formState.ngayKhoiChieu}
            onChange={handleChange}
            className={"w-full border py-2.5 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <ToggleSwitch 
            label="Đang chiếu" 
            checked={formState.dangChieu} 
            onChange={() => handleToggleChange('dangChieu')} 
          />
          <ToggleSwitch 
            label="Sắp chiếu" 
            checked={formState.sapChieu} 
            onChange={() => handleToggleChange('sapChieu')} 
          />
          <ToggleSwitch 
            label="Hot" 
            checked={formState.hot} 
            onChange={() => handleToggleChange('hot')} 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Số sao:</label>
          <input
            type="number"
            name="soSao"
            value={formState.danhGia}
            onChange={handleChange}
            min="0"
            max="10" 
            className={"w-full max-w-xs py-2.5 px-3.5 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">Hình ảnh:</label>
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
            disabled={loading || !!nameError}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out disabled:bg-green-300"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật phim'}
          </button>
        </div>
      </form>
    </div>
  );
}