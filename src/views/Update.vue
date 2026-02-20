<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>게시글 수정</h1>
    
    <div v-if="loading" style="text-align: center; padding: 40px;">
      <p>데이터 로딩 중...</p>
    </div>

    <form v-else @submit.prevent="submitUpdate">
      <div style="margin-bottom: 15px;">
        <label for="id" style="display: block; margin-bottom: 5px;">ID:</label>
        <input 
          type="text" 
          id="id" 
          v-model="article.id" 
          disabled
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f0f0f0;"
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="userId" style="display: block; margin-bottom: 5px;">User ID:</label>
        <input 
          type="text" 
          id="userId" 
          v-model="article.userId" 
          required
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="title" style="display: block; margin-bottom: 5px;">Title:</label>
        <input 
          type="text" 
          id="title" 
          v-model="article.title" 
          required
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="body" style="display: block; margin-bottom: 5px;">Body:</label>
        <textarea 
          id="body" 
          v-model="article.body" 
          required
          rows="10"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        ></textarea>
      </div>

      <div style="display: flex; gap: 10px;">
        <button 
          type="submit" 
          style="padding: 10px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          수정하기
        </button>
        <button 
          type="button" 
          @click="$router.go(-1)"
          style="padding: 10px 20px; background-color: #666; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          취소
        </button>
      </div>
    </form>

    <div v-if="message" style="margin-top: 20px; padding: 10px; background-color: #e8f5e9; border: 1px solid #4caf50; border-radius: 4px;">
      {{ message }}
    </div>

    <div v-if="error" style="margin-top: 20px; padding: 10px; background-color: #ffebee; border: 1px solid #f44336; border-radius: 4px;">
      에러: {{ error }}
    </div>
  </div>
</template>

<script>
import boardApi from '@/api/board';

export default {
  name: 'UpdateView',
  data() {
    return {
      article: {
        id: null,
        userId: '',
        title: '',
        body: ''
      },
      loading: true,
      message: '',
      error: null
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await boardApi.getArticle(id);
      this.article = res.data;
      this.loading = false;
      console.log('게시글 로드:', this.article);
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      console.error('데이터 로딩 실패:', err);
    }
  },
  methods: {
    async submitUpdate() {
      try {
        const res = await boardApi.updateArticle(
          this.article.id,
          this.article.userId,
          this.article.title,
          this.article.body
        );
        
        console.log('게시글 수정 성공:', res.data);
        this.message = '게시글이 성공적으로 수정되었습니다!';
        
        // 2초 후 상세 페이지로 이동
        setTimeout(() => {
          this.$router.push(`/detail/${this.article.id}`);
        }, 2000);
        
      } catch (err) {
        this.error = err.message;
        console.error('게시글 수정 실패:', err);
      }
    }
  }
};
</script>

<style scoped>
button:hover {
  opacity: 0.8;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}
</style>
