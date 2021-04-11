<template>
  <el-dialog
    class="list_search"
    title='添加'
    @close="changeAddRecommendTypeShowFlag(false)"
    :visible.sync="addRecommendShowFlag"
    width="90%"
  >
    <el-form label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item
            size="small"
            prop="list_name"
            label='产品名称：'
          >
            <el-input
              style="width:100%;"
              v-model="queryItem.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            prop='descript'
            size='small'
            label='产品描述：'
          >
            <el-input v-model="queryItem.descript"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            prop='imgSrc'
            size='small'
          >
            <el-button @click="getProductList(1)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading='tableLoading'
      :data="productListData"
    >
      <el-table-column
        label='产品名称1'
        prop='name'
        width="300"
      >
      </el-table-column>

      <el-table-column
        label='描述'
        prop='descript'
      >
      </el-table-column>

      <el-table-column
        label='更新时间'
        width="150px"
        prop='updateTime'
      >
      </el-table-column>

      <el-table-column
        label='图片'
        width="100"
        prop='src'
      >
        <template slot-scope="scope">
          <img
            style="width:50px;height:50px;"
            :src="productUrl + scope.row.src"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="50"
      >
        <template slot-scope="scope">
          <img
            v-if="!scope.row.recommend"
            alt="添加到推荐"
            title="添加到推荐"
            style="height:18px;cursor:pointer;"
            @click="addProduct(scope.row)"
            :src="addPng"
          />
          <img
            v-else
            alt="取消此产品推荐"
            title="取消此产品推荐"
            style="height:18px;cursor:pointer;"
            @click="addProduct(scope.row)"
            :src="exitPng"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      ref="pagination"
      style="float:right;"
      layout="prev, pager, next, total"
      :total="total"
      @prev-click="(pagenum)=>getProductList(pagenum)"
      @next-click="(pagenum)=>getProductList(pagenum)"
      @current-change="(pagenum)=>getProductList(pagenum)"
      key="boardContent"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
import addPng from "img/add.png";
import exitPng from "img/exit.png";
export default {
  data() {
    return {
      changed: 0, // 是否有对推荐进行修改
      addRecommendShowFlag: true,
      tableLoading: false,
      total: 0,
      propsType: {},
      addPng: addPng,
      exitPng: exitPng,
      imgSrc: this.$rq.imgSrc,
      productListData: [],
      queryItem: {
        name: "",
        descript: "",
        page: 1,
        perpage: 10,
      },
      productUrl: cdn.productUrl,
    };
  },
  mounted: function () {
    this.getProductList(1);
  },
  methods: {
    changeAddRecommendTypeShowFlag: function (flag) {
      if (this.changed) {
        this.$parent.query_product_list(1);
      }
      this.$parent.changeAddTypeShowFlag(flag);
    },
    addProduct: function (item) {
      console.log("item", item, item.recommend);

      this.changed = 1;
      const requestData = {
        id: item.id,
        flag: item.recommend ? 0 : 1,
      };
      this.tableLoading = true;
      this.$rq
        .changeProductTypeStatus(requestData)
        .then((res) => {
          if (res) {
            this.$message.success(
              item.recommend ? "取消推荐成功" : "添加推荐成功"
            );
            item.recommend = item.recommend ? 0 : 1;
            this.tableLoading = false;
            this.$parent.query_product_list(1);
            //this.getProductList(this.$refs.pagination.lastEmittedPage == -1 ? 1: this.$refs.pagination.lastEmittedPage)
          }
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    getProductList: function (page) {
      console.log(this.$refs.pagination);
      const requestData = this.queryItem;
      requestData.page = page;
      this.tableLoading = true;
      this.$rq
        .getAllProductTypeList(requestData)
        .then((res) => {
          this.tableLoading = false;
          if (res) {
            this.total = res.total;
            this.productListData = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
  },
};
</script>

<style lang="less">
</style>