import axios from "./axiosInstance";

export default {
  // 단건 조회
  async getArticle(id) {
    const res = await axios.get(`${id}`);
    return res;
  },

  // 다건 조회 (검색 기능 포함)
  async getArticles(params = {}) {
    const res = await axios.get("", { params });
    return res;
  },

  // 등록
  async postArticle(board_id, userId, title, body, file_nm) {
    const article = { boardId: board_id, userId, title, body, fileNm: file_nm };
    const res = await axios.post("", article);
    return res;
  },

  // 수정
  async updateArticle(id, board_id, userId, title, body, file_nm) {
    const article = { id, boardId: board_id, userId, title, body, fileNm: file_nm };
    const res = await axios.put("", article);
    return res;
  },

  // 삭제
  async deleteArticle(id) {
    const res = await axios.delete(`${id}`);
    return res;
  },

  // 파일 다운로드 URL 생성
  getDownloadUrl(fileNm) {
    const base = axios.defaults.baseURL.replace(/\/$/, "");
    return `${base}/download/${fileNm}`;
  }
};