<template>
	<div class="date-wrap">
		<span class="now-date font-30" >{{ nowDate|formatDate('day')}}</span>
		<span class="comp-date font-30" @click="showDatePicker=true">{{ compDate|formatDate('day')}}</span>
		<a href="javascript:;" class="opt-link icon-date" @touchend="showDatePicker=true"></a>
		<div class="mask" v-if="showMask" @click="showDatePicker = false">
			<DatePicker v-if="showDatePicker" :dates="dates" />
		</div>
	</div>
</template>
 
<script>
import DatePicker from './DatePicker.vue'
import moment from 'moment'
	const dateWrap = {
		data(){
			return {
				showDatePicker: false,
				showMask: false
			}
		},
		props: {
			nowDate: Object | String | Date,
			compDate: Object | String | Date,
			nowDateCanChange: {
				type: Boolean,
				default: true
			},
			compDateCanChange: {
				type: Boolean,
				default: true
			},
			onSubmit: Function
		},
		computed: {
			dates(){
				return [{
					date: this.nowDate,
					title: '开始日期',
					type: 0,
					key: 'nowDate',
					disabled: !this.nowDateCanChange
				}, {
					date: this.compDate,
					title: '结束日期',
					type: 1,
					key: 'compDate',
					max: moment().subtract(1, 'd'),
					disabled: !this.compDateCanChange
				}]
			}
		},
		methods: {
			setDate(dates){
				this.showDatePicker = false
				dates.map(d=>{
					this[d.key]= d.date
				})
				this.onSubmit(dates)
			}
		},
		components: {
			DatePicker
		},
		watch: {
			showDatePicker(val){
				if(val){
					this.showMask = true
				}else{
					setTimeout(() => { this.showMask=false }, 300)
				}
			}
		},
		mounted(){
			window.datePicker = {
				cancel: () => {
					this.showDatePicker = false
				}
			}
		}
	}	
	export default {
		...dateWrap
	}
</script>

<style lang="scss">
	.date-wrap{
		position: relative;
		padding: 25px 36px;
		border-radius: 3px;/*no*/
		color: #fff;
	}
	.now-date:after{
		content: 'VS';
		margin-left: 20px;
		font-size: 20px;
	}
	.comp-date{
		margin-left: 20px;
		padding-left: 35px;
		background: url('../../assets/images/icon-date-on.png') left center no-repeat;
		background-size: 25px 25px;
		color: #55d4ff;
	}
	.icon-date{
		position: absolute;
		top: 16px;
		right: 36px;
	}
</style>