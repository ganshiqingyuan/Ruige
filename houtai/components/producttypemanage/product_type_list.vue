<template>
    <div class="recommend_manage_list_container">
        <add-type  v-if="addTypeShowFlag"></add-type>
        <el-form label-width = '120px'>
            <el-row>
                <el-col :span="5">
                    <el-form-item label = '分类名称：' size="small">
                        <el-input v-model="queryItem.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label = '分类描述：' size="small">
                        <el-input v-model="queryItem.descript"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item size="small">
                        <el-button @click="query_product_list(1)">查询</el-button>
                        <el-button type="primary" plain @click="changeAddTypeShowFlag(true)">添加产品分类</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-table
        v-loading='tableLoading'
        :data = 'typeData'
        >
            <el-table-column
            label='排序'
            width="50"
            prop="recommend"
            >
            </el-table-column>

            <el-table-column
            label='产品名称'
            prop = 'name'
            >
            </el-table-column>

            <el-table-column
            label='产品描述'
            width="220"
            prop = 'descript'
            >
            </el-table-column>

            <el-table-column
            label='图片'
            prop = 'src'
            >
                <template slot-scope="scope">
                    <img style="width:50px;height:50px;" :src="scope.row.src"/>
                </template>
            </el-table-column>

            <el-table-column
            label='更新时间'
            prop = 'updateTime'
            show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
            label="操作"
            >
                <template slot-scope="scope">
                    <img style="height:18px;cursor:pointer;" @click="deleteRecommend(scope.row)" :src="deletePng"/>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float:right;"
            layout="prev, pager, next, total"
            :total="total"
            @prev-click="(pagenum)=>query_product_list(pagenum)"
            @next-click="(pagenum)=>query_product_list(pagenum)"
            @current-change="(pagenum)=>query_product_list(pagenum)"
            key="boardContent"
        >
        </el-pagination>
    </div>
</template>

<script>
import addType from './add_type.vue'
import deletePng from 'img/delete.png'
export default {
    data(){
        return{
            deletePng: deletePng,
            imgSrc: this.$rq.imgSrc, // 图片资源基础地址
            addTypeShowFlag: false, // 填加产品分类页打开状态
            total:0, // 产品分类总数量
            tableLoading:false, // loading 状态
            queryItem:{
                name:'',
                descript:'',
                page:1,
                perpage:10
            },
            typeData:[ // 产品分类列表
                
            ]
        }
    },
    mounted: function(){
        this.query_product_list(1)
    },
    methods:{
        deleteRecommend: function(item){
            const requestData = {
                id:item.id,
                flag:0
            }
            this.$confirm('确认将该商品移除分类列表?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$rq.changeProductTypeStatus(requestData).then(res=>{
                    this.$message('移除成功');
                    this.query_product_list(1)
                })
            }).catch((err) => {
                console.info(err)
            });
        },
        changeAddTypeShowFlag: function(flag){
            this.addTypeShowFlag = flag
        },
        query_product_list: function(page){
            const requestData = this.queryItem
            requestData.page = page
            this.tableLoading = true
            this.$rq.getAllRecommendProductTypeList(requestData).then(res=>{
                // this.typeData = res.data ? res.data.filter(item=>item.recommend) : []
                this.typeData = res.data 
                this.total = res.total
                // this.total = this.typeData.length
                this.tableLoading = false
            })
            .catch(err=>{
                console.info(err)
                this.tableLoading = false
            })
        }
    },
    components:{
        addType
    }
}
</script>

<style lang="less">
.recommend_manage_list_container{
    background: #ffffff;
    width: 96%;
    margin: 15px auto;
    input{
        width: 90% !important;
        height: 30px;
        line-height: 30px;
    }
}
</style>