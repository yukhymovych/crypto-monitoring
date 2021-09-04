import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Coin from './Coin/Coin';
import AddCoin from './AddCoin/AddCoin';

import firebase from './Config/config';


function App() {

   const app = firebase;
   const database = app.database().ref().child('coinList'); 
   /* coinList - real data */
   /* testone - test data */

   const editForm = useRef(null);
   const errorMessage = useRef(null);

   const [coinArray, setCoinArray] = useState([]);
   const [coinFullSum, setCoinFullSum] = useState(0);

   useEffect(() => {
      coinArrayRebuild();
   }, []);

   function coinArrayRebuild() {
      let newArray = [];
      let coinNameString = '';
      let apiCallUrl = '';
      let coinFullSum = 0;

      database.once('value', snap => {
         snap.forEach(function(snapItem) {
            newArray.push({
               id: snapItem.key,
               coinName: snapItem.val().coinName,
               coinAmount: snapItem.val().coinAmount
            });
            coinNameString += snapItem.val().coinName + ',';
         });

         apiCallUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + coinNameString + '&tsyms=USD';

         fetch(apiCallUrl)
         .then(response => response.json())
         .then(json => {
            for (let i = 0; i < newArray.length; i++) {
               newArray[i].coinPrice = json.RAW[newArray[i].coinName.toUpperCase()].USD.PRICE;
               newArray[i].coinInCash = (json.RAW[newArray[i].coinName].USD.PRICE * newArray[i].coinAmount).toFixed(2);
               newArray[i].coinImgUrl = 'https://www.cryptocompare.com' + json.RAW[newArray[i].coinName].USD.IMAGEURL;
               coinFullSum += newArray[i].coinInCash * 1;
            }

            setCoinArray(newArray);
            setCoinFullSum(coinFullSum.toFixed(2));
         });
      });
   }

   const coinSumReduce = (singleCoinSum) => {
      let newSum = (coinFullSum - parseInt(singleCoinSum, 10)).toFixed(2);

      setCoinFullSum(newSum);
   }

   const removeCoin = (id) => {
      let newArray = coinArray;

      database.child(id).remove();

      for (let i=0; i < newArray.length; i++) {
         if (newArray[i].id === id) {
            newArray.splice(i, 1);
         }
      }

      setCoinArray(newArray);
      coinArrayRebuild();
   }

   const addCoin = (coin) => {
      database.push().set({
         coinName: coin.coinName,
         coinAmount: coin.coinAmount,
      });

      coinArrayRebuild();
   }

   const editCoin = (coin) => {
      let newArray = coinArray;

      let editCoinBtn = document.getElementById("edit-coin-btn");
      let editCoinCloseBtn = document.getElementById("edit-coin-close-btn");

      let editCoinName;
      let editCoinAmount;

      editForm.current.style = "opacity: 1; visibility: visible";

      for (let i=0; i < newArray.length; i++) {
         if(newArray[i].id === coin.id){
            document.getElementById("coinName").value = newArray[i].coinName;
            document.getElementById("coinAmount").value = newArray[i].coinAmount;
         }
      }
      
      editCoinBtn.onclick = () => {
         for (let i=0; i < newArray.length; i++) {
            if(newArray[i].id === coin.id){
               editCoinName = document.getElementById("coinName").value;
               editCoinAmount = document.getElementById("coinAmount").value;
            }
         }

         if (isNaN(editCoinAmount) || editCoinAmount === '' || editCoinAmount === 0) {
            errorMessage.current.textContent = "Need a number.";
            errorMessage.current.classList.add("error-message--fade-in");
         }
         else {
            for (let i = 0; i < newArray.length; i++) {
               if(newArray[i].id === coin.id) {
                  database.child(coin.id).set({
                     coinName: editCoinName,
                     coinAmount: editCoinAmount
                  });

                  coinArrayRebuild();
               }
            }
            
            editForm.current.style = "opacity: 0; visibility: hidden";
            errorMessage.current.classList.remove("error-message--fade-in");
         }
      }

      editCoinCloseBtn.onclick = () => {
         editForm.current.style = "opacity: 0; visibility: hidden";
         errorMessage.current.classList.remove("error-message--fade-in");
      }
   }

   return (
      <div className="App">
         <div className="wrapper">
            <div className="coin-full-sum"><span>Total</span><br/>${coinFullSum}</div>

            <div className="coin-list">
            {
               coinArray.map((item) => {
                  return(
                     <Coin 
                        coinId={item.id} 
                        coinName={item.coinName} 
                        coinAmount={item.coinAmount}
                        coinPrice={item.coinPrice}
                        coinInCash={item.coinInCash}
                        coinImgUrl={item.coinImgUrl}
                        key={item.id}

                        removeCoin={removeCoin}
                        coinSumReduce={coinSumReduce}
                        editCoin={editCoin}
                     />
                  )
               })
            }
            </div>

            <AddCoin addCoin={addCoin} />
            
            <div className="edit-form" ref={editForm}>
               <input className="edit-coin-name addcoin-input" id="coinName" />
               <input className="edit-coin-amount addcoin-input" id="coinAmount" placeholder="Сумма" />
               <button id="edit-coin-btn" className="addcoin-btn">Save</button>
               <button id="edit-coin-close-btn" className="addcoin-btn">Cancel</button>
               <p className="error-message" ref={errorMessage}>.</p>
            </div>
         </div>
      </div>
   );
}

export default App;