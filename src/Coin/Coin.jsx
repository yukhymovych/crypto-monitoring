import React, { useEffect } from 'react';
import './Coin.css';

function Coin(props) {
   useEffect(() => {
      return () => {
         props.coinSumReduce(props.coinInCash);
      }
   }, []);

   const handleRemoveItem = (id) => {
      props.removeCoin(id);
   }

   const handleEditItem = () => {
      let coin = {
         id: props.coinId,
         coinName: props.coinName,
         coinAmount: props.coinAmount,
      };

      props.editCoin(coin);
   }

   return (
      <div className="coin-item">
         <div className="coin-item__img"><img src={props.coinImgUrl} alt="" /></div>
         <div className="coin-item__name-and-price">{props.coinName} - ${props.coinPrice}</div>
         <div className="coin-item__amount">{props.coinAmount}</div>
         <div className="coinitem__in-cash">${props.coinInCash}</div>
         <div className="coin-item__remove" onClick={() => handleRemoveItem(props.coinId)}>Delete</div>
         <div className="coin-item__edit" onClick={() => handleEditItem()}>Edit</div>
      </div>
   );
}

export default Coin;