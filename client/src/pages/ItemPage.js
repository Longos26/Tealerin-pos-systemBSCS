import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message, Upload, Spin } from "antd";

const ItemPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllItems = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/items/get-item");
      setItemsData(data);
      setFilteredItems(data);
    } catch (error) {
      message.error("Failed to load items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  useEffect(() => {
    const filtered = itemsData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, itemsData]);

  const handleSort = () => {
    const sortedData = [...filteredItems].sort((a, b) => {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
    setFilteredItems(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = async (record) => {
    try {
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();
    } catch (error) {
      message.error("Failed to delete item");
      console.error(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => <img src={image} alt={record.name} height="60" width="60" />,
    },
    { title: "Price", dataIndex: "price" },
    { title: "Size", dataIndex: "size" },
    { title: "Pieces", dataIndex: "pieces" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined style={{ cursor: "pointer", marginRight: 10 }} onClick={() => {
            setEditItem(record);
            setPopupModal(true);
          }} />
          <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];

  const handleSubmit = async (value) => {
    try {
      if (!editItem) {
        await axios.post("/api/items/add-item", value);
        message.success("Item Added Successfully");
      } else {
        await axios.put("/api/items/edit-item", { ...value, itemId: editItem._id });
        message.success("Item Updated Successfully");
      }
      getAllItems();
      setPopupModal(false);
      setEditItem(null);
    } catch (error) {
      message.error("Failed to save item");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>Add Item</Button>
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

      {loading ? (
        <Spin />
      ) : (
        <Table columns={columns} dataSource={filteredItems} bordered />
      )}

      {popupModal && (
        <Modal
          title={`${editItem ? "Edit Item" : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
            setEditItem(null);
          }}
          footer={null}
        >
          <Form layout="vertical" initialValues={editItem} onFinish={handleSubmit}>
            <Form.Item 
              name="name" 
              label="Name" 
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              name="price" 
              label="Price" 
              rules={[{ required: true, message: "Please enter the price!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="size" label="Sizes">
              <Input />
            </Form.Item>
            <Form.Item name="pieces" label="Pieces">
              <Input type="number" />
            </Form.Item>
            <Form.Item 
              name="image" 
              label="Image" 
              valuePropName="fileList" 
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)} 
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Product Image</Button>
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
              <Button type="primary" htmlType="submit">SAVE</Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
