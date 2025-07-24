<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

@Options({
  components: {
    AppHeader,
    AppFooter,
  },
})
export default class App extends Vue {}
</script>

<style>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Noto Sans SC", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --primary: #cb3837;
  --primary-stress: #b32d2a;
  --primary-background: #f2e1e1;
  --secondary: #f5f5f5;
  --dark: #333;
  --light: #fff;
  --border: #eaeaea;
  --shadow: rgba(0, 0, 0, 0.1);
}

body {
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
