<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">
          全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete-o"
                @click="isDeleteShow=true" />
    </van-cell>
    <van-cell :title="item" :key="index"
              v-for="(item,index) in searchHistories"
              @click="onSearchItemClick(item,index)">
      <van-icon v-if="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // prop数据
    // 1.如果是普通数据（数字、字符串、布尔值）绝对不能修改
    //     即便改了也不会传导给父组件
    // 2.如果是引用类型数据（数组、对象）
    //     可以修改，例如[].push(xxx), 对象.xxx= xxx
    //     不能重新赋值，xxx=[]
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
