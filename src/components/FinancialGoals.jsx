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
  Avatar,
  Divider,
} from "antd";
import {
  createGoal,
  getGoals,
  deleteGoal,
  updateGoal,
} from "./../redux/financialGoalsSlice";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, LoadingOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import {
  getExpenseCategoryList,
  getExpenseItemsList,
} from "../redux/expenseSlice";
import Meta from "antd/es/card/Meta";

const { Option } = Select;

const FinancialGoals = () => {
  const newGoalModel = {
    name: "",
    description: "",
    target_amount: 0,
    current_amount: 0,
    allocated_amount: 0,
    target_date: "",
    recurrence: "monthly",
    income_source: "",
  };

  const dispatch = useDispatch();
  const { goals, loading, error } = useSelector((state) => state.goals);

  const [newGoal, setNewGoal] = useState(newGoalModel);
  const [isEditing, setIsEditing] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  const handleInputChange = (e, field) => {
    setNewGoal({
      ...newGoal,
      [field]: e.target.value,
    });
  };

  const handleCreateOrUpdateGoal = async () => {
    if (!isEditing) {
      await dispatch(createGoal(newGoal));
      if (goals.error !== null) {
        setNewGoal(newGoalModel);
        form.resetFields();
        message.success("Goal created successfully");
      } else {
        message.error("Failed to create goal");
      }
    } else {
      try {
        await dispatch(
          updateGoal({ goalId: currentGoal.id, updatedData: newGoal })
        );
        dispatch(getExpenseCategoryList());
        dispatch(getExpenseItemsList());
        message.success("Goal updated successfully");
        setIsEditing(false);
        setCurrentGoal(null);
      } catch (error) {
        message.error("Failed to update goal");
      }
    }
  };

  const onRemoveGoal = (goal) => {
    Modal.confirm({
      title: "Are you sure you want to delete this goal?",
      content: "This action cannot be undone.",
      onOk: async () => {
        await dispatch(deleteGoal(goal.id));
        if (goals.error !== null) {
          message.success("Goal removed successfully");
        } else {
          message.error("Failed to remove goal");
        }
      },
    });
  };

  const openEditModal = (goal) => {
    setIsEditing(true);
    setCurrentGoal(goal);
    setNewGoal(goal);
    editForm.setFieldsValue(goal);
  };

  const openContributionModal = (goal) => {
    setCurrentGoal(goal);
    setContributionAmount(0);
    setIsContributionModalOpen(true);
  };

  const handleContribution = async () => {
    const updatedAmount =
      parseFloat(currentGoal.current_amount) + parseFloat(contributionAmount);

    const updatedGoal = {
      ...currentGoal,
      current_amount:
        updatedAmount > parseFloat(currentGoal.target_amount)
          ? currentGoal.target_amount
          : String(updatedAmount),
    };

    await dispatch(
      updateGoal({ goalId: currentGoal.id, updatedData: updatedGoal })
    );
    message.success("Contribution added successfully");
    setIsContributionModalOpen(false);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h5>
        {isEditing ? "Edit Financial Goal" : "Create a New Financial Goal"}
      </h5>

      <Form
        form={form}
        onFinish={handleCreateOrUpdateGoal}
        layout="vertical"
        style={{ marginBottom: "20px" }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Goal Name"
              name="name"
              rules={[{ required: true, message: "Please enter a goal name" }]}
            >
              <Input
                value={newGoal.name}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder="Enter goal name"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Description" name="description">
              <Input
                value={newGoal.description}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder="Enter description"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Target Amount" name="target_amount">
              <Input
                type="number"
                value={newGoal.target_amount}
                onChange={(e) => handleInputChange(e, "target_amount")}
                placeholder="Enter target amount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Current Amount" name="current_amount">
              <Input
                type="number"
                value={newGoal.current_amount}
                onChange={(e) => handleInputChange(e, "current_amount")}
                placeholder="Enter current amount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Target Date" name="target_date">
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => handleInputChange(e, "target_date")}
                placeholder="Enter target date"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Recurrence" name="recurrence">
              <Select
                value={newGoal.recurrence}
                onChange={(value) =>
                  setNewGoal({ ...newGoal, recurrence: value })
                }
                placeholder="Select recurrence"
              >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit">
          {isEditing ? "Update Goal" : "Create Goal"}
        </Button>
      </Form>

      <Modal
        title="Edit Financial Goal"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={handleCreateOrUpdateGoal}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Goal Name"
            name="name"
            rules={[{ required: true, message: "Please enter a goal name" }]}
          >
            <Input
              value={newGoal.name}
              onChange={(e) => handleInputChange(e, "name")}
              placeholder="Enter goal name"
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input
              value={newGoal.description}
              onChange={(e) => handleInputChange(e, "description")}
              placeholder="Enter description"
            />
          </Form.Item>
          <Form.Item label="Target Amount" name="target_amount">
            <Input
              type="number"
              value={newGoal.target_amount}
              onChange={(e) => handleInputChange(e, "target_amount")}
              placeholder="Enter target amount"
            />
          </Form.Item>
          <Form.Item label="Current Amount" name="current_amount">
            <Input
              type="number"
              value={newGoal.current_amount}
              onChange={(e) => handleInputChange(e, "current_amount")}
              placeholder="Enter current amount"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Make a Contribution"
        visible={isContributionModalOpen}
        onCancel={() => setIsContributionModalOpen(false)}
        onOk={handleContribution}
      >
        <Form layout="vertical">
          <Form.Item label="Contribution Amount">
            <Input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(Number(e.target.value))}
              placeholder="Enter contribution amount"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Divider/>
      <div style={{ marginTop: "20px" }}>
  {loading ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  ) : (
    <Row gutter={[16, 16]}>
      {goals.map((goal, idx) => (
        <Col span={8} key={goal.id}> {/* Adjust span to control the number of cards per row */}
          <Card
            style={{
              width: "100%",  // Set width to 100% to fill the available space inside the column
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
            actions={[
              <SettingOutlined key="setting" style={{ color: "blue" }} />,
              <EditOutlined key="edit" onClick={() => openEditModal(goal)} />,
              <DeleteOutlined
                key="delete"
                onClick={() => onRemoveGoal(goal)}
                style={{ color: "#f5222d" }}
              />,
              <PlusCircleOutlined
                key="contribution"
                onClick={() => openContributionModal(goal)}
                style={{ color: "green" }}
              />,
            ]}
          >
            <Row justify="space-between" align="middle" style={{ padding: "16px", display: "flex" }}>
              <Col span={12}>
                <Meta
                  title={goal.name}
                  style={{
                    color: 'blue'
                  }}
                  description={goal.description}
                />
              </Col>
              <Col span={12} style={{ textAlign: "center" }}>
                <Progress
                  type="dashboard"
                  percent={(goal.current_amount / goal.target_amount) * 100}
                  format={(percent) => (
                    <span style={{ fontSize: "12px", color: "#595959" }}>
                      {`${percent.toFixed(2)}%`}
                    </span>
                  )}
                  strokeColor={
                    (goal.current_amount / goal.target_amount) * 100 <= 50
                      ? "#ff4d4f" // Red if percentage is 50 or below
                      : (goal.current_amount / goal.target_amount) * 100 <= 60
                      ? "#fadb14" // Yellow if percentage is between 50 and 60
                      : "#52c41a" // Green if percentage is above 60
                  }
                  width={80}
                />
              </Col>
            </Row>

            <div style={{ padding: "16px" }}>
              <p style={{ color: "#595959" }}>
               <b> Target :</b> ₹{goal.target_amount}
              </p>
              <p style={{ color: "#595959" }}>
                <b>Current</b>: ₹{goal.current_amount}
              </p>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )}
</div>

    </div>
  );
};

export default FinancialGoals;
