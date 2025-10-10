import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFilm } from './slice'; 

export default function DeleteFilmButton({ maPhim, tenPhim, onSuccessfulDelete }) {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.deleteFilmReducer);

    const handleDelete = async () => {
        if (loading) return; 

        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa phim "${tenPhim}" (Mã: ${maPhim}) không?`);
        
        if (isConfirmed) {
            try {
              
                const resultAction =  dispatch(deleteFilm(maPhim)); 
                
                if (deleteFilm.fulfilled.match(resultAction)) {
                    alert(`✅ Xóa phim "${tenPhim}" thành công!`);
                    if(onSuccessfulDelete) {
                        onSuccessfulDelete(maPhim);
                    }
                }
            } catch (error) {
                console.error(" Lỗi xóa phim:", error);
                alert(` Xóa phim thất bại: ${error.message || "Lỗi không xác định"}`);
            }
        }
    };

    return (
        <button 
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 font-medium py-1 px-3 border border-red-600 hover:border-red-900 rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Đang xóa...' : 'Xóa'}
        </button>
    );
}