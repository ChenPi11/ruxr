<template>
  <div class="container">
    <ErrorContainer :initFunction="init">
      <div class="main-content">
        <div class="sidebar">
          <div class="package-info">
            <h1 class="package-name" v-if="packageData">
              {{ packageData.name }}
            </h1>
            <LiteLoadingBar v-else />

            <span class="package-version" v-if="packageData">
              v{{ packageData.versions[0].version }}
            </span>
            <LiteLoadingBar v-else />

            <p class="package-description" v-if="packageData">
              {{ packageData.description }}
            </p>
            <LiteLoadingBar v-else />

            <div class="actions">
              <button class="btn btn-primary" @click="downloadLatestRelease">
                <i class="nf nf-oct-download"></i> Download
              </button>
            </div>

            <div class="install-command" v-if="packageData">
              <h3>Install Command:</h3>
              <div class="command-box">
                <code class="language-reic">{{
                  rubiscoExtInstallCommand
                }}</code>
                <button
                  class="copy-command-btn"
                  :class="{ copied: isCopied }"
                  @click="copyInstallCommand"
                  title="Copy to clipboard"
                >
                  <i class="nf nf-md-content_copy" v-if="!isCopied"></i>
                  <i class="nf nf-md-check" v-else></i>
                  <span class="copy-text">{{ isCopied ? "Copied!" : "" }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="metadata">
            <h3>Package Metadata</h3>
            <div class="metadata-item">
              <span class="metadata-label">License:</span>
              <span v-if="packageData">
                {{ packageData.license }}
              </span>
              <LiteLoadingBar v-else />
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Homepage:</span>
              <span v-if="packageData">
                <a
                  :href="packageData.homepage"
                  target="_blank"
                  class="metadata-link"
                >
                  {{ packageData.homepage }}
                </a>
              </span>
              <LiteLoadingBar v-else />
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Tags:</span>
              <div class="tags" v-if="packageData && packageData.tags.length">
                <span
                  v-for="(tag, index) in packageData.tags"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <LiteLoadingBar v-else-if="packageData" />
              <span v-else> No tags found. </span>
            </div>
          </div>

          <div class="metadata">
            <h3>Maintainers</h3>
            <div v-if="packageData && packageData.maintainers.length">
              <a
                :href="maintainer.homepage"
                target="_blank"
                class="maintainer-card"
                v-for="maintainer in packageData.maintainers"
                :key="maintainer.name"
              >
                <div class="maintainer-avatar">
                  <img :src="maintainer.avatar" alt="Maintainer Avatar" />
                </div>
                <div class="maintainer-name">{{ maintainer.name }}</div>
              </a>
            </div>
            <LiteLoadingBar
              v-else-if="packageData && packageData.maintainers"
            />
            <span v-else> No maintainers found. </span>
          </div>
        </div>

        <div class="content-area">
          <div class="tabs">
            <div
              class="tab"
              :class="{ active: activeTab === 'readme' }"
              @click="activeTab = 'readme'"
            >
              README
            </div>
            <div
              class="tab"
              :class="{ active: activeTab === 'versions' }"
              @click="activeTab = 'versions'"
            >
              Versions
            </div>
            <div
              class="tab"
              :class="{ active: activeTab === 'license' }"
              @click="activeTab = 'license'"
            >
              License
            </div>
            <div
              class="tab"
              :class="{ active: activeTab === 'dependencies' }"
              @click="activeTab = 'dependencies'"
            >
              Dependencies
            </div>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'readme'" class="readme-content">
              <MarkdownViewer
                :url="packageData.getReadmeUrl()"
                v-if="packageData"
              />
              <LoadingBar v-else />
            </div>

            <div v-if="activeTab === 'versions'" class="versions-content">
              <h3>Version History</h3>
              <ul class="versions-list">
                <div v-if="packageData">
                  <li
                    v-for="version in packageData.versions"
                    :key="version.version"
                    class="version-item"
                  >
                    <span>
                      <a
                        :href="version.url"
                        target="_blank"
                        class="version-number"
                        v-if="version.url"
                        >v{{ version.version }}</a
                      >
                      <div v-else>{{ version.version }}</div>
                    </span>
                    <span class="version-date">{{ version.date }}</span>
                  </li>
                </div>
                <LoadingBar v-else-if="!packageData" />
                <div v-else class="no-content">
                  <p>No version history available for this extension.</p>
                </div>
              </ul>
            </div>

            <div v-if="activeTab === 'license'" class="license-content">
              <ErrorContainer :initFunction="fetchLicense">
                <div v-if="packageData && licenseText" class="markdown-body"
                :key="licenseText">
                  <h1>{{ packageData.license }}</h1>
                  <pre><code>{{ licenseText }}</code></pre>
                </div>
                <LoadingBar v-else/>
              </ErrorContainer>
            </div>

            <div
              v-if="activeTab === 'dependencies'"
              class="dependencies-content"
            >
              <ul class="versions-list">
                <div v-if="packageData && packageData.deps.length">
                  <li
                    class="version-item"
                    v-for="dep in packageData.deps"
                    :key="dep.name"
                  >
                    <span>
                      <a
                        :href="dep.url"
                        target="_blank"
                        class="metadata-link"
                        v-if="dep.url"
                      >
                        {{ dep.name }}
                      </a>
                      <div v-else>{{ dep.name }}</div>
                    </span>
                    <span>{{ dep.version }}</span>
                  </li>
                </div>
                <LoadingBar v-else-if="!packageData" />
                <div v-else class="no-content">
                  <p>No dependencies required for this extension.</p>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ErrorContainer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { FullExtensionInfo } from "@/lib/extension";
import { fetchExtensionInfo } from "@/lib/fetch";
import DOMPurify from "dompurify";

import LoadingBar from "@/components/LoadingBar.vue";
import LiteLoadingBar from "@/components/LiteLoadingBar.vue";
import MarkdownViewer from "@/components/MarkdownViewer.vue";
import ErrorContainer from "@/components/ErrorContainer.vue";
import { useRoute } from "vue-router";

@Options({
  name: "ExtensionShow",
  components: {
    LoadingBar,
    LiteLoadingBar,
    MarkdownViewer,
    ErrorContainer,
  },
})
export default class ExtensionShow extends Vue {
  activeTab: string = "readme";
  packageData: FullExtensionInfo | null = null;
  isCopied: boolean = false;

  rubiscoExtInstallCommand: string = "";
  readmeText?: string;
  licenseText: string = "";

  async init() {
    const route = useRoute();
    const id = route.params.id as string;
    this.packageData = await fetchExtensionInfo(id);
    document.title = `${this.packageData.name} - RUXR`;
    this.rubiscoExtInstallCommand = `rubisco ext install ${this.packageData.id}`;
  }

  async fetchLicense() {
    const response = await fetch(this.packageData!.getLicenseUrl());
    if (!response.ok) {
      throw new Error(`Failed to fetch license: ${response.statusText}`);
    }
    this.licenseText = DOMPurify.sanitize(await response.text());
  }

  async copyInstallCommand(): Promise<void> {
    if (!this.packageData) return;

    try {
      await navigator.clipboard.writeText(this.rubiscoExtInstallCommand);
      this.isCopied = true;

      setTimeout(() => {
        this.isCopied = false;
      }, 2000);

      console.log("Install command copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      this.selectCommandText();
    }
  }

  selectCommandText(): void {
    const commandElement = document.querySelector(
      ".command-text"
    ) as HTMLElement;
    if (commandElement) {
      const range = document.createRange();
      range.selectNodeContents(commandElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  downloadLatestRelease(): void {
    if (!this.packageData) return;
    const url = this.packageData.latest_release;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
</script>

<style scoped>
@import url("https://www.nerdfonts.com/assets/css/webfont.css");

.main-content {
  display: flex;
  gap: 30px;
  padding: 30px 0;
}

.sidebar {
  flex: 0 0 300px;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow);
  padding: 20px;
  height: fit-content;
}

.package-info {
  margin-bottom: 30px;
}

.package-name {
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 10px;
}

.package-version {
  display: inline-block;
  background: var(--secondary);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.package-description {
  color: #555;
  margin-bottom: 20px;
}

.metadata {
  margin-bottom: 25px;
}

.metadata h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border);
}

.metadata-item {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.metadata-label {
  font-weight: bold;
  min-width: 100px;
  color: #555;
}

.metadata-link {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.metadata-link:hover {
  color: var(--primary-stress);
  text-decoration: underline;
}

.maintainer-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 6px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  text-decoration: none;
}

.maintainer-card:hover {
  background: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.maintainer-avatar {
  flex-shrink: 0;
}

.maintainer-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #dee2e6;
  transition: border-color 0.2s ease;
}

.maintainer-avatar img:hover {
  border-color: var(--primary);
}

.maintainer-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.maintainer-name:hover {
  color: var(--primary-stress);
  text-decoration: underline;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.tag {
  background: var(--secondary);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary);
  color: white;
  flex: 1;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.install-command {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border);
}

.command-box {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  position: relative;
}

.language-reic {
  flex: 1;
  font-family: Consolas, ui-monospace, SFMono-Regular, SF Mono, Menlo,
    Liberation Mono, monospace;
  font-size: 13px;
}

.copy-command-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
}

.copy-command-btn:hover {
  background-color: #e9ecef;
  color: var(--primary);
}

.copy-command-btn.copied {
  color: #28a745;
  background-color: #d4edda;
}

.copy-command-btn i {
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.copy-text {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.copy-command-btn.copied .copy-text {
  opacity: 1;
  transform: translateX(0);
}

.content-area {
  flex: 1;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  padding: 0 20px;
}

.tab {
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
}

.tab.active {
  color: var(--primary);
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
}

.tab-content {
  padding: 30px;
  min-height: 400px;
}

.readme-content {
  line-height: 1.8;
}

.readme-content h2 {
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.readme-content p {
  margin-bottom: 15px;
}

.readme-content pre {
  background: var(--secondary);
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
}

.no-content {
  text-align: center;
  padding: 50px 0;
  color: #777;
}

.license-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

.versions-list {
  list-style: none;
}

.version-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}

.version-item:last-child {
  border-bottom: none;
}

.version-number {
  font-weight: bold;
  text-decoration: none;
  color: var(--primary);
  transition: color 0.2s ease;
}

.version-number:hover {
  color: var(--primary-stress);
}

.version-date {
  color: #777;
  font-size: 0.9rem;
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
    width: 100%;
  }

  .nav-links {
    margin-top: 10px;
  }
}
</style>
