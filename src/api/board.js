import axios from "axios";

const BASE_URL = "http://localhost:9000/api/board";

export default {
  // 단건 조회
  getArticle: function (id) {
    return axios.get(`${BASE_URL}/${id}`).then((res) => {
      console.log(res.data);
      return res;
    });
  },

  // 다건 조회 (검색 기능 포함)
  getArticles: function (params = {}) {
    const { userId, title, body } = params;
    return axios.get(BASE_URL, { 
      params: { userId, title, body } 
    }).then((res) => {
      console.log(res.data);
      return res;
    });
  },

  // 등록
  postArticle: function (userId, title, body) {
    const article = { userId, title, body };          
    return axios.post(BASE_URL, article).then((res) => {
      console.log(res.data);
      return res;
    }); 
  },

  // 수정
  updateArticle: function (id, userId, title, body) {
    const article = { id, userId, title, body };
    return axios.put(BASE_URL, article).then((res) => {
      console.log(res.data);
      return res;
    });
  },

  // 삭제
  deleteArticle: function (id) {
    return axios.delete(`${BASE_URL}/${id}`).then((res) => {
      console.log(res.data);
      return res;
    });
  }

};