<template>
    <div @click="hideThis" class="top_order_container">
        <div @click.stop.prevent="" @scroll.stop.prevent="" class="top_order_content">
            <ul>
                <li>
                    <div class="order_info">
                        <span>
                        order time：<span class="order_time">2018-10-05 15:20:32</span>
                        </span>
                        <span>
                        total price：<span class="order_money">$ 1021312</span>
                        </span>
                    </div>
                    <div class="pro_info">
                        <span class="p_name">X-RAY MACHINE
                            <span class="spec">（color: black, size: middle）（x10）</span>
                        </span>
                        <span class="money">  $101312</span>
                    </div>
                    <div class="order_status">
                        <span>
                        order status:<span> completed</span>
                        </span> 

                        <div class="button see_it">SEE IT</div>
                    </div>
                </li>
                <li>
                    <div class="order_info">
                        <span>
                        order time：<span class="order_time">2018-10-05 15:20:32</span>
                        </span>
                        <span>
                        total price：<span class="order_money">$ 1021312</span>
                        </span>
                    </div>
                    <div class="pro_info">
                        <span class="p_name">X-RAY MACHINE
                            <span class="spec">（color: black, size: middle）（x10）</span>
                        </span>
                        <span class="money">  $101312</span>
                    </div>
                    <div class="order_status">
                        <span>
                        order status:<span> completed</span>
                        </span> 

                        <div class="button see_it">SEE IT</div>
                    </div>
                </li>
                <li>
                    <div class="order_info">
                        <span>
                        order time：<span class="order_time">2018-10-05 15:20:32</span>
                        </span>
                        <span>
                        total price：<span class="order_money">$ 1021312</span>
                        </span>
                    </div>
                    <div class="pro_info">
                        <span class="p_name">X-RAY MACHINE
                            <span class="spec">（color: black, size: middle）（x10）</span>
                        </span>
                        <span class="money">  $101312</span>
                    </div>
                    <div class="order_status">
                        <span>
                        order status:<span> completed</span>
                        </span> 

                        <div class="button see_it">SEE IT</div>
                    </div>
                </li>
                <li>
                    <div class="order_info">
                        <span>
                        order time：<span class="order_time">2018-10-05 15:20:32</span>
                        </span>
                        <span>
                        total price：<span class="order_money">$ 1021312</span>
                        </span>
                    </div>
                    <div class="pro_info">
                        <span class="p_name">X-RAY MACHINE
                            <span class="spec">（color: black, size: middle）（x10）</span>
                        </span>
                        <span class="money">  $101312</span>
                    </div>
                    <div class="order_status">
                        <span>
                        order status:<span> completed</span>
                        </span> 

                        <div class="button see_it">SEE IT</div>
                    </div>
                </li>

            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'topHeader',
    data(){
        return {

        }        
    },
    methods:{
        hideThis:function(){
            this.$parent.changeTopOrder(false)
        }
    }
}
</script>

<style lang="less">
.top_order_container{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    overflow: scroll;
    z-index: 100;
    background: rgba(0, 0, 0, 0.4);
    .top_order_content{
        box-sizing: border-box;
        padding: 2rem 2rem;
        width: 40rem;
        min-height: 100%;
        background: rgba(255,255,255,1.00);
        margin: 50px auto;
        ul{
            width: 100%;
            overflow: auto;
            li{
                list-style: none;
                width: 100%;
                box-sizing: border-box;
                padding: 0.5rem 0rem;
                color: #ffffff;
                border-bottom: 1px dashed #19b7f5;
                .pro_info{
                    width: 100%;
                    height: 2rem;
                    padding: 0.4rem 0;
                    line-height: 2rem;
                    padding: 0.4rem 1rem;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    .p_name{
                        font: normal normal normal 0.8rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: black;
                    }
                    .spec{
                        font: normal normal normal 0.8rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: #ddd;
                    }
                    .money{
                        font: normal normal 600 1rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        // color: rgb(241, 38, 89);
                        //#00bcd4
                        color: #c13457;
                    }
                }
                .order_info{
                    width: 100%;
                    background: #1ab7f5;
                    color: #ffffff;
                    line-height: 2rem;
                    border-radius: 5px;
                    font-size: 0.8rem;
                    display: flex;
                    padding: 0 1rem;
                    box-sizing: border-box;
                    flex-direction: row;
                    justify-content: space-between;
                    .order_time{
                        font: normal normal normal 0.8rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: #ffffff;
                    }
                    .order_money{
                        font: normal normal 600 0.8rem/1rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        // color: rgb(241, 38, 89);
                        color: #ffffff;
                    }
                    .order_status{
                        font: normal normal 500 1rem/1.5rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                        color: #ffffff;
                    }
                }
                .order_status{
                    width: 100%;
                    padding: 0.4rem 0;
                    line-height: 1.5rem;
                    font-size: 1rem;
                    padding: 0.4rem 1rem;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    font: normal normal 500 1rem/1.5rem system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
                    color: black;
                    .button{
                        cursor: pointer;
                        height: 1.5rem;
                        line-height: 1.5rem;
                        padding: 0 0.3rem;
                        background: #1ab7f5;
                        color: #ffffff;
                        font-size: 0.8rem;
                        display: inline-block;
                        border-radius: 0.2rem;
                    }
                }
            }
        }
    }
}
</style>