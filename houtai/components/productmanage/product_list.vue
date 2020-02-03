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
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item size="small" prop="list_name" label = '分类名称：'>
                        <el-input v-model="itemList.list_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='detail' size = 'small' label = '详细描述：'>
                        <el-input v-model="itemList.detail"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='descript' size = 'small' label = '描述：'>
                        <el-input v-model="itemList.descript"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop='imgSrc' size = 'small' label = '图片：'>
                        <el-input v-model="itemList.imgSrc"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="changeTypeChangeShowFlag(false)">取 消</el-button>
            <el-button size="small" :loading="uploadLoading" type="primary" @click="submitType">提 交</el-button>
        </span> -->
    </el-dialog>
</template>

<script>
export default {
    data(){
        return {
            listChangeShowFlag: true,
            itemList:{
                name:'',
                descript:'',
                sort:'',
                file:'',
                id:''
            }
           
        }
    },
    props:{
        seePropsType: Object
    },
    mounted: function(){
        const seePropsType = this.seePropsType
        console.log('seePropsType',seePropsType)
        if(seePropsType){
            this.itemList.name = seePropsType.name;
            this.itemList.descript = seePropsType.descript;
            this.itemList.sort = seePropsType.sort;
            this.itemList.file = seePropsType.src;
            this.itemList.id = seePropsType.id
        }
    },
    methods:{
        changeListChangeShowFlag: function(flag){
            this.$parent.changeListChangeShowFlag(flag)
        }
    }
}
</script>

<style lang="less">

</style>