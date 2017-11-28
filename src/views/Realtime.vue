<template>
	<div class="realtime">
		
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import { DateWrap, FilterWrap, TargetsFilter } from '../components'

	export default {
		name: 'realtime',
		data(){
			return {

			}
		},
		computed: {
			...mapState({
				list: state => state.list
			}),
			...mapGetters([
				sortList
			]),
			titile(){
				return '实时热点'
			}
		},
		asyncData({ store, route, cookie }){
			store.dispatch('PRE_FETCH_DATA', cookie)
		},
		beforeRouteLeave(to, from, next){
			// 导航离开该组件的对应路由时调用
	        // 可以访问组件实例 `this`
	        document.body.className = ""
	        next()
		},
		components: {
			DateWrap,
			FilterWrap,
			TargetsFilter
		}
	}
</script>