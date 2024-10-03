import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message, Upload } from "antd";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [popupModal, setPopupModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Fetch all items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      setFilteredItems(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  // Load items on component mount
  useEffect(() => {
    getAllItems();
  }, []);

  // Handle add category
  const handleAddCategory = async () => {
    if (!categoryName || !image) {
      message.error("Please provide category name and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("image", image);

    try {
      await axios.post("/api/categories/add-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Category Added Successfully");
      setCategoryName("");
      setImage(null);
      setAddCategoryModal(false);
    } catch (error) {
      message.error("Failed to add category");
      console.error(error);
    }
  };

  // Upload Props
  const uploadProps = {
    beforeUpload: (file) => {
      setImage(file);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setImage(null);
    },
    fileList: image ? [image] : [],
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <div>
          <Button type="primary" onClick={() => setPopupModal(true)}>
            Add Item
          </Button>
          <Button type="primary" onClick={() => setAddCategoryModal(true)} style={{ marginLeft: "10px" }}>
            Add Category
          </Button>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        visible={addCategoryModal}
        onCancel={() => setAddCategoryModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddCategory}>
          <Form.Item label="Category Name" required>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Image Upload">
            <Upload {...uploadProps}>
              <Button>Upload Image</Button>
            </Upload>
          </Form.Item>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              SAVE
            </Button>
          </div>
        </Form>
      </Modal>

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

      {/* Item Modal Code Here... */}
    </DefaultLayout>
  );
};

export default ItemPage;
