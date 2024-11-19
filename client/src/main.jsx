import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {TransactionProvider} from './context/TransactionContext';
ReactDOM.render(
  //transactionProvider will provide values that can be accessed across all the encompassed components , and its children and further 
  //it reduces the need for passing props at each and every stage
  <TransactionProvider>  
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </TransactionProvider>,
  document.getElementById('root')
)
