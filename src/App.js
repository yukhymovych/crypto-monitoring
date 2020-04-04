import React, { Component } from 'react';
import './App.css';

import Coin from './Coin/Coin';
import AddCoin from './AddCoin/AddCoin';

import { config } from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';


class App extends Component {
   constructor(props){
      super(props);

      this.app = firebase.initializeApp(config);
      this.database = this.app.database().ref().child('testone');

      this.editForm = React.createRef();
      this.errorMessage = React.createRef();

      this.state = {
         coinArray: [],
         coinFullSum: 0,
         userIP: '',
      }
   }

   componentDidMount() {
      this.coinArrayRebuild();
   }

   coinArrayRebuild = () => {
      let newArray = [];
      let coinNameString = '';
      let apiCallUrl = '';
      let coinFullSum = 0;

      this.database.once('value', snap => {
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
         .then(json => this.setState(() => {
            for (let i = 0; i < newArray.length; i++) {
               newArray[i].coinPrice = json.DISPLAY[newArray[i].coinName].USD.PRICE;
               newArray[i].coinInCash = (json.DISPLAY[newArray[i].coinName].USD.PRICE.slice(1) * newArray[i].coinAmount).toFixed(2);
               newArray[i].coinImgUrl = 'https://www.cryptocompare.com' + json.DISPLAY[newArray[i].coinName].USD.IMAGEURL;
               coinFullSum += newArray[i].coinInCash * 1;
            }

            this.setState({
               coinArray: newArray,
               coinFullSum: coinFullSum.toFixed(2)
            });
         }));
      });
   }

   coinSumReduce = (singleCoinSum) => {
      let newSum = (this.state.coinFullSum - parseInt(singleCoinSum, 10)).toFixed(2);

      this.setState({
         coinFullSum: newSum
      });
   }

   removeCoin = (id) => {
      let coinArray = [...this.state.coinArray];

      this.database.child(id).remove();

      for (let i=0; i < coinArray.length; i++) {
         if (coinArray[i].id === id) {
            coinArray.splice(i, 1);
         }
      }

      this.setState({
         coinArray
      });
   }

   addCoin = (coin) => {
      this.database.push().set({
         coinName: coin.coinName,
         coinAmount: coin.coinAmount,
      });

      this.coinArrayRebuild();
   }

   editCoin = (coin) => {
      let coinArray = [...this.state.coinArray];

      let editCoinBtn = document.getElementById("edit-coin-btn");
      let editCoinCloseBtn = document.getElementById("edit-coin-close-btn");
      let errorMessage = this.errorMessage.current;

      let editCoinName;
      let editCoinAmount;

      this.editForm.current.style = "opacity: 1; visibility: visible";

      for (let i=0; i < coinArray.length; i++) {
         if(coinArray[i].id === coin.id){
            document.getElementById("coinName").value = coinArray[i].coinName;
            document.getElementById("coinAmount").value = coinArray[i].coinAmount;
         }
      }
      
      editCoinBtn.onclick = () => {
         for (let i=0; i < coinArray.length; i++) {
            if(coinArray[i].id === coin.id){
               editCoinName = document.getElementById("coinName").value;
               editCoinAmount = document.getElementById("coinAmount").value;
            }
         }

         if (isNaN(editCoinAmount) || editCoinAmount === '' || editCoinAmount === 0) {
            this.errorMessage.current.textContent = "Ошибка. Введите число.";
            errorMessage.classList.add("error-message--fade-in");
         }
         else {
            for (let i = 0; i < coinArray.length; i++) {
               if(coinArray[i].id === coin.id) {
                  this.database.child(coin.id).set({
                     coinName: editCoinName,
                     coinAmount: editCoinAmount
                  });

                  this.coinArrayRebuild();
               }
            }
            
            this.editForm.current.style = "opacity: 0; visibility: hidden";
            errorMessage.classList.remove("error-message--fade-in");
         }
      }

      editCoinCloseBtn.onclick = () => {
         this.editForm.current.style = "opacity: 0; visibility: hidden";
         errorMessage.classList.remove("error-message--fade-in");
      }
   }

   render() {
      return (
         <div className="App">
            <div className="wrapper">
               <div className="coin-full-sum"><span>Вся сумма</span><br/>${this.state.coinFullSum}</div>

               <div className="coin-list">
               {
                  this.state.coinArray.map((item) => {
                     return(
                        <Coin 
                           coinId={item.id} 
                           coinName={item.coinName} 
                           coinAmount={item.coinAmount}
                           coinPrice={item.coinPrice}
                           coinInCash={item.coinInCash}
                           coinImgUrl={item.coinImgUrl}
                           key={item.id}

                           removeCoin={this.removeCoin}
                           coinSumBuild={this.coinSumBuild}
                           coinSumReduce={this.coinSumReduce}
                           editCoin={this.editCoin}
                        />
                     )
                  })
               }
               </div>

               <AddCoin addCoin={this.addCoin} />
               
               <div className="edit-form" ref={this.editForm}>
                  <select className="edit-coin-name addcoin-input" id="coinName">
                     <option selected value="BTC">Bitcoin</option>
                     <option value="BCH">Bitcoin Cash</option>
                     <option value="BNB">Binance Coin</option>
                     <option value="DASH">Dash</option>
                     <option value="EOS">EOS</option>
                     <option value="ETH">Ethereum</option>
                     <option value="LTC">Litecoin</option>
                     <option value="XMR">Monero</option>
                     <option value="NEO">NEO</option>
                     <option value="XLM">Stellar</option>
                     <option value="TRX">Tron</option>
                     <option value="XRP">XRP</option>
                     <option value="ZEC">Zcash</option>
                  </select>
                  <input className="edit-coin-amount addcoin-input" id="coinAmount" placeholder="Сумма" />
                  <button id="edit-coin-btn" className="addcoin-btn">Сохранить</button>
                  <button id="edit-coin-close-btn" className="addcoin-btn">Отмена</button>
                  <p className="error-message" ref={this.errorMessage}>.</p>
               </div>
            </div>
         </div>
     );
   }
}

export default App;
