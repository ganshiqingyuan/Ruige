<template>
    <div class="product_type_list_container">
        <el-form label-width = '120px'>
            <el-row>
                <el-col :span="8">
                    <el-form-item label = '产品类型名称：' size="small">
                        <el-input v-model="type_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label = '产品描述：' size="small">
                        <el-input v-model="type_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item size="small">
                        <el-button @click="query_type_list(1)">查询</el-button>
                        <el-button @click="addProduct">添加分类产品</el-button>
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
            prop = 'descript'
            >
            </el-table-column>

            <el-table-column
            label='图片'
            prop = 'descript'
            >
                <template slot-scope="scope">

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
    </div>
</template>

<script>
export default {
    data(){
        return{
            typeData:[
                {
                    
                }
            ]
        }
    },
    methods:{
        query_type_list: function(page){
            const requestData = {}
        }
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