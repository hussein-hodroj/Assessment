import { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppPage from './pages/AppPage' 

function App() {
  const [count, setCount] = useState('');

  return (
    <div>
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<AppPage />}></Route>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
