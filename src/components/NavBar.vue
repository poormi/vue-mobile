<template>
	<header class="navbar" @touchmove.prevent>
	    <nav class="inner tc" :class="'len-'+data.length">
	      <div class="nav-wrap">
	      	<router-link class="nav-item" v-for="(nav,i) in data" :key="i" :to="nav.link"  active-class="on"><span class="nav-text">{{nav.name}}</span></router-link>
	      </div>
	    </nav>
	    <i class="slidebar"></i>
    </header>
</template>

<script>
	export default{
		data(){
			return {
				current: 0
			}
		},
		props: {
			data: Array
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.navbar {
		&:before{
			position: fixed;
			top: 90px;
			content:'';
			width: 100%;
			height: 373px;
			background: url(../../assets/images/main-bg.png) top no-repeat;
			background-size: 100% 100%;
			z-index: -1;
		}
		.inner{
			position: fixed;
			z-index: 1;
		    top: 0;
		    width: 100%;
			background: url(../../assets/images/top-bg.png) top no-repeat;
			background-size: 100% 100%; 
			box-shadow: 0 0 10px 5px rgba(1,60,150,0.5);
			transition: opacity 500ms ease-in-out;
		}
		.slidebar{
			position: absolute;
		}
	}
	.nav-wrap{
		width: 100%;
	}
	.nav-item{
		display: inline-block;
		padding-top: 20px;
		height: 90px;
		color: rgba(255,255,255,0.6);
		font-size: 34px;
		.nav-text{
			display: inline-block;
			height: 100%;
		}
		&.on .nav-text{
			border-bottom: solid 4px #fff;
			color: #fff;
		}
	}
	$navs: (2, 3);
	@each $length in $navs{
		.inner.len-#{$length} .nav-item{
			width: 100%/$length
		}
	}

</style>