<template>
  <header>
    <div class="container header-content">
      <div class="logo">
        <img
          src="../assets/logo.svg"
          alt="Rubisco"
          width="40"
          height="40"
          class="icon"
        />
        <span>Rubisco Extension Repository</span>
      </div>
      <div class="search-bar">
        <i class="nf nf-oct-search" @click="handleSearch"></i>
        <input 
          type="text" 
          placeholder="Search packages..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
      </div>
      <nav class="nav">
        <router-link to="/"><i class="nf nf-cod-home"></i> Home</router-link>
        <a href="https://github.com/cppp-project/ruxr"><i class="nf nf-dev-github"></i> GitHub</a>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "AppHeader",
})
export default class AppHeader extends Vue {
  searchQuery: string = "";

  handleSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.$router.push({
        path: '/extensions',
        query: { query: query }
      });
    } else {
      this.$router.push('/extensions');
    }
  }
}
</script>

<style scoped>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

header {
  background-color: var(--primary);
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 10px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.logo i {
  font-size: 2rem;
}

.search-bar {
  flex: 1;
  max-width: 600px;
  min-width: 200px;
  margin: 0 20px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  padding-left: 40px;
  box-sizing: border-box;
}

.search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  cursor: pointer;
  transition: color 0.2s ease;
}

.search-bar i:hover {
  color: #555;
}

.nav a, .nav .router-link-active, .nav .router-link-exact-active {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  font-weight: 500;
  white-space: nowrap;
}

.nav {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    flex: 1;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .search-bar {
    margin: 10px 0;
    max-width: 100%;
    min-width: 0;
    width: auto;
  }

  .nav-links {
    margin-top: 10px;
  }
}
</style>
