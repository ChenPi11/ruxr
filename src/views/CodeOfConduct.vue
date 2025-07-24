<template>
    <MarkdownViewer :url="'/ruxr/CODE_OF_CONDUCT.md'" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MarkdownViewer from "@/components/MarkdownViewer.vue";

@Options({
  name: "CodeOfConduct",
  components: {
    MarkdownViewer
  }
})
export default class CodeOfConduct extends Vue {
  mounted() {
    document.title = "Code of Conduct - RUXR";
  }
}
</script>
