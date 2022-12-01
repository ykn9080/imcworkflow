// export const API =
//   process.env.REACT_APP_NODE_ENV === "production"
//     ? "https://api.kiki-bus.com"
//     : "http://kikibus.iptime.org:8080";

export const API2 =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "https://ormwork.kiki-bus.com/api"
    : process.env.REACT_APP_NODE_ENV === "local"
    ? "http://localhost:8011/api"
    : "http://kikibus.iptime.org:18011/api";
console.log(process.env.REACT_APP_NODE_ENV);
// export const API = "https://api.kiki-bus.com";
// export const API2 = "https://orm.kiki-bus.com/api";
// export const API = "http://kikibus.iptime.org:8080";
// export const API2 = "http://kikibus.iptime.org:18484/api";
