import React, { Component } from 'react';
import './Coin.css';

class Coin extends Component {
   constructor(props) {
      super(props);

      this.state = {
         coinId: this.props.coinId,
         coinName: this.props.coinName,
         coinAmount: this.props.coinAmount,
         coinInCash: 0,
         coinPrice: 0,
         coinImg: "https://www.cryptocompare.com",
      }
   }

   componentDidMount() {
      let apiCallUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' + this.state.coinName + '&tsyms=USD';
      let apiCallUrl2 = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + this.state.coinName + '&tsyms=USD';

      fetch(apiCallUrl)
      .then(response => response.json())
      .then(json =>  this.setState({
                        coinPrice: json.USD * 1,
                        coinInCash: (json.USD * this.state.coinAmount).toFixed(2)
                     }, () => {this.props.coinSumBuild(this.state.coinInCash)}));

      fetch(apiCallUrl2)
      .then(response => response.json())
      .then(json =>  this.setState({
                        coinImg: this.state.coinImg + json.DISPLAY[this.props.coinName].USD.IMAGEURL,
                     }));      
   }

   componentDidUpdate(prevProps) {
      if (this.props.coinName !== prevProps.coinName || this.props.coinAmount !== prevProps.coinAmount) {
         let apiCallUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' + this.props.coinName + '&tsyms=USD';

         fetch(apiCallUrl)
         .then(response => response.json())
         .then(json =>  this.setState({
                           coinName: this.props.coinName,
                           coinAmount: this.props.coinAmount,
                           coinPrice: json.USD * 1,
                           coinInCash: (json.USD * this.props.coinAmount).toFixed(2)
                        }, () => {this.props.coinSumBuild(this.state.coinInCash)}));

         let apiCallUrl2 = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + this.props.coinName + '&tsyms=USD';
         
         fetch(apiCallUrl2)
         .then(response => response.json())
         .then(json =>  this.setState({
                           coinImg: 'https://cryptocompare.com' + json.DISPLAY[this.props.coinName].USD.IMAGEURL,
                        }));
      }
   }

   componentWillUnmount() {
      this.props.coinSumReduce(this.state.coinInCash);
   }

   handleRemoveItem = (id) => {
      this.props.removeCoin(id);
   }

   handleEditItem = () => {
      let coin = {
         id: this.props.coinId,
         coinName: this.props.coinName,
         coinAmount: this.props.coinAmount,
      };

      this.props.editCoin(coin);
   }

   render() {
      return (
         <div className="coin-item">
            <div className="coin-item__img"><img src={this.state.coinImg} alt=""/></div>
            <div className="coin-item__name-and-price">{this.state.coinName} - ${this.state.coinPrice}</div>
            <div className="coin-item__amount">Funds<br/>{this.state.coinAmount}</div>
            <div className="coinitem__in-cash">$ {this.state.coinInCash}</div>
            <div className="coin-item__remove" onClick={() => this.handleRemoveItem(this.state.coinId)}>Удалить</div>
            <div className="coin-item__edit" onClick={() => this.handleEditItem()}>Изменить</div>
         </div>
      );
   }
}

export default Coin;