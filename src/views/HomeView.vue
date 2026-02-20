<template>
  <h1>aa</h1>
</template>

<script>
import boardApi from "@/api/board";

export default {
  name: "HomeView",
  data() {
    return {
      article: null,
      error: null
    };
  },
  async created() {
    try {
      const { data } = await boardApi.getArticle(1);
      this.article = data;
      console.log(this.article);
    } catch (err) {
      this.error = err;
      console.error(err);
    }
  }
};
</script>