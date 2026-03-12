// src/utils/boardUtils.js
export const BOARD_TITLES = {
  free: '자유게시판',
  notice: '공지사항',
  qna: 'Q&A'
};

export function getBoardTitle(boardId) {
  return BOARD_TITLES[boardId] || '게시판';
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString('ko-KR') +
    ' ' +
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  );
}
