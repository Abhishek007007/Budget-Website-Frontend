import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Select,
  Modal,
  Spin,
  Progress,
  Card,
} from "antd";
import {
  createBudget,
  getBudget,
  deleteBudget,
  updateBudget,
} from "../redux/budgetSlice";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateBudget = () => {
  const dispatch = useDispatch();
  const { budgets, loading, error } = useSelector((state) => state.budget);

  const [newBudget, setNewBudget] = useState({
    name: "",
    description: "",
    period: "monthly",
    budget_limit: 0,
  });

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    dispatch(getBudget());
  }, [dispatch]);

  useEffect(() => {
    if (budgets.length > 0) {
      setCurrentBudget(budgets[0]);
      setIsEditing(true);
    }
  }, [budgets]);

  const handleInputChange = (e, field) => {
    setNewBudget({
      ...newBudget,
      [field]: e.target.value,
    });
  };

  const handlePeriodChange = (value) => {
    setNewBudget({
      ...newBudget,
      period: value,
    });
  };

  const onCreateBudget = () => {
    if (newBudget.budget_limit <= 0 || isNaN(newBudget.budget_limit)) {
      message.error("Budget limit should be a valid number greater than zero.");
      return;
    }

    if (!isEditing) {
      dispatch(createBudget(newBudget))
        .then(() => message.success("Budget created successfully"))
        .catch(() => message.error("Failed to create budget"));
    } else {
      dispatch(updateBudget(newBudget))
        .then(() => {
          message.success("Budget updated successfully");
          setIsModalVisible(false); // Close the modal after update
        })
        .catch(() => message.error("Failed to update budget"));
    }
  };

  const onRemoveBudget = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this budget?",
      content: "This action cannot be undone.",
      onOk: () => {
        dispatch(deleteBudget(currentBudget.id))
          .then(() => {
            message.success("Budget removed successfully");
            setIsEditing(false);
            setCurrentBudget(null);
            setNewBudget({
              name: "",
              description: "",
              period: "monthly",
              budget_limit: 0,
            });
          })
          .catch(() => message.error("Failed to remove budget"));
      },
    });
  };

  const showEditModal = () => {
    setIsModalVisible(true);
    setNewBudget(currentBudget); // Load current budget data into form for editing
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const budgetLimit = currentBudget ? currentBudget.budget_limit : 0;
  const totalExpenses = currentBudget ? currentBudget.total_expenses : 0;
  const remainingBalance = budgetLimit - totalExpenses;

  const percentageSpent =
    budgetLimit === 0 ? 0 : (totalExpenses / budgetLimit) * 100;

  return (
    <div style={{ margin: "20px" }}>
      <h2>{isEditing ? "Edit Budget" : "Create a New Budget"}</h2>

      {/* Budget Form */}
      <Form
        form={form}
        onFinish={onCreateBudget}
        layout="vertical"
        style={{ marginBottom: "20px" }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Budget Name"
              name="name"
              rules={[
                { required: !isEditing, message: "Please enter a budget name" },
              ]}
            >
              <Input
                value={newBudget.name}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder={
                  isEditing ? currentBudget.name : "Enter your budget name"
                }
                disabled={isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Description" name="description">
              <Input
                value={newBudget.description}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder={
                  isEditing ? currentBudget.description : "Enter a description"
                }
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Period" name="period">
              <Select
                value={newBudget.period}
                onChange={handlePeriodChange}
                placeholder="Select period"
                disabled={isEditing}
              >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Budget Limit"
              name="budget_limit"
              rules={[
                {
                  required: !isEditing,
                  message: "Please enter a valid budget limit",
                },
              ]}
            >
              <Input
                type="number"
                value={newBudget.budget_limit}
                onChange={(e) => handleInputChange(e, "budget_limit")}
                placeholder={
                  isEditing ? currentBudget.budget_limit : "Enter budget limit"
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          {isEditing ? "Update Budget" : "Create Budget"}
        </Button>
      </Form>

      {isEditing && (
        <Row gutter={16}>
          <Col span={12} style={{ textAlign: "center" }}>
            <h4 className="mb-5">Budget Spending Overview</h4>
            <Progress
              type="circle"
              percent={percentageSpent}
              format={(percent) => (
                <span style={{ fontSize: "16px" }}>
                  {`${percent.toFixed(2)}% spent`}{" "}
                  {/* Display percentage with 2 decimal places */}
                </span>
              )}
              strokeColor={
                percentageSpent <= 50
                  ? "#52c41a" // Red if percentage is 50 or below
                  : percentageSpent <= 60
                  ? "#fadb14" // Yellow if percentage is between 50 and 60
                  : "#ff4d4f" // Green if percentage is above 60
              }
              width={180} // Increase the width to make the progress bar bigger
            />
          </Col>

          <Col span={12}>
            <Card title="Budget Details" style={{ marginTop: "24px" }}>
              <p>
                <strong>Total Limit:</strong> ₹{budgetLimit}
              </p>
              <p>
                <strong>Spent:</strong> ₹{totalExpenses}
              </p>
              <p>
                <strong>Remaining:</strong> ₹{remainingBalance}
              </p>
            </Card>
          </Col>
        </Row>
      )}

      {/* Option to Remove Budget */}
      {isEditing && (
        <Button
          type="danger"
          style={{ marginTop: "20px", color: "white" }}
          onClick={onRemoveBudget}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Budget Name"
                name="name"
                rules={[{ required: true, message: "Please enter a budget name" }]}>
                <Input
                  onChange={(e) => handleInputChange(e, "name")}
                  placeholder="Enter your budget name"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" name="description">
                <Input
                  onChange={(e) => handleInputChange(e, "description")}
                  placeholder="Enter a description"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Period" name="period">
                <Select
                  onChange={handlePeriodChange}
                  placeholder="Select period"
                  initialValue={newBudget.period}
                >
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Budget Limit"
                name="budget_limit"
                rules={[{ required: true, message: "Please enter a valid budget limit" }]}>
                <Input
                  type="number"
                  onChange={(e) => handleInputChange(e, "budget_limit")}
                  placeholder="Enter budget limit"
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">Create Budget</Button>
        </Form>
      )}

      {/* Show the editing details when editing an existing budget */}
      {isEditing && (
        <>
          {/* Top Row: Remaining Budget and Budget Details */}
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Remaining Budget"
                bordered={false}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#e6f7ff",
                  color: "#1890ff",
                }}
              >
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹{remainingBalance.toFixed(2)}</p>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Budget Details">
                <p><strong>Total Limit:</strong> ₹{budgetLimit}</p>
                <p><strong>Spent:</strong> ₹{totalExpenses}</p>
                <p><strong>Remaining:</strong> ₹{remainingBalance}</p>
              </Card>
            </Col>
          </Row>

          {/* Second Row: Budget Spending Overview */}
          <Row gutter={16} style={{ marginTop: "24px" }}>
            <Col span={24} style={{ textAlign: "center" }}>
              <p>Budget Spending Overview</p>
              <Progress
                type="circle"
                percent={percentageSpent}
                format={(percent) => (
                  <span style={{ fontSize: '16px' }}>
                    {`${percent.toFixed(2)}% spent`}
                  </span>
                )}
                strokeColor={
                  percentageSpent <= 50 ? '#52c41a' :
                  percentageSpent <= 60 ? '#fadb14' :
                  '#ff4d4f'
                }
                width={180}
              />
            </Col>
          </Row>

          {/* Button to Edit Budget */}
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={showEditModal}
          >
            Edit Budget
          </Button>

          {/* Option to Remove Budget */}
          <Button
            type="danger"
            style={{ marginTop: "20px", marginLeft: "10px", color: 'white' }}
            onClick={onRemoveBudget}
          >
            Remove Budget
          </Button>
        </>
      )}

      {/* Modal for Editing Budget */}
      <Modal
        title="Edit Budget"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={form.submit} // Trigger form submission on "OK" button
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          onFinish={onCreateBudget}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Budget Name"
                name="name"
                initialValue={newBudget.name}
                rules={[{ required: true, message: "Please enter a budget name" }]} >
                <Input
                  onChange={(e) => handleInputChange(e, "name")}
                  placeholder="Enter your budget name"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" name="description" initialValue={newBudget.description}>
                <Input
                  onChange={(e) => handleInputChange(e, "description")}
                  placeholder="Enter a description"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Period" name="period" initialValue={newBudget.period}>
                <Select onChange={handlePeriodChange} placeholder="Select period">
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Budget Limit"
                name="budget_limit"
                initialValue={newBudget.budget_limit}
                rules={[{ required: true, message: "Please enter a valid budget limit" }]}>
                <Input
                  type="number"
                  onChange={(e) => handleInputChange(e, "budget_limit")}
                  placeholder="Enter budget limit"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBudget;
