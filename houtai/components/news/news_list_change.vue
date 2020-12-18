<template>
  <el-dialog
    class="news_add"
    title="新闻增加"
    @close="changeNewsListChangeShowFlag(false)"
    :visible.sync="newsListChangeShowFlag"
    width="1000px"
  >
    <el-form label-width="150px">
      <el-form-item label="新闻标题：" size="small">
        <el-input v-model="newsEntity.title"></el-input>
      </el-form-item>
      <el-form-item size="small" label="图片：">
        <el-upload
          ref="upload"
          style="text-align:center;"
          action=""
          :show-file-list="false"
          :on-change="listChange"
          :auto-upload="false"
        >
          <img
            v-if="newsEntity.titleImg"
            style="width:50%;"
            :src="
              typeof newsEntity.titleImg == 'string'
                ? newsEntity.titleImg
                : URL.createObjectURL(newsEntity.titleImg.raw)
            "
            class="avatar"
          />
          <div v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              一次上传一张，只支持处理过后的透明png图片
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容：" size="small">
        <quill-editor
          ref="myQuillEditor"
          v-model="content"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
          @change="onEditorChange"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="changeNewsListChangeShowFlag(false)"
        >取 消</el-button
      >
      <el-button
        size="small"
        :loading="uploadLoading"
        type="primary"
        @click="submitNews"
        >提 交</el-button
      >
    </span>
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
      URL: URL,
      editorOption: {},
      newsEntity: {
        title: "",
        titleImg: "",
        content: "",
      },
      uploadLoading: false,
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
      this.newsEntity.content = html;
    },
    listChange: function(file) {
      if (file.size > 100000) {
        this.$notify({
          message: "封面图片过大",
          type: "warning",
        });
        this.$refs.upload.uploadFiles.pop();
        return;
      }
      this.newsEntity.titleImg = file;
    },
    submitNews: function() {
      if (!this.newsEntity.titleImg) {
        this.$notify({
          message: "请上传封面图片图片",
          type: "warning",
        });
        return;
      }
      if (!this.newsEntity.title) {
        this.$notify({
          message: "请输入新闻标题",
          type: "warning",
        });
        return;
      }
      if (!this.newsEntity.content) {
        this.$notify({
          message: "新闻内容为空",
          type: "warning",
        });
        return;
      }
      const requestData = new FormData();
      requestData.append("title", this.newsEntity.title);
      requestData.append("content", this.newsEntity.content);
      if (typeof this.newsEntity.titleImg != "string") {
        requestData.append("file", this.newsEntity.titleImg.raw);
      }
      this.$rq.changeNews(requestData).then((res) => {
        if (res) {
          this.$message("添加成功");
          this.changeNewsListChangeShowFlag(false);
        }
      });
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style lang="less"></style>
