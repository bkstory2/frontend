<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>✏️ {{ getBoardTitle() }} - 게시글 작성</h1>
    
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

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">📎 파일 첨부:</label>
        
        <!-- 파일 드래그 앤 드롭 영역 -->
        <div 
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="onFileDropped"
          style="padding: 20px; border: 2px dashed #ccc; border-radius: 4px; text-align: center; cursor: pointer;"
          :style="{ backgroundColor: dragOver ? '#f0f0f0' : 'transparent', borderColor: dragOver ? '#42b983' : '#ccc' }"
        >
          <input 
            type="file" 
            ref="fileInput"
            @change="onFileSelected"
            style="display: none;"
          />
          <div @click="$refs.fileInput.click()" style="cursor: pointer;">
            <p style="margin: 10px 0; font-size: 24px;">📁</p>
            <p style="margin: 5px 0; color: #666;">파일을 여기에 드래그하거나</p>
            <p style="margin: 5px 0;">
              <span style="color: #42b983; font-weight: bold; text-decoration: underline;">클릭하여 파일 선택</span>
            </p>
          </div>
        </div>

        <!-- 선택된 파일 표시 및 삭제 -->
        <div v-if="selectedFile" style="margin-top: 15px; padding: 10px; background-color: #e8f5e9; border: 1px solid #4caf50; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0;">
              📄 선택된 파일: <strong>{{ selectedFile.name }}</strong>
              <span style="color: #999; font-size: 12px;">
                ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }}MB)
              </span>
            </p>
            <button
              type="button"
              @click="deleteSelectedFile"
              style="padding: 6px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>
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
          @click="goBack"
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
      boardId: 'free',
      article: {
        boardId: 'free',
        userId: '',
        title: '',
        body: '',
        fileNm: null
      },
      selectedFile: null,
      dragOver: false,
      message: '',
      error: null,
      uploading: false
    };
  },
  created() {
    this.boardId = this.$route.query.board_id || 'free';
    this.article.boardId = this.boardId;
  },
  methods: {
    getBoardTitle() {
      const titles = {
        'free': '자유게시판',
        'notice': '공지사항',
        'qna': 'Q&A'
      };
      return titles[this.boardId] || '게시판';
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0] || null;
      console.log('파일 선택:', this.selectedFile?.name);
    },
    onFileDropped(event) {
      this.dragOver = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        console.log('파일 드롭됨:', this.selectedFile.name);
      }
    },
    deleteSelectedFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
      console.log('파일 삭제됨');
    },
    async uploadFile() {
      if (!this.selectedFile) {
        return null;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const response = await fetch('http://localhost:7789/api/board/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('파일 업로드 실패: ' + response.statusText);
        }

        const fileName = await response.text();
        console.log('파일 업로드 성공:', fileName);
        return fileName;
      } catch (err) {
        this.error = '파일 업로드 중 오류 발생: ' + err.message;
        console.error('파일 업로드 실패:', err);
        throw err;
      } finally {
        this.uploading = false;
      }
    },
    async submitArticle() {
      try {
        this.message = '';
        this.error = null;

        // 파일 업로드 (있으면)
        if (this.selectedFile) {
          this.message = '파일 업로드 중...';
          this.article.fileNm = await this.uploadFile();
        }

        // 게시글 저장
        this.message = '게시글 저장 중...';
        const res = await boardApi.postArticle(
          this.article.boardId,
          this.article.userId,
          this.article.title,
          this.article.body,
          this.article.fileNm
        );

        console.log('게시글 작성 성공:', res.data);
        this.message = '게시글이 성공적으로 작성되었습니다!';

        // 1초 후 목록 페이지로 이동
        setTimeout(() => {
          this.$router.push({
            name: 'home',
            query: { board_id: this.boardId }
          });
        }, 1000);
      } catch (err) {
        this.error = err.message;
        console.error('게시글 작성 실패:', err);
      }
    },
    goBack() {
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

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}
</style>