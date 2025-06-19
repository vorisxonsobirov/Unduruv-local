import React from 'react'
import { Link } from 'react-router-dom';
import "./bar.css"

const Bar = () => {
  return (
    <div className='Bar'>
     <a href=""><Link to="/">  Profile</Link>  </a> 
     <a href=""><Link to="/Map"> Map </Link> </a>
     {/* <a href=""><Link to="/KursValyut"> Kurs valyut </Link> </a>
     <a href=""><Link to="/Xabarlar"> Xabarlar</Link> </a>
     <a href=""><Link to="/Tulovlar"> Tulovlar </Link> </a>
     <a href=""><Link to="/Kontragentlar"> Kontragentlar </Link> </a> */}
      
      
      
    </div>
  )
}

export default Bar
