<template>
  <el-dialog
    class="hospital_search"
    title="分类添加"
    @close="changeTypeChangeShowFlag(false)"
    :visible.sync="typeChangeShowFlag"
    width="1000px"
  >
    <el-form
      ref="typeform"
      :model="fenleiItem"
      :rules="fenleirules"
      label-width="120px"
    >
      <el-form-item
        size="small"
        prop="name"
        label="分类名称："
      >
        <el-input v-model="fenleiItem.name"></el-input>
      </el-form-item>
      <el-form-item
        prop="descript"
        size="small"
        label="描述："
      >
        <el-input v-model="fenleiItem.descript"></el-input>
      </el-form-item>
      <el-form-item
        prop="sort"
        size="small"
        label="排序："
      >
        <el-input v-model="fenleiItem.sort"></el-input>
      </el-form-item>
      <el-form-item
        size="small"
        label="图片"
      >
        <el-upload
          ref="upload"
          style="text-align:center;"
          action=""
          :show-file-list="false"
          :on-change="listChange"
          :auto-upload="false"
        >
          <img
            v-if="fenleiItem.file"
            style="width:50%;"
            :src="
              typeof fenleiItem.file == 'string'
                ? productUrl + fenleiItem.file
                : URL.createObjectURL(fenleiItem.file.raw)
            "
            class="avatar"
          />
          <div v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div
              class="el-upload__tip"
              slot="tip"
            >
              一次上传一张，只支持处理过后的透明png图片
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        @click="changeTypeChangeShowFlag(false)"
      >取 消</el-button>
      <el-button
        size="small"
        :loading="uploadLoading"
        type="primary"
        @click="submitType"
      >提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      typeChangeShowFlag: true,
      uploadLoading: false,
      fenleiItem: {
        name: "",
        descript: "",
        sort: "",
        file: "",
        id: "",
      },
      imgSrc: this.$rq.imgSrc,
      URL: URL,
      productUrl: cdn.productUrl,
      fenleirules: {
        name: [
          { required: true, trigger: "blur", message: "分类名称不能唯恐" },
        ],
        descript: [
          { required: true, trigger: "blur", message: "分类描述不能为空" },
        ],
        sort: [{ required: true, trigger: "blur", message: "排序不能为空" }],
      },
    };
  },
  props: {
    propsType: Object,
  },
  mounted: function () {
    const propsType = this.propsType;
    console.log(propsType);
    if (propsType) {
      this.fenleiItem.name = propsType.name;
      this.fenleiItem.descript = propsType.descript;
      this.fenleiItem.sort = propsType.sort;
      this.fenleiItem.file = propsType.src;
      this.fenleiItem.id = propsType.id;
    }
  },
  methods: {
    changeTypeChangeShowFlag: function (flag) {
      this.$parent.changeTypeChangeShowFlag(flag);
    },
    listChange: function (file) {
      if (file.name.split(".")[file.name.split(".").length - 1] != "png") {
        this.$notify({
          message: "只支持处理过后的透明png图片上传",
          type: "warning",
        });
        this.$refs.upload.uploadFiles.pop();
        return;
      }
      this.fenleiItem.file = file;
    },
    submitType: function () {
      this.$refs.typeform.validate((valid) => {
        if (valid) {
          if (this.fenleiItem.file) {
            this.uploadLoading = true;
            const formData = new FormData();
            formData.append(
              "file",
              typeof this.fenleiItem.file == "string"
                ? this.fenleiItem.file
                : this.fenleiItem.file.raw
            );
            formData.append("name", this.fenleiItem.name);
            formData.append("descript", this.fenleiItem.descript);
            formData.append("sort", this.fenleiItem.sort);
            formData.append("id", this.fenleiItem.id);
            this.$rq
              .saveType(formData)
              .then((res) => {
                this.uploadLoading = false;
                if (res) {
                  this.$message("保存成功");
                  this.changeTypeChangeShowFlag(false);
                }
                this.$parent.query_type_list(1);
              })
              .catch((error) => {
                console.error(error);
                this.uploadLoading = false;
              });
          } else {
            this.$notify({
              message: "请上传分类的展示图片",
              type: "warning",
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less"></style>
