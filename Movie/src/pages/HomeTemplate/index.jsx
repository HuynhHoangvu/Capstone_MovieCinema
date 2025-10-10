import { Outlet } from "react-router-dom"
import Navbar from "./_components/Navbar"
import Footer from "./_components/Footer"
export default function HomeTemplate() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
