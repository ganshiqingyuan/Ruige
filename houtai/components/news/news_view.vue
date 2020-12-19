<template>
  <el-dialog
    class="news_add"
    title="新闻预览"
    @close="changeNewsViewChangeShowFlag(false)"
    :visible.sync="newsViewShowFlag"
    width="1000px"
  >
    <div class="ql-editor" v-html="newsHtml"></div>
  </el-dialog>
</template>

<script>
export default {
  name: "newsView",
  data() {
    return {
      newsViewShowFlag: true,
    };
  },
  props: ["newsHtml"],
  methods: {
    changeNewsViewChangeShowFlag: function(flag) {
      this.$parent.changeNewsViewChangeShowFlag(flag);
    },
  },
};
</script>

<style lang="less"></style>
