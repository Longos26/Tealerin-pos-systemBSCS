import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Input } from "antd";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
      }
    };

    const getAllCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories/get-categories");
        setCategoriesData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllItems();
    getAllCategories();
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <DefaultLayout>
      <div className="d-flex">
        <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          {categoriesData.map((category) => (
            <div
              key={category.name}
              className={`d-flex category ${
                selectedCategory === category.name && "category-active"
              }`}
              onClick={() => setSelectedCategory(category.name)}
              style={{ display: "inline-block", cursor: "pointer" }}
            >
              <h4>{category.name}</h4>
              <img
                src={category.image}
                alt={category.name}
                height="40"
                width="60"
              />
            </div>
          ))}
        </div>
      </div>

      <Input
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ margin: "20px 0" }}
      />

      <Row>
        {itemsData
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (item.category === selectedCategory || selectedCategory === "all")
          )
          .map((item) => (
            <Col xs={24} lg={6} md={12} sm={6} key={item.id}>
              <ItemList item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
