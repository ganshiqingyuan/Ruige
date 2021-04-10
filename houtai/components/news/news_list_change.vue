<template>
  <el-dialog
    class="news_add"
    title="新闻增加"
    @close="changeNewsListChangeShowFlag(false)"
    :visible.sync="newsListChangeShowFlag"
    width="1000px"
  >
    <el-form label-width="150px">
      <el-form-item
        label="新闻标题："
        size="small"
      >
        <el-input v-model="newsEntity.title"></el-input>
      </el-form-item>
      <!-- <el-form-item size="small" label="图片：">
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
      </el-form-item> -->

      <el-form-item
        label="内容："
        size="small"
      >
        <quill-editor
          ref="myQuillEditor"
          v-model="newsEntity.content"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"
        />
      </el-form-item>
      <el-form-item
        label="自定义图片名称："
        size="small"
        prop="imgName"
      >
        <el-input
          placeholder="依次输入内容中上传图片的名称用逗号隔开(例name1,name2,name3)"
          v-model="newsEntity.imgName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="选择封面图片："
        size="small"
        prop="imgFace"
      >
        <el-button
          type="primary"
          plain
          @click="selectImgFaceBtn(true)"
        >选择封面图</el-button>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="changeNewsListChangeShowFlag(false)"
      >取 消</el-button>
      <el-button
        size="small"
        :loading="uploadLoading"
        type="primary"
        @click="submitNews"
      >提 交</el-button>
    </span>
    <el-dialog
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-radio-group v-model="radio">
        <el-radio :label="0"><img src=""></el-radio>
        <el-radio :label="1">备选项</el-radio>
        <el-radio :label="2">备选项</el-radio>
      </el-radio-group>
      <span
        slot="footer"
        class="dialog-footer"
      ></span>
      <el-button
        size="small"
        type="primary"
        @click="add"
      >添加</el-button>
      <el-button
        size="small"
        @click="submitNews"
      >取消</el-button>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
export default {
  name: "newListChange",
  data() {
    return {
      radio: "0",
      innerVisible: false,
      newsListChangeShowFlag: true,
      URL: URL,
      editorOption: {},
      newsEntity: this.$props.news || {
        id: "",
        title: "",
        // titleImg: "",
        imgName: "",
        imgFace: "",
        content: "",
      },
      uploadLoading: false,
    };
  },
  props: ["news"],
  methods: {
    add() {},
    //选择封面图
    selectImgFaceBtn(flag) {
      this.innerVisible = flag;
    },
    changeNewsListChangeShowFlag: function (flag) {
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
    // listChange: function (file) {
    //   if (file.size > 100000) {
    //     this.$notify({
    //       message: "封面图片过大",
    //       type: "warning",
    //     });
    //     this.$refs.upload.uploadFiles.pop();
    //     return;
    //   }
    //   //   this.newsEntity.titleImg = file;
    // },
    submitNews: function () {
      //   if (!this.newsEntity.titleImg) {
      //     this.$notify({
      //       message: "请上传封面图片图片",
      //       type: "warning",
      //     });
      //     return;
      //   }
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
      requestData.append("id", this.newsEntity.id);
      //   requestData.append(
      //     "file",
      //     typeof this.newsEntity.titleImg != "string"
      //       ? this.newsEntity.titleImg.raw
      //       : this.newsEntity.titleImg
      //   );
      requestData.append("imgName", this.newsEntity.imgName);
      requestData.append("imgFace", this.newsEntity.imgFace);
      this.uploadLoading = true;
      this.$rq
        .changeNews(requestData)
        .then((res) => {
          if (res) {
            this.$message("添加成功");
            this.changeNewsListChangeShowFlag(false);
            this.$parent.query_news_list();
            this.uploadLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.uploadLoading = false;
        });
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style lang="less"></style>
