import"../css/navbar.css";
function Navbar({title}){
    return(
        <nav className="navbar">
             <h2>{title}</h2>
             <div className="profile">
                <span>🔔</span> 
                <span>Admin</span>
             </div>
                
        
        </nav>
    );
}
export default Navbar;