<template>
  <div class="news_list_container">
        <news-list-change
    <el-form label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="新闻标题" size="small">
            <el-input v-model="queryItem.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内容" size="small">
            <el-input v-model="queryItem.content"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="small">
        </el-col>
      </el-row>
      <el-row>
                <el-col :span="8">
                    <el-form-item prop='beginTime' size = 'small' label = '时间：从'>
                        <el-input style="width:100%;" v-model="itemList.beginTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='endTime' size = 'small' label = '至'>
                        <el-input style="width:100%;" v-model="itemList.endTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='imgSrc' size = 'small'>
                        <el-button @click="query_news_list(1)">查询</el-button>
                        <el-button @click="changeNewsListChangeShowFlag(true)">添加</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
    </el-form>
  </div>
</template>

<script>
import newsListChange from './news_list_change'
export default {
  name: "newsListChange",
  data() {
    return {
      newsListShowFlag: false,
    };
  },
  methods: {
    query_news_list: function() {},
    changeNewsListChangeShowFlag: function(flag) {
      this.newsListShowFlag = flag;
    },
  },
  components: {
        newsListChange
  }
};
</script>

<style lang="less"></style>
