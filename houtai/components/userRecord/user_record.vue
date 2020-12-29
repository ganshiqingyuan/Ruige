<template>
  <div class="news_list_container">
    <el-form label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="ip" size="small">
            <el-input v-model="queryItem.ip"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="location" size="small">
            <el-input v-model="queryItem.location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="creationTimeFrom" size="small" label="时间：从">
            <el-date-picker
              v-model="queryItem.creationTimeFrom"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="creationTimeTo" size="small" label="至">
            <el-date-picker
              v-model="queryItem.creationTimeTo"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="imgSrc" size="small">
            <el-button @click="query_news_list(1)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <el-form-item size="small">
          <el-button @click="query_news_list(1)" type="primary" plain
            >查询</el-button
          >
        </el-form-item>
      </div>
    </el-form>

    <el-table v-loading="tableLoading" :data="userRecordList">
      <el-table-column label="id" prop="id"> </el-table-column>

      <el-table-column show-overflow-tooltip label="cookie" prop="cookie">
      </el-table-column>
      <el-table-column label="ip" prop="ip"> </el-table-column>

      <el-table-column show-overflow-tooltip label="location" prop="location">
      </el-table-column>

      <el-table-column label="访问次数" prop="count"> </el-table-column>

      <el-table-column label="访问历史" prop="history">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="500" trigger="click">
            <ul>
              <li
                v-for="(item, index) of scope.row.history.split(',')"
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
            <p style="cursor: pointer;" slot="reference">点击查看</p>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="生成时间" prop="creationTime">
        <template slot-scope="scope">
          <p>
            {{ formatDate(scope.row.creationTime, "yyyy-MM-dd HH:mm:ss") }}
          </p>
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
import dealJpg from "img/deal.jpg";
import seeJpg from "img/see.jpg";
export default {
  name: "userRecord",
  data() {
    return {
      dealJpg: dealJpg,
      seeJpg: seeJpg,
      tableLoading: false,
      queryItem: {
        location: "",
        ip: "",
        creationTimeFrom: "",
        creationTimeTo: "",
      },
      userRecordList: [],
      total: 0,
      changedNews: "",
    };
  },
  methods: {
    query_news_list: function(page) {
      const requestData = {
        location: this.queryItem.location,
        ip: this.queryItem.ip,
        creationTimeFrom: this.queryItem.creationTimeFrom || new Date(0),
        creationTimeTo: this.queryItem.creationTimeTo || new Date(),
        page: page,
        perpage: 10,
      };

      this.$rq.getUserRecordList(requestData).then((res) => {
        this.userRecordList = res.data;
        this.total = res.total;
        this.tableLoading = false;
      });
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
    this.query_news_list(1);
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
