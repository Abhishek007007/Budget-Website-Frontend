import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Typography, Card, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { postIncomeSource, deleteIncomeSource, getIncomeSourceList } from "../redux/incomeSlice";

const { Title } = Typography;

function IncomeSource() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newIncomeSource, setNewIncomeSource] = useState("");
  const [editSourceId, setEditSourceId] = useState(null);
  const [editSourceName, setEditSourceName] = useState("");

  // Handle adding a new income source
  const handleAddIncomeSource = () => {
    dispatch(postIncomeSource(newIncomeSource));
    setNewIncomeSource("");
    setIsAddingSource(false);
  };

  // Handle editing an income source
  const handleEditIncomeSource = () => {
    console.log(""); // Add the functionality to handle income source editing
  };

  // Open the edit modal with the source info
  const openEditModal = (source) => {
    setEditSourceId(source.id);
    setEditSourceName(source.name);
  };

  // Handle deleting an income source
  const handleDeleteIncomeSource = (id) => {
    dispatch(deleteIncomeSource(id));
  };

  // Close the edit modal
  const handleCancelEdit = () => {
    setEditSourceId(null);
    setEditSourceName("");
  };

  // Fetch the income sources when the component mounts or when the list changes
  useEffect(() => {
    if (income.incomeSourceList.length === 0) {
      dispatch(getIncomeSourceList());
    }
  }, [dispatch, income.incomeSourceList]);

  // Refresh income source list when an income source is deleted
  useEffect(() => {
    dispatch(getIncomeSourceList());
  }, [dispatch, income.incomeSourceList]);

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
        onOk={handleAddIncomeSource}
        onCancel={() => setIsAddingSource(false)}
        okText="Add"
        cancelText="Close"
      >
        <Input
          placeholder="Enter new income source"
          value={newIncomeSource}
          onChange={(e) => setNewIncomeSource(e.target.value)}
        />
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
                    style={{ color: "yellow" }} // Yellow for edit icon
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
