import { Button, Form, Input, Table, Tag, Space, Tooltip } from "antd";
import react, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addSubItem,
  deleteSubItem,
  getSubItem,
  updateSubItem,
} from "../../actions/subItems";
import LayoutComponent from "../../Components/Layout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const item = () => {
  const [subItems, setSubItems] = useState();
  const [refresh, setRefresh] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState();

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    getSubItem()
      .then(({ data }) => {
        console.log(data);
        setSubItems(data.subItems);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  const handleDelete = (itemId) => {
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    console.log(itemId);
    deleteSubItem(itemId)
      .then(({ data }) => {
        toast.dismiss();
        console.log(data);
        toast("Sub-Item Deleted Succesfully", {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        handleRefresh();
      })
      .catch((err) => {
        toast.dismiss();

        toast(err.response.data.message, {
          position: "bottom-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log(err);
      });
  };

  const handleUpdate = (_id) => {
    setSelectedSubItem(subItems.filter((subItem) => subItem._id === _id)[0]);
  };
  return (
    <LayoutComponent>
      <div>SubItem List </div>
      <ItemForm
        handleRefresh={handleRefresh}
        selectedSubItem={selectedSubItem}
        setSelectedSubItem={setSelectedSubItem}
      />
      <ItemList
        listData={subItems}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    </LayoutComponent>
  );
};

const ItemForm = ({ handleRefresh, selectedSubItem, setSelectedSubItem }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedSubItem) {
      console.log(selectedSubItem);
      console.log(selectedSubItem.name, selectedSubItem.unit);
      form.setFieldsValue({
        name: selectedSubItem.name,
        unit: selectedSubItem.unit,
      });
    }
  }, [selectedSubItem]);

  const onFinish = (values) => {
    toast("Loading", {
      position: "bottom-right",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    if (selectedSubItem) {
      updateSubItem(selectedSubItem._id, values)
        .then(({ data }) => {
          toast.dismiss();
          toast("Sub-Item Updated Succesfully", {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          form.resetFields();
          handleRefresh();
          selectedSubItem();
        })
        .catch((err) => console.log(err));
    } else {
      addSubItem(values)
        .then(({ data }) => {
          toast.dismiss();
          toast("Sub-Item Added Succesfully", {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          handleRefresh();
          form.resetFields();
        })
        .catch((err) => console.log(err));
    }
  };

  const onReset = () => {
    form.resetFields();
    setSelectedSubItem();
  };

  return (
    <div>
      <h2 className="text-2xl">Add SubItem</h2>
      <Form
        form={form}
        name="horizontal_login"
        layout="inline"
        onFinish={onFinish}
        onReset={onReset}
        className="my-2">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please Enter the SubItem Name" },
          ]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: "Please Enter the Unit" }]}>
          <Input placeholder="Unit" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="mx-2"
            htmlType="submit"
            disabled={
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length
            }>
            {selectedSubItem ? "Update SubItem" : "Add SubItem"}
          </Button>
          {selectedSubItem && (
            <Button
              className="mx-2"
              type="primary"
              htmlType="reset"
              disabled={
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }>
              Reset
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

const ItemList = ({ listData, handleDelete, handleUpdate }) => {
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
      title: "Action",
      key: "action",
      dataIndex: "_id",
      render: (props) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(props)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(props)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {listData && (
        <div className="mt-10">
          <h2 className="text-2xl ">List of All Sub-Items</h2>
          <Table columns={columns} dataSource={listData} pagination={false} />
        </div>
      )}
    </>
  );
};

export default item;
