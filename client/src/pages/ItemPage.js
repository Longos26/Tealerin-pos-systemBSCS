// In ItemPage.js
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);
  const [imageFile, setImageFile] = useState(null); // State for image file

  // Fetch all items function
  const getAllItems = async () => {
    // Same as before...
  };

  // Load items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    // Same as before...
  }, [searchQuery, itemsData]);

  // Handle delete function
  const handleDelete = async (record) => {
    // Same as before...
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },
    { title: "Size", dataIndex: "size" },
    { title: "Pieces", dataIndex: "pieces" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
              setImageFile(null); // Reset image file on edit
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  // Handle form submit (Add/Edit)
  const handleSubmit = async (value) => {
    const formData = new FormData(); // Create a FormData object
    formData.append("name", value.name);
    formData.append("price", value.price);
    formData.append("size", value.size);
    formData.append("pieces", value.pieces);
    formData.append("category", value.category);
    if (imageFile) {
      formData.append("image", imageFile); // Append the image file
    }
    if (editItem === null) {
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.post("/api/items/add-item", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        });
        message.success("Item Added Successfully");
        setNewItemCount(newItemCount + 1);
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.error(error);
      }
    } else {
      // Handle editing similar to adding (you may want to adjust this)
      try {
        dispatch({ type: "SHOW_LOADING" });
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Updated Successfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.error(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="d-flex justify-content-between my-3">
        <Input
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSort}>
          {sortOrder === "asc" ? "Sort Z-A" : "Sort A-Z"}
        </Button>
      </div>

      {/* Single Table rendering filteredItems */}
      <Table columns={columns} dataSource={filteredItems} bordered />

      {/* New Item Count */}
      <div className="my-3">
        <p>New Items Added: {newItemCount}</p>
      </div>

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>

            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>

            <Form.Item name="size" label="Sizes">
              <Input />
            </Form.Item>

            <Form.Item name="pieces" label="Pieces">
              <Input />
            </Form.Item>

            <Form.Item name="image" label="Image">
              <Input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="drinks">Drinks</Select.Option>
                <Select.Option value="rice">Rice</Select.Option>
                <Select.Option value="noodles">Noodles</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
