import axios from "axios";
import LayoutComponent from "../Components/Layout";

const group = () => {
  const handleClick = () => {
    axios
      .post(
        "/api/groups",
        { name: "sample", quantity: 10 },
        { withCredentials: true }
      )
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <LayoutComponent>
      <div>Group List</div>
      <button onClick={() => handleClick()}>Add item</button>
    </LayoutComponent>
  );
};

export default group;
