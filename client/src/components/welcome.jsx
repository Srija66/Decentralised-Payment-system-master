
import React , {useContext , useState} from "react";

import { AiFillMacCommand, AiFillMessage, AiFillMoneyCollect, AiOutlineNumber } from "react-icons/ai";
import { SiContactlesspayment, SiEthereum, SiHandshakeProtocol } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import Recaptcha from "react-recaptcha";
import { TransactionContext } from "../context/TransactionContext";
import {Loader } from '.'; // loading animation




const Input = ({placeholder,name , type,value , handleChange})=>(
  <input placeholder={placeholder} 
  type={type}
  step="0.01"
  value={value}
  onChange={(e)=>handleChange(e, name)}
  className="my-3 w-full rounded-m p-2 bg-transparent text-yellow border-none text-sm white-glassmorphism"/>
  
);





const welcome =() =>{
const {connectWallet,currentAccount, formData ,sendTransaction ,handleChange ,isLoading,GetBalance ,Balance,refreshPage} = useContext(TransactionContext);
const [payLock ,setPayLock] = useState(true);

var callback = function () {
  console.log('Done!!!!');
};
var verifyCallback = function (response) {
  if(response){
    setPayLock(false);
  }
};


    const handleSubmit = (e)=>{
 const {addressTo , amount , message }= formData;
 //the below line is for preventing the page from reloading upon form submission
 e.preventDefault;
 if(!addressTo || !amount || !message)return;
 
if(!payLock){
  sendTransaction();
}else{
  alert("complete the captcha to complete the payment")
}

    }
    return (
       <div className="flex w-full justify-center items-center">
           <div className="flex mf:flex-row flex-col items-start justify-between m:p-20 py-12 px-4 ">
            <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white justify-left" style={{fontFamily: 'monospace'}}> Secure Software Framework For Financial Transactions<br/>
            </h1>       

          </div>

<div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">



{!currentAccount ?

(<button type="button" onClick={connectWallet} className="flex flex-row justify-center itmes-center my-5 bg-[#cc0000] p-3 rounded-full cursor-pointer hover:bg-[#99ff33]">
  
  Connect Wallet
  
  </button>)
  
  :(

    <>
    <div className="p-4 justify-end items-start flex-col rounded-xl h-80 sm:w-72 w-full my-6 eth-card white-glassmorphism ">
<div className="flex justify-between flex-col w-full h-full">

  <div className="flex justify-between items-start">
    <div className="w-20 h-10 border-white flex justify-center items-center">
    
      <SiContactlesspayment fontSize={67} color="white"/>
    </div>
    <BsInfoCircle fontSize={25} color="white"/>
  </div>
  <div className="w-100 h-20 flex justify-center items-center">

  <SiEthereum fontSize={107} color="white"/>
  
  </div>
  

  <div>
  <p className="text-white text-sm justify-start">
    Account Address:<br></br>{currentAccount.substring(0,32)+'...'}
    </p>
    
  </div>
</div>
</div>

    <button type="button" onClick={GetBalance} className="flex flex-row justify-center itmes-center my-5 bg-[#1aff1a] p-3 rounded-full cursor-pointer hover:bg-[#1ac6ff]">Check Balance</button>    
<p className="text-white border-2 rounded  text-sm mt-1">Balance : {Balance} ETH</p>

<br>
</br>
<div className="p-5 sm:w-96 w-full text-white flex flex-col justify-start items-center">
<SiHandshakeProtocol></SiHandshakeProtocol>Receiver's Address<Input placeholder="Account Address(0x..)" name="addressTo" type="text" handleChange={handleChange}/>
<AiFillMoneyCollect></AiFillMoneyCollect><Input placeholder="Currency in the form(INR,USD,EUR..)" name="currency" type="text" handleChange={handleChange}/>
<AiFillMacCommand></AiFillMacCommand>

<AiOutlineNumber></AiOutlineNumber> Amount<Input placeholder="Amount in numbers only" name="amount" type="number" handleChange={handleChange}/>
<AiFillMessage></AiFillMessage>Message<Input placeholder="Message" name="message" type="text" handleChange={handleChange}/>



<div className="h-[1px] w-full bg-gray-400 my-2"/>

{isLoading ? (

<Loader/>



) :(
  <button type="button" onClick={handleSubmit} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#1dc91d] rounded-full cursor-pointer">
pay
  </button>
  
  
)}




{
<button type="button" onClick={refreshPage} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#ffff66] rounded-full cursor-pointer" >
  Refresh page
</button>
}


<br></br>

<Recaptcha
    sitekey="6Leb_IofAAAAABAhs5hp-yWXW61KKFiKtBMzQ3jd"
    render="explicit"
    verifyCallback={verifyCallback}
    onloadCallback={callback}
    type='image'
    theme="dark"
  />
<br></br>

</div>

</>


  )
}

<br></br>





</div>

           </div>

       </div>
    );

}
export default welcome;