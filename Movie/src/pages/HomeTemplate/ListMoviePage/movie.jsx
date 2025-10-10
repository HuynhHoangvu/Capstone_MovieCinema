import { Link } from "react-router-dom";
export default function Movie(props) {
  const { data } = props;
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
      <a href="#" className="block relative overflow-hidden rounded-t-lg">
        <Link to={`/detail/${data.maPhim}`}>
          <div className="pt-[150%] relative">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
              src={data.hinhAnh}
              alt={data.tenPhim}
            />
          </div>
        </Link>
      </a>

      <div className="p-5 flex flex-col flex-grow">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
            {data.tenPhim}
          </h5>
        </a>
      </div>
    </div>
  );
}
