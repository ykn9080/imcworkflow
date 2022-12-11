import axios from "axios";
import { API2 } from "constants";
import { getData } from "components/dataget/fetchData";

export const findTaskId = async (id, type) => {
  const url = `${API2}/findTaskIdfromLinked/${id}/${type}`;
  const rtn = await getData(url, "get");

  if (rtn && rtn.data && rtn.data.length > 0) return rtn.data[0].taskId;
  else return null;
};
export const findFormByTaskId = async (id) => {
  const url = `${API2}/findFormByTaskId/${id}`;
  const rtn = await getData(url, "get");
  console.log(rtn);
  if (rtn && rtn.data && rtn.data.length > 0) return rtn.data[0].id;
  else return null;
};
