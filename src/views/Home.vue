<template>
	<div class="main" :class="{'float': scrollY >= searchHeight && scrollY !== 0}" @touchmove="setScrollY">
		<NavBar :data="navs" />
		<transition name="fade" mode="out-in">
	      <router-view class="view"></router-view>
	    </transition>
	</div>
</template>

<script>
  import { NavBar } from '../components/common'
  import { mapGetters } from 'vuex'

	export default{
		data() {
			return {
				navs: [{
					link: '/mobile/home',
					name: '热门'
				},{
					link: '/mobile/favorites',
					name: '收藏'
				}],
				scrollY: 0,
				searchHeight: 0,
				needBack2top: false,
				clientHeight: 0
			}
		},
		methods:{
			setScrollY(){
				this.scrollY = window.scrollY
			},
			gobak2Top(){
				this.needBack2top = false
				this.scrollY = 0
			}
		},
		components: {
			NavBar
		},
		mounted(){			
	      const _v = this
	      this.searchHeight = this.$children[1].searchHeight
	      this.clientHeight = window.innerHeight
	      window.onscroll = function(){
	      	_v.scrollY = window.scrollY
	      }
	      //debug
          window.needDebug =false
          window.touchDebug = (need)=>{
            window.needDebug = need
          }
		}
	}
</script>

<style lang="scss">
	.main.float{
		.navbar{
			.nav-wrap{
				width: 505px;
			}
			.inner{
				opacity: 0.9;
			}
			.on .nav-text{
				height: 85%;
			}
		}
		.icon-button{
			position: fixed;
		    top: 0;
			width: 124px;
		    height: 90px;
			background-color: transparent;
		    background-position: center;
		    border-left: solid 1px #fff;
			z-index: 2;
			&:after{
				content: '';
			}
		}
		.icon-filter{
			right: 0;
			background-size: 45px 32px;
			&.on{
				background-color: #fff;
			}
		}
		.icon-date{
			right: 124px;
			background-size: 45px 45px;
		}
	}
	.view{
		margin-top: 90px;
	}
</style>