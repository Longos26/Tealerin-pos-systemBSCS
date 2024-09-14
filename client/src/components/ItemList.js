//eto ang mag didisplay ng data sa Homepage.js

import React from 'react'
import { Card } from "antd";

const ItemList = ({item}) => {
  const {Meta} = Card;
  return (
<div style={{ width: '100%', maxWidth: 240,marginTop:10 }}>
  <Card
    hoverable
    style={{ 
      width: '100%', 
      maxWidth: '240px', 
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
  </Card>
</div>

  );
};

export default ItemList
