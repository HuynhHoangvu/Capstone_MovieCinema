import {Link} from "react-router-dom"
export default function Movie(props) {
 const {data} = props;
 return (

    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
    <a href="#" className="block relative overflow-hidden rounded-t-lg">

          <div className="pt-[150%] relative"> 
              <img 
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg" 
                  src={data.hinhAnh} 
                  alt={data.tenPhim} 
              />
          </div>
    </a>

    <div className="p-5 flex flex-col flex-grow">
     <a href="#">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">{data.tenPhim}</h5>
     </a>
     <Link 
            to={`/detail/${data.maPhim}`} 
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-auto"
        >
    Detail
    </Link>
    </div>
   </div>
 )
}