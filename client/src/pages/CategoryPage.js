import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, message } from "antd";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [categoriesData , setCategoriesData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [popupModal, setPopupModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategoryCount, setNewCategoryCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      setLoading(true);
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/categoriess/get-category");
      setCategoriesData(data);
      setFilteredCategories(data);
    } catch (error) {
      message.error("Failed to fetch categories.");
      console.error(error);
    } finally {
      setLoading(false);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  // Load categories on component mount
  useEffect(() => {
    getAllCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    const filtered = categoriesData.filter((category) =>
      category.Cname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categoriesData]);

  // Handle sorting by name
  const handleSort = () => {
    const sortedData = [...filteredCategories].sort((a, b) => {
      return sortOrder === "asc"
        ? a.Cname.localeCompare(b.Cname)
        : b.Cname.localeCompare(a.Cname);
    });
    setFilteredCategories(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.delete(`/api/categoriess/delete-category/${record._id}`);
      message.success("Category Deleted Successfully");
      getAllCategories();
    } catch (error) {
      message.error("Failed to delete category.");
      console.error(error);
    } finally {
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  // Table columns
  const columns = [
    { title: "Category Name", dataIndex: "Cname", key: "Cname" }, // Add key
    {
      title: "Category Image",
      dataIndex: "Cimage",
      key: "Cimage", // Add key
      render: (Cimage, record) => (
        <img src={Cimage} alt={record.Cname} height="60" width="60" />
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "_id", // Add key
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={() => {
              setEditCategory(record);
              setImageFile(null);
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

    // Handle form submit (Add/Edit Category)
  const handleSubmit = async (value) => {
    const formData = new FormData();
    formData.append("Cname", value.Cname);
    if (imageFile) {
      formData.append("Cimage", imageFile);
    }

    try {
      dispatch({ type: "SHOW_LOADING" });
      if (editCategory === null) {
        // Adding a new category
        await axios.post("/api/categoriess/add-category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category Added Successfully");
        setNewCategoryCount((prevCount) => prevCount + 1);
      } else {
        // Editing an existing category
        formData.append("categoryId", editCategory._id);
        await axios.put(`/api/categoriess/edit-category/${editCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category Updated Successfully");
      }
      // Refresh the category list after add/edit
      await getAllCategories(); // Ensure this is awaited
      closeModal();
    } catch (error) {
      message.error("Failed to save category.");
      console.error(error);
    } finally {
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  const closeModal = () => {
    setEditCategory(null);
    setPopupModal(false);
    setImageFile(null);
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Category List</h1>
        <div>
          <Button type="primary" onClick={() => setPopupModal(true)}>
            Add Category
          </Button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="d-flex justify-content-between my-3">
        <Input
          placeholder="Search categories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSort}>
          {sortOrder === "asc" ? "Sort Z-A" : "Sort A-Z"}
        </Button>
      </div>

      {/* Table rendering filtered categories */}
      <Table columns={columns} dataSource={filteredCategories} bordered loading={loading} />

      {/* New Category Count */}
      <div className="my-3">
        <p>New Categories Added: {newCategoryCount}</p>
      </div>

      {/* Category Popup Modal */}
      <Modal
        title={`${editCategory !== null ? "Edit Category" : "Add New Category"}`}
        open={popupModal}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{
            Cname: editCategory?.Cname || "",
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="Cname"
            label="Category Name"
            rules={[{ required: true, message: "Please enter Category Name." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Category Image">
            <Input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          </Form.Item>

          {/* Preview selected image */}
          {imageFile && (
            <div>
              <p>Selected Image:</p>
              <img src={URL.createObjectURL(imageFile)} alt="Preview" height="60" width="60" />
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              SAVE
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
 };

export default CategoryPage;