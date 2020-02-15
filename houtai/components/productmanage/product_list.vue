<template>
    <el-dialog
        class="list_search"
        title='添加'
        @close="changeListChangeShowFlag(false)"
        :visible.sync="listChangeShowFlag"
        width="90%"
    >
        <product-list-change :propsType="propsType" @getProductList = 'getProductList' :typeId="itemList.typeId" @changeProductChangeShowFlag = 'changeProductChangeShowFlag' v-if="productChangeShowFlag"></product-list-change>
        <el-form label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item size="small" prop="list_name" label = '分类名称：'>
                        <el-input style="width:100%;" v-model="itemList.list_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='detail' size = 'small' label = '详细描述：'>
                        <el-input v-model="itemList.detail"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='descript' size = 'small' label = '描述：'>
                        <el-input style="width:100%;" v-model="itemList.descript"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item prop='beginTime' size = 'small' label = '时间：从'>
                        <el-input style="width:100%;" v-model="itemList.beginTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='endTime' size = 'small' label = '至'>
                        <el-input style="width:100%;" v-model="itemList.endTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop='imgSrc' size = 'small'>
                        <el-button @click="getProductList(1)">查询</el-button>
                        <el-button @click="changeProductChangeShowFlag(true)">添加</el-button>
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
            >
                <template slot-scope="scope">
                    <img style="height:18px;cursor:pointer;" @click="deleteProduct(scope.row)" :src="deletePng"/>
                    <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                    <img style="height:18px;cursor:pointer;" @click="changeProduct(scope.row)" :src="dealJpg"/>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
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
import deletePng from 'img/delete.png'
import dealJpg from 'img/deal.jpg'
import cutJpg from 'img/cut.jpg'
import seeJpg from 'img/see.jpg'
import productListChange from './product_list_change.vue'
export default {
    data(){
        return {
            productChangeShowFlag:false,
            listChangeShowFlag: true,
            tableLoading: false,
            total:0,
            propsType:{},
            deletePng: deletePng,
            cutJpg: cutJpg,
            seeJpg: seeJpg,
            dealJpg: dealJpg,
            imgSrc: this.$rq.imgSrc,
            productListData: '',
            itemList: {
                list_name: '',
                descript: '',
                beginTime: '',
                endTime: '',
                typeId: this.seePropsType.id,
                page:1,
                perpage:10
            }
           
        }
    },
    props:{
        seePropsType: Object
    },
    mounted: function(){
        this.getProductList(1)
    },
    methods:{
        changeListChangeShowFlag: function(flag){
            this.$parent.changeListChangeShowFlag(flag)
        },
        changeProductChangeShowFlag: function(flag){
            this.productChangeShowFlag = flag
            this.propsType = ''
        },
        changeProduct: function(item){
            this.propsType = item;
            this.productChangeShowFlag = true
        },
        getProductList: function(page){
            const requestData = {
                list_name: this.itemList.list_name,
                descript: this.itemList.descript,
                beginTime: this.itemList.beginTime,
                endTime: this.itemList.endTime,
                typeId: this.seePropsType.id,
                page:page,
                perpage:10
            }
            this.tableLoading = true
            this.$rq.getProductList(requestData).then(res=>{
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
        deleteProduct: function(item){
            const requestData = {
                id: item.id,
                imgSrc: item.imgSrc,
                typeId: this.itemList.typeId
            }

            this.$confirm('确认删除该产品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$rq.deleteProduct(requestData).then(res=>{
                if(res){
                        this.$message("删除成功")
                        this.getProductList(1)
                    }
                })
                .catch(error =>{
                    this.$message("删除失败")
                })
            }).catch(() => {

            });
        },
    },
    components:{
        productListChange
    }
}
</script>

<style lang="less">

</style>