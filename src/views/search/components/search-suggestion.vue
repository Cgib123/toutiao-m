<template>
  <div class="search-suggestion">
    <van-cell icon="search" :key="index"
              v-for="(text,index) in suggestions "
              @click="$emit('search',text)">
      <span slot="title" v-html="highlight(text)"></span>
    </van-cell>

  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载好处：只会把使用到的成员打包到结果中
import { debounce } from 'loadsh'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生变化的时候，会调用 handler 函数
      // 注意 handler 函数名称是固定的
      // handler (value) {
      //   console.log(value)
      // },
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 300),
      // handler (value) {
      //   this.loadSearchSuggestion(value)
      // },
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () { },
  mounted () { },
  methods: {
    // q 为搜索的前缀文字 ，也就是handler传来的 value
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当作匹配字符串来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang='less' scoped>
.search-suggestion {
  /deep/ span.active {
    // 如果提高层级还没有效果，就说明作用域的影响，加/deep/
    color: #3296fa;
  }
}
</style>
