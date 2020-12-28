<template>
  <div class="news_list_container">
    <news-list-change
      v-if="newsListShowFlag"
      :news="changedNews"
    ></news-list-change>
    <el-form label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="id" size="small">
            <el-input v-model="queryItem.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="cookie" size="small">
            <el-input v-model="queryItem.content"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <el-form-item size="small">
          <el-button @click="query_news_list(1)" type="primary" plain
            >查询</el-button
          >
          <el-button @click="addNews">添加</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table v-loading="tableLoading" :data="newsList">
      <!-- <el-table-column label="时间" prop="creationTimestamp">
        <template slot-scope="scope">
          <p>
            {{ formatDate(scope.row.creationTimestamp, "yyyy-MM-dd HH:mm:ss") }}
          </p>
        </template>
      </el-table-column> -->

      <el-table-column label="id" prop="title"> </el-table-column>

      <el-table-column label="cookie" prop="title"> </el-table-column>
      <el-table-column label="ip" prop="title"> </el-table-column>

      <el-table-column label="location" prop="title">
        <template slot-scope="scope">
          <img
            style="height:18px;cursor:pointer;"
            @click="changeNews(scope.row)"
            :src="dealJpg"
          />
        </template>
      </el-table-column>

      <el-table-column label="counter次数" prop="title"> </el-table-column>

      <el-table-column label="time" prop="title">上传时间 </el-table-column>
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
// import newsView from "./news_view.vue";
import dealJpg from "img/deal.jpg";
import seeJpg from "img/see.jpg";
export default {
  name: "newsList",
  data() {
    return {
      dealJpg: dealJpg,
      seeJpg: seeJpg,
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
      changedNews: "",
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
    changeNews: function(item) {
      this.changedNews = item;
      this.changeNewsListChangeShowFlag(true);
    },
    formatDate: function(date, format) {
      date = new Date(date);
      if (!format) format = "yyyy-MM-dd";
      var dict = {
        yyyy: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        H: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        MM: ("" + (date.getMonth() + 101)).substr(1),
        dd: ("" + (date.getDate() + 100)).substr(1),
        HH: ("" + (date.getHours() + 100)).substr(1),
        mm: ("" + (date.getMinutes() + 100)).substr(1),
        ss: ("" + (date.getSeconds() + 100)).substr(1),
      };
      return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
      });
    },
  },
  mounted: function() {
    this.query_news_list();
  },
  components: {
    // newsListChange,
    // newsView,
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
