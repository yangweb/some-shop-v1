
<template>
    <div class="">
        <div class="shop-title">
            <span class="fl map-lng-lat title-sp" v-touch-ripple>坐标</span>
            <span class="title-sp">
                店铺管理 {{search}}
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
                        <input type="search" placeholder="搜索店铺..." v-model.trim="search" >
                    </div>
                </div>
            </div>
            
            <div class="shop-list">
                
                <div v-for="d in data " class="shop-list-child" :key="d.id"  >
                    <input class="jui-checkbox" type="radio" id="jui-{{d.id}}" name="radio-shop"  value="{{d.id}}" />
                    <label for="jui-{{d.id}}"></label>
                    <span class="shop-list-title">
                        <a v-link="{ name: 'shop_product', params: { shopid: d.id }}">
                        {{d.title}}
                        </a>
                    </span>
                    <span class="fr shop-list-top"
                         v-bind:class="{ 'flag_true': d.flag }"
                        @click="flagAdd(d.id)" >
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
        watch:{
            'search': {
                handler: function (val, oldVal) {
                   this.filterData();
                },
                immediate: true,
                deep: true
            }
        },
        data: function () {
             return {
                page: 1,
                pageSize: 1000,
                count: 0,
                search:'',
                searchData:[],
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
                    this.searchData = datas;

                    this.count = data.count;
                    this.onDataTable();
                });
            },
            onDataTable: function() {
                let vm = this;
                let data = vm.data;
                let len = data.length;

            },
            filterData:function(){
                let vm = this;
                let skey = vm.search.replace(/(^\s*)|(\s*$)/g, "");
                let data = vm.searchData;
                let leng = data.length;
                if(!skey){
                    vm.data = data;
                    return
                };
                let newData = [];
                let rep = new RegExp(skey);

                for(var i=0;i<leng;i++){
                    let item = data[i];
                    if(rep.test(item.title) || rep.test(item.number) || rep.test(item.address) || rep.test(item.description)){
                        newData.push(item);
                    }
                }

                vm.data = newData;
            },
            flagAdd:function(shop_id){
                let vm = this;
                this.$http.put('house/flag/' + shop_id).then(function (result) {
                    let data = result.data;
                    if (data.errors) {
                        this.errors = data.errors;
                        return
                    }
                    vm.getData();
                    console.log(data);
                });

            }
        }
    }
</script>
