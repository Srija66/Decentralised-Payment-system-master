import {Welcome ,Transactions,Stats} from "./components";
const App = ()=> {
 

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
     
      <Welcome/>
      </div>    
      <Transactions/>
      <Stats/>  
    </div>
  )
}

export default App
