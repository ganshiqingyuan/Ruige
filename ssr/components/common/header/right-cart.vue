<template>
    <div @click="close_right_cart" class="right_cart_container">
        <div class="right_cart_content">
            <div class="header_control">
                <i class="iconfont iconclose"></i>
            </div>

            <p class="cart_title">SHOPPING CART</p>

            <ul>
                <li>
                    <img src="../../../../static/img/SIXone.jpg"/>
                    <div class="right_detail">
                        <p class="d_title">X-RAY MACHINE</p>
                        <p class="d_spec">black medium with touch bar</p>
                        <p class="d_price">price： $198231</p>
                        <p class="d_count"><i>count:</i>  <span><i class="iconfont iconreduce"></i> <i>2</i> <i class="iconfont iconadd"></i></span></p>
                    </div>
                </li>
                <li>
                    <img src="../../../../static/img/SIXone.jpg"/>
                    <div class="right_detail">
                        <p class="d_title">X-RAY MACHINE</p>
                        <p class="d_spec">black medium with touch bar d sadsad a dsa dad as </p>
                        <p class="d_price">price： $198231</p>
                    </div>
                </li>
                <li>
                    <img src="../../../../static/img/SIXone.jpg"/>
                    <div class="right_detail">
                        <p class="d_title">X-RAY MACHINEasd a ad  ASD DASD  DA</p>
                        <p class="d_spec">black medium with touch bar</p>
                        <p class="d_price">price： $198231</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rightCart',
    data(){
        return{

        }
    },
    methods:{
        close_right_cart: function(){
            this.$parent.changeRightCart(false)
        }
    }
}
</script>

<style lang="less">
.right_cart_container{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    overflow: scroll;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    .right_cart_content{
        width: 20rem;
        min-height: 100%;
        float: right;
        background: #ffffff;
        box-sizing: border-box;
        padding: 1rem 2rem;
        .header_control{
            width: 100%;
            height: 2.5rem;
            line-height: 2.5rem;
            text-align: left;
            i{
                font-size: 1.5rem;
            }
        }
        .cart_title{
            color:#19b7f5;
            padding: 1rem 0 0 0;
            border-bottom:1px solid #19b7f5;
        }
        ul{
            width: 100%;
            overflow: auto;
            li{
                list-style: none;
                width: 100%;
                display: flex;
                flex-direction: row;
                padding: 1rem 0;
                justify-content: space-between;
                align-items: center;
                img{
                    width: 5rem;
                }
                .right_detail{
                    width: 15rem;
                    .d_title{
                        font: normal normal 300 1.1rem/1.4rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: black;
                    }
                    .d_spec{
                        margin-top:0.2rem ;
                        font: normal normal normal 0.8rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: #ddd;
                    }
                    .d_price{
                        font: normal normal 600 1rem/1.4rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: #c13457;
                    }
                    .d_count{
                        font: normal normal 300 1.1rem/1.4rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: black;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        i{
                            font: normal normal 300 1.1rem/1.4rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
}
</style>