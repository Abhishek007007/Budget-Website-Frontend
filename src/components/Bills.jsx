import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBillReminders,
  addBillReminder,
  deleteBillReminder,
  markBillAsPaid,
} from "../redux/billsSlice";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  notification,
  Calendar,
  Row,
  Col,
  List,
  Typography,
  Card,
} from "antd";

const { Title } = Typography;

const BillReminderComponent = () => {
  const dispatch = useDispatch();
  const { billReminders, loading, error } = useSelector(
    (state) => state.billReminders
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false); // To control the calendar modal visibility
  const [billForm, setBillForm] = useState({
    bill_name: "",
    amount: "",
    category: "",
    due_date: "",
    recurring_interval: "",
    reminder_time: "",
  });

  useEffect(() => {
    dispatch(getBillReminders());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setBillForm({
      ...billForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value, field) => {
    setBillForm({
      ...billForm,
      [field]: value,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showCalendarModal = () => {
    setCalendarModalVisible(true);
  };

  const handleSubmit = (values) => {
    const billData = {
      ...values,
      due_date: values.due_date.format("YYYY-MM-DD"),
    };

    dispatch(addBillReminder(billData))
      .then(() => {
        notification.success({ message: "Bill added successfully!" });
        setIsModalVisible(false);
      })
      .catch(() => {
        notification.error({
          message: "Failed to add bill. Please try again.",
        });
      });
  };

  const handleDeleteBill = (id) => {
    dispatch(deleteBillReminder(id))
      .then(() => {
        notification.success({ message: "Bill deleted successfully!" });
      })
      .catch(() => {
        notification.error({
          message: "Failed to delete bill. Please try again.",
        });
      });
  };

  const handleMarkAsPaid = (billId) => {
    dispatch(markBillAsPaid(billId))
      .then(() => {
        notification.success({ message: "Bill marked as paid successfully!" });
      })
      .catch((error) => {
        notification.error({
          message: `Failed to mark bill as paid: ${error.message}`,
        });
      });
  };

  const getRecurringDates = (bill) => {
    const dates = [];
    const start = moment(bill.due_date);

    if (bill.recurring_interval === "monthly") {
      for (let i = 0; i < 12; i++) {
        dates.push(start.clone().add(i, "months").format("YYYY-MM-DD"));
      }
    }

    return dates;
  };

  const renderCalendarDateCell = (value) => {
    const currentDate = value.format("YYYY-MM-DD");
    const billsOnThisDate = billReminders.filter((bill) => {
      const recurringDates = getRecurringDates(bill);
      console.log(recurringDates);
      return recurringDates.includes(currentDate);
    });

    return (
      <ul>
        {billsOnThisDate.map((bill) => (
          <li key={bill.id}>{bill.bill_name}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="px-4">
      <Title level={2}>Bill Reminders</Title>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        Add New Bill
      </Button>

      <Button
        type="default"
        onClick={showCalendarModal}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        View Bill Calendar
      </Button>

      <List
        header={<Title level={3}>Upcoming Bills</Title>}
        bordered
        dataSource={billReminders}
        renderItem={(bill) => (
          <List.Item
            actions={[
              <Button
                type="link"
                danger
                onClick={() => handleDeleteBill(bill.id)}
              >
                Delete
              </Button>,
              !bill.is_paid && (
                <Button type="link" onClick={() => handleMarkAsPaid(bill.id)}>
                  Mark as Paid
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={`${bill.bill_name} - ₹${bill.amount}`}
              description={`Due: ${moment(bill.due_date).format(
                "YYYY-MM-DD"
              )} - Status: ${bill.is_paid ? "Paid" : "Unpaid"}`}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Bill Calendar"
        visible={calendarModalVisible}
        onCancel={() => setCalendarModalVisible(false)}
        footer={null}
        width={800}
      >
        <Calendar dateCellRender={renderCalendarDateCell} />
      </Modal>

      <Modal
        title="Add New Bill"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={billForm}
        >
          <Form.Item
            label="Bill Name"
            name="bill_name"
            rules={[{ required: true, message: "Please input the bill name!" }]}
          >
            <Input name="bill_name" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Please input the bill amount!" },
            ]}
          >
            <Input name="amount" type="number" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select onChange={(value) => handleSelectChange(value, "category")}>
              <Select.Option value="Electricity">Electricity</Select.Option>
              <Select.Option value="Internet">Internet</Select.Option>
              <Select.Option value="Rent">Rent</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="due_date"
            rules={[{ required: true, message: "Please select a due date!" }]}
          >
            <DatePicker
              onChange={(date) => setBillForm({ ...billForm, due_date: date })}
            />
          </Form.Item>

          <Form.Item label="Recurring Interval" name="recurring_interval">
            <Select
              onChange={(value) =>
                handleSelectChange(value, "recurring_interval")
              }
            >
              <Select.Option value="monthly">Monthly</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
              <Select.Option value="annually">Annually</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Reminder Time" name="reminder_time">
            <Input
              name="reminder_time"
              onChange={handleInputChange}
              placeholder="e.g. 1 day before"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save Bill
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default BillReminderComponent;
