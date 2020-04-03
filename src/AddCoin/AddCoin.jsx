import React, { Component } from 'react';
import './AddCoin.css';

class AddCoin extends Component {
   constructor(props) {
      super(props);

      this.state = {
         coinName: "BTC",
         coinAmount: 0,
      }
   }

   handleNameInput = (e) => {
      this.setState({
         coinName: e.target.value
      });
   }

   handleAmountInput = (e) => {
      this.setState({
         coinAmount: e.target.value
      });
   }

   writeCoin = () => {
      let coin = {
         coinName: this.state.coinName,
         coinAmount: this.state.coinAmount
      };
      
      this.props.addCoin(coin);

      this.setState({
         coinName: "BTC",
         coinAmount: 0
      });
   }

   render() {
      return (
         <div className="addcoin-container">
            <select className="addcoin-input" value={this.state.coinName} onChange={this.handleNameInput}>
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

            <input className="addcoin-input" 
            placeholder="Сумма"
            value={this.state.coinAmount} 
            onChange={this.handleAmountInput} />
            
            <button className="addcoin-btn"
            onClick={this.writeCoin}>Добавить</button>
         </div>
      );
   }
}

export default AddCoin;