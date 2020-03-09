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
            <el-form-item  prop = 'detail' size = 'small' label = '详细描述：'>
                <el-input type="textarea" :rows="6" placeholder="不同的条目以，分割" v-model="fenleiItem.detail"></el-input>
            </el-form-item>
            <el-form-item size = 'small' label = '图片：'>
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
            <el-form-item size="small" label="seo 关键词：">
                <el-input v-model="fenleiItem.seo_con"></el-input>
            </el-form-item> 
            <el-form-item size = "small" label = "是否有规格：">
                <el-radio-group v-model="fenleiItem.has_spec">
                    <el-radio-button :label="1">是</el-radio-button>
                    <el-radio-button :label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if = "fenleiItem.has_spec" size="small" label="规格：">
                <el-table
                border
                width='500'
                :data = 'fenleiItem.spec_arr'
                >
                    <el-table-column
                    label="规格名称"
                    width="150"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.spec_name"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格值"
                    >
                        <template slot-scope="scope">
                            <el-table
                            :data = 'scope.row.spec_value_arr'
                            >
                                <el-table-column
                                label="规格值选项"
                                >
                                    <template slot-scope="scope2">
                                        <el-input v-model="scope2.row.spec_value"></el-input>  
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="规格选项值操作操作"
                                width="150"
                                >
                                    <template slot-scope="scope2">
                                        <img style="height:18px;cursor:pointer;" @click="scope.row.spec_value_arr.length>0?scope.row.spec_value_arr.splice(scope2.$index,1):''" :src="deletePng"/>
                                        <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                                        <img style="height:18px;cursor:pointer;" @click="scope.row.spec_value_arr.push({spec_value:''})" :src="addPng"/>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格种类操作"
                    width="100"
                    >
                        <template slot-scope="scope">
                            <img style="height:18px;cursor:pointer;" @click="fenleiItem.spec_arr.splice(scope.$index,1)" :src="deletePng"/>
                            <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                            <img style="height:18px;cursor:pointer;" @click="fenleiItem.spec_arr.push({spec_name:'',spec_value_arr:[{spec_value:''}]})" :src="addPng"/>
                        </template>
                    </el-table-column>
                </el-table>
                <br>
                <br>
                <el-table
                :data="fenleiItem.spec_data"
                border
                >
                    <el-table-column
                    label="组合">
                        <template slot-scope="scope">
                            <p>{{scope.row.spec_comp.reduce((pre,cur)=>pre+cur.spec_value,'')}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="价格"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="库存"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.stock"></el-input>   
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item v-if="!fenleiItem.has_spec" label="价格：" size="small">
                <el-input v-model="fenleiItem.price" size="small"></el-input>
            </el-form-item>

            <el-form-item v-if="!fenleiItem.has_spec" label="库存：" size="small">
                <el-input v-model="fenleiItem.stock" size="small"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="changeTypeChangeShowFlag(false)">取 消</el-button>
            <el-button size="small" :loading="uploadLoading" type="primary" @click="submitType">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import deletePng from 'img/delete.png'
import cutJpg from 'img/cut.jpg'
import addPng from 'img/add.png'
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
                seo_con:'',
                has_spec: 0,
                spec_arr:[
                    {
                        spec_name:'颜色',
                        spec_value_arr:[
                            {
                                spec_value:'黑色'
                            },
                            {
                                spec_value:'白色'
                            }
                        ]
                    },
                    {
                        spec_name:'大小',
                        spec_value_arr:[
                            {
                                spec_value:'大'
                            },
                            {
                                spec_value:'小'
                            }
                        ]
                    },
                    {
                        spec_name:'胖瘦',
                        spec_value_arr:[
                            {
                                spec_value:'胖'
                            },
                            {
                                spec_value:'瘦'
                            }
                        ]
                    }
                ],
                spec_data:[
                    {
                        price: 0,
                        stock: 0,
                        spec_comp:[
                            {
                                spec_name:'颜色',
                                spec_name_id: 0,
                                spec_value:'黑色',
                                spec_value_id:0
                            },
                            {
                                spec_name:'大小',
                                spec_name_id: 0,
                                spec_value:'大',
                                spec_value_id:0
                            }
                        ]
                    },
                    {
                        price: 0,
                        stock: 0,
                        spec_comp:[
                            {
                                spec_name:'颜色',
                                spec_name_id: 0,
                                spec_value:'黑色',
                                spec_value_id:0
                            },
                            {
                                spec_name:'大小',
                                spec_name_id: 0,
                                spec_value:'小',
                                spec_value_id:0
                            }
                        ]
                    },
                    {
                        price: 0,
                        stock: 0,
                        spec_comp:[
                            {
                                spec_name:'颜色',
                                spec_name_id: 0,
                                spec_value:'白色',
                                spec_value_id:0
                            },
                            {
                                spec_name:'大小',
                                spec_name_id: 0,
                                spec_value:'大',
                                spec_value_id:0
                            }
                        ]
                    },
                    {
                        price: 0,
                        stock: 0,
                        spec_comp:[
                            {
                                spec_name:'颜色',
                                spec_name_id: 0,
                                spec_value:'白色',
                                spec_value_id:0
                            },
                            {
                                spec_name:'大小',
                                spec_name_id: 0,
                                spec_value:'小',
                                spec_value_id:0
                            }
                        ]
                    }
                ],
                price: 0, // 没有规格的时候的价格
                stock:0, // 没有规格时候的库存
                id:'',
                typeId:this.typeId
            },
            imgSrc: this.$rq.imgSrc,
            URL:URL,
            deletePng:deletePng,
            cutJpg: cutJpg,
            addPng: addPng,
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
        },
        dker: function(arr1, arr2){
            var result_arr = []
            for(var i=0; i<arr1.length; i++){
                for(var j=0; j<arr2.length; j++){
                    result_arr.push(arr1[i].concat(arr2[j]))
                }
            }
            return result_arr
        }
    },
    watch:{
        'fenleiItem.spec_arr':{
            handler(value){
                var ret_arr = []
                console.log('改变')
                console.log(value)
                if(value.length == 2){
                    //const dker_arr = this.dker(this.fenleiItem.spec_arr[0].spec_value_arr.map(_=>[_]),this.fenleiItem.spec_arr[1].spec_value_arr.map(_=>[_]))
                    for(var i=0; i<value[0].spec_value_arr.length; i++){
                        for(var j=0; j<value[1].spec_value_arr.length; j++){
                            ret_arr.push({
                                price: 0,
                                stock: 0,
                                spec_comp: value.map((_,index)=>{
                                    if(index == 0)
                                    return {
                                        spec_name: _.spec_name,
                                        spec_name_id: _.spec_id,
                                        spec_value: _.spec_value_arr[i].spec_value,
                                        spec_value_id: _.spec_value_arr[i].id
                                    }
                                    else {
                                        return {
                                            spec_name: _.spec_name,
                                            spec_name_id: _.spec_id,
                                            spec_value: _.spec_value_arr[j].spec_value,
                                            spec_value_id: _.spec_value_arr[j].id
                                        }
                                    }
                                })
                            })
                        }
                    }
                }

                this.fenleiItem.spec_data = ret_arr
                

            },
            deep: true
        }
    }
}
</script>

<style lang="less">

</style>