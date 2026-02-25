<template>
  <header style="background-color: #42b983; color: white; padding: 15px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h1 style="margin: 0 0 15px 0; font-size: 24px;">📋 Vue.js 게시판</h1>
      <nav style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button 
          v-for="menu in menus" 
          :key="menu.id"
          @click="goToBoard(menu.id)"
          :style="getMenuStyle(menu.id)"
        >
          {{ menu.name }}
        </button>
        <router-link 
          to="/dashboard" 
          style="background: #fff; color: #42b983; font-weight: bold; border-radius: 4px; padding: 8px 16px; text-decoration: none; margin-left: 20px;"
        >
          📊 대시보드
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderMenu',
  data() {
    return {
      menus: [
        { id: 'free', name: '자유게시판' },
        { id: 'notice', name: '공지사항' },
        { id: 'qna', name: 'Q&A' }
      ],
      currentBoardId: null
    };
  },
  mounted() {
    // 현재 board_id 감지
    this.updateCurrentBoard();
    this.$router.afterEach(() => {
      this.updateCurrentBoard();
    });
  },
  methods: {
    goToBoard(boardId) {
      this.currentBoardId = boardId;
      this.$router.push({
        name: 'home',
        query: { board_id: boardId }
      });
    },
    updateCurrentBoard() {
      this.currentBoardId = this.$route.query.board_id || 'free';
    },
    getMenuStyle(menuId) {
      const isActive = this.currentBoardId === menuId;
      return {
        padding: '8px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: isActive ? '#2c9d6f' : 'rgba(255,255,255,0.2)',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.3s ease'
      };
    }
  }
};
</script>

<style scoped>
button:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}
</style>
