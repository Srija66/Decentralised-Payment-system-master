//TransactionContext is an React API that is responsible for interaction between 
//React , smart contracts and the blockchain 


import React , {useEffect, useState } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import axios from 'axios';

export const TransactionContext = React.createContext();

const { ethereum } = window;//metamask injects into window.ethereum in every page , this line will be helpful in detecting its presence




const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner(); //<-- this is needed to write onto the blockchain
    const transactionContract = new ethers.Contract(contractAddress , contractABI , signer);
    return transactionContract;
    //console.log( {provider , signer , transactionContract});
}

//TransactionProvider is a jsx element that allows other parts of the app to access the values in it 

export const TransactionProvider = ( {children} )=>{
    const [ currentAccount , setCurrentAccount] = useState('');
    const [ formData , setFormData] = useState({addressTo:'' , amount :'' , message:'', currency:''});
    const [isLoading ,setIsLoading] = useState(false);
    const [transactionCount ,setTransactionCount] = useState(localStorage.getItem('transactionCount')); // starts off from the count of previous web session
    const [transactions, setTransactions] = useState([]);
    const [Balance, setBalance] = useState(localStorage.getItem('GetBalance'));
//const [infoLock ,setInfoLock] = useState(true);

    //when you are updating a new state with an old state , you have to provide  callback function
    // we are updating form data here and ...prevState is used so that only the variable we intend to change in the json object changes and 
    // other parameters remain same.
const handleChange = (e , name)=>{
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
}



const refreshPage = async()=>{
    window.location.reload(false);
  }

  

const getAllTransactions = async() =>{
    try {
        if(!ethereum) return alert("Please Install Metamask")
        const transactionContract = getEthereumContract();
        const availableTransactions = await transactionContract.getAllTransactions()
        //console.log(availableTransaction)
        const structuredTransactions = availableTransactions.map((transaction)=>({
            addressTo: transaction.receiver ,
            addressFrom: transaction.sender , 
            timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            message:transaction.message,
            amount:parseInt(transaction.amount._hex)/(10**18) //amount is in hexadecimal gwei , to get it into hexadecimal eth
            //we need to divide it with 10^18 

        }))
        //console.log(structuredTransactions)
setTransactions(structuredTransactions);
    } catch (error) {
        console.log(error);
    }

}
//The keyword await before a function makes the function wait for a promise:
    const checkIfWalletIsConnected = async () =>{
      try{  if(!ethereum) return alert("Please Install metamask");
        const accounts = await ethereum.request({method:'eth_accounts'});
        console.log(accounts);
        
    if(accounts.length){
        setCurrentAccount(accounts[0]);
        getAllTransactions()
        
        
    }
 
    else
    {
        console.log('NO ACCOUNTS FOUND');
        
    } 
}catch (error) {
        console.log(error)
        throw new Error("NO ETHEREUM OBJECT!!!")
    }
   
    };


const checkIfTransactionsExist = async() =>{
    try {
        const transactionContract = getEthereumContract();
        const transactionCount = await transactionContract.getTransactionCount();
        window.localStorage.setItem("transactionCount" , transactionCount );
        //LocalStorage is a read-only method of window interface that allows us to store data across browser sessions
    } catch (error) {
        console.log(error)
        throw new Error("NO ETHEREUM OBJECT")
    }
}




//function to connect wallet
    const connectWallet = async()=>{
        try {if(!ethereum) return alert("Please Install metamask");
        const accounts = await ethereum.request({method:'eth_requestAccounts'});
        setCurrentAccount(accounts[0]);
        await GetBalance();
        await getAllTransactions();
        //console.log(ethereum.getBalance(currentAccount));
    } catch (error) {
            console.log(error)
            throw new Error("NO ETHEREUM OBJECT")
        }
      
    };

    const GetBalance = async() =>{
        try{
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(currentAccount); 
        const balanceinether = ethers.utils.formatEther(balance);
        
        //console.log(balance); 
       // console.log(balanceinether);  
        setBalance(balanceinether);
        window.localStorage.setItem("GetBalance" , balanceinether );
        }catch(error){
            console.log(error);
        }
    
    }

let getConversionvalue = async(currency)=>{
   let conv;
    try{
        const response =axios.get('https://min-api.cryptocompare.com/data/price?fsym='+currency+'&tsyms=ETH')
        console.log((await response).data);
        const adjamt= (await response).data;
        conv=adjamt['ETH']
        console.log(conv)
          }catch(error1){
              console.log(error1)
          }
          return conv;
}


//sending and storing transactions
    const sendTransaction = async ()=>{
try {
    if(!ethereum) return alert("Please Install metamask");
    //get data from the form
    const {addressTo , amount, message,currency}= formData;
    const transactionContract  = getEthereumContract();

   let conv =await getConversionvalue(currency.toUpperCase());
  const amt = Number(amount)*conv;
  const reval = amt.toString();
  //console.log(reval , amt , typeof amount)
    const parsedAmount = ethers.utils.parseEther(reval);
    await ethereum.request({
        method :'eth_sendTransaction',
        params:[{
            from : currentAccount,
        to :addressTo,
        gas:'0x5208' , // 21000Gwei - 0.000021 ether
        value:parsedAmount._hex
        }

        ]

    });
    
    const transactionHash = await transactionContract.addToBlockchain(addressTo , parsedAmount , message);
    setIsLoading(true);
    console.log(`Loading - ${transactionHash.hash}`); 
    await transactionHash.wait();
    setIsLoading(false);
    console.log(`Successful - ${transactionHash.hash}`);

    const updatedTransactionCount = await transactionContract.getTransactionCount();
    setTransactionCount(updatedTransactionCount.toNumber());
    window.localStorage.setItem("transactionCount", updatedTransactionCount.toNumber());

    await GetBalance();
    await getAllTransactions();
} catch (error) {
    console.log(error)
        throw new Error("NO ETHEREUM OBJECT!!!")
}
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
        checkIfTransactionsExist();

        
    },[transactionCount]); // the useEffect function calls all the sub functions when change in the 
            // array is there 

    
    return(
        <TransactionContext.Provider value ={{connectWallet, currentAccount , formData ,setFormData ,handleChange,sendTransaction,isLoading,transactions,getEthereumContract,GetBalance,Balance,refreshPage,transactionCount}}>
             {children}
        </TransactionContext.Provider>
    );

} 
