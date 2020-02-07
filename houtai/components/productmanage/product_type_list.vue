<template>
    <div class="product_type_list_container">
        <product-type-change :propsType = 'propsType' v-if="productTypeChangeShowFlag"></product-type-change>
        <product-list :seePropsType = 'seePropsType' v-if="productListShowFlag"></product-list>
        <el-form label-width = '120px'>
            <el-row>
                <el-col :span="8">
                    <el-form-item label = '产品类型名称：' size="small">
                        <el-input v-model="queryItem.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label = '产品描述：' size="small">
                        <el-input v-model="queryItem.descript"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item size="small">
                        <el-button @click="query_type_list(1)">查询</el-button>
                        <el-button @click="changeTypeChangeShowFlag(true)">添加分类产品</el-button>
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
            prop = 'sort'
            >
            </el-table-column>

            <el-table-column
            label='产品名称'
            prop = 'name'
            >
            </el-table-column>

            <el-table-column
            label='产品描述'
            prop = 'descript'
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
                    <img style="width:50px;height:50px;" :src="imgSrc+ scope.row.src.replace('url(','').replace(')','').trim()"/>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            >
                <template slot-scope="scope">
                    <img style="height:18px;cursor:pointer;" @click="deleteType(scope.row)" :src="deletePng"/>
                    <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                    <img style="height:18px;cursor:pointer;" @click="seeListType(scope.row)" :src="seeJpg"/>
                    <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                    <img style="height:18px;cursor:pointer;" @click="changeType(scope.row)" :src="dealJpg"/>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float:right;"
            layout="prev, pager, next, total"
            :total="total"
            @prev-click="(pagenum)=>query_type_list(pagenum)"
            @next-click="(pagenum)=>query_type_list(pagenum)"
            @current-change="(pagenum)=>query_type_list(pagenum)"
            key="boardContent"
        >
        </el-pagination>
    </div>
</template>

<script>
import productTypeChange from './product_type_change.vue'
import productList from './product_list.vue'
import deletePng from 'img/delete.png'
import dealJpg from 'img/deal.jpg'
import cutJpg from 'img/cut.jpg'
import seeJpg from 'img/see.jpg'
export default {
    data(){
        return{
            propsType:'',
            seePropsType:'',
            deletePng: deletePng,
            cutJpg: cutJpg,
            seeJpg: seeJpg,
            dealJpg: dealJpg,
            imgSrc: this.$rq.imgSrc,
            productTypeChangeShowFlag: false,
            productListShowFlag: false,
            total:0,
            tableLoading:false,
            queryItem:{
                name:'',
                descript:'',
                page:1,
                perpage:10
            },
            typeData:[
                
            ]
        }
    },
    mounted: function(){
        this.query_type_list(1)
    },
    methods:{
        deleteType: function(item){
            const requestData = {
                id:item.id,
                src: item.src
            }
            this.$confirm('确认删除该类别?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$rq.deleteType(requestData).then(res=>{
                    this.$message('删除成功');
                    this.query_type_list(1)
                })
            }).catch(() => {

            });
        },
        changeTypeChangeShowFlag: function(flag){
            this.productTypeChangeShowFlag = flag
            this.propsType = ''
        },
        changeListChangeShowFlag: function(flag){
            this.productListShowFlag = flag
            this.seePropsType = ''
        },
        query_type_list: function(page){
            const requestData = this.queryItem
            requestData.page = page
            this.tableLoading = true
            this.$rq.getTypeList(requestData).then(res=>{
                this.typeData = res.data
                this.total = res.total
                this.tableLoading = false
            })
            .catch(err=>{
                console.info(err)
                this.tableLoading = false
            })
        },
        changeType: function(item){
            this.propsType = item;
            this.productTypeChangeShowFlag = true
        },
        seeListType: function(item){
            this.seePropsType = item;
            this.productListShowFlag = true
        }
    },
    components:{
        productTypeChange,
        productList
    }
}
</script>

<style lang="less">
.product_type_list_container{
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