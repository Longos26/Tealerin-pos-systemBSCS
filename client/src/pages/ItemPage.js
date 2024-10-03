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
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // For handling image upload

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

  // Filter items based on search query
  useEffect(() => {
    const filtered = itemsData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, itemsData]);

  // Handle sorting by name (A-Z, Z-A)
  const handleSort = () => {
    const sortedData = [...filteredItems].sort((a, b) => {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setFilteredItems(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();n
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.error(error);
    }
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
              setImage(record.image); // Set current image for editing
              setPopupModal(true);
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
    setLoading(true);
    const formData = new FormData();

    // Append form data
    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });

    // Append image if exists
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editItem === null) {
        await axios.post("/api/items/add-item", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Item Added Successfully");
        setNewItemCount((prevCount) => prevCount + 1);
      } else {
        await axios.put("/api/items/edit-item", {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Updated Successfully");
      }
      getAllItems();
      setPopupModal(false);
    } catch (error) {
      message.error("Something Went Wrong");
      console.error(error);
    } finally {
      setLoading(false);
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
            setImage(null); // Reset image on modal close
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>

            <Form.Item name="size" label="Sizes">
              <Input />
            </Form.Item>

            <Form.Item name="pieces" label="Pieces">
              <Input type="number" />
            </Form.Item>

            <Form.Item name="image" label="Image Upload">
              <Upload {...uploadProps}>
                <Button>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="drinks">Drinks</Select.Option>
                <Select.Option value="rice">Rice</Select.Option>
                <Select.Option value="noodles">Noodles</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit" loading={loading}>
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
