<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- 遍历文章列表项 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 加载组件
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  // 注册组件
  name: 'ArticleList',
  components: {
    // 注册
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // list[] 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态，为true时，不再触发加载更多
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '' // 下拉刷新成果提示文本
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 请求数据的页码
          // 请求第一页的数据： 当前最新时间戳 Date.now()
          // 用于请求之后数据的时间戳，会在当前请求的结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶
        })
        /* // 模拟随即失败的情况
        if(Math.random() > 0.5) {
          JSON.parse('desnajndjsa')
        } */
        // 2.把请求结果数据放到 list 数组中
        const { results } = data.data
        // ...数组的展开操作符，会把数组一个一个展开 拿出来,=list[0],list[1]
        this.list.push(...results)

        // 3.本次数据加载结束之后，要把加载状态设置为结束
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 如果没有数据了，将finished=true，不再load加载更多
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败 loading也需要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的 时候会触发调用该函数
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 请求数据的页码
          // 请求当前最新时间戳 Date.now()
          timestamp: Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶
        })
        /*     // 模拟随即失败的情况
            if (Math.random() > 0.5) {
              JSON.parse('desnajndjsa')
            } */
        // 2.将数据追加列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading状态
        this.isRefreshLoading = false
        // 更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
    /*     onLoad () {
          // 异步更新数据
          // 1.请求获取数据
          // setTimeout 仅做示例，真实场景中一般为 ajax 请求
          setTimeout(() => {
            // 2.把请求结果数据放到 list 数组中
            for (let i = 0; i < 10; i++) {
              this.list.push(this.list.length + 1)
            }
            // 3.本次数据加载结束之后，要把加载状态设置为结束
            // loading 关闭以后才能触发下一次的加载更多
            this.loading = false
            // 4.判断数据是否全部加载完成
            if (this.list.length >= 40) {
              // 如果没有数据了把finished设置为true，之后不再触发加载更多
              this.finished = true
            }
          }, 1000)
        } */
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 记住列表的滚动位置
  height: 79vh;
  overflow-y: auto; // 没有的话列表就没办法滚动了
}
</style>
