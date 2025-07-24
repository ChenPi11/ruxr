<template>
  <ErrorContainer :initFunction="renderMarkdown">
    <div v-if="renderedMarkdown">
      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </div>
    <LoadingBar v-else />
  </ErrorContainer>
</template>

<script lang="ts">
import { Options, Vue, prop } from "vue-class-component";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import hljs from "highlight.js";

import LoadingBar from "@/components/LoadingBar.vue";
import ErrorContainer from "@/components/ErrorContainer.vue";

class Props {
  url = prop<string>({ required: true });
}

@Options({
  name: "MarkdownViewer",
  components: {
    LoadingBar,
    ErrorContainer,
  },
})
export default class MarkdownViewer extends Vue.with(Props) {
  renderedMarkdown: string = "";

  async renderMarkdown() {
    this.renderedMarkdown = "";

    const response = await fetch(this.url);
    const markdown_text = await response.text();

    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str: string, lang: string): string {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs"><code>' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value +
              "</code></pre>"
            );
          } catch (__) {
            return (
              '<pre class="hljs"><code>' +
              md.utils.escapeHtml(str) +
              "</code></pre>"
            );
          }
        }

        return (
          '<pre class="hljs"><code>' +
          md.utils.escapeHtml(str) +
          "</code></pre>"
        );
      },
    });

    this.renderedMarkdown = DOMPurify.sanitize(md.render(markdown_text));
  }
}
</script>

<style>
@import "github-markdown-css/github-markdown.css";
@import "highlight.js/styles/github.css";

.markdown-content {
  line-height: 1.6;
}

.markdown-body pre,
.markdown-body code {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
}

.markdown-body pre code {
  font-family: inherit;
}
</style>
