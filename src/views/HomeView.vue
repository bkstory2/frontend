<template>
  <div>
    <h1>게시판</h1>
    
    <!-- 검색 기능 -->
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <input 
          type="text" 
          v-model="search.userId" 
          placeholder="User ID 검색"
          style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;"
        />
        <input 
          type="text" 
          v-model="search.title" 
          placeholder="제목 검색"
          style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;"
        />
        <input 
          type="text" 
          v-model="search.body" 
          placeholder="내용 검색"
          style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;"
        />
        <button 
          @click="loadArticles" 
          style="padding: 8px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          검색
        </button>
        <button 
          @click="resetSearch" 
          style="padding: 8px 20px; background-color: #666; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          초기화
        </button>
      </div>
    </div>

    <div v-if="articles && articles.length > 0">
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px;">No.</th>
            <th style="padding: 10px;">ID</th>
            <th style="padding: 10px;">User ID</th>
            <th style="padding: 10px;">Title</th>
            <th style="padding: 10px;">Body</th>
            <th style="padding: 10px;">작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(article, index) in articles" :key="article.id" @click="$router.push(`/detail/${article.id}`)" style="cursor: pointer;">
            <td style="padding: 8px; text-align: center;">{{ index + 1 }}</td>
            <td style="padding: 8px; text-align: center;">{{ article.id }}</td>
            <td style="padding: 8px;">{{ article.userId }}</td>
            <td style="padding: 8px;">{{ article.title }}</td>
            <td style="padding: 8px;">{{ article.body.substring(0, 50) }}{{ article.body.length > 50 ? '...' : '' }}</td>
            <td style="padding: 8px; text-align: center;">{{ formatDate(article.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="error">
      <p style="color: red;">에러: {{ error.message }}</p>
    </div>
    <div v-else-if="!loading && articles.length === 0">
      <p>등록된 게시글이 없습니다.</p>
    </div>
    <div v-else>
      <p>데이터 로딩 중...</p>
    </div>

    <div style="margin-top: 20px;">
      <button @click="$router.push('/write')" style="padding: 10px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        ✏️ 글쓰기
      </button>
    </div>
  </div>
</template>

<script>
import boardApi from "@/api/board";

export default {
  name: "HomeView",
  data() {
    return {
      articles: [],
      search: {
        userId: '',
        title: '',
        body: ''
      },
      loading: true,
      error: null
    };
  },
  async created() {
    await this.loadArticles();
  },
  methods: {
    async loadArticles() {
      try {
        this.loading = true;
        this.error = null;
        const params = {};
        if (this.search.userId) params.userId = this.search.userId;
        if (this.search.title) params.title = this.search.title;
        if (this.search.body) params.body = this.search.body;
        
        const res = await boardApi.getArticles(params);
        this.articles = res.data;
        console.log("게시글 목록:", this.articles);
      } catch (err) {
        this.error = err;
        console.error("데이터 로딩 실패:", err);
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.search = {
        userId: '',
        title: '',
        body: ''
      };
      this.loadArticles();
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
  }
};
</script>

<style scoped>
tbody tr:hover {
  background-color: #f5f5f5;
}
</style>