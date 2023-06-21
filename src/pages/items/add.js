import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, List } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { AddItem } from "../../actions/items";
import { searchSubItem } from "../../actions/subItems";
import LayoutComponent from "../../Components/Layout";

const add = () => {
  return (
    <LayoutComponent>
      <div className="w-full lg:w-1/2 mx-auto">
        <h1 className="text-3xl mb-4">Add Item</h1>{" "}
        <div>
          <AddItemForm />
        </div>
      </div>
    </LayoutComponent>
  );
};

const AddItemForm = () => {
  const router = useRouter();
  const [itemData, setItemData] = useState({ name: "", subItems: [] });

  const handleReset = () => {
    setItemData({
      ...itemData,
      subItems: itemData.subItems.map((item) => {
        return { ...item, quantity: 1 };
      }),
    });
  };

  const [searchQuery, setSearchQuery] = useState();
  const [searchedItem, setSearchItems] = useState([]);

  const onFinish = (values) => {
    console.log(values);
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    AddItem({ ...values, subItems: itemData.subItems })
      .then(({ data }) => {
        toast.dismiss();
        toast("Item Added Successfully", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          router.push("/items");
        }, 5000);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss();
        toast("There was error while performing the action", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };
  const onFinishFailed = () => {
    console.log("error");
  };

  useEffect(() => {
    console.log({ searchQuery });
    if (searchQuery)
      searchSubItem(searchQuery)
        .then(({ data }) => {
          console.log(data);
          setSearchItems(data.subItems);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [searchQuery]);

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off">
      <Form.Item
        label="name"
        name="name"
        rules={[{ required: true, message: "Please input item name!" }]}>
        <Input />
      </Form.Item>
      <h3>Search SubItems</h3>
      <input
        name="browser"
        id="browser"
        className="border border-black rounded w-full"
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      <table className="w-full border border-black">
        {searchedItem.map((item) => {
          return (
            <tr className="w-full  border border-black rounded">
              <td className="my-2 p-2">
                <div>{item.name}</div>
              </td>
              <td className="my-2 p-2 text-center">
                <div>{item.unit}</div>
              </td>
              <td className="my-2 p-2 text-right">
                <Button
                  onClick={() => {
                    setItemData({
                      ...itemData,
                      subItems: [
                        ...itemData.subItems,
                        { subitemInfo: item, quantity: 1 },
                      ],
                    });
                  }}>
                  Add
                </Button>
              </td>
            </tr>
          );
        })}
      </table>

      <h3>Selected SubItems</h3>
      <div className="" style={{ minHeight: "100px" }}>
        <table className="w-full ">
          {itemData.subItems.map((item, listindex) => {
            return (
              <tr className="w-full  border border-black rounded">
                <td className="my-2 p-2">
                  <div>{item.subitemInfo.name}</div>
                </td>
                <td className="my-2 p-2 text-center">
                  <input
                    className="w-20 border border-black rounded"
                    type="number"
                    defaultValue={1}
                    min={1}
                    onChange={(e) => {
                      setItemData({
                        ...itemData,
                        subItems: itemData.subItems.map((item2, itemIndex) => {
                          return {
                            ...item2,
                            quantity:
                              listindex === itemIndex
                                ? parseInt(e.target.value)
                                : parseInt(item2.quantity),
                          };
                        }),
                      });
                    }}
                  />
                </td>
                <td className="my-2 p-2">
                  <div>{item.subitemInfo.unit}</div>
                </td>
                <td className="my-2 p-2">
                  <div
                    className="text-xl flex justify-center content-center"
                    onClick={() => {
                      setItemData({
                        ...itemData,
                        subItems: itemData.subItems.filter(
                          (item2, itemIndex) => listindex !== itemIndex
                        ),
                      });
                    }}>
                    <CloseOutlined />
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </div>

      <Form.Item className="mt-3">
        <Button
          type="primary"
          className="mx-2"
          htmlType="reset"
          onClick={() => handleReset()}>
          Reset
        </Button>
        <Button type="primary" className="mx-2" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default add;
