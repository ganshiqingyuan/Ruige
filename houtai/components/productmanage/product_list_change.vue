<template>
    <el-dialog
        class="hospital_search"
        title='产品添加'
        @close="changeProductChangeShowFlag(false)"
        :visible.sync="typeChangeShowFlag"
        append-to-body
        width="1000px"
    >
        <el-form ref="typeform" :model="fenleiItem" :rules="fenleirules" label-width='120px'>
            <el-form-item size="small" prop="list_name" label = '产品名称：'>
                <el-input v-model="fenleiItem.list_name"></el-input>
            </el-form-item>
            <el-form-item prop='descript' size = 'small' label = '描述：'>
                <el-input v-model="fenleiItem.descript"></el-input>
            </el-form-item>
            <el-form-item  prop = 'detail' size = 'small' label = '详细描述'>
                <el-input type="textarea" :rows="6" placeholder="不同的条目以，分割" v-model="fenleiItem.detail"></el-input>
            </el-form-item>
            <el-form-item size = 'small' label = '图片'>
                <el-upload
                    ref="upload"
                    style="text-align:center;"
                    action=""
                    :show-file-list="false"
                    :on-change="listChange"
                    :auto-upload="false">
                    <img style="width:50%;" v-if="fenleiItem.file" :src="typeof(fenleiItem.file) == 'string'?(fenleiItem.file):URL.createObjectURL(fenleiItem.file.raw)" class="avatar">
                    <div v-else >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">一次上传一张，只支持处理过后的透明png图片</div>
                    </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="changeTypeChangeShowFlag(false)">取 消</el-button>
            <el-button size="small" :loading="uploadLoading" type="primary" @click="submitType">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data(){
        return {
            typeChangeShowFlag: true,
            uploadLoading:false,
            fenleiItem:{
                list_name:'',
                descript:'',
                detail:'',
                file:'',
                id:'',
                typeId:this.typeId
            },
            imgSrc: this.$rq.imgSrc,
            URL:URL,
            fenleirules:{
                list_name:[
                    {required:true, trigger:'blur', message:'产品名称不能为空'}
                ],
                descript:[
                    {required:true, trigger:'blur', message:'产品描述不能为空'}
                ],
                detail:[
                    {required:true, trigger:'blur', message:'产品详细信息不能为空'}
                ]
            }
        }
    },
    props:{
        propsType: Object,
        typeId: String
    },
    mounted: function(){
        const propsType = this.propsType
        if(propsType){
            this.fenleiItem.list_name = propsType.list_name;
            this.fenleiItem.descript = propsType.descript;
            this.fenleiItem.detail = propsType.detail;
            this.fenleiItem.file = propsType.imgSrc;
            this.fenleiItem.id = propsType.id
        }
    },
    methods:{
        changeProductChangeShowFlag: function(flag){
            this.$emit('changeProductChangeShowFlag',flag)
        },
        listChange: function(file){
            console.log(file)
            if(file.name.split('.')[file.name.split('.').length-1]!='png'){
                this.$notify({
                    message:'只支持处理过后的透明png图片上传',
                    type:'warning'
                })
                this.$refs.upload.uploadFiles.pop()
                return
            }
            this.fenleiItem.file = file
        },
        submitType: function(){
            this.$refs.typeform.validate(valid=>{
                if(valid){
                    if(this.fenleiItem.file){
                        this.uploadLoading = true;
                        const formData = new FormData();
                        formData.append('file',typeof(this.fenleiItem.file) == 'string'?this.fenleiItem.file:this.fenleiItem.file.raw)
                        formData.append('list_name',this.fenleiItem.list_name)
                        formData.append('descript',this.fenleiItem.descript)
                        formData.append('detail',this.fenleiItem.detail)
                        formData.append('id',this.fenleiItem.id)
                        formData.append('typeId',this.fenleiItem.typeId)
                        this.$rq.changeProduct(formData).then(res=>{
                            this.uploadLoading = false
                            if(res){
                                this.$message('保存成功')
                                this.changeProductChangeShowFlag(false)
                            }
                            this.$emit('getProductList',1)
                        })
                        .catch(error=>{
                            console.error(error)
                            this.uploadLoading = false
                        })
                    }
                    else{
                       this.$notify({
                            message:'请上传图片',
                            type:'warning'
                        }) 
                    }
                }
            })
        }
    }
}
</script>

<style lang="less">

</style>