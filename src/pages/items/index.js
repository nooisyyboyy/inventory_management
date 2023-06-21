import { Badge, Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { deleteItem, getListOfItems } from "../../actions/items";
import LayoutComponent from "../../Components/Layout";

const index = () => {
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    getListOfItems()
      .then(({ data }) => {
        console.log({ data }, "items");
        setItems(data.fetchedItem);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  const refreshData = () => {
    setRefresh(!refresh);
  };
  return (
    <LayoutComponent>
      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl">List of Items</h2>
          <Button type="primary">
            <Link href="/items/add">
              <a>Add New Item</a>
            </Link>
          </Button>
        </div>
        <ItemList items={items} refreshData={refreshData} />
      </div>
    </LayoutComponent>
  );
};

const ItemList = ({ items, refreshData }) => {
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
      render: (_id) => (
        <div className="flex" style={{ width: "10px" }}>
          <Button type="primary">
            <Link
              // href={`items/`}
              href={`/items/${_id.toString()}`}
            >
              <a>Update</a>
            </Link>
          </Button>
          <Button
            className="mx-2"
            type="primary"
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteItem(_id)
                .then(({ data }) => {
                  console.log(data);
                  refreshData();
                })
                .catch((err) => console.log(err));
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="my-5">
      <Table columns={columns} dataSource={items} />
    </div>
  );
};

export default index;
