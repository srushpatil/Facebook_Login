import './App.css';
import Facebook from './components/Facebook';
import Phpsignupform from './components/Phpsignupform';
import DisplayData from './components/DisplayData'; // Import the component for displaying data
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Main page where signup form and Facebook login appear */}
        <Route 
          path="/home" 
          element={
            <div className="container-wrapper">
              <div className="flex-container">
                <div className="flex-item">
                  <Phpsignupform className="form" />
                </div>

                <div className="vertical-line"></div>
                <div className="circle">OR</div>

                <div className="flex-item">
                  <Facebook />
                </div>
              </div>
            </div>
          } 
        />

        {/* Route for displaying the data */}
        <Route path="/data" element={<DisplayData />} />
      </Routes>
    </div>
  );
}

export default App;
