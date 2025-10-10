import {BrowserRouter,  Routes} from "react-router-dom"
import { renderRoutes } from "./routes"
function App() {
  return (
   <BrowserRouter>
   {/* Home Template */}
    <Routes>{renderRoutes()}</Routes>
   </BrowserRouter>
  )
}

export default App;
