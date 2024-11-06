import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeSource } from "../redux/incomeSlice";
import { Modal, Button, Input, Card, Typography, Row, Col, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function IncomeSource() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newIncomeSource, setNewIncomeSource] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddIncomeSource = () => {
    if (newIncomeSource.trim()) {
      dispatch(postIncomeSource({ source_name: newIncomeSource, editIndex }));
      setNewIncomeSource("");
      setIsModalVisible(false);
      setEditIndex(null);
    }
  };

  const openAddModal = () => {
    setIsModalVisible(true);
    setNewIncomeSource("");
    setEditIndex(null);
  };

  const openEditModal = (index, sourceName) => {
    setIsModalVisible(true);
    setNewIncomeSource(sourceName);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    // Implement your delete logic here
    console.log("Deleting income source at index:", index);
  };

  return (
    <div className="income-source-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Title level={3}>Income Sources</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          Add Income Source
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {income.incomeSourceList.map((source, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              actions={[
                <EditOutlined onClick={() => openEditModal(index, source.source_name)} />,
                <DeleteOutlined onClick={() => handleDelete(index)} />,
              ]}
            >
              <Text>{source.source_name}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editIndex !== null ? "Edit Income Source" : "Add Income Source"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddIncomeSource}
        okText={editIndex !== null ? "Update" : "Add"}
      >
        <Input
          placeholder="Enter income source"
          value={newIncomeSource}
          onChange={(e) => setNewIncomeSource(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default IncomeSource;
