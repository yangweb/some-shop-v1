
<template>
    <div class="">
        <div class="shop-title">
            <button class="fl map-lng-lat title-sp">坐标</button>
            <button class="title-sp">
                店铺管理
            </button>
            <button class="fr map-navigate title-sp">
                导航
            </button>
        </div>
        <div class="shop-main">
            <div class="shop-search">
                <div class="shop-searchbar">
                    <div class="shop-searchbar-input">
                        <input type="search" placeholder="搜索店铺...">
                    </div>
                    

                </div>
            </div>
            
            <div class="shop-list">
                
                <div v-for="d in data " class="shop-list-child">
                   <label class="vc-radio">
                        <input type="radio" name="radio1" value="">
                        <div class="vc-radio-icon"></div>
                   </label>

                   {{d.title}}

                   <span class="fr">
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
            this.inputPla();
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

         

            

            },
            inputPla: function (){
                $('[placeholder]').focus(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                        input.removeClass('placeholder');
                    }
                }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.addClass('placeholder');
                        input.val(input.attr('placeholder'));
                    }
                }).blur();
                $('[placeholder]').parents('form').submit(function() {
                    $(this).find('[placeholder]').each(function() {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                        }
                    })
                });
            }
        }
    }
</script>
<style lang='stylus'>

.shop-title
    background: #5cb85c
    color: #FFF
    text-align: center
    font-size: 18px
    padding-top:5px
    .title-sp
        display: inline-block
        color:#FFF
.shop-main
    padding:5px
    color:#FFF

.shop-search
    background:rgb(92, 184, 95)
    input
        color:#FFF
        ::-webkit-input-placeholder
            color:#FFF
.shop-searchbar
    padding:0 30px

.shop-list
    list-style: none
    margin: 0
    padding: 0
    color:#333
    &>div
        background: #FFF
        margin:3px 0
        padding:4px
</style>