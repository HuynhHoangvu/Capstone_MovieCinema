import { useDispatch, useSelector } from 'react-redux';
import { deleteFilm } from './slice'; 

export default function DeleteFilmButton({ maPhim, tenPhim, onSuccessfulDelete }) {
    const dispatch = useDispatch(); 
    const { loading } = useSelector(state => state.deleteFilmReducer);

    const handleDelete = async () => {
        if (loading) return; 

        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa phim "${tenPhim}"`);
        
        if (isConfirmed) {
            try {
                await dispatch(deleteFilm(maPhim)).unwrap(); 
                
                alert(`Xóa phim "${tenPhim}" thành công!`);
                
                if(onSuccessfulDelete) {
                    onSuccessfulDelete();
                }
            } catch (error) {
                const errorMessage = error.message || JSON.stringify(error) || "Lỗi không xác định";
                alert(`Xóa phim thất bại: ${errorMessage}`);
            }
        }
    };

    return (
        <button 
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 font-medium py-1 px-3  rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} 
        >
                <i className="fas fa-trash-alt"></i>       
        </button>
    );
}