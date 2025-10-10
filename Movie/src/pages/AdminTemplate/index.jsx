import { Outlet, Navigate } from "react-router-dom"
import Navbar from "./_components/Navbar"
import {useSelector} from "react-redux"
export default function AdminTemplate() {
  const data = useSelector((state)=>state.authReducer.data);

  if(!data) {
    return <Navigate to="/auth"/>
  }
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}
