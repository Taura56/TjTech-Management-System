
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from"./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Report from "./pages/Report";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Services from "./pages/Services";
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" 
      element={<Dashboard/>}/>

      <Route path="/products"
      element={<Products/>}/>

      <Route path = "/customers"
      element={<Customers/>}/>

      <Route path ="/reports"
      element ={<Report/>}/>

     < Route path="/sales"
      element = {<Sales/>}/>

      <Route path="/payments"
      element = {<Payments/>}/>

      <Route path="/services"
      element = {<Services/>}/>
    </Routes>
    </BrowserRouter>
    )
}
export default App;