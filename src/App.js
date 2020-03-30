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

      this.state = {
         coinArray: [],
         coinFullSum: 0,
         timeToRerender: 9999,
         intervalId: 0,
      }
   }

   componentDidMount() {
      const coinArray = [...this.state.coinArray];
      let apiCallUrl = '';
      let tempCoinPrice = 0;
      let coinInCash = 0;

      this.database.on('child_added', snap => {
         apiCallUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' + snap.val().coinName + '&tsyms=USD';

         fetch(apiCallUrl)
         .then(response => response.json())
         .then(json     => {
            tempCoinPrice = json.USD;
            coinInCash =  (json.USD * snap.val().coinAmount).toFixed(2);

            coinArray.push({
               id: snap.key,
               coinName: snap.val().coinName,
               coinAmount: snap.val().coinAmount,
               coinPrice: tempCoinPrice,
               coinInCash: coinInCash,
            });

            this.setState({
               coinArray
            });
         });
      });

      this.database.on('child_removed', snap => {
         for(var i=0; i < coinArray.length; i++){
            if(coinArray[i].id === snap.key){
               coinArray.splice(i, 1);
            }
         }

         this.setState({
            coinArray
         });
      });


      // var intervalId = setInterval(this.timer, 1000);
      // this.setState({intervalId: intervalId});
   }

   // timer = () => {
   //    const coinArray = [...this.state.coinArray];

   //    this.setState({ 
   //       currentCount: this.state.currentCount -1,
   //    });
   // }

   // componentWillUnmount() {
   //    clearInterval(this.state.intervalId);
   // }

   

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

   // editCoin = (coin) => {
   //    let array = [...this.state.coinArray];
   //    let coinForEdit = {
   //       id: coin.id,
   //       coinName: coin.coinName,
   //       coinAmount: coin.coinAmount
   //    };

      

   //    for (let i = 0; i < array.length; i++) {
   //       if (array.coinArray[i].id === coin.id) {
   //          array[i] = {
   //             id: coin.id,
   //             coinName: coin.coinName,
   //             coinAmount: coin.coinAmount,
   //          }
   //       }
   //    }

   //    this.setState({
   //       coinArray: array
   //    });
   // }

   render() {
      return (
         <div className="App">
            <div className="wrapper">
               <div className="coinList">
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
                           // editCoin={this.editCoin}
                        />
                     )
                  })
               }
               {this.state.coinFullSum}
               </div>

               <AddCoin addCoin={this.addCoin} />
               
               {/* <div className="edit-form">
                  <input className="editcoin-input" 
                  placeholder="Название"
                  value={this.state.coinName} 
                  onChange={this.handleNameInput} />
                  <input className="editcoin-input" 
                  placeholder="Сумма"
                  value={this.state.coinAmount} 
                  onChange={this.handleAmountInput} />
                  <button className="editcoin-btn"
                  onClick={this.writeCoin}>Сохранить</button>
               </div> */}
            </div>
         </div>
     );
   }
}

export default App;
