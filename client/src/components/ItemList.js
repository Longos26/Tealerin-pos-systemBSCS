import React, { useState } from "react";
import { Button, Card, Modal, Radio } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  // Open modal for selecting size
  const showSizeModal = () => {
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle adding item to cart after size selection
  const handleAddToCart = () => {
    if (selectedSize) {
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1, size: selectedSize },
      });
      setIsModalVisible(false); // Close the modal after adding to cart
    } else {
      alert("Please select a size.");
    }
  };

  // Handle size selection change
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const { Meta } = Card;
  return (
    <div>
      <Card
        style={{ width: 240, marginBottom: 20 }}
        cover={<img alt={item.name} src={item.image} style={{ height: 200 }} />}
      >
        <Meta title={item.name} />
        <div className="item-button">
          <Button onClick={showSizeModal}>Add to cart</Button>
        </div>
      </Card>

      {/* Modal for selecting size */}
      <Modal
        title="Select Size"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleAddToCart}
      >
        <Radio.Group onChange={handleSizeChange}>
          <Radio.Button value="S">Small</Radio.Button>
          <Radio.Button value="M">Medium</Radio.Button>
          <Radio.Button value="L">Large</Radio.Button>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default ItemList;
