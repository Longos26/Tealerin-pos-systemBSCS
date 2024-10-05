import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";


// const CategoryPage = () => {
//   const dispatch = useDispatch();
//   const [itemsData, setItemsData] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]); 
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
//   const [popupModal, setPopupModal] = useState(false);
//   const [categoryModal, setCategoryModal] = useState(false); 
//   const [editItem, setEditItem] = useState(null);
//   const [newItemCount, setNewItemCount] = useState(0);
//   const [imageFile, setImageFile] = useState(null);

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [categoriessData, setCategoriesData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [popupModal, setPopupModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategoryCount, setNewCategoryCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);


//Fetch all items
  const getAllCategories = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/categoriess/get-category");
      setCategoriesData(data);
      setFilteredCategories(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Failed to fetch categoriess.");
      console.error(error);
    }
  };

  // Load items on component mount
  useEffect(() => {
    getAllCategories ();
  }, []);

//////////////////////////////////Filter items based on search query
  useEffect(() => {
    const filtered = categoriessData.filter((category) =>
      category.CategoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredCategories(filtered);
  }, [searchQuery, categoriessData]);

  ////////////////////////////////Handle sorting by name (A-Z, Z-A)
  const handleSort = () => {
    const sortedData = [...filteredCategories].sort((a, b) => {
      return sortOrder === "asc"
        ? a.CategoryName.localeCompare(b.CategoryName)
        : b.CategoryName.localeCompare(a.CategoryName);
    });
    setFilteredCategories(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle delete
  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/categoriess/delete-category", { categoryId: record._id });
      message.success("Category Deleted Successfully");
      getAllCategories();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Failed to delete category.");
      console.error(error);
    }
  };

  // Table columns
  const columns = [
    { title: "Categoryname", dataIndex: "CategoryName" },
    {
      title: "Categoryimage",
      dataIndex: "CategoryImage",
      render: (CategoryImage, record) => (
        <img src={CategoryImage} alt={record.CategoryName} height="60" width="60" />
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
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

//  Handle form submit (Add/Edit Item)
// const handleSubmit = async (value) => {
//     const formData = new FormData();
//     formData.append("name", value.name);
//     if (imageFile) {
//       formData.append("image", imageFile);
    }

  const handleSubmit = async (value) => {
    const formData = new FormData();
    formData.append("CategoryName", value.CategoryName);
    if (imageFile) {
      formData.append("CategoryImage", imageFile);
    }

    try {
      dispatch({ type: "SHOW_LOADING" });
      if (editCategory === null) {
        await axios.post("/api/categoriess/add-category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category Added Successfully");
        setNewCategoryCount((prevCount) => prevCount + 1);
      } else {
        formData.append("categoryId", editCategory._id);
        await axios.put("/api/categoriess/edit-category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Category Updated Successfully");
      }
      getAllCategories();
      setPopupModal(false);
      setImageFile(null);
      setEditCategory(null);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Failed to save category.");
      console.error(error);
    }
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
          placeholder="Search categoriess"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSort}>
          {sortOrder === "asc" ? "Sort Z-A" : "Sort A-Z"}
        </Button>
      </div>

      {/* Single Table rendering filteredItems */}
      <Table columns={columns} dataSource={filteredCategories} bordered />

      {/* New Item Count */}
      <div className="my-3">
        <p>New Category Added: {newCategoryCount}</p>
      </div>

      {/* Item Popup Modal */}
      {popupModal && (
        <Modal
          title={`${editCategory !== null ? "Edit Category " : "Add New Category"}`}
          visible={popupModal}
          onCancel={() => {
            setEditCategory(null);
            setPopupModal(false);
            setImageFile(null);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={{
              CategoryName: editCategory?.CategoryName || "",
              
            }}
            onFinish={handleSubmit}
          >
            <Form.Item name="CategoryName" label="Name" rules={[{ required: true, message: "Please enter Category Name." }]}>
              <Input />
            </Form.Item>


            <Form.Item label="Image">
              <Input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
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


export default CategoryPage;
