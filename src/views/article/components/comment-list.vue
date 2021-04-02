<template>
  <van-list v-model="loading" :finished="finished"
            finished-text="没有更多了" :immediate-check="false"
            @load="onLoad" :error="error"
            error-text="加载失败，请点击重试！">
    <comment-item :key="index" :comment="item"
                  v-for="(item,index) in list"
                  @reply-click="$emit('reply-click',$event)" />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loading = true
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 获取文章的评论和获取评论的回复时同一个接口
        // 唯一的区别是接口的参数不同
        // type:
        //   a 文章的评论
        //   c 评论的回复
        // source：
        //    文章的评论，传递文章的id
        //    评论的回复，传递评论的id
        // 1. 请求获取数据
        const { data } = await getComments({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        })
        // 2. 将数据添加到列表中
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)
        // 3. 将 loading 设置为 false
        this.loading = false
        // 4. 判断是否还有数据
        if (results.length) {
          //    有就更新获取下一页数据页码
          this.offset = data.data.last_id
        } else {
          //    没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
