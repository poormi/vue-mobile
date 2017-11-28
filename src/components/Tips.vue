<template>
	<div class="tips-wrap"><span ref="tip" class="tips" :style="align" v-html="msg"></span></div>
</template>

<script>
	export default{
		data(){
			return {
				align:{
					marginLeft: 0
				}
			}
		},
		props:{
			msg: String
		},
		mounted(){
			this.align.marginLeft = -this.$refs.tip.offsetWidth / 2
			const _v = this;
			setTimeout(function(){
				_v.$parent.showTips = false
			}, 3000)
		}
	}
</script>

<style scope>
	.tips-wrap{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 9;
	}
	.tips{
		position: absolute;
		top: 50%;
		left: 50%;
		padding: 36px;
		background-color: rgba(0, 0, 0, .6);
		text-align: center;
		color: #fff;
	}
</style>