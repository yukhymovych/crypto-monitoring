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
      this.database = this.app.database().ref().child('coinList');

      this.editForm = React.createRef();
      this.errorMessage = React.createRef();

      this.state = {
         coinArray: [],
         coinFullSum: 0,
         userIP: '',
      }
   }

   componentDidMount() {
      const coinArray = [...this.state.coinArray];
   
      this.database.on('child_added', snap => {
         coinArray.push({
            id: snap.key,
            coinName: snap.val().coinName,
            coinAmount: snap.val().coinAmount
         });

         this.setState({
            coinArray
         });
      });

      this.database.on('child_removed', snap => {
         for (let i=0; i < coinArray.length; i++) {
            if (coinArray[i].id === snap.key) {
               coinArray.splice(i, 1);
            }
         }

         this.setState({
            coinArray
         });
      });

      this.database.on('child_changed', snap => {
         console.log(1);
         for (let i=0; i < coinArray.length; i++) {
            if (coinArray[i].id === snap.key) {
               coinArray[i].coinName = snap.val().coinName;
               coinArray[i].coinAmount = snap.val().coinAmount;
            }
         }

         this.setState({
            coinArray
         });
      });
   }

   coinSumBuild = (singleCoinSum) => {
      let newSum = this.state.coinFullSum + parseInt(singleCoinSum, 10);

      this.setState({
         coinFullSum: newSum
      });
   }

   coinSumReduce = (singleCoinSum) => {
      let newSum = this.state.coinFullSum - parseInt(singleCoinSum, 10);

      this.setState({
         coinFullSum: newSum
      });
   }

   removeCoin = (id) => {
      this.database.child(id).remove();
   }

   addCoin = (coin) => {
      this.database.push().set({
         coinName: coin.coinName,
         coinAmount: coin.coinAmount,
      });
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

         if (isNaN(editCoinAmount) || editCoinAmount == '' || editCoinAmount == 0) {
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
