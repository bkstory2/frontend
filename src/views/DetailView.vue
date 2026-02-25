<template>
<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>📖 게시글 상세</h1>
    
    <div v-if="error">
      <p style="color: red;">에러: {{ error.message }}</p>
    </div>
    <div v-else-if="!article">
      <p>데이터 로딩 중...</p>  
    </div>
    <div v-else style="border: 1px solid #ddd; padding: 20px; border-radius: 4px; background-color: #f9f9f9;">
      <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
        <p style="margin: 5px 0;"><strong>ID:</strong> {{ article.id }}</p>
        <p style="margin: 5px 0;"><strong>게시판:</strong> {{ getBoardTitle() }}</p>
        <p style="margin: 5px 0;"><strong>작성자:</strong> {{ article.userId }}</p>
        <p style="margin: 5px 0;"><strong>작성일:</strong> {{ formatDate(article.createdAt) }}</p>
        <p style="margin: 5px 0;"><strong>수정일:</strong> {{ article.updatedAt ? formatDate(article.updatedAt) : '-' }}</p>
      </div>
      <div style="margin-bottom: 15px;">
        <h2 style="margin: 10px 0;">{{ article.title }}</h2>
      </div>
      <div style="white-space: pre-wrap; line-height: 1.6;">
        {{ article.body }}
      </div>

      <div v-if="article.fileNm" style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border: 1px solid #2196f3; border-radius: 4px;">
        <p style="margin: 5px 0;"><strong>📎 첨부파일:</strong></p>
        <p style="margin: 10px 0;">
          <a :href="`/api/board/download/${article.fileNm}`" 
             download
             style="color: #2196f3; text-decoration: none; font-weight: bold;">
            📥 {{ article.fileNm }}
          </a>
        </p>
      </div>
    </div>

    <br>
    <div style="display: flex; gap: 10px;">
      <button 
        @click="goToUpdate" 
        v-if="article"
        style="padding: 10px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        ✏️ 수정하기
      </button>
      <button 
        @click="confirmDelete" 
        v-if="article"
        style="padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        🗑️ 삭제하기
      </button>
      <button 
        @click="goToList"
        style="padding: 10px 20px; background-color: #666; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        📋 목록으로
      </button>
    </div>

    <div v-if="message" style="margin-top: 20px; padding: 10px; background-color: #e8f5e9; border: 1px solid #4caf50; border-radius: 4px;">
      {{ message }}
    </div>

</div>

</template>

<script>

    import boardApi from '@/api/board';
    
    export default {
        name: "DetailView",
        data() {
            return {
                article: null,
                error: null,
                message: '',
                boardId: 'free'
            };
        },
        async mounted() {
            const id = this.$route.params.id;
            this.boardId = this.$route.query.board_id || 'free';
            try {
                const res = await boardApi.getArticle(id);
                this.article = res.data;
                console.log("게시글 상세 정보:", this.article);
            } catch (err) {
                this.error = err;
                console.error("데이터 로딩 실패:", err);
            }
        },
        methods: {
            getBoardTitle() {
              const titles = {
                'free': '자유게시판',
                'notice': '공지사항',
                'qna': 'Q&A'
              };
              return titles[this.article?.board_id] || this.article?.board_id || '게시판';
            },
            formatDate(dateStr) {
                if (!dateStr) return '-';
                const date = new Date(dateStr);
                return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR');
            },
            async confirmDelete() {
                if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                    await this.deleteArticle();
                }
            },
            async deleteArticle() {
                try {
                    await boardApi.deleteArticle(this.article.id);
                    this.message = '게시글이 삭제되었습니다.';
                    console.log('게시글 삭제 성공');
                    
                    // 1초 후 목록으로 이동
                    setTimeout(() => {
                        this.goToList();
                    }, 1000);
                } catch (err) {
                    this.error = err;
                    console.error('게시글 삭제 실패:', err);
                    alert('게시글 삭제에 실패했습니다.');
                }
            },
            goToUpdate() {
              this.$router.push({
                name: 'update',
                params: { id: this.article.id },
                query: { board_id: this.boardId }
              });
            },
            goToList() {
              this.$router.push({
                name: 'home',
                query: { board_id: this.boardId }
              });
            }
        }
    };  
</script>

<style scoped>
button:hover {
  opacity: 0.8;
}
</style>