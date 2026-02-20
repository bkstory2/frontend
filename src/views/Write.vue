<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>게시글 작성</h1>
    
    <form @submit.prevent="submitArticle">
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
          작성하기
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
  name: 'WriteView',
  data() {
    return {
      article: {
        userId: '',
        title: '',
        body: ''
      },
      message: '',
      error: null
    };
  },
  methods: {
    async submitArticle() {
      try {
        const res = await boardApi.postArticle(
          this.article.userId,
          this.article.title,
          this.article.body
        );
        
        console.log('게시글 작성 성공:', res.data);
        this.message = '게시글이 성공적으로 작성되었습니다!';
        
        // 2초 후 목록으로 이동
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
        
      } catch (err) {
        this.error = err.message;
        console.error('게시글 작성 실패:', err);
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