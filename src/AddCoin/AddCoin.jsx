import React, { useState } from 'react';
import './AddCoin.css';

function AddCoin(props) {
   const [coinName, setCoinName] = useState('BTC');
   const [coinAmount, setCoinAmount] = useState(0);

   const writeCoin = () => {
      let coin = {
         coinName: coinName.toUpperCase(),
         coinAmount: coinAmount
      };
      
      props.addCoin(coin);

      setCoinName('BTC');
      setCoinAmount(0);
   }

   return (
      <div className="addcoin-container">
         <input className="addcoin-input" value={coinName} onChange={e => setCoinName(e.target.value)} />

         <input className="addcoin-input" 
         placeholder="Сумма"
         value={coinAmount} 
         onChange={e => setCoinAmount(e.target.value)} />
         
         <button className="addcoin-btn"
         onClick={() => writeCoin()}>Add</button>
      </div>
   );
}

export default AddCoin;