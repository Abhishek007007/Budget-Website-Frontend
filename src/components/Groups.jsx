import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroups,
  deleteGroup,
  createGroup,
  addGroupMember,
  removeGroupMember,
  createExpense,
  deleteExpense,
} from "../redux/groupSlice";
import {
  Button,
  Modal,
  Spin,
  notification,
  Card,
  Input,
  Form,
  Collapse,
  Avatar,
  Divider,
  Row,
  Col,
  Table,
} from "antd";
import { DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import authSlice from "../redux/authSlice";

const { Panel } = Collapse;

const Groups = () => {
  const dispatch = useDispatch();
  const { groupsList, loading, error, success } = useSelector(
    (state) => state.groups
  );

  const user = useSelector((state) => state.auth.user);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [newGroupName, setNewGroupName] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  console.log(isMembersModalVisible);
  useEffect(() => {
    console.log(groupsList);
    if (loading === false && success === true && selectedGroup !== null) {
      setSelectedGroup(
        groupsList.find((element) => element.id === selectedGroup.id)
      );
    }
  }, [groupsList]);

  useEffect(() => {
    if (newMemberUsername !== "" && loading === false && success === true) {
      dispatch(getGroups());
      openNotification(
        "Member Added",
        "The member has been added to the group."
      );
      setNewMemberUsername(""); // Clear the input field
    } else if (error !== null) {
      openNotification("Error", "Failed to add member.");
    }
  }, [loading, error, success]);

  const handleAddExpense = async () => {
    if (selectedGroup && newExpenseDescription && newExpenseAmount) {
      const expenseData = {
        title: newExpenseDescription,
        amount: parseFloat(newExpenseAmount),
        description: newExpenseDescription,
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
      };

      await dispatch(createExpense({ groupId: selectedGroup.id, expenseData }));
      dispatch(getGroups());

      setNewExpenseDescription("");
      setNewExpenseAmount("");
      openNotification(
        "Expense Added",
        "The expense has been added successfully."
      );
      setIsExpenseModalVisible(false); // Close modal after adding
    } else {
      openNotification(
        "Error",
        "Please provide a valid description and amount."
      );
    }
  };

  const openNotification = (message, description) => {
    if (message !== "Error") {
      notification.success({
        message,
        description,
        duration: 2,
      });
    } else {
      notification.error({
        message,
        description,
        duration: 2,
      });
    }
  };

  const handleDelete = (groupId) => {
    console.log("Group to delete:", groupId); // Debugging log
    setGroupToDelete(groupId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      dispatch(deleteGroup(groupToDelete))
        .then(() => {
          openNotification(
            "Group Deleted",
            "The group has been deleted successfully."
          );
          dispatch(getGroups()); // Refresh the groups list after deleting
        })
        .catch(() => {
          openNotification("Error", "Failed to delete group.");
        });
      setIsDeleteModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleCreateGroup = () => {
    if (newGroupName) {
      dispatch(createGroup({ name: newGroupName }));
      setIsCreateModalVisible(false);
      setNewGroupName("");
      openNotification(
        "Group Created",
        "The group has been created successfully."
      );
    } else {
      openNotification("Error", "Please provide a group name.");
    }
  };

  const cancelCreateGroup = () => {
    setIsCreateModalVisible(false);
    setNewGroupName("");
  };

  const openMembersModal = (group) => {
    setSelectedGroup(group);
    setIsMembersModalVisible(true);
  };

  const cancelMembersModal = useCallback(() => {
    setIsMembersModalVisible(false);
    setSelectedGroup(null);
    setNewMemberUsername("");
  }, []);

  const handleAddMember = () => {
    if (newMemberUsername && selectedGroup) {
      dispatch(
        addGroupMember({
          groupId: selectedGroup.id,
          username: newMemberUsername,
        })
      );
    } else {
      openNotification("Error", "Please provide a valid username.");
    }
  };

  const handleRemoveMember = async (username) => {
    if (selectedGroup) {
      try {
        await dispatch(
          removeGroupMember({ groupId: selectedGroup.id, username })
        );
        dispatch(getGroups()); // Re-fetch groups to get the latest data
        // Update selectedGroup with the latest data

        openNotification(
          "Member Removed",
          `${username} has been removed from the group.`
        );
      } catch (error) {
        openNotification("Error", "Failed to remove member.");
      }
    }
  };

  const openExpenseModal = (group) => {
    setSelectedGroup(group); // Set the selected group before opening the expense modal
    setIsExpenseModalVisible(true);
  };

  // if (loading) {
  //   return <Spin size="large" />;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  const expenseColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount (INR)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `${text} INR`, // Optional: format amount with "INR" suffix
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (expense) => (
        <Button
          disabled={user.id !== expense.user}
          type="danger"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            handleDeleteExpense(expense.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleDeleteExpense = async (expenseId) => {
    try {
      await dispatch(deleteExpense(expenseId)); // Assuming you have a deleteExpense action
      openNotification(
        "Expense Deleted",
        "The expense has been deleted successfully."
      );
      dispatch(getGroups()); // Re-fetch groups to get the latest data
    } catch (error) {
      openNotification("Error", "Failed to delete expense.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Groups</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsCreateModalVisible(true)}
        style={{ marginBottom: "20px" }}
        disabled={loading}
      >
        Create Group
      </Button>

      {groupsList.length === 0 ? (
        <div>No groups available</div>
      ) : (
        <Collapse bordered={false} expandIconPosition="right">
          {groupsList.map((group) => (
            <Panel
              header={group.name}
              key={group.id}
              extra={
                <>
                  <Button
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={() => openMembersModal(group)}
                    style={{ marginRight: "10px" }}
                    disabled={loading}
                  >
                    Members
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openExpenseModal(group)}
                    style={{ marginRight: "10px" }}
                    disabled={loading}
                  >
                    Add Expense
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(group.id)}
                    disabled={loading || user.username !== group.admin}
                  >
                    Delete
                  </Button>
                </>
              }
            >
              <Card bordered={false} style={{ marginBottom: "20px" }}>
                <p>
                  <strong>Group Information:</strong>
                </p>
                <p>Members: {group.members.length}</p>
                <p>Expenses: {group.expenses?.length || 0}</p>

                <Collapse bordered={false} style={{ marginTop: "20px" }}>
                  <Panel header="Expenses" key="1">
                    {group.expenses?.length > 0 ? (
                      <Table
                        columns={expenseColumns}
                        dataSource={group.expenses.map((expense) => ({
                          key: expense.id,
                          title: expense.title,
                          description: expense.description,
                          amount: expense.amount,
                          date: expense.date,
                          action: expense,
                        }))}
                        pagination={true}
                      />
                    ) : (
                      <p>No expenses added yet.</p>
                    )}
                  </Panel>
                </Collapse>
              </Card>
            </Panel>
          ))}
        </Collapse>
      )}

      {/* Modal for Creating Group */}
      <Modal
        title="Create Group"
        visible={isCreateModalVisible}
        onOk={handleCreateGroup}
        onCancel={cancelCreateGroup}
      >
        <Form layout="vertical">
          <Form.Item label="Group Name">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Adding Expense */}
      <Modal
        title="Add Expense"
        visible={isExpenseModalVisible}
        onCancel={() => setIsExpenseModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Expense Title (Description)">
            <Input
              value={newExpenseDescription}
              onChange={(e) => setNewExpenseDescription(e.target.value)}
              placeholder="Enter expense description"
            />
          </Form.Item>
          <Form.Item label="Amount">
            <Input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleAddExpense}
              disabled={!newExpenseDescription || !newExpenseAmount}
            >
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Confirm Delete */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this group?</p>
      </Modal>

      {/* Modal for Members */}
      <Modal
        title="Group Members"
        open={isMembersModalVisible}
        onCancel={cancelMembersModal}
        footer={null}
      >
        <div>
          {selectedGroup && (
            <>
              <Row gutter={[16, 16]}>
                {selectedGroup.members.map((member) => (
                  <Col span={8} key={member.username}>
                    <Card
                      hoverable
                      style={{ width: "100%" }}
                      actions={[
                        selectedGroup.admin !== member.username ? (
                          <Button
                            danger
                            onClick={() => handleRemoveMember(member.username)}
                          >
                            Remove
                          </Button>
                        ) : null,
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={member.username}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Divider />
              <Input
                placeholder="Add new member"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
                style={{ marginBottom: "20px" }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddMember}
                disabled={!newMemberUsername}
              >
                Add Member
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
