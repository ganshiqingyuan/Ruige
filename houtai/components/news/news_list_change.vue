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
        <el-table
          class="img_chose_table"
          :data="imgList"
        >
          <el-table-column
            width="100"
            label="图片"
            class="img_chose"
          >
            <template slot-scope="scope">
              <div v-html="scope.row">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="图片名">
            <template slot-scope="scope">
              <el-input v-model="newsEntity.imgName[scope.$index]"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="是否为封面图片">
            <template slot-scope="scope">
              <el-radio
                v-model="newsEntity.imgFace"
                :label="scope.$index"
              >选这个</el-radio>
            </template>
          </el-table-column>

        </el-table>
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
        imgName: [],
        imgFace: 0,
        content: "",
      },
      uploadLoading: false,
      oldArry:
        (this.$props.news &&
          this.$props.news.content.match(new RegExp(/<img src=[^>]*>/, "g"))) ||
        [],
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
      if (this.newsEntity.imgName.filter((item) => !item).length) {
        this.$notify({
          message: "请为图片补充名称以方便进行seo",
          type: "warning",
        });
        return;
      }
      if (this.imgList.length < this.newsEntity.imgFace + 1) {
        this.$notify({
          message: "请选择封面图片或上传封面图片",
          type: "warning",
        });
        return;
      }
      const requestData = {
        title: this.newsEntity.title,
        content: this.newsEntity.content,
        id: this.newsEntity.id,
        imgName: this.newsEntity.imgName,
        imgFace: this.newsEntity.imgFace == -1 ? 0 : this.newsEntity.imgFace,
      };
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
  computed: {
    imgList: function () {
      var regex = /<img src=[^>]*>/;
      var newArry = this.newsEntity.content.match(new RegExp(regex, "g")) || [];
      console.log("执行", newArry);
      if (newArry.length > this.oldArry.length) {
        for (let i = 0; i < newArry.length; i++) {
          if (this.oldArry.indexOf(newArry[i]) == -1) {
            this.newsEntity.imgName.splice(i, 0, "");
          }
        }
      } else {
        for (let i = 0; i < this.oldArry.length; i++) {
          if (newArry.indexOf(this.oldArry[i]) == -1) {
            this.newsEntity.imgName.splice(i, 1);
          }
        }
      }
      this.oldArry = newArry;
      return newArry;
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style lang="less">
.img_chose_table {
  img {
    width: 100%;
  }
}
</style>
