<template>
	<div class="favorites">
		<h2 class="title">敬请期待～</h2>

	</div>
</template>

<script>
	export default {
		name: 'favorites',

		computed: {

		},

		asyncData({ store}){
			//return store.dispatch('FETCH_FAVORITES')
		},

		title (){
			return '我的足迹'
		},

		method (){

		}
	}
</script>

<style lang="scss">
	.favorites{
		.title{
			padding: 1em;
			color: #fff;
		}
	}
</style>