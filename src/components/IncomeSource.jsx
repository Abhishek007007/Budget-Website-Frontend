import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Typography, Card, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { postIncomeSource, deleteIncomeSource, getIncomeSourceList, getIncomeItemsList } from "../redux/incomeSlice";

const { Title } = Typography;

function IncomeSource() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newIncomeSource, setNewIncomeSource] = useState("");
  const [editSourceId, setEditSourceId] = useState(null);
  const [editSourceName, setEditSourceName] = useState("");
  const [isCustomSource, setIsCustomSource] = useState(false); // Toggle between predefined and custom sources

  const predefinedIncomeSources = [
    { name: "Salary 💼", id: "salary" },
    { name: "Freelance 💻", id: "freelance" },
    { name: "Investment 💰", id: "investment" },
    { name: "Rental Income 🏠", id: "rental" },
    { name: "Business Income 🏢", id: "business" },
    { name: "Dividend Income 📈", id: "dividend" },
    { name: "Other 📝", id: "other" },
  ];

  // Handle adding a new income source (either from predefined or custom)
  const handleAddIncomeSource = (sourceName) => {
    dispatch(postIncomeSource(sourceName));
    setNewIncomeSource("");
    setIsAddingSource(false);
    setIsCustomSource(false); // Reset after adding
  };

  // Handle editing an income source
  const handleEditIncomeSource = () => {
    if (editSourceId && editSourceName) {
      // Implement the functionality to update the income source here
    }
  };

  // Open the edit modal with the source info
  const openEditModal = (source) => {
    setEditSourceId(source.id);
    setEditSourceName(source.name);
  };

  // Handle deleting an income source
  const handleDeleteIncomeSource = async (id) => {
    await dispatch(deleteIncomeSource(id));
    dispatch(getIncomeSourceList());
    dispatch(getIncomeItemsList());
  };

  // Close the edit modal
  const handleCancelEdit = () => {
    setEditSourceId(null);
    setEditSourceName("");
  };

  // Fetch the income sources when the component mounts
  useEffect(() => {
    if (income.incomeSourceList.length === 0) {
      dispatch(getIncomeSourceList());
    }
  }, [income.incomeSourceList]);

  return (
    <div className="w-100 h-25 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center">
        <Title level={4}>Income Sources</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddingSource(true)}>
          Add Income Source
        </Button>
      </div>

      {/* Modal for Adding a New Income Source */}
      <Modal
        title="Add Income Source"
        visible={isAddingSource}
        onCancel={() => setIsAddingSource(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Title level={5}>Choose a Predefined Source or Enter a Custom One:</Title>
          
          {/* Buttons for Predefined Income Sources */}
          <Space wrap>
            {predefinedIncomeSources.map((source) => (
              <Button
                key={source.id}
                type="default"
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#f0f5ff",
                }}
                onClick={() => handleAddIncomeSource(source.name)}
              >
                {source.name}
              </Button>
            ))}
          </Space>
          
          {/* Toggle to enter a custom income source */}
          <Button
            type="default"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#f0f5ff",
            }}
            onClick={() => setIsCustomSource(!isCustomSource)}
          >
            {isCustomSource ? "Select Predefined" : "Enter Custom Source"}
          </Button>
          
          {/* Input for Custom Income Source */}
          {isCustomSource && (
            <Input
              placeholder="Enter custom income source"
              value={newIncomeSource}
              onChange={(e) => setNewIncomeSource(e.target.value)}
              style={{ marginTop: "10px" }}
            />
          )}
          
          {/* Add Custom Income Source Button */}
          {isCustomSource && newIncomeSource && (
            <Button
              type="primary"
              style={{ marginTop: "10px" }}
              onClick={() => handleAddIncomeSource(newIncomeSource)}
            >
              Add Custom Source
            </Button>
          )}
        </Space>
      </Modal>

      {/* Modal for Editing an Existing Income Source */}
      <Modal
        title="Edit Income Source"
        visible={!!editSourceId}
        onOk={handleEditIncomeSource}
        onCancel={handleCancelEdit}
        okText="Update"
        cancelText="Close"
      >
        <Input
          placeholder="Edit income source name"
          value={editSourceName}
          onChange={(e) => setEditSourceName(e.target.value)}
        />
      </Modal>

      {/* Row of Cards with Custom Background Color, Rounded Corners, and Shadow */}
      <div style={{ display: "flex" }}>
        <Space size="middle">
          {income.incomeSourceList.length > 0 ? (
            income.incomeSourceList.map((source) => (
              <Card
                key={source.id}
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
                    onClick={() => openEditModal(source)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    style={{ color: "red" }} // Red for delete icon
                    onClick={() => handleDeleteIncomeSource(source.id)}
                  />,
                ]}
              >
                <Card.Meta title={source.source_name} />
              </Card>
            ))
          ) : (
            <div>No income sources available.</div>
          )}
        </Space>
      </div>
    </div>
  );
}

export default IncomeSource;
