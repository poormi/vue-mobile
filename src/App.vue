<template>
    <v-touch id="app" v-on:panup="onPanUp" v-on:pandown="onPanDown">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <TabBar :class="{hide : isScroll}"/>
    </v-touch>
</template>

<script>
  import {
    TabBar
  } from './components'

  export default {
    name: 'app',
    data() {
      return {
        isScroll: false
      }
    },
    methods: {
      onPanUp(){
        this.isScroll = true
      },
      onPanDown(){
        this.isScroll = false
      }
    },
    components: {
      TabBar
    },
    mounted(){

    }
  }
</script>