<template>
  <el-dialog
    class="news_add"
    title="新闻增加"
    @close="changeNewsListChangeShowFlag(false)"
    :visible.sync="newsListChangeShowFlag"
    width="1000px"
  >
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange"
    />
  </el-dialog>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "newListChange",
  data() {
    return {
      newsListChangeShowFlag: true,
      content: "",
      editorOption: {},
    };
  },
  methods: {
    changeNewsListChangeShowFlag: function(flag) {
      this.$parent.changeNewsListChangeShowFlag(flag);
    },
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style lang="less"></style>
