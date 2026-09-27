import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../css/layout.css";
function Layout({children,title}){
    return(
            <div className="layout ">
               
                   < Sidebar/>
                
                <div className="main">
                  
                    <Navbar title={title}/>
                    <div className="content">
                        {children}
                    </div>  
                </div>
            </div>
        

    
    );
}
export default Layout;