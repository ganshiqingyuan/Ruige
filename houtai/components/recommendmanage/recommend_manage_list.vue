<template>
  <div class="recommend_manage_list_container">
    <add-recommend v-if="addRecommendShowFlag"></add-recommend>
    <el-form label-width='110px'>
      <el-row>
        <el-col :span="5">
          <el-form-item
            label='产品名称：'
            size="small"
          >
            <el-input v-model="queryItem.list_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label='产品描述：'
            size="small"
          >
            <el-input v-model="queryItem.descript"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label='产品详细描述：'
            size="small"
          >
            <el-input v-model="queryItem.detail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item size="small">
            <el-button @click="query_recommend_list(1)">查询</el-button>
            <el-button @click="changeAddRecommendShowFlag(true)">添加推荐产品</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading='tableLoading'
      :data='recommendData'
    >
      <el-table-column
        label='排序'
        prop='sort'
      >
      </el-table-column>

      <el-table-column
        label='产品名称'
        prop='list_name'
      >
      </el-table-column>

      <el-table-column
        label='产品描述'
        prop='descript'
      >
      </el-table-column>

      <el-table-column
        label='详细描述'
        prop='detail'
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        label='图片'
        prop='src'
      >
        <template slot-scope="scope">
          <img
            style="width:50px;height:50px;"
            :src="productUrl + scope.row.imgSrc"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <img
            style="height:18px;cursor:pointer;"
            @click="deleteRecommend(scope.row)"
            :src="deletePng"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right;"
      layout="prev, pager, next, total"
      :total="total"
      @prev-click="(pagenum)=>query_recommend_list(pagenum)"
      @next-click="(pagenum)=>query_recommend_list(pagenum)"
      @current-change="(pagenum)=>query_recommend_list(pagenum)"
      key="boardContent"
    >
    </el-pagination>
  </div>
</template>

<script>
import addRecommend from "./add_recommend.vue";
import deletePng from "img/delete.png";
export default {
  data() {
    return {
      deletePng: deletePng,
      imgSrc: this.$rq.imgSrc, // 图片资源基础地址
      addRecommendShowFlag: false, // 填加推荐产品页打开状态
      total: 0, // 推荐产品总数量
      tableLoading: false, // loading 状态
      queryItem: {
        list_name: "",
        descript: "",
        detail: "",
        page: 1,
        perpage: 10,
      },
      recommendData: [
        // 推荐产品列表
      ],
      productUrl: cdn.productUrl,
    };
  },
  mounted: function () {
    this.query_recommend_list(1);
  },
  methods: {
    deleteRecommend: function (item) {
      const requestData = {
        id: item.id,
        flag: 0,
      };
      this.$confirm("确认将该商品移除推荐?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$rq.changeRecommendStatus(requestData).then((res) => {
            this.$message("移除成功");
            this.query_recommend_list(1);
          });
        })
        .catch((err) => {
          console.info(err);
        });
    },
    changeAddRecommendShowFlag: function (flag) {
      this.addRecommendShowFlag = flag;
    },
    query_recommend_list: function (page) {
      const requestData = this.queryItem;
      requestData.page = page;
      this.tableLoading = true;
      this.$rq
        .getAllRecommendProductList(requestData)
        .then((res) => {
          this.recommendData = res.data;
          this.total = res.total;
          this.tableLoading = false;
        })
        .catch((err) => {
          console.info(err);
          this.tableLoading = false;
        });
    },
  },
  components: {
    addRecommend,
  },
};
</script>

<style lang="less">
.recommend_manage_list_container {
  background: #ffffff;
  width: 96%;
  margin: 15px auto;
  input {
    width: 90% !important;
    height: 30px;
    line-height: 30px;
  }
}
</style>