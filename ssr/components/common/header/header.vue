<template>
    <div class="nav_header">
        <div style="width:100%; height:100%;">
            <div class="left_logo">ruige</div>
            <div class="item_right">
                <ul>
                    <li @click="changeRightCart(true)">
                        CART
                    </li>
                    <li @click="changeTopOrder(true)">
                        order
                    </li>
                </ul>
            </div>
        </div>

        <transition name="show_right_cart">
            <right-cart v-if="show_right_cart"></right-cart>
        </transition>
        
        <transition name="show_top_order">
            <top-order v-if="show_top_order"></top-order>
        </transition>
    </div>
</template>

<script>
import rightCart from './right-cart.vue';
import topOrder from './top-order.vue'
export default {
    name: 'Header',
    data(){
        return {
            show_top_order: false,
            show_right_cart: false
        }
    },
    methods:{
        changeTopOrder: function(flag){
            this.show_top_order = flag
        },
        changeRightCart: function(flag){
            this.show_right_cart = flag
        }
    },
    components:{
        rightCart,
        topOrder
    }
}
</script>

<style lang="less">
.nav_header{
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    background: rgba(51,51,51,1);
    box-sizing: border-box;
    padding: 0 2rem;
    position: relative;
    .left_logo{
        width: 3rem;
        float: left;
        font: normal normal 500 1rem/2rem "Times New Roman";
        color: #000000;
    }
    .item_right{
        float: right;
        width: calc(100% - 3rem);
        height: 100%;
        ul{
            width: 100%;
            margin: 0;
            height: 100%;
            overflow: auto;
            li{
                list-style: none;
                float: right;
                width: 7rem;
                height: 100%;
                font: normal normal 500 0.6rem/2rem "Times New Roman";
                cursor: pointer;
                color: #ffffff;
            }
        }
    }


    .show_top_order-enter,.show_top_order-leave-to{
        opacity: 0;
    }
    .show_top_order-enter-to,.show_top_order-leave{
        opacity: 1;
    }
    .show_top_order-enter-active,.show_top_order-leave-active{
        transition: all 0.2s linear;
    }

    .show_right_cart-enter,.show_right_cart-leave-to{
        background: rgba(0, 0, 0, 0);
        .right_cart_content{
            transform: translateX(20rem);
        }
    }
    .show_right_cart-enter-to,.show_right_cart-leave{
        background: rgba(0, 0, 0, 0.6);
        .right_cart_content{
            transform: translateX(0);
        }
    }
    .show_right_cart-enter-active,.show_right_cart-leave-active{
        transition: all 0.3s ease-in;
        .right_cart_content{
            transition: all 0.3s ease-in;
        }
    }
}
</style>