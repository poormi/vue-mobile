<template>
	<div class="bottom">
		<tab class="inner" :class="'len-'+tabs.length">
	      <router-link class="tab-item" :class="[tab.icon,{on: i==0}]" v-for="(tab,i) in tabs" :to="tab.link" :key="i" exact>{{tab.name}}</router-link>
	    </tab>
	</div>
</template>

<script>
	export default{	
		data(){
			return {
				tabs: [{
					link: '/mobile',
					icon: 'realtime',
					name: '实时热点'
				},{
					link: '/mobile/',
					icon: 'history',
					name: '足迹'
				},{
					link: '/mobile/',
					icon: 'vip',
					name: '会员'
				},{
					link: '/mobile/',
					icon: 'my',
					name: '我的'
				}]
			}
		}
	}
</script>

<style lang="scss">
	.bottom{
		position: fixed;
		bottom: 0;
		padding: 8px 0;
		width: 100%;
		background-color: #fff;
		border-top: solid 1px #dcdcdc;
		text-align: center;
		transition: all 500ms ease;
		&.hide{
			bottom: -100px;
		}
	}
	.tab-item{
		display: inline-block;
		padding-top: 45px;
		color: #096db0;
		background-repeat: no-repeat;
		background-position: top;
		background-size: auto 40px;
		&.on{
			color: #53d3ff;
		}
	}
	$tabs: (3,4,5);
	$icons: ['realtime','history','vip','my'];
	@each $length in $tabs {
		.inner.len-#{$length} .tab-item{
			width: 100%/$length;
		}
	}
	@each $icon in $icons {
		.tab-item.#{$icon} {
			background-image: url(../assets/images/#{$icon}.png)
		}
	}
</style>