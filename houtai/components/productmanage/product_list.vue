<template>
    <el-dialog
        class="list_search"
        title='添加'
        @close="changeListChangeShowFlag(false)"
        :visible.sync="listChangeShowFlag"
        width="1000px"
    >
    <div>123</div>
        <el-form>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item size="small" prop="list_name" label = '分类名称：'>
                        <el-input style="width:100%;" v-model="itemList.list_name"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item prop='detail' size = 'small' label = '详细描述：'>
                        <el-input v-model="itemList.detail"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="6">
                    <el-form-item prop='descript' size = 'small' label = '描述：'>
                        <el-input style="width:100%;" v-model="itemList.descript"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='beginTime' size = 'small' label = '从'>
                        <el-input style="width:100%;" v-model="itemList.beginTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='endTime' size = 'small' label = '至'>
                        <el-input style="width:100%;" v-model="itemList.endTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='imgSrc' size = 'small'>
                        <el-button>查询</el-button>
                        <el-button>添加</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-table
        v-loading='tableLoading'
        :data="productListData"
        >

        </el-table>
        
    </el-dialog>
</template>

<script>
export default {
    data(){
        return {
            listChangeShowFlag: true,
            tableLoading: false,

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
        getProductList: function(page){
            console.log('page',page);
            
            const requestData = {
                list_name: this.itemList.list_name,
                descript: this.itemList.descript,
                beginTime: this.itemList.beginTime,
                endTime: this.itemList.endTime,
                typeId: this.seePropsType.id,
                page:page,
                perpage:10
            }
            
            console.log('requestData',requestData);
            
            this.$rq.getProductList(requestData).then(res=>{
                console.log('res',res);
            })
        }
    }
}
</script>

<style lang="less">

</style>