import React, { useState } from 'react'

const KKKKK = () => {
  const [user, setUser]= useState(null);
  
  const clickBtn = async ()=>{
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data =  await res.json();
      setUser(data);
      alert(data.name + ' ' + data.email + ' ' + data.phone);
    } catch (error) {
      console.log("error: " + error);
    }
  }
  return (
    <div className='KKKKK'>
      <button onClick={clickBtn}>click</button>
    </div>
  )
}

export default KKKKK
