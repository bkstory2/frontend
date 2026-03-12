<template>
    <div>
        <h1>📌 {{ getBoardTitle() }}</h1>
        <!-- 검색 기능 -->
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <input type="text" v-model="search.userId" placeholder="User ID 검색"
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;" />
                <input type="text" v-model="search.title" placeholder="제목 검색"
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;" />
                <input type="text" v-model="search.body" placeholder="내용 검색"
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px;" />
                <button @click="loadArticles"
                    style="padding: 8px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    검색
                </button>
                <button @click="resetSearch"
                    style="padding: 8px 20px; background-color: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">
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
                        <th style="padding: 10px;">첨부파일</th>
                        <th style="padding: 10px;">작성일</th>
                        <th style="padding: 10px;">수정일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(article, index) in articles" :key="article.id" style="cursor: pointer;">
                        <td style="padding: 8px; text-align: center;">{{ index + 1 }}</td>
                        <td style="padding: 8px; text-align: center;">{{ article.id }}</td>
                        <td style="padding: 8px;">{{ article.userId }}</td>
                        <td style="padding: 8px; cursor: pointer;" @click="goToDetail(article)">{{ article.title }}</td>
                        <td style="padding: 8px; cursor: pointer;" @click="goToDetail(article)">{{
                            article.body.substring(0, 50) }}{{ article.body.length > 50 ? '...' : '' }}</td>
                        <td style="padding: 8px; text-align: center;">
                            <a v-if="article.fileNm"
                                :href="downloadUrl(article.fileNm)"
                                download
                                style="color: #2196f3; text-decoration: none; font-weight: bold; cursor: pointer;"
                                @click.stop>
                                📥 {{ article.fileNm }}
                            </a>
                            <span v-else style="color: #999;">-</span>
                        </td>
                        <td style="padding: 8px; text-align: center; cursor: pointer;" @click="goToDetail(article)">{{
                            formatDate(article.createdAt) }}</td>
                        <td style="padding: 8px; text-align: center; cursor: pointer;" @click="goToDetail(article)">{{
                            article.updatedAt ? formatDate(article.updatedAt) : '-' }}</td>
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
            <button @click="goToWrite"
                style="padding: 10px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                ✏️ 글쓰기
            </button>
        </div>
    </div>
</template>

<script>

import boardApi from "@/api/board";
import { getBoardTitle } from "@/utils/boardUtils";

export default {
    name: "BoardList",
    data() {
        return {
            boardId: 'free',
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
        this.boardId = this.$route.query.board_id || 'free';
        await this.loadArticles();
    },
    watch: {
        '$route.query.board_id'() {
            this.boardId = this.$route.query.board_id || 'free';
            this.resetSearch();
        }
    },
    methods: {
        getBoardTitle() {
            return getBoardTitle(this.boardId);
        },
        async loadArticles() {
            try {
                this.loading = true;
                this.error = null;
                const params = {
                    board_id: this.boardId
                };
                if (this.search.userId) params.userId = this.search.userId;
                if (this.search.title) params.title = this.search.title;
                if (this.search.body) params.body = this.search.body;
                const res = await boardApi.getArticles(params);
                this.articles = res.data;
            } catch (err) {
                this.error = err;
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
        goToDetail(article) {
            this.$router.push({
                name: 'detail',
                params: { id: article.id },
                query: { board_id: this.boardId }
            });
        },
        goToWrite() {
            this.$router.push({
                name: 'write',
                query: { board_id: this.boardId }
            });
        },
        formatDate(date) {
            // utils에서 직접 불러와 사용
            return require('@/utils/boardUtils').formatDate(date);
        },
        downloadUrl(fileNm) {
            return boardApi.getDownloadUrl(fileNm);
        }
    }
};
</script>

<style scoped>
tbody tr:hover {
    background-color: #f5f5f5;
}
</style>
