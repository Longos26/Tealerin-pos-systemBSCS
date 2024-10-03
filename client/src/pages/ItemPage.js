import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message, Upload } from "antd";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItemCount, setNewItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);

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

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories/get-categories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllItems();
    getAllCategories();
  }, []);

  useEffect(() => {
    const filtered = itemsData.filter((item) =>
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
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.error(error);
    }
  };

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
              setImage(record.image);
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

  const handleSubmit = async (value) => {
    setLoading(true);
    const formData = new FormData();

    Object.keys(value).forEach((key) => {
      formData.append(key, value[key]);
    });

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

  const handleCategorySubmit = async () => {
    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      await axios.post("/api/categories/add-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Category Added Successfully");
      getAllCategories();
      setCategoryModal(false);
    } catch (error) {
      message.error("Something Went Wrong");
      console.error(error);
    }
  };

  const categoryUploadProps = {
    beforeUpload: (file) => {
      setCategoryImage(file);
      return false;
    },
    onRemove: () => {
      setCategoryImage(null);
    },
    fileList: categoryImage ? [categoryImage] : [],
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setImage(file);
      return false;
    },
    onRemove: () => {
      setImage(null);
    },
    fileList: image ? [image] : [],
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Item List</h1>
        <div>
          <Button type="primary" onClick={() => setPopupModal(true)} style={{ marginRight: 10 }}>
            Add Item
          </Button>
          <Button type="primary" onClick={() => setCategoryModal(true)}>
            Manage Categories
          </Button>
        </div>
      </div>

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

      <Table columns={columns} dataSource={filteredItems} bordered />

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
            setImage(null);
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

            <Form.Item label="Upload Image" rules={[{ required: true }]}>
              <Upload {...uploadProps}>
                <Button>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form>
        </Modal>
      )}

      {categoryModal && (
        <Modal
          title="Add New Category"
          visible={categoryModal}
          onCancel={() => {
            setCategoryModal(false);
            setCategoryName("");
            setCategoryImage(null);
          }}
          footer={false}
        >
          <Form layout="vertical" onFinish={handleCategorySubmit}>
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[{ required: true }]}
            >
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Upload Category Image">
              <Upload {...categoryUploadProps}>
                <Button>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
