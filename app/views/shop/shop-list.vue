<template>
    <div class="shop-list">
        <ul>
            <li v-for="va in data">
                {{va.name}}
            </li>
        </ul>
    </div>
</template>
<style lang="stylus">
.shop-list
    color:#FFF
</style>
<script>

export default {
    props:{
        data: {
            required: true,
            type: Array
        },
    },
    methods:{

    }
}
</script>