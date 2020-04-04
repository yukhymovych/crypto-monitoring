import React, { Component } from 'react';
import './Coin.css';

class Coin extends Component {
   constructor(props) {
      super(props);
   }

   componentWillUnmount() {
      this.props.coinSumReduce(this.props.coinInCash);
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
      const {coinId, coinName, coinAmount, coinPrice, coinInCash, coinImgUrl} = this.props;

      return (
         <div className="coin-item">
            <div className="coin-item__img"><img src={ coinImgUrl } alt=""/></div>
            <div className="coin-item__name-and-price">{ coinName } - { coinPrice }</div>
            <div className="coin-item__amount">Funds<br/>{ coinAmount }</div>
            <div className="coinitem__in-cash">$ { coinInCash }</div>
            <div className="coin-item__remove" onClick={() => this.handleRemoveItem(coinId)}>Удалить</div>
            <div className="coin-item__edit" onClick={() => this.handleEditItem()}>Изменить</div>
         </div>
      );
   }
}

export default Coin;