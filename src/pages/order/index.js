import { CloseOutlined } from "@ant-design/icons";
import { Select, DatePicker, Input, Button, Row, Col, Pagination } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getOrders } from "../../actions/order";
import LayoutComponent from "../../Components/Layout";
import { SubItemCard } from "./restock";
import { ItemCard } from "./sell";

const index = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [pagedOrders, setPagedOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const getFilterData = (filterData = {}) => {
    setPage(0);

    toast("Loading Data", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log({ filterData }, "filterData");
    getOrders(filterData)
      .then(({ data }) => {
        toast.dismiss();
        console.log(data.orders, "orders");
        setOrders(data.orders);
        setPage(1);
        setTotal(data.orders.length);
      })
      .catch((err) => {
        toast.dismiss();
        toast("There was error loading the orders", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log(err);
      });
  };

  useEffect(() => {
    let skip = (page - 1) * 6;
    let end = skip + 6;
    console.log(
      orders.length !== 0
        ? orders.filter((order, index) => {
            return index >= skip && index < end;
          })
        : []
    );
    setPagedOrders(
      orders.length !== 0
        ? orders.filter((order, index) => {
            return index >= skip && index < end;
          })
        : []
    );
  }, [page]);

  useEffect(() => {
    getFilterData();
  }, []);
  return (
    <LayoutComponent>
      <h1 className="text-3xl">Order Management</h1>
      <div className="flex items-center w-full">
        <div className="w-1/2 p-4 text-center text-2xl cursor-pointer">
          <div
            className="border border-black py-5 rounded"
            onClick={() => {
              router.push("/order/restock");
            }}>
            <h2>Restock</h2>
          </div>
        </div>
        <div className="w-1/2 p-4 text-center text-2xl cursor-pointer">
          <div
            className="border border-black py-5 rounded"
            onClick={() => {
              router.push("/order/sell");
            }}>
            <h2>Sell</h2>
          </div>
        </div>
      </div>
      <hr />
      <h2>Select Filter</h2>
      <div>
        <ActivityFilter getFilterData={getFilterData} />
      </div>
      <Row gutter={16}>
        {pagedOrders.length !== 0 &&
          pagedOrders.map((order) => {
            return (
              <Col span={24} lg={8} key={order._id}>
                {order.subItem && <SubItemCard order={order} />}
                {order.item && <ItemCard order={order} />}
              </Col>
            );
          })}
      </Row>
      {total !== 0 && (
        <Pagination
          defaultCurrent={0}
          current={page}
          onChange={(values) => {
            console.log({ values });
            setPage(values);
          }}
          showSizeChanger={false}
          pageSize={6}
          total={total}
        />
      )}
      <ToastContainer />
    </LayoutComponent>
  );
};
export default index;

const ActivityFilter = ({ getFilterData }) => {
  const [filterData, setFilterData] = useState({});
  const [allFilters, setAllFilters] = useState([
    { name: "Date", type: "Date" },
    { name: "Order Type", type: "Order" },
    { name: "Item Type", type: "Item" },
    { name: "Search", type: "Query" },
  ]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  function AddNewFilter(value) {
    let temp = allFilters;
    let tempForRemain = [];
    let tempForSelected = [];
    temp.map((filter) => {
      {
        console.log(value, filter.type);
        value === filter.type
          ? tempForSelected.push(filter)
          : tempForRemain.push(filter);
      }
    });
    setSelectedFilters([...selectedFilters, ...tempForSelected]);
    setAllFilters(tempForRemain);
  }

  function RemoveFilter(value) {
    let temp = selectedFilters;
    let tempForRemain = [];
    let tempForSelected = [];
    temp.map((filter) => {
      {
        console.log(value, filter.type);
        value === filter.type
          ? tempForRemain.push(filter)
          : tempForSelected.push(filter);
      }
    });
    setSelectedFilters(tempForSelected);
    setAllFilters([...allFilters, ...tempForRemain]);
  }

  const handleFilterData = (type, value) => {
    console.log(type, value, "filterData");
    setFilterData({ ...filterData, [type]: value });
  };

  const handleSubmit = () => {
    let tempFilter = {};
    let isSell = false;
    let isItem = false;
    selectedFilters.map((filter) => {
      if (filter.type == "Order" && filterData[filter.type] == "sell")
        isSell = true;
      if (filter.type == "Item" && filterData[filter.type] == "item")
        isItem = true;
      tempFilter = {
        ...tempFilter,
        [filter.type]: filterData[filter.type] || "",
      };
    });
    console.log(isSell && isItem && filterData["Querytype"]);
    if (
      isSell &&
      isItem &&
      filterData["Querytype"] &&
      filterData["Querytype"] === "client"
    ) {
      tempFilter = {
        ...tempFilter,
        Querytype: filterData["Querytype"] || "",
      };
    }
    console.log({ tempFilter }, " tempFilter");
    getFilterData(tempFilter);
  };

  return (
    <div>
      <div>
        <Select
          defaultValue="lucy"
          value=""
          style={{ width: 120 }}
          onChange={AddNewFilter}>
          {allFilters.map((filter) => (
            <Select.Option value={filter.type} key={filter}>
              {filter.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        {selectedFilters.length !== 0 && (
          <>
            <p className="px-2 w-1/2">Selected Filters</p>
            <hr />
          </>
        )}
        {selectedFilters.map((filter) => (
          <div className="my-2">
            <FilterComponent
              type={filter.type}
              RemoveFilter={RemoveFilter}
              handleChange={handleFilterData}
            />
          </div>
        ))}
      </div>
      <Button
        className="my-2"
        type="primary"
        htmlType="buttom"
        onClick={() => handleSubmit()}>
        Filter
      </Button>
    </div>
  );
};

const FilterComponent = ({ type, RemoveFilter, handleChange }) => {
  return (
    <>
      {type === "Date" && (
        <div className="flex items-center w-full">
          <div className="grow">
            <DateFilter handleChange={handleChange} />
          </div>
          <CloseOutlined
            onClick={() => RemoveFilter(type)}
            className="flex-none px-3"
          />
        </div>
      )}
      {type === "Order" && (
        <div className="flex items-center w-full">
          <div className="grow flex">
            <p className="px-2 w-1/2">Select Order Type</p>
            <Select
              className="w-1/2"
              // defaultValue={"sell"}
              onChange={(value) => {
                console.log(value);
                handleChange(type, value);
              }}>
              <Option value="sell">Sell</Option>
              <Option value="restock">Restock</Option>
            </Select>
          </div>
          <CloseOutlined
            onClick={() => RemoveFilter(type)}
            className="flex-none px-3"
          />
        </div>
      )}
      {type === "Item" && (
        <div className="flex items-center w-full">
          <div className="grow flex">
            <p className="px-2 w-1/2">Select Item Type</p>
            <Select
              className="w-1/2"
              // defaultValue={"item"}
              onChange={(value) => {
                console.log(value);
                handleChange(type, value);
              }}>
              <Option value="item">Item</Option>
              <Option value="subItem">SubItem</Option>
            </Select>
          </div>
          <CloseOutlined
            onClick={() => RemoveFilter(type)}
            className="flex-none px-3"
          />
        </div>
      )}
      {type === "Query" && (
        <div className="flex">
          <div className="grow flex">
            <Input
              addonBefore={
                <Select
                  className="w-36"
                  defaultValue="name"
                  onChange={(e) => handleChange(`${type}type`, e)}>
                  <Select.Option value="name">Name</Select.Option>
                  <Select.Option value="client">Client</Select.Option>
                </Select>
              }
              placeholder="Search By Name"
              onChange={(e) => {
                handleChange(type, e.target.value);
              }}
            />
          </div>
          <CloseOutlined
            onClick={() => RemoveFilter(type)}
            className="flex-none px-3"
          />
        </div>
      )}
    </>
  );
};

const DateFilter = ({ handleChange }) => {
  const [filterType, setFilterType] = useState("Date");
  return (
    <div>
      <div className="flex">
        <p className="px-2 w-1/2">Select Period Type</p>
        <Select
          value={filterType}
          style={{ width: " 100px" }}
          onChange={(value) => setFilterType(value)}>
          <Option value="Date">Date</Option>
          <Option value="Month">Month</Option>
          <Option value="Year">Year</Option>
        </Select>
      </div>
      <div>
        {filterType === "Date" && (
          <div className="flex items-center w-full">
            <p className="px-2 w-1/2">Select Date</p>
            <DatePicker
              className="w-1/2"
              onChange={(value) => {
                handleChange(
                  "Date",
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "short",
                  })
                );
                console.log(
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                    day: "numeric",
                    month: "short",
                  })
                );
              }}
            />
          </div>
        )}
        {filterType === "Month" && (
          <div className="flex items-center w-full">
            <p className="px-2 w-1/2">Select Date</p>
            <DatePicker
              className="w-1/2"
              onChange={(value) => {
                handleChange(
                  "Date",
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                );
                console.log(
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                );
              }}
              picker="month"
            />
          </div>
        )}
        {filterType === "Year" && (
          <div className="flex items-center w-full ">
            <p className="px-2 w-1/2">Select Date</p>
            <DatePicker
              className="w-1/2"
              onChange={(value) => {
                handleChange(
                  "Date",
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                  })
                );
                console.log(
                  new Date(value).toLocaleString("en-US", {
                    year: "numeric",
                  })
                );
              }}
              picker="year"
            />
          </div>
        )}
      </div>
    </div>
  );
};
