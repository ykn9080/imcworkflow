import axios from "axios";
import { API2 } from "constants";
import { getData } from "components/dataget/fetchData";

export const findTaskId = async (id, type) => {
  const url = `${API2}/findTaskIdfromLinked/${id}/${type}`;
  const rtn = await getData(url, "get");

  if (rtn && rtn.data && rtn.data.length > 0) return rtn.data[0].taskId;
};
