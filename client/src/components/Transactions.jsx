import React, { useContext, useState, useEffect } from 'react';
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const Chtransaction = (addressTo, addressFrom, currentAccount) => {
  let chk = 0;

  if (JSON.stringify(currentAccount).toLowerCase() === JSON.stringify(addressFrom).toLowerCase()) {
    chk = 1; // Sent transaction
  } else if (JSON.stringify(currentAccount).toLowerCase() === JSON.stringify(addressTo).toLowerCase()) {
    chk = 2; // Received transaction
  }
  return chk;
};

const SentTransactionCard = ({ addressTo, addressFrom, timestamp, message, amount, currentAccount }) => {
  let ch = Chtransaction(addressTo, addressFrom, currentAccount);

  return (
    <>
      {ch === 1 && (
        <div className='bg-[#181918] m-4 flex flex-1
          2xl:min-w-[450px]
          2xl:max-w-[500px]
          sm:min-w-[270px]
          sm:max-w-[300px]
          min-w-full
          flex-col p-4 rounded-md hover:shadow-2xl'>
          <div className='flex flex-col items-center w-full mt-3'>
            <div className='display-flex justify-start w-full mb-6 p-2'>
              <p className='text-white text-base'>
                From: {shortenAddress(addressFrom)}
              </p>
              <p className='text-white text-base'>
                To: {shortenAddress(addressTo)}
              </p>
              <p className='text-white text-base'>
                Amount: {amount} Eth
              </p>
              {message && (
                <>
                  <p className='text-white text-base'>Msg: {message}</p>
                </>
              )}
              <br />
              <div className='bg-black p-3 px-8 w-max rounded-xl shadow-2xl'>
                <p className='text-[#8c66ff] font-bold'>{timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ReceivedTransactionCard = ({ addressTo, addressFrom, timestamp, message, amount, currentAccount }) => {
  let ch = Chtransaction(addressTo, addressFrom, currentAccount);

  return (
    <>
      {ch === 2 && (
        <div className='bg-[#181918] m-4 flex flex-1
          2xl:min-w-[450px]
          2xl:max-w-[500px]
          sm:min-w-[270px]
          sm:max-w-[300px]
          min-w-full
          flex-col p-4 rounded-md hover:shadow-2xl'>
          <div className='flex flex-col items-center w-full mt-3'>
            <div className='display-flex justify-start w-full mb-6 p-2'>
              <p className='text-white text-base'>
                From: {shortenAddress(addressFrom)}
              </p>
              <p className='text-white text-base'>
                To: {shortenAddress(addressTo)}
              </p>
              <p className='text-white text-base'>
                Amount: {amount} Eth
              </p>
              {message && (
                <>
                  <p className='text-white text-base'>Msg: {message}</p>
                </>
              )}
              <br />
              <div className='bg-black p-3 px-8 w-max rounded-xl shadow-2xl'>
                <p className='text-[#8c66ff] font-bold'>{timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Transactions = () => {
  const { currentAccount, transactions } = useContext(TransactionContext);
  const [sentCount, setSentCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);

  useEffect(() => {
    // Calculate sent and received counts whenever transactions or currentAccount changes
    let sent = 0;
    let received = 0;
    
    transactions.forEach((transaction) => {
      const ch = Chtransaction(transaction.addressTo, transaction.addressFrom, currentAccount);
      if (ch === 1) sent=sent+1;
      if (ch === 2) received=received+1;
    });

    setSentCount(sent);
    setReceivedCount(received);
  }, [transactions, currentAccount]);

    // Avoid mutating transactions multiple times
    const reversedTransactions = [...transactions].reverse();  // Avoid mutating transactions multiple times
    

  return (
    <div className='flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions'>
      <div className='flex flex-col md:p-12 py-12 px-4'>
        {currentAccount ? (
          <>
            <h3 className="text-white text-3xl text-center my-2">
              Latest Transactions
            </h3>
            <br />
            <h4 className="text-white text-xl font-bold text-center my-4">
              SENT TRANSACTIONS ({sentCount})
              <br />
            </h4>
            
            <div className="flex flex-wrap justify-center items-center mt-10">
              {reversedTransactions.map((transaction, i) => (
                <SentTransactionCard key={i} {...transaction} currentAccount={currentAccount} />
              ))}
            </div>
            <br />
            <h4 className="text-white text-xl font-bold text-center my-4">
              RECEIVED TRANSACTIONS ({receivedCount})
            </h4>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {reversedTransactions.map((transaction, i) => (
                <ReceivedTransactionCard key={i} {...transaction} currentAccount={currentAccount} />
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-white text-3xl text-center my-2" style={{ fontFamily: 'monospace' }}>
            Connect your Wallet to view your transactions
          </h3>
        )}
      </div>
    </div>
  );
};

export default Transactions;
