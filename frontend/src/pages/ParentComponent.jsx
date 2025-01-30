import React, { useRef, useState } from 'react'
import ChildComponents from './ChildComponents';

function ParentComponent() {
    const [name,setName] = useState('');
   function handleData(data){
    setName(data);
   }
  return (
    <div>
    <ChildComponents handleData ={handleData}/>
    </div>
  )
}

export default ParentComponent

