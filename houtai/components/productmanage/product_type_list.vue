<template>
    <div class="product_type_list_container">
        <product-type-change v-if="productTypeChangeShowFlag"></product-type-change>
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
                    <el-button>查看子产品列表</el-button>
                    <el-button>删除产品类别</el-button>
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

export default {
    data(){
        return{
            imgSrc: this.$rq.imgSrc,
            productTypeChangeShowFlag: false,
            total:0,
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
    methods:{
        changeTypeChangeShowFlag: function(flag){
            this.productTypeChangeShowFlag = flag
        },
        query_type_list: function(page){
            const requestData = this.queryItem
            requestData.page = page

            this.$rq.getTypeList(requestData).then(res=>{
                this.typeData = res.data
                this.total = res.total
            })
        }
    },
    components:{
        productTypeChange
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