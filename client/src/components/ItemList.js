//eto ang mag didisplay ng data sa Homepage.js

import React from 'react'
import { Button,Card } from "antd";
import { useDispatch } from 'react-redux';
const ItemList = ({item}) => {
  const dispatch = useDispatch();
  //update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: item,
    });
  };

  const {Meta} = Card;
  return (
<div style={{ width: '100%', maxWidth: 240,marginTop:10 }}>
  <Card
    style={{ 
      width: '100%', 
      maxWidth: '320px',
      margin: 'auto' // Centering card
    }}
    cover={
      <img 
        alt={item.name} 
        src={item.image} 
        style={{ 
          width: '100%', 
          height: 'auto', 
          maxHeight: 200 // To ensure the image doesn’t grow too tall
        }} 
      />
    }
   
  >
    <Meta title={item.name} />
    <div className='item-button'>
      <Button onClick={() => handleAddTOCart()}>Add to Cart</Button>
    </div>
  </Card>
</div>

  );
};

export default ItemList;
