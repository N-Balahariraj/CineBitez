import "./App.css";
import {Outlet} from 'react-router-dom'
import SidePane from "./Components/SidePane";


function App() {

  return (
    <>
    <div className="flex">
      <SidePane/>
      <Outlet/>
    </div>
    </>
  );
}

export default App;
