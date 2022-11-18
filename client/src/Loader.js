import React from 'react';
import loading from './assets/loading.gif';

function Loader() {
  return (
    <div>
        <img src={loading} className='h-30 w-20 my-3 mx-3'/>
    </div>
  )
}

export default Loader