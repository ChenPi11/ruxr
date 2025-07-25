<template>
  <div class="extension-list">
    <div class="container">
      <div class="extensions-container">
        <ErrorContainer :initFunction="initExtensionList">
          <LoadingBar v-if="isLoading" />
          <div v-else-if="filteredExtensions.length" class="extensions-grid">
            <div
              v-for="extension in filteredExtensions"
              :key="extension.id"
              class="extension-card"
              @click="selectExtension(extension)"
            >
              <div class="extension-icon">
                <img
                  :src="extension.icon"
                  :alt="extension.name"
                  v-if="extension.icon"
                />
                <div class="default-icon" v-else>
                  {{ extension.name.charAt(0) }}
                </div>
              </div>
              <div class="extension-details">
                <h3>{{ extension.name }}</h3>
                <p class="description">{{ extension.description }}</p>
                <div
                  class="extension-tags"
                  v-if="extension.tags && extension.tags.length"
                >
                  <span v-for="tag in extension.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
                <div class="extension-meta">
                  <span class="author">{{ extension.first_maintainer }}</span>
                  <span class="version">v{{ extension.latest_version }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!isLoading" class="no-extensions">
            <p>No extensions found</p>
          </div>
        </ErrorContainer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Router } from "vue-router";
import { Options, Vue } from "vue-class-component";
import { Watch } from "vue-property-decorator";

import { fetchExtensions } from "@/lib/fetch";
import { ExtensionCard } from "@/lib/extension";

import LoadingBar from "@/components/LoadingBar.vue";
import ErrorContainer from "@/components/ErrorContainer.vue";

@Options({
  components: {
    LoadingBar,
    ErrorContainer,
  },
})
export default class ExtensionList extends Vue {
  $router!: Router;

  name: string = "ExtensionList";
  searchQuery: string = "";
  extensions: ExtensionCard[] = [];
  filteredExtensions: ExtensionCard[] = [];
  isLoading: boolean = false;

  async filterExtensions(): Promise<void> {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredExtensions = this.extensions;
      return;
    }

    this.filteredExtensions = this.extensions.filter((extension) => {
      return (
        extension.name.toLowerCase().includes(query) ||
        extension.description.toLowerCase().includes(query) ||
        extension.first_maintainer.toLowerCase().includes(query) ||
        extension.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }

  async initExtensionList(): Promise<void> {
    this.isLoading = true;
    try {
      this.extensions = await fetchExtensions();
      this.filterExtensions();
    } finally {
      this.isLoading = false;
    }
  }

  async mounted(): Promise<void> {
    const urlQuery = (this.$route.query.query as string) || "";
    this.searchQuery = urlQuery;

    await this.initExtensionList();
  }

  @Watch("$route")
  async onRouteChange(newRoute: any, oldRoute: any): Promise<void> {
    if (newRoute.query.query !== oldRoute.query.query) {
      const newQuery = (newRoute.query.query as string) || "";
      this.searchQuery = newQuery;
      await this.filterExtensions();
    }
  }

  async beforeRouteUpdate(to: any, from: any, next: any): Promise<void> {
    const newQuery = (to.query.query as string) || "";
    if (newQuery !== this.searchQuery) {
      this.searchQuery = newQuery;
      await this.filterExtensions();
    }
    next();
  }

  async selectExtension(extension: ExtensionCard): Promise<void> {
    await this.$router.push(`/extensions/${extension.id}`);
  }

  async retryFetch(): Promise<void> {
    await this.initExtensionList();
  }
}
</script>

<style scoped>
.extension-list {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 20px;
}

.extensions-container {
  width: 100%;
}

.extensions-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.extension-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #e8e8e8;
}

.extension-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #d0d0d0;
}

.extension-icon {
  width: 128px;
  height: 128px;
  margin-right: 16px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.extension-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-icon {
  font-size: 64px;
  font-weight: bold;
  color: #666;
}

.extension-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.extension-details h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.extension-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: auto;
  margin-top: 8px;
}

.tag {
  background-color: var(--primary-background);
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid var(--primary);
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: var(--primary-background);
  transform: scale(1.05);
}

.extension-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #888;
  margin-top: auto;
}

.author {
  font-weight: 500;
}

.version {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.no-extensions {
  text-align: center;
  padding: 40px 0;
  color: var(--dark);
}
</style>
