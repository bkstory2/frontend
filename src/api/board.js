import axios from "axios";

const BASE_URL = "http://localhost:8080/api/board";

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
   
    return axios.get(BASE_URL, { 
      params: params 
    }).then((res) => {
     
      console.log(res.data);
      return res;
    });
  },

  // 등록
  postArticle: function (board_id, userId, title, body, file_nm) {
    const article = { boardId: board_id, userId, title, body, fileNm: file_nm };          
    return axios.post(BASE_URL, article).then((res) => {
      console.log(res.data);
      return res;
    }); 
  },

  // 수정
  updateArticle: function (id, board_id, userId, title, body, file_nm) {
    const article = { id, boardId: board_id, userId, title, body, fileNm: file_nm };
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