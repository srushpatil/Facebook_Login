import './App.css';
// import Facebook from './components/FacebookLogin/Facebook';
import Phpsignupform from './components/SignUp/Phpsignupform';
import DisplayData from './components/DisplayData/DisplayData'; // Import the component for displaying data
import { Routes, Route } from 'react-router-dom';
import sideImg from './assets/side_img.jpg';

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          {/* Main page where signup form and Facebook login appear */}
          <Route 
            path="/" 
            element={
              <div className="container-fluid h-100">
                <div className="row h-100">
                  {/* Left side with the image */}
                  <div className="col-md-5 d-none d-md-block p-0">
                    <img src={sideImg} alt="sideImg" className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} />
                  </div>
                  
                  {/* Right side with form and Facebook login */}
                  <div className="col-md-7 d-flex align-items-center justify-content-center">
                    <div className="form-wrapper ">
                      <Phpsignupform />
                      {/* <Facebook /> */}
                    </div>
                  </div>
                </div>
              </div>
            } 
          />

          {/* Route for displaying the data */}
          <Route path="/data" element={<DisplayData />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
