//gloval variable collection
const globalVariable = (obj) => {
  return {
    type: Object.keys(obj)[0],
    payload: obj[Object.keys(obj)[0]],
  };
};

export default globalVariable;
