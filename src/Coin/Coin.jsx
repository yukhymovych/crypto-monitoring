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
         coinPrice: {},
      }
   }

   componentDidMount() {
      // let apiCallUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' + this.state.coinName + '&tsyms=USD';

      // fetch(apiCallUrl)
      // .then(response => response.json())
      // .then(json =>  this.setState({
      //                coinPrice: json,
      //                coinInCash: (json.USD * this.state.coinAmount).toFixed(2)
      //                }, () => {this.props.coinSumBuild(this.state.coinInCash)}));
   }

   componentWillUnmount() {
      this.props.coinSumReduce(this.state.coinInCash);
   }

   handleRemoveItem = (id) => {
      this.props.removeCoin(id);
   }

   // handleEditItem = () => {
   //    let coin = {
   //       id: this.props.coinId,
   //       coinName: this.props.coinName,
   //       coinAmount: this.props.coinAmount,
   //    };

   //    this.props.editCoin(coin);
   // }

   render() {
      return (
         <div className="coin-item">
            <div className="coin-item__name">{this.state.coinName}</div>
            <div className="coin-item__price">$ {this.state.coinPrice.USD}</div>
            <div className="coin-item__amount">{this.state.coinAmount}</div>
            <div className="coinitem__in-cash">$ {this.state.coinInCash}</div>
            <div className="coin-item__remove" onClick={() => this.handleRemoveItem(this.state.coinId)}>Удалить</div>
            {/* <div className="coin-item__edit" onClick={() => this.handleEditItem()}>Изменить</div> */}
         </div>
      );
   }
}

export default Coin;