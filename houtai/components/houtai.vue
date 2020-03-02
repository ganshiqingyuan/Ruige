<template>
    <div class="houtai_container">
        <div class="config_left">
            <el-menu
            default-active="2"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            >
                <template v-for="(item,index) of configData" >
                    <el-submenu v-if="item.children" :index="index.toString()" :key="index">
                        <template slot="title">
                        <i class="el-icon-info"></i>
                        <span>{{item.label}}</span>
                        </template>
                        <template  v-for="(item1,index1) of item.children">
                            <el-submenu v-if="item1.children" :index="index+'-'+index1" >
                                <template slot="title">{{item1.label}}</template>
                            </el-submenu>

                            <el-menu-item v-else @click="itemDeal(item1)" :index="index+'-'+index1">
                                <i class="el-icon-info"></i>
                                <span slot="title">{{item1.label}}</span>
                            </el-menu-item>
                        </template>
                        
                    </el-submenu>
                    <el-menu-item v-else @click="itemDeal(item)" :index="index.toString()">
                        <i class="el-icon-info"></i>
                        <span slot="title">{{item.label}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
        <div class="config_right">
            <router-view></router-view>
        </div>
 
    </div>
</template>

<script>
export default {
    name:"systemconfig",
    data(){
        return{
            isCollapse:false,
            configData:[
                {
                    label: '商品管理',
                    path: '',
                    icon: 'el-icon-c-scale-to-original',
                    code: '0501',
                    showed: false,
                    children: [{
                            label: '分类商品管理',
                            icon: 'el-icon-c-scale-to-original',
                            path: '/houtai/productmanage',
                            code: '050101',
                            showed: false
                        },{
                            label: '推荐商品管理',
                            icon: 'el-icon-c-scale-to-original',
                            path: '/houtai/recommendmanage',
                            code: '050101',
                            showed: false
                        }
                    ]
                },
                {
                    label: '邮件咨询管理',
                    path: '',
                    icon: 'el-icon-c-scale-to-original',
                    code: '0501',
                    showed: false,
                    children: [{
                            label: '邮件留言历史记录',
                            icon: 'el-icon-c-scale-to-original',
                            path: '/app/main/systemconfig/usermanager',
                            code: '050101',
                            showed: false
                        },
                    ]
                },
                {
                    label: '咨询信息管理',
                    path: '',
                    icon: 'el-icon-c-scale-to-original',
                    code: '0501',
                    showed: false,
                    children: [{
                            label: '咨询信息轮播图管理',
                            icon: 'el-icon-c-scale-to-original',
                            path: '/app/main/systemconfig/usermanager',
                            code: '050101',
                            showed: false
                        },
                    ]
                },
                {
                    label: '网站浏览统计',
                    path: '',
                    icon: 'el-icon-c-scale-to-original',
                    code: '0501',
                    showed: false,
                    children: [{
                            label: '各个页面浏览量统计',
                            icon: 'el-icon-c-scale-to-original',
                            path: '/app/main/systemconfig/usermanager',
                            code: '050101',
                            showed: false
                        },
                    ]
                }
            ]
        }
    },
    methods:{
        itemDeal:function(item){
            this.$router.push(item.path)
        }
    },
    mounted:function(){
        console.log(this.configData)
    }
}
</script>

<style lang="less">
.houtai_container{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    .config_left{
        height: 100%;
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 220px;
            min-height: 400px;
        }
    }
    .config_right{
        height: 100%;
        flex: 1;
    }
}
</style>
