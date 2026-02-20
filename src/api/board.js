import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export default {
  getArticle: function (i) {
    return axios.get(`${BASE_URL}/posts/${i}`).then((res) => {
      console.log(res.data);
      return res;
    });
  }
};