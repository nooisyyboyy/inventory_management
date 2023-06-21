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
  Progress,
  InputNumber,
} from "antd";
import { getListOfItems } from "../../actions/items";
import { sellItem } from "../../actions/sell";
import { toast, ToastContainer } from "react-toastify";

const restock = () => {
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState();
  const [selectedItem, setSelectItem] = useState();
  const [selectedItemQuantity, setSelectedItemQuantity] = useState(0);
  const [soldTo, toSoldTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Info",
      dataIndex: "subitems",
      key: "subitems",
      render: (subItems) => (
        <div className="max-h-24 overflow-y-auto">
          {subItems.map((subItem) => {
            return (
              <div className="flex justify-between ">
                <div className="grow ">{subItem.subitemInfo.name}</div>
                <div className="flex w-1/2 justify-between">
                  <div>{subItem.quantity}</div>
                  <Badge className="" count={subItem.subitemInfo.unit} />
                </div>
              </div>
            );
          })}
        </div>
      ),
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
                setSelectItem(items.filter((item) => item._id === props)[0])
              }>
              Sell
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const handleCancel = () => {
    setSelectItem();
    setSelectedItemQuantity(0);
  };

  const handleRestock = (values) => {
    if (selectedItemQuantity) {
      setIsLoading(true);
      toast("Loading", {
        position: "bottom-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(
        {
          quantity: selectedItemQuantity,
          soldTo: soldTo,
        },
        "body"
      );
      sellItem(selectedItem._id, {
        quantity: selectedItemQuantity,
        soldTo: soldTo,
      })
        .then(({ data }) => {
          setIsLoading(false);

          toast.dismiss();
          toast("Item Sold Successfully", {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log({ data });
          setIsLoading(false);
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
          setIsLoading(false);
          console.log(err);
        });
    }
    console.log(values);
  };

  useEffect(() => {
    getListOfItems()
      .then(({ data }) => {
        setItems(
          data.fetchedItem.map((item) => {
            return {
              ...item,
              available:
                Math.min(
                  ...item.subitems.map(
                    (subItem) => subItem.subitemInfo.quantity / subItem.quantity
                  )
                )
                  .toString()
                  .split(".")[0] * 1,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  return (
    <LayoutComponent>
      <h1 className="text-2xl">Sell the Items</h1>
      <Table columns={columns} dataSource={items} pagination={false} />
      {selectedItem && (
        <Modal
          title={`Restock ${selectedItem.name}`}
          visible={selectedItem}
          onCancel={handleCancel}
          footer={[]}>
          <div>
            <Form onFinish={handleRestock}>
              <Form.Item name="quantity" label="Quantity">
                <InputNumber
                  max={selectedItem.available}
                  min={1}
                  onChange={(value) => setSelectedItemQuantity(value)}
                />
                <p>Max available: {selectedItem.available} </p>
              </Form.Item>
              <Form.Item name="soldto" label="Sold To">
                <Input
                  onChange={(e) => {
                    console.log(e.target.value);
                    toSoldTo(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={isLoading}>
                  Sell
                </Button>

                <small className="text-red-500 mx-2	">
                  (Warning: This actions cannot be undone)
                </small>
              </Form.Item>
            </Form>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>SubItem</td>
                    <td>Quantity</td>
                  </tr>
                  {selectedItem.subitems.map((subitem) => (
                    <tr>
                      <td>{subitem.subitemInfo.name}</td>
                      <td>
                        <Progress
                          percent={parseFloat(
                            ((selectedItemQuantity * subitem.quantity) /
                              subitem.subitemInfo.quantity) *
                              100
                          ).toFixed(2)}
                          status="active"
                        />
                        {/* {selectedItemQuantity * subitem.quantity}/
                        {subitem.subitemInfo.quantity} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
      <hr />

      <ToastContainer />
    </LayoutComponent>
  );
};

export const ItemCard = ({ order }) => {
  return (
    <Card title={order.item.name} className="my-2" bordered={true}>
      <div className="flex justify-between">
        <p>Quantity : {order.quantity} </p>
        <p>
          Placed On : {new Date(order.createdAt).toLocaleDateString("en-In")}
        </p>
      </div>
      {order.soldTo && (
        <div>
          <p>Sold To : {order.soldTo}</p>
        </div>
      )}
      <hr className="my-2" />
      <div>
        <div
          style={{
            height: "100px",
            overflowY: "auto",
          }}>
          <table
            className="w-full "
            style={{ maHeight: " 100px", overflowY: "auto" }}>
            {order.item.subitems.map((subItem) => {
              return (
                <tr className="">
                  <td className=" ">{subItem.subitemInfo.name}</td>
                  <td className="flex justify-between">
                    <div>{subItem.quantity * order.quantity}</div>
                    <Badge className="" count={subItem.subitemInfo.unit} />
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </Card>
  );
};

export default restock;
