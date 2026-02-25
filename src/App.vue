<template>
  <div id="app">
    <HeaderMenu />
    <main style="min-height: calc(100vh - 200px); max-width: 1200px; margin: 0 auto; padding: 20px;">
      <router-view/>
    </main>
    <FooterMenu />
  </div>
</template>

<script>
import HeaderMenu from '@/views/menu/header.vue';
import FooterMenu from '@/views/menu/footer.vue';

export default {
  name: 'App',
  components: {
    HeaderMenu,
    FooterMenu
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
