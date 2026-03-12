<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>✏️ {{ getBoardTitle() }} - 게시글 수정</h1>
    
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

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">📎 파일 첨부:</label>
        
        <!-- 기존 파일 관리 -->
        <div v-if="article.fileNm" style="margin-bottom: 15px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
          <p style="margin: 5px 0;">현재 파일: <strong>{{ article.fileNm }}</strong></p>
          <button
            type="button"
            @click="deleteCurrentFile"
            style="margin-top: 8px; padding: 6px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            🗑️ 현재 파일 삭제
          </button>
        </div>

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
              📄 새 파일: <strong>{{ selectedFile.name }}</strong>
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
          수정하기
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
import { getBoardTitle, formatDate } from '@/utils/boardUtils';

export default {
  name: 'UpdateView',
  data() {
    return {
      boardId: 'free',
      article: {
        id: null,
        board_id: 'free',
        userId: '',
        title: '',
        body: '',
        file_nm: null
      },
      selectedFile: null,
      dragOver: false,
      loading: true,
      message: '',
      error: null,
      uploading: false
    };
  },
  async created() {
    const id = this.$route.params.id;
    this.boardId = this.$route.query.board_id || 'free';
    try {
      const res = await boardApi.getArticle(id);
      this.article = res.data;
      this.loading = false;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
    }
  },
  methods: {
    getBoardTitle() {
      return getBoardTitle(this.boardId);
    },
    formatDate,
    onFileSelected(event) {
      this.selectedFile = event.target.files[0] || null;
    },
    onFileDropped(event) {
      this.dragOver = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
      }
    },
    deleteSelectedFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },
    deleteCurrentFile() {
      this.article.fileNm = null;
    },
    async submitUpdate() {
      try {
        this.message = '';
        this.error = null;
        if (this.selectedFile) {
          this.message = '파일 업로드 중...';
          this.article.fileNm = await this.uploadFile();
        }
        await boardApi.updateArticle(
          this.article.id,
          this.boardId,
          this.article.userId,
          this.article.title,
          this.article.body,
          this.article.fileNm
        );
        this.message = '게시글이 수정되었습니다.';
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } catch (err) {
        this.error = err.message || '게시글 수정에 실패했습니다.';
      }
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
        return fileName;
      } catch (err) {
        this.error = '파일 업로드 중 오류 발생: ' + err.message;
        throw err;
      } finally {
        this.uploading = false;
      }
    },
    goBack() {
      this.$router.push({
        name: 'board-list',
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
