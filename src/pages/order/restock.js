import React, { useState, useEffect } from "react";
import LayoutComponent from "../../Components/Layout";
import {
  Button,
  Form,
  Input,
  Table,
  Tag,
  Space,
  Tooltip,
  Modal,
  Badge,
  Row,
  Col,
  Card,
} from "antd";
import { getSubItem } from "../../actions/subItems";
import { getRestockOrders, restockSubItem } from "../../actions/restock";
import { toast, ToastContainer } from "react-toastify";

const restock = () => {
  const [refresh, setRefresh] = useState(false);
  const [subItems, setSubItems] = useState();
  const [selectedSubItem, setSelectSubItem] = useState();

  const columns = [
    {
      title: "Sub-Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "_id",
      render: (props) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              onClick={() =>
                setSelectSubItem(
                  subItems.filter((item) => item._id === props)[0]
                )
              }>
              Restock
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setSelectSubItem();
  };

  const handleRestock = (values) => {
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    restockSubItem(selectedSubItem._id, values)
      .then(({ data }) => {
        toast.dismiss();
        toast("Item Sold Successfully", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log({ data });
        handleCancel();
        setRefresh(!refresh);
      })
      .catch((err) => {
        toast.dismiss();
        toast("There was error while performing the action", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log(err);
      });
    console.log(values);
  };
  useEffect(() => {
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    getSubItem()
      .then(({ data }) => {
        toast.dismiss();
        console.log(data);
        setSubItems(data.subItems);
      })
      .catch((err) => {
        toast.dismiss();
        toast("There was error while performing the action", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log(err);
      });
  }, [refresh]);
  return (
    <LayoutComponent>
      <h1 className="text-2xl">Restock the SubItems</h1>
      <Table columns={columns} dataSource={subItems} pagination={false} />
      {selectedSubItem && (
        <Modal
          title={`Restock ${selectedSubItem.name}`}
          visible={selectedSubItem}
          onCancel={handleCancel}
          footer={[]}>
          <Form onFinish={handleRestock}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true }]}>
              <Input placeholder="Enter Amount to be added" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <small className="text-red-500 mx-2	">
                (Warning: This actions cannot be undone)
              </small>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <hr />

      <ActivityCard refresh={refresh} />
      <ToastContainer />
    </LayoutComponent>
  );
};

const ActivityCard = ({ refresh }) => {
  const [orders, setOrders] = useState();
  useEffect(() => {
    getRestockOrders()
      .then(({ data }) => {
        console.log(data, "orders");
        setOrders(data.orders);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  return (
    <>
      {" "}
      {orders && (
        <div>
          <h1 className="text-2xl my-2">Recent Activity</h1>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              {orders.map((order) => (
                <Col span={24} lg={8} md={16} key={order._id}>
                  <SubItemCard order={order} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export const SubItemCard = ({ order }) => {
  return (
    <Card title={order.subItem.name} className="my-2" bordered={true}>
      <p>
        Quantity : {order.quantity}{" "}
        <span className="border border-black rounded-xl px-2 py-1">
          {order.subItem.unit}
        </span>
      </p>
      <p>Placed On : {new Date(order.createdAt).toLocaleDateString("en-In")}</p>
    </Card>
  );
};

export default restock;
