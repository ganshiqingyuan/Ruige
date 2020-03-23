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
                                        <img style="height:18px;cursor:pointer;" @click="scope.row.spec_value_arr.push({spec_value:'', spec_value_id:0})" :src="addPng"/>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column
                    label="规格种类操作"
                    width="150"
                    >
                        <template slot-scope="scope">
                            <img style="height:18px;cursor:pointer;" @click="fenleiItem.spec_arr.splice(scope.$index,1)" :src="deletePng"/>
                            <img style="height:21px;padding:0 10px;cursor:pointer;" :src="cutJpg"/>
                            <img style="height:18px;cursor:pointer;" @click="fenleiItem.spec_arr.push({spec_name:'', spec_name_id:0 ,spec_value_arr:[{spec_value:'', spec_value_id: 0}]})" :src="addPng"/>
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
                        spec_name:'',
                        spec_name_id:0,
                        spec_value_arr:[
                            {
                                spec_value:'',  
                                spec_value_id: 0
                            }
                        ]
                    }
                ],
                spec_data:[
                    
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

            this.init_product_detail(propsType.id)
        }
    },
    methods:{
        changeProductChangeShowFlag: function(flag){
            this.$emit('changeProductChangeShowFlag',flag)
        },
        init_product_detail: function(id){
            this.$rq.get_product_detail({id:id}).then(res=>{
                if(res){
                    const item = res.data
                    this.fenleiItem.list_name = item.product_detail.list_name;
                    this.fenleiItem.descript = item.product_detail.descript;
                    this.fenleiItem.detail = item.product_detail.detail;
                    this.fenleiItem.file = item.product_detail.imgSrc;
                    this.fenleiItem.id = item.product_detail.id;
                    this.fenleiItem.seo_con = item.product_detail.seo_con;
                    this.fenleiItem.has_spec = item.product_detail.has_spec;
                    this.fenleiItem.stock = item.product_detail.stock;
                    this.fenleiItem.price = item.product_detail.price;

                    if(item.spec_name_list.length)
                    this.fenleiItem.spec_arr = item.spec_name_list;

                    setTimeout(()=>{
                        if(item.spec_data.length)
                        this.fenleiItem.spec_data = item.spec_data;
                    })
                }
            })
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
                        formData.append('fenleiItem', JSON.stringify(this.fenleiItem))
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
        merge: function(arry1, arry2){
            var result_arr = []
            for(var i=0; i<arry1.length; i++){
            for(var j=0; j< arry2.spec_value_arr.length; j++){
            result_arr.push({
                sku_id: 0,
                price: 0,
                stock: 0,
                spec_comp: arry1[i].spec_comp.concat({
                spec_name: arry2.spec_name,
                spec_name_id: 0,
                spec_value: arry2.spec_value_arr[j].spec_value,
                spec_value_id: arry2.spec_value_arr[j].spec_value_id
                })
            })
                    }
                }
            return result_arr;
        }
    },
    watch:{
        'fenleiItem.spec_arr':{
            handler(value){
                if(!value.length){
                    this.fenleiItem.spec_data = [];
                    return
                }

                var init_arr = value[0].spec_value_arr.map(_=>{
                    return {
                        sku_id:0,
                        price: 0,
                        stock: 0,
                        spec_comp:[
                            {
                                spec_name: value[0].spec_name,
                                spec_name_id: 0,
                                spec_value:_.spec_value,
                                spec_value_id:0
                            },
                        ]
                    }
                })

                for(var i=1; i< value.length; i++){
                    init_arr = this.merge(init_arr, value[i])
                }
                console.log(init_arr);

                this.fenleiItem.spec_data = init_arr
                

            },
            deep: true
        }
    }
}
</script>

<style lang="less">

</style>