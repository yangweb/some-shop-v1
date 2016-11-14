
<template>
    <div class="">
        <div class="shop-title">
            <span class="fl map-lng-lat title-sp" v-touch-ripple>坐标</span>
            <span class="title-sp">
                店铺管理
            </span>
            <span class="fr map-navigate title-sp" v-touch-ripple>
                导航
            </span>
        </div>
        <div class="shop-main">
            <div class="shop-search">
                <div class="shop-add-btn"><i class="fa fa-plus" aria-hidden="true"></i></div>
                <div class="shop-searchbar">
                    <div class="shop-searchbar-input">
                        <input type="search" placeholder="搜索店铺...">
                    </div>
                </div>
            </div>
            
            <div class="shop-list">
                
                <div v-for="d in data " class="shop-list-child">
                    <input class="jui-checkbox" type="radio" id="jui-{{d.id}}" name="radio-shop"  value="{{d.id}}" />
                    <label for="jui-{{d.id}}"></label>
                    <span class="shop-list-title">
                        <a v-link="{ name: 'shop_product', params: { shopid: d.id }}">
                        {{d.title}}
                        </a>
                    </span>
                    <span class="fr shop-list-top">
                        <i class="fa fa-star-o" aria-hidden="true"></i>
                    </span>
                </div>
                
            </div>
            
        </div>
    </div>
</template>
<script>
    
    export default {
        ready: function () {
            this.getData();
           
        },
        data: function () {
             return {
                page: 1,
                pageSize: 1000,
                count: 0,
                data: [],

            }
        },
        components: {
            
        },
        methods: {
            getData: function() {
                var vm = this;
                this.$http.get('house', {
                    page: this.page,
                    page_size: this.pageSize
                }).then(function(result) {
                    let data = result.data;
                    let datas = data.data;
                    this.data = datas;

                    this.count = data.count;
                    this.onDataTable();
                });
            },
            onDataTable: function() {
                let vm = this;
                let data = vm.data;
                let len = data.length;

            }
        }
    }
</script>
<style lang='stylus'>
</style>