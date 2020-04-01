<template>
<div id ='app'>
    <Header></Header>
    <div class="pro_container">
        <div class="pro_left_img">
            <div class="pro_img"></div>
            <ul>
                <li>
                </li>
            </ul>
        </div>

        <div class="pro_right_label">
            <h2>{{p_data.product_detail.list_name}}</h2>
            <h5>{{p_data.product_detail.descript}}</h5>
            <p v-if="p_data.spec_name_list.length" class="title">SPEC</p>
            <ul v-if="spec_name_list.length" class="p_spec_ul">
                <li v-for="(item,index) of spec_name_list" :key="index" class="p_spec_li">
                    <div>{{item.spec_name}}：</div>
                    <ul  class="p_spec_value_ul">
                        <li v-for="(item2,index2) of item.spec_value_arr" @click="setChose(item,item2)" :key="index2" :class="{'p_spec_value_li':true, 'chosed': item2.chosed}">
                            {{item2.spec_value}}
                        </li>
                    </ul>
                </li>
            </ul>
            <p class="title">PRICE</p>
            <div class="price">$  {{chosed_price}}</div>
            <p class="title">STOCK</p>
            <div class="stock">{{chosed_stock}}</div>
            <div class="button_area">
                <div class="go_cart">JOIN CART <i class="iconfont iconadd-cart"></i></div>
                <div class="go_buy">pay now</div>
            </div>
        </div>
    </div>
    <div class="bottom_bar">
        <div @click="GoConstrast" :class="{'bar_item':true, chosed: showd_router == 'contrast'}">constrast</div>
        <div @click="GoDescript" :class="{'bar_item':true, chosed: showd_router == 'descript'}">descript</div>
    </div>
    <router-view style="width:90%; margin:auto;border-top:0.2rem solid rgb(25, 183, 245);"></router-view>
</div>
</template>

<script>
import Header from '../common/header/header.vue'
export default {
    asyncData ({ store, route }) {
        // 触发 action 后，会返回 Promise
        return store.dispatch('getProductInfo', route.params.id)
    },
    data(){
        return {
            showd_router: 'contrast',
            p_data: this.$store.state.p_data,
            spec_name_list: this.$store.state.p_data.spec_name_list.map(_=>{
                return {
                    spec_name_id: _.spec_name_id,
                    spec_name: _.spec_name,
                    spec_value_arr: _.spec_value_arr.map((__,index)=>{
                        return {
                            spec_value: __.spec_value,
                            spec_value_id: __.spec_value_id,
                            spec_name_id: __.spec_name_id,
                            chosed: index == 0
                        }
                    })
                }
            })
        }
    },
    methods:{
        setChose: function(item,item2){
            item.spec_value_arr.forEach(_=> _.chosed = false)
            item2.chosed = true  
            console.log('执行')
        },
        GoConstrast: function(){
            this.showd_router = "contrast";
            this.$router.push({name:'contrast'});
        },
        GoDescript: function(){
            this.showd_router = "descript";
            this.$router.push({name:'descript'});
        }
    },
    computed:{
        chosed_price: function(){
            const chosed_spec = JSON.stringify(
                this.spec_name_list.map(_=>{
                    return {
                        spec_name: _.spec_name,
                        spec_name_id: _.spec_name_id,
                        spec_value: _.spec_value_arr.find(_=>_.chosed)?_.spec_value_arr.find(_=>_.chosed).spec_value:'未选择规格',
                        spec_value_id: _.spec_value_arr.find(_=>_.chosed)?_.spec_value_arr.find(_=>_.chosed).spec_value_id:'未选择规格'
                    }
                })
            );
            return this.p_data.spec_data.find(_=>_.spec_data == chosed_spec)?this.p_data.spec_data.find(_=>_.spec_data == chosed_spec).price:this.p_data.product_detail.price
        },
        chosed_stock: function(){
            const chosed_spec = JSON.stringify(
                this.spec_name_list.map(_=>{
                    return {
                        spec_name: _.spec_name,
                        spec_name_id: _.spec_name_id,
                        spec_value: _.spec_value_arr.find(_=>_.chosed).spec_value,
                        spec_value_id: _.spec_value_arr.find(_=>_.chosed).spec_value_id
                    }
                })
            );
            return this.p_data.spec_data.find(_=>_.spec_data == chosed_spec)?this.p_data.spec_data.find(_=>_.spec_data == chosed_spec).stock:this.p_data.product_detail.stock
        }
    },
    components:{
        Header
    }
}
</script>


<style lang='less'>
#test,#app{
    .pro_container{
        width: 90%;
        margin: auto;
        overflow: auto;
        .pro_left_img{
            float: left;
            width: 50%;
            .pro_img{
                width: 100%;
                padding-top: 100%;
                height: 0;
                background: url(../../../static/img/SIXone.jpg);
                background-size: 100% 100%; 
            }
            ul{
                width: 100%;
                overflow: auto;
                li{
                    list-style: none;
                    width: 20%;
                    border: 1px solid #ffffff;
                    padding-top: 20%;
                    height: 0;
                    background: url(../../../static/img/SIXone.jpg);
                    background-size: 100% 100%; 
                    cursor: pointer;
                }
                li:hover{
                    border: 1px solid rgba(45, 171, 175, 0.667);
                }
            }
        }
        .pro_right_label{
            float: left;
            width: 50%;
            overflow: auto;
            box-sizing: border-box;
            padding: 20px;
            h2{
                font-size: 2rem;
                padding: 1rem 0;
            }
            h5{
                font-size: 1.5rem;
                padding: 1rem 0;
            }
            p.title{
                height: 0.8rem;
                padding: 0.6rem 0;
                line-height: 0.8rem;
                color: #ddd;
                text-align: left;
                font-size: 0.8rem;
            }
            div.price{
                height: 1.5rem;
                color: rgb(241, 38, 89);
                line-height: 1.5rem;
                text-align: left;
                font-size: 1.5rem;
            }
            div.stock{
                height: 1rem;
                line-height: 1rem;
                text-align: left;
                font-size: 1rem;
            }
            ul.p_spec_ul{
                width: 100%;
                margin: 0;
                padding: 0;
                overflow: auto;
                li.p_spec_li{
                    width: 100%;
                    overflow: auto;
                    margin-top: 0.7rem;
                    list-style: none;
                    div{
                        width: 3rem;
                        text-align: left;
                        float: left;
                        font-size: 1rem;
                        height: 2rem;
                        line-height: 2rem;
                    }
                    ul{
                        width: calc(100% - 4rem);
                        float: left;
                        margin: 0;
                        padding: 0;
                        margin-left: 1rem;
                        overflow: auto;
                        li{
                            height: 1.5rem;
                            margin-top: 0.2rem;
                            padding: 0 0.3rem;
                            line-height: 1.5rem;
                            text-align: center;
                            float: left;
                            font-size: 1rem;
                            cursor: pointer;
                            border-radius: 0.2rem;
                            margin-left: 1rem;
                            list-style: none;
                            border: 0.05rem solid rgb(25, 183, 245);
                        }
                        li.chosed{
                            border: 0.05rem solid #86ea3a;
                        }
                        li:hover{
                            border: 0.05rem solid #86ea3a;
                        }
                    }
                }
            }
            .button_area{
                width: 100%;
                overflow: auto;
                margin: 1.5rem 0 0 0;
                padding: 0;
                div{
                    cursor: pointer;
                    height: 2rem;
                    line-height: 2rem;
                    padding: 0 0.4rem;
                    // background: #1ab7f5;
                    background-color: #0070c9;
                    background: linear-gradient(#42a1ec,#0070c9);
                    border: 1px solid #07c;
                    color: #ffffff;
                    font-size: 1rem;
                    display: inline-block;
                    border-radius: 0.2rem;
                }
                .go_buy{
                    margin-left: 1rem;
                    background: #86ea3a;
                    color:#ffffff;
                }
            }
        }
        @media only screen and  (max-width: 600px) {
            .pro_right_label{
                font-size: 10px;
                width: 100%;
            }
            .pro_left_img{
                width: 100%;
            }
        }
    }
    .bottom_bar{
        width: 90%;
        margin: auto;
        height: 2rem;
        overflow: auto;
        div{
            width: 6rem;
            cursor:pointer;
            height: 2rem;
            float: left;
            line-height: 2rem;
            text-align: center;
            color: black;
            background: #ffffff;
        }
        div.chosed{
            color: #ffffff;
            background: #1ab7f5;
        }
    }
}
@media only screen and (min-width: 1800px) {
    html{
        font-size: 24px;
    }
}
@media only screen and (min-width: 1600px) and (max-width: 1800px) {
    html{
        font-size: 22px;
    }
}
@media only screen and (min-width: 1400px) and (max-width: 1600px) {
    html{
        font-size: 20px;
    }
}
@media only screen and (min-width: 1200px) and (max-width: 1400px) {
    html{
        font-size: 18px;
    }
}
@media only screen and (min-width: 1000px) and (max-width: 1200px) {
    html{
        font-size: 16px;
    }
}
@media only screen and (min-width: 800px) and (max-width: 1000px) {
    html{
        font-size: 14px;
    }
}
@media only screen and (min-width: 600px) and (max-width: 800px) {
    html{
        font-size: 12px;
    }
}
@media only screen and  (max-width: 600px) {
    html{
        font-size: 10px;
    }
    .pro_right_label{
        font-size: 10px;
        width: 100%;
    }
    .pro_left_img{
        width: 100%;
    }
}
</style>