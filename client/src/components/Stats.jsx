import React , {useContext} from "react";

import { TransactionContext } from "../context/TransactionContext";


var nmS=0 , nmR=0 , Count=0;
let adr;
//var mst ={};
const NumTransac = ({addressTo, addressFrom})=>{
   const{currentAccount , transactionCount} = useContext(TransactionContext);
var dsp =false;
if(JSON.stringify(currentAccount).toLowerCase()==JSON.stringify(addressFrom).toLowerCase()){
   nmS++;

}
if(JSON.stringify(currentAccount).toLowerCase()==JSON.stringify(addressTo).toLowerCase()){
nmR++; 
}
   Count++;
if(Count/2==transactionCount){
dsp=true;
}
//return dsp;
}
//Number of Transactions sent : {nmS/2}
//Number of Recieved Transaction:{nmR/2}

const NumberOfTransactions =({addressTo, addressFrom},currentAccount,transactionCount)=>{
  
   
}






const Stats =() =>{

    const {currentAccount, formData,Balance,transactions,transactionCount} = useContext(TransactionContext);
    const {addressTo , amount, message,currency }= formData;
    
    
    return (
        <div className="flex w-full justify-center items-center gradient-bg-stats text-white align-middle">
            <div className="flex mf:flex-row flex-col items-start justify-between m:p-20 py-12 px-4 ">
         
      
               <div className="flex flex-1 justify-start flex-col mf:mr-10">
   
        
  
        
            {currentAccount ? 
         
         ( 


      
               <div className="flex flex-1 justify-start flex-col mf:mr-10">
   


            
       <h1 className="text-white text-3xl text-center my-1">STATS</h1> <br></br>
      
      
<h2 className="text-white my-2">
Wallet Address:{currentAccount}<br></br>
Balance: {Balance}ETH  <br></br>
   
   Transaction Summary:<br></br>

{transactions.map((transaction , i)=>(
          NumTransac({...transaction})
         //<NumberOfTransactions key={i} {...transaction}/> 
        ))}
<>Number of Transactions Sent:{nmS/2}</> <br></br>
<>Number of Received Transactions :{nmR/2}</>

</h2>
<br></br>





</div>


   ):(
     
    <h1 className="text-white text-3xl text-center my-2">Please Connect your wallet to see the stats</h1>

   )      




}

   
</div>
</div>  
</div> 


);

}
export default Stats;