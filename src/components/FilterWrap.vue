<template>
	<div class="filter-wrap" :class="{'open': showFilter}">
		<span class="filter-text font-28 ell">{{displayText|orderDisplay}}</span>
		<button class="icon-button icon-filter" :class="{'on':showFilter}" @touchstart="toggleShow"></button>
		<div v-show="showFilter" class="filter-dialog" @touchmove.prevent><!-- prevent native scroll -->
			<placeholder class="filter-placeholder"></placeholder>
			<div class="filter-list" :style="dialogPosition" @touchmove.stop @touchstart="touchStart" @touchmove="move"> <!-- stop event propagation -->
				<FilterItems ref="ex" title="会员" :multiSelect="true" :data="exclude" />
				<FilterItems ref="deptCd" title="部门" :data="deptData" code="catelogCd" name="catelogNm"/>
				<FilterItems ref="applyTp" title="类型" :data="applyData" />
				<FilterItems ref="vendorTp" title="销售方式" :data="vendorData" name="vendorTpDesc" code="vendorTp"/>
				<FilterItems ref="activeCode" title="激活方式" :data="activeData" name="mpdActNm" code="mpdActId"/>
			</div>
			<BottomBar :reset="reset" :confirm="confirm"/>
		</div>
	</div>
</template>

<script>
import FilterItems from './FilterItems.vue'
import BottomBar from './BottomBar.vue'
import {mapGetters} from 'vuex'
import sort from 'lodash/sortBy'

	export default {
		data() {
			return {
				showFilter: false,
				displayText: [],
				params: {
					payForMonth: 9,
					payForYear: 9,
					deptCd: '99999',
					applyTp: 9,
					vendorTp: 9,
					activeCode: '999'
				},
				exclude: [{
					name: '按月付费',
					key: 'payForMonth',
					code: 1
				},{
					name: '按年付费',
					key: 'payForYear',
					code: 1
				}],
				dialogPosition: {
					top: 0
				},
				posY: 0,
			}
		},
		props: {
			onSubmit: Function,
			filterData: Object
		},
		computed: {
			...mapGetters([
				'deptData',
				'applyData',
				'activeData',
				'vendorData'
			])
		},
		filters: {
			orderDisplay(ar){
				let copyAr = ar.concat([])
				copyAr = sort(copyAr, t => t.index || 0)
				const text = copyAr.map(t => {
					return t.name || t
				})
				if(!text.length) return '全部'
				return text.join(' / ')
			}
		},
		methods: {
			confirm(){
				let _this = this, arr = [], refs = this.$refs
				this.showFilter = false
				Object.keys(refs).forEach(function(key){
					const ref = refs[key],v = ref.value, t = ref.selectedText
					if(Array.isArray(v)){ 
						_this.setExclude()
						v.forEach( r => _this.params[r.key] = r.code)						
					}
					else if(_this.params[key] && typeof v === 'object'){
						_this.params[key] = v[ref.code]
					}
					if(Array.isArray(t)){
						arr = arr.concat(t)
					}
					else if(t && t.indexOf('全部') === -1){
						arr.push(t)
					}
				})
				this.displayText = arr
				this.onSubmit(this.params)
			},
			reset() {
				const refs = this.$refs
				Object.keys(this.$refs).forEach(function(key){
					const ref = refs[key]
					ref.reset()
				})
			},
			setExclude(bo, af){
				this.params.payForMonth = bo || 9
				this.params.payForYear = af || 9
			},
			toggleShow(){
				const $el = event.target, $parentEl = $el.parentElement,
					offsetTop = $el.offsetTop + $el.offsetHeight + $parentEl.offsetTop,
					scrollTop = document.body.scrollTop
				if($el.offsetLeft + $el.offsetWidth == document.body.clientWidth){
					this.dialogPosition.top = $el.offsetTop + $el.offsetHeight
				}else {
					this.dialogPosition.top = offsetTop - scrollTop - 1 // for error 1px
				}
				this.showFilter = !this.showFilter
			},
			cancel(){
				this.showFilter = false
			},
			touchStart(e){
				const evt = e.touches[0] || event
				this.posY = evt.pageY
			},
			move(e){
				const evt = e.touches[0] || event, $el = e.currentTarget, scrollTop = $el.scrollTop,
					scrollHeight = $el.scrollHeight, clientHeight = $el.clientHeight,
					distanceY = evt.pageY - this.posY
				if(scrollHeight - clientHeight <= 0){
					event.preventDefault()
				}else if(distanceY < 0 && scrollTop + 1 >= scrollHeight - clientHeight){
					event.preventDefault()
				}else if(distanceY > 0 && scrollTop == 0){
					event.preventDefault()
				}
			},
			setSelected(){
				const _v = this, params = this.params, refs = this.$refs, filterData = this.filterData
				let arr = [], returnedSelected = null
				Object.keys(refs).forEach(key => {
					const value = filterData[key], ref = refs[key]
					if(_v.params[key]) {
						_v.params[key] = value
					}else{
						_v.setExclude(filterData.payForMonth, filterData.payForYear)
					}
					if(key === 'ex'){ //exclude filters
						let values = []
						if(filterData.payForMonth != 9){
							values.push('payForMonth')
						}
						if(filterData.payForYear != 9){
							values.push('payForYear')
						}
						returnedSelected = ref.setSelected({key:values})
						arr = arr.concat(returnedSelected)
					}else{
						returnedSelected = ref.setSelected({value})
						returnedSelected && returnedSelected.indexOf('全部') === -1 && arr.push(returnedSelected)
					}

				})
				this.displayText = arr.concat([])
			}
		},
		watch:{
			showFilter(val){
				if(!!val){
					document.body.className = "noscroll"
				}else{
					document.body.className = ""
				}
			},
			deptData(val){
				if(val && val.length){
					const code = val[0].catelogCd, name = val[0].catelogNm

					this.params['deptCd'] = code

					if(name && name.indexOf('全部') === -1 && this.displayText.indexOf(name) === -1) {
						this.displayText.push({ index: 1, name: name})
					}
				}
			},
			applyData(val){
				if(val && val.length){
					const code = val[0].code, name = val[0].name
					this.params['applyTp'] = code
					if(name && name.indexOf('全部') === -1 && this.displayText.indexOf(name) === -1) {
						this.displayText.push({index: 2, name:name})
					}
				}
			},
			vendorData(val){
				if(val && val.length){
					const code = val[0].vendorTp, name = val[0].vendorTpDesc
					this.params['vendorTp'] = code
					if(name && name.indexOf('全部') === -1 && this.displayText.indexOf(name) === -1) {
						this.displayText.push({index: 3, name:name})
					}
				}
			},
			activeData(val){
				if(val && val.length){
					const code = val[0].mpdActId, name = val[0].mpdActNm
					this.params['activeCode'] = code
					if(name && name.indexOf('全部') === -1 && this.displayText.indexOf(name) === -1) {
						this.displayText.push({index: 4, name:name})
					}
				}
			}
		},
		beforeMount(){
			this.$store.dispatch('FETCH_APPLY_DATA')
			this.$store.dispatch('FETCH_DEPT_DATA')
			this.$store.dispatch('FETCH_ACTIVE_TYPE')
			this.$store.dispatch('FETCH_VENDOR_TYPE')
		},
		components:{
			FilterItems,
			BottomBar
		},
		mounted(){
			if(this.filterData){
				this.setSelected()
			}
		}
	}
</script>

<style lang="scss">
  $buttonWidth: 142px;
  $buttonRight: 36px;
 	.filter-wrap{
 		position: relative;
		padding: 25px 0;
		color: #fff;
	}
	.filter-list{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		overflow: auto;
		padding-bottom: 114px;
		background-color: #fff;
	}
	.filter-text{
		display: inline-block;
		padding: 0 36px;
		width: 750px - $buttonRight - $buttonWidth;
		height: 48px;
	}
	.icon-filter{
		position: absolute;
		top: 16px;
		right: $buttonRight;
	}
	.filter-dialog{
		position: fixed;
		top: 90px;
		bottom: 0;
		width: 100%;
		z-index: 3;
	}

</style>