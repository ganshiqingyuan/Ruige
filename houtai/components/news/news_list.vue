<template>
  <div class="news_list_container">
    <news-list-change v-if="newsListShowFlag"></news-list-change>
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
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="beginTime" size="small" label="时间：从">
            <el-date-picker
              v-model="queryItem.beginTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="endTime" size="small" label="至">
            <el-date-picker
              v-model="queryItem.endTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="imgSrc" size="small">
            <el-button @click="query_news_list(1)">查询</el-button>
            <el-button @click="changeNewsListChangeShowFlag(true)"
              >添加</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="tableLoading" :data="newsList">
      <el-table-column label="时间" prop="createTimestamp"> </el-table-column>

      <el-table-column label="标题" prop="title"> </el-table-column>

      <el-table-column label="内容" prop="content"> </el-table-column>

      <el-table-column label="封面图片" prop="titleImg">
        <template slot-scope="scope">
          <img style="width:50px;height:50px;" :src="scope.row.titleImg" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <img
            style="height:18px;cursor:pointer;"
            @click="deleteNews(scope.row)"
            :src="deletePng"
          />
          <img
            style="height:21px;padding:0 10px;cursor:pointer;"
            :src="cutJpg"
          />
          <img
            style="height:18px;cursor:pointer;"
            @click="changeNews(scope.row)"
            :src="dealJpg"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right;"
      layout="prev, pager, next, total"
      :total="total"
      @prev-click="(pagenum) => query_news_list(pagenum)"
      @next-click="(pagenum) => query_news_list(pagenum)"
      @current-change="(pagenum) => query_news_list(pagenum)"
      key="boardContent"
    >
    </el-pagination>
  </div>
</template>

<script>
import newsListChange from "./news_list_change.vue";

export default {
  name: "newsList",
  data() {
    return {
      newsListShowFlag: false,
      tableLoading: false,
      queryItem: {
        title: "",
        content: "",
        beginTime: "",
        endTime: "",
        page: 1,
      },
      newsList: [],
      total: 0,
    };
  },
  methods: {
    query_news_list: function() {
      const requestData = {
        title: this.queryItem.title,
        content: this.queryItem.content,
        beginTime: this.queryItem.beginTime || new Date(0),
        endTime: this.queryItem.endTime || new Date(),
        page: this.queryItem.page,
        perpage: 10,
      };

      this.$rq.getNewsList(requestData).then((res) => {
        console.log(res);
        this.newsList = res.data;
        this.total = res.total;
        this.tableLoading = false;
      });
    },
    changeNewsListChangeShowFlag: function(flag) {
      this.newsListShowFlag = flag;
    },
    deleteNews: function(item) {},
    changeNews: function(item) {},
  },
  components: {
    newsListChange,
  },
};
</script>

<style lang="less">
.news_list_container {
  background: #ffffff;
  width: 96%;
  margin: 15px auto;
}
</style>
