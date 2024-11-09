import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Typography, Card, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  postExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategoryList,
  editExpenseCategory,
  getExpenseItemsList
} from "../redux/expenseSlice";

const { Title } = Typography;

function ExpenseCategory() {
  const expense = useSelector((state) => state.expense);
  const dispatch = useDispatch();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false); // To toggle between predefined and custom categories

  const predefinedCategories = [
    { name: "Household 🏠", id: "household" },
    { name: "Travel ✈️", id: "travel" },
    { name: "Food 🍔", id: "food" },
    { name: "Entertainment 🎬", id: "entertainment" },
    { name: "Health 🏥", id: "health" },
    { name: "Education 📚", id: "education" },
    { name: "Transportation 🚗", id: "transportation" }
  ];

  // Handle adding a new expense category (either from predefined or custom)
  const handleAddExpenseCategory = (categoryName) => {
    dispatch(postExpenseCategory(categoryName));
    setNewExpenseCategory("");
    setIsAddingCategory(false);
    setIsCustomCategory(false); // Reset after adding
  };

  // Handle editing an expense category
  const handleEditExpenseCategory = () => {
    if (editCategoryId && editCategoryName) {
      dispatch(editExpenseCategory([editCategoryId, editCategoryName]));
      setEditCategoryId(null);
      setEditCategoryName("");
    }
  };

  // Open the edit modal with the category info
  const openEditModal = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  // Handle deleting an expense category
  const handleDeleteExpenseCategory = async(id) => {
    await dispatch(deleteExpenseCategory(id));
    dispatch(getExpenseCategoryList());
    dispatch(getExpenseItemsList())
  };

  // Close the edit modal
  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };

  // Fetch the expense categories when the component mounts
  useEffect(() => {
    if (expense.expenseCategoryList.length === 0) {
      dispatch(getExpenseCategoryList());
    }
  }, [expense.expenseCategoryList]);

  return (
    <div className="w-100 h-25 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center">
        <Title level={4}>Expense Categories</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddingCategory(true)}>
          Add Expense Category
        </Button>
      </div>

      {/* Modal for Adding a New Expense Category */}
      <Modal
        title="Add Expense Category"
        visible={isAddingCategory}
        onCancel={() => setIsAddingCategory(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={5}>Choose a Predefined Category or Enter a Custom One:</Title>
          
          {/* Buttons for Predefined Categories */}
          <Space wrap>
            {predefinedCategories.map((category) => (
              <Button
                key={category.id}
                type="default"
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#f0f5ff",
                }}
                onClick={() => handleAddExpenseCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </Space>
          
          {/* Toggle to enter a custom category */}
          <Button
            type="default"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#f0f5ff",
            }}
            onClick={() => setIsCustomCategory(!isCustomCategory)}
          >
            {isCustomCategory ? "Select Predefined" : "Enter Custom Category"}
          </Button>
          
          {/* Input for Custom Category */}
          {isCustomCategory && (
            <Input
              placeholder="Enter custom expense category"
              value={newExpenseCategory}
              onChange={(e) => setNewExpenseCategory(e.target.value)}
              style={{ marginTop: "10px" }}
            />
          )}
          
          {/* Add Custom Category Button */}
          {isCustomCategory && newExpenseCategory && (
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={() => handleAddExpenseCategory(newExpenseCategory)}
            >
              Add Custom Category
            </Button>
          )}
        </Space>
      </Modal>

      {/* Modal for Editing an Existing Expense Category */}
      <Modal
        title="Edit Expense Category"
        visible={!!editCategoryId}
        onOk={handleEditExpenseCategory}
        onCancel={handleCancelEdit}
        okText="Update"
        cancelText="Close"
      >
        <Input
          placeholder="Edit expense category name"
          value={editCategoryName}
          onChange={(e) => setEditCategoryName(e.target.value)}
        />
      </Modal>

      {/* Row of Cards with Custom Background Color, Rounded Corners, and Shadow */}
      <div style={{ display: "flex" }}>
        <Space size="middle">
          {expense.expenseCategoryList.length > 0 ? (
            expense.expenseCategoryList.map((category) => (
              <Card
                key={category.id}
                style={{
                  width: 250,
                  minHeight: 100,
                  backgroundColor: "#f0f5ff",
                  borderRadius: "10px", // Rounded corners
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adding shadow
                }}
                bordered={true}
                actions={[
                  <EditOutlined
                    key="edit"
                    style={{ color: "blue" }} // Yellow for edit icon
                    onClick={() => openEditModal(category)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    style={{ color: "red" }} // Red for delete icon
                    onClick={() => handleDeleteExpenseCategory(category.id)}
                  />,
                ]}
              >
                <Card.Meta title={category.name} />
              </Card>
            ))
          ) : (
            <div>No expense categories available.</div>
          )}
        </Space>
      </div>
    </div>
  );
}

export default ExpenseCategory;
