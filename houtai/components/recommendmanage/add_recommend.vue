<template>
    <el-dialog
        class="list_search"
        title='添加'
        @close="changeAddRecommendShowFlag(false)"
        :visible.sync="addRecommendShowFlag"
        width="90%"
    >
        <el-form label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item size="small" prop="list_name" label = '产品名称：'>
                        <el-input style="width:100%;" v-model="queryItem.list_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='detail' size = 'small' label = '产品描述：'>
                        <el-input v-model="queryItem.descript"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='descript' size = 'small' label = '详细描述：'>
                        <el-input style="width:100%;" v-model="queryItem.detail"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='imgSrc' size = 'small'>
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
            label='产品名称'
            prop = 'list_name'
            >
            </el-table-column>

            <el-table-column
            label='描述'
            prop = 'descript'
            >
            </el-table-column>

            <el-table-column
            label='详细描述'
            prop = 'detail'
            show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
            label='更新时间'
            prop = 'updateTime'
            >
            </el-table-column>

            <el-table-column
            label='图片'
            prop = 'src'
            >
                <template slot-scope="scope">
                    <img style="width:50px;height:50px;" :src="scope.row.imgSrc"/>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            width="50"
            >
                <template slot-scope="scope">
                    <img v-if="!scope.row.recommend" alt="添加到推荐" title="添加到推荐" style="height:18px;cursor:pointer;" @click="addProduct(scope.row)" :src="addPng"/>
                    <img v-else alt="取消此产品推荐" title="取消此产品推荐" style="height:18px;cursor:pointer;" @click="addProduct(scope.row)" :src="exitPng"/>
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
import addPng from 'img/add.png'
import exitPng from 'img/exit.png'
export default {
    data(){
        return {
            changed: 0, // 是否有对推荐进行修改
            addRecommendShowFlag: true,
            tableLoading: false,
            total:0,
            propsType:{},
            addPng: addPng,
            exitPng: exitPng,
            imgSrc: this.$rq.imgSrc,
            productListData: [],
            queryItem: {
                list_name: '',
                descript: '',
                detail: '',
                page:1,
                perpage:10
            }
           
        }
    },
    mounted: function(){
        this.getProductList(1)
    },
    methods:{
        changeAddRecommendShowFlag: function(flag){
            if(this.changed){
                this.$parent.query_recommend_list(1)
            }
            this.$parent.changeAddRecommendShowFlag(flag)
        },
        addProduct: function(item){
                this.changed = 1
                const requestData = {
                    id: item.id,
                    flag: item.recommend == 1 ? 0 : 1
                }
                this.tableLoading = true;
                this.$rq.changeRecommendStatus(requestData).then(res=>{
                    if(res){
                        this.$message(item.recommend == 1 ? '取消推荐成功' : '添加推荐成功')
                        item.recommend = (item.recommend == 1 ? 0 : 1)
                        this.tableLoading = false;
                        //this.getProductList(this.$refs.pagination.lastEmittedPage == -1 ? 1: this.$refs.pagination.lastEmittedPage)
                    }
                })
                .catch(err=>{
                    console.log(err)
                    this.tableLoading = false
                })
        },
        getProductList: function(page){
            console.log(this.$refs.pagination)
            const requestData = this.queryItem;
            requestData.page = page
            this.tableLoading = true
            this.$rq.getAllProductList(requestData).then(res=>{
                this.tableLoading = false
                if(res){
                    this.total = res.total;
                    this.productListData = res.data;
                }
            })
            .catch(err=>{
                console.log(err)
                this.tableLoading = false
            })
        },
    }
}
</script>

<style lang="less">

</style>