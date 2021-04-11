<template>
  <div class="news_list_container">
    <news-list-change
      v-if="newsListShowFlag"
      :news="changedNews"
    ></news-list-change>
    <news-view
      :newsHtml="viewsNews"
      v-if="newsViewShowFlag"
    ></news-view>
    <el-form label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="新闻标题"
            size="small"
          >
            <el-input v-model="queryItem.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="内容"
            size="small"
          >
            <el-input v-model="queryItem.content"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            prop="beginTime"
            size="small"
            label="时间：从"
          >
            <el-date-picker
              v-model="queryItem.beginTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="endTime"
            size="small"
            label="至"
          >
            <el-date-picker
              v-model="queryItem.endTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="imgSrc"
            size="small"
          >
            <el-button @click="query_news_list(1)">查询</el-button>
            <el-button @click="addNews">添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="newsList"
    >
      <el-table-column
        label="时间"
        prop="creationTimestamp"
      >
        <template slot-scope="scope">
          <p>
            {{ formatDate(scope.row.creationTimestamp, "yyyy-MM-dd HH:mm:ss") }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        label="标题"
        prop="title"
      > </el-table-column>

      <el-table-column
        label="内容"
        prop="content"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="点击预览新闻内容"
            placement="top"
          >
            <img
              style="height:21px;padding:0 10px;cursor:pointer;"
              alt="点击预览内容"
              @click="viewNews(scope.row.content)"
              :src="seeJpg"
            />
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        label="封面图片"
        prop="titleImg"
      >
        <template slot-scope="scope">
          <img
            style="width:50px;height:50px;"
            :src="newsUrl + scope.row.title.replace(/\s/g, '-') + '/' + scope.row.titleImg"
          />
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
import newsView from "./news_view.vue";
import deletePng from "img/delete.png";
import dealJpg from "img/deal.jpg";
import cutJpg from "img/cut.jpg";
import seeJpg from "img/see.jpg";
export default {
  name: "newsList",
  data() {
    return {
      deletePng: deletePng,
      dealJpg: dealJpg,
      cutJpg: cutJpg,
      seeJpg: seeJpg,
      newsListShowFlag: false,
      newsViewShowFlag: false,
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
      viewsNews: "",
      changedNews: "",
      newsUrl: cdn.newsUrl,
    };
  },
  methods: {
    query_news_list: function () {
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
    changeNewsViewChangeShowFlag: function (flag) {
      this.newsViewShowFlag = flag;
    },
    changeNewsListChangeShowFlag: function (flag) {
      this.newsListShowFlag = flag;
    },
    deleteNews: function (item) {
      const requestData = {
        id: item.id,
      };

      this.$confirm("确认删除该条新闻?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$rq
            .deleteNews(requestData)
            .then((res) => {
              if (res) {
                this.$message("删除成功");
                this.query_news_list(1);
              }
            })
            .catch((error) => {
              this.$message("删除失败");
            });
        })
        .catch(() => {});
    },
    changeNews: function (item) {
      this.changedNews = {
        ...item,
        imgName: item.content
          .match(new RegExp(/<img src=[^>]*>/, "g"))
          .map((str) => {
            const url = str.substring(
              str.indexOf('"') + 1,
              str.lastIndexOf(".")
            );
            return url.substr(url.lastIndexOf("/") + 1);
          }),
        imgFace: item.content
          .match(new RegExp(/<img src=[^>]*>/, "g"))
          .map((str) => {
            const url = str.substring(
              str.indexOf('"') + 1,
              str.lastIndexOf('"')
            );
            return url.substr(url.lastIndexOf("/") + 1);
          })
          .indexOf(item.titleImg),
      };
      console.log(this.changedNews);
      this.changeNewsListChangeShowFlag(true);
    },
    viewNews: function (content) {
      this.viewsNews = content;
      this.changeNewsViewChangeShowFlag(true);
    },
    addNews: function () {
      this.changedNews = "";
      this.changeNewsListChangeShowFlag(true);
    },
    formatDate: function (date, format) {
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
      return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]];
      });
    },
  },
  mounted: function () {
    this.query_news_list();
  },
  components: {
    newsListChange,
    newsView,
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
