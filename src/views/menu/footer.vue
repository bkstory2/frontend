<template>
  <footer style="background-color: #333; color: #999; padding: 20px; text-align: center; margin-top: 40px; border-top: 1px solid #555;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <p style="margin: 5px 0;">© 2026 Vue.js 게시판 | 자유게시판 · 공지사항 · Q&A</p>
      <p style="margin: 5px 0; font-size: 12px;">Powered by Vue.js + Spring Boot + MySQL</p>
      <p style="margin: 5px 0; font-size: 12px;">
        <a href="#" style="color: #999; text-decoration: none;">이용약관</a> | 
        <a href="#" style="color: #999; text-decoration: none;">개인정보처리방침</a> | 
        <a href="#" style="color: #999; text-decoration: none;">문의하기</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterMenu'
};
</script>

<style scoped>
a:hover {
  color: #fff;
}
</style>
