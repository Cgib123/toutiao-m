<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button class="edit-btn" type="danger" plain round size="mini"
                  @click="isEdit = !isEdit">{{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" :key="index"
                     v-for="(channel, index) in myChannels"
                     @click="onMyChannelClick(channel, index)">
        <!--   v-bind:class语法
      一个对象，对象中的key 表示要作用的css类名
      对象中的value要计算出布尔值
      true，则作用该类名
      false，不作用类名 -->
        <!-- 不能是固定频道里的id -->
        <van-icon v-show="isEdit && !fiexdChannels.includes(channel.id)"
                  name="clear" slot="icon"></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">
          {{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="(channel, index) in recommendChannels" :key="index"
                     icon="plus" :text="channel.name"
                     @click="onAddChannel(channel)" />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
// vuex的映射方法，把容器映射到当前组件中，获取当前用户登陆状态
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    // 接收数据
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有的频道
      isEdit: false, // 我的频道关闭按钮
      fiexdChannels: [0] // 固定频道，不允许被删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐频道计算属性
    // 计算属性 会观测内部依赖数据的变化
    // 若数据变化 则计算属性会重新执行
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }

    /*  recommendChannels () {
       const channels = []
       this.allChannels.forEach(channel => {
         // find 遍历数组， 找到满足条件的元素项
         const ret = this.myChannels.find(myChannel => {
           return myChannel.id === channel.id
         })
         // 如果我的频道不包括该频道，则收集到推荐频道中
         if (!ret) {
           channels.push(channel)
         }
       })
       return channels
     } */
  },
  watch: {},
  // 在created中请求调用
  created () {
    this.loadAllChannels()
  },
  mounted () { },
  methods: {
    // 发送请求
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('数据请求失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 登录状态  把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试 ')
        }
      } else {
        // 未登录状态 把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道则,不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)

        // 3. 删除频道是激活项之前的
        // 编辑状态 删除频道 isEdit=true
        // 参数一：要删除的索引
        // 参数二：要删除的个数，不指定则删除到最后
        if (index <= this.active) {
          // 让激活的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 4.持久化处理
        this.deleteChannel(channel)
      } else {
        // 非编辑状态 切换频道  isEdit=false
        // 给父组件发送一个自定义事件
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录 将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录 将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
