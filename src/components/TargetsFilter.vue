<template>
	<div class="labels-filter" @touchmove.prevent>
		<div class="checked">
			<h2 class="c-title">已添加的 （最多选择6个）</h2>
			<ul class="list">
				<li v-for="label in checkedLabels" class="item-wrap">
					<a href="javascript:;" class="item shadow" @click="unCheck(label)">{{label.name}}<i class="checked-delete"></i></a>
				</li>
			</ul>
		</div>
		<div class="unchecked">
			<h2 class="c-title">添加更多</h2>
			<ul class="list">
				<li v-for="label in uncheckedLabels" @click="check(label)" class="item-wrap">
					<a href="javascript:;" class="item shadow" :class="{'disabled': checkedLabels.length>=6}">{{label.name}}</a>
				</li>
			</ul>
		</div>
		<BottomBar :reset="reset" :confirm="confirm" :hasCancel="true" :cancel="cancel" />
		<Tips v-if="showTips" :msg="msg" />
	</div>
</template>

<script>
import {BottomBar, Tips} from '../common'
	export default{
		data(){
			return {
				showTips: false,
				checkedLabels: [],
				uncheckedLabels: [],
				msg: ""
			}
		},
		props:{
			data: Array
		},
		computed: {
			showedLabels(){
				let ts = {}
				this.checkedLabels.forEach(t => ts[t.id] = t )
				return ts
			}
		},
		methods: {
			check(label){
				if(this.checkedLabels.length >= 6){
					this.msg = "最多添加<b>6</b>个哦～"
					this.showTips = true
				}else{
					this.checkedLabels = this.checkedLabels.concat([{
						...label,
						show: true
					}])
					this.uncheckedLabels.splice(this.uncheckedLabels.indexOf(label), 1)
				}
			},
			unCheck(label){
				if(this.checkedLabels.length <= 1){
					this.msg = "至少添加<b>1</b>个哦～"
					this.showTips = true
				}else{
					const index = this.checkedLabels.indexOf(label)
					this.uncheckedLabels = this.uncheckedLabels.concat([{
						...label,
						show: false
					}])
					this.checkedLabels.splice(index, 1)
				}
			},
			reset(){
				this.checkedLabels = this.data.slice(0, 6)
				this.uncheckedLabels = this.data.slice(6)
			},
			getChecked(){
				let checked = {}
				this.checkedLabels.map(d => {
					checked[d.id] = d
				})
				return checked
			},
			confirm(){
				const _v = this
				this.data.map(d => {
					const c = _v.getChecked()[d.id]
					d.show = !!c
				})
				this.$parent.confirmFilterlabel()
			},
			cancel(){
				this.checkedLabels = []
				this.uncheckedLabels = []
				this.data.map(d => {
					if(d.show){
						this.checkedLabels.push(d)
					}else{
						this.uncheckedLabels.push(d)
					}
				})
				this.$parent.showLabelsFilter = false
			}
		},
		beforeMount(){
			if(!this.checkedLabels.length){
				this.checkedLabels = this.data.slice(0, 6).concat([])
			}
			if(!this.uncheckedLabels.length){
				this.uncheckedLabels = this.data.slice(6).concat([])
			}
		},
		components:{
			BottomBar,
			Tips
		}
	}
</script>

<style lang="scss">
	$num: 3;
	.labels-filter{
		position: fixed;
		top: 0;
		bottom: 0;
		padding-bottom: 114px;
		width: 100%;
		background-color: #f0f0f0;
		z-index: 3;//top for water mark
		overflow: auto;
		font-size: 30px;
		.checked{
			padding: 45px 18px;
			background-color: #fff;
			box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
			.item-wrap{
				width: 50%;
			}
			.item{
				margin: 5px;
			}
			.c-title{
				padding-left: 44px;
				background: url(../../assets/images/icon-add.png) left no-repeat;
				background-size: 29px 29px;
			}
		}
		.checked-delete{
			display: inline-block;
			padding: 0 1em;
			width: 23px;
			height: 100%;
			float:right;
			background: url(../../assets/images/icon-delete.png) center no-repeat;
			background-size: 23px 28px;
		}
		.unchecked{
			padding: 45px 18px;
			.item{
				margin: 8px;
				text-align: center;
				&.disabled{
					background-color: #dadada;
					color: #bbb;
					box-shadow: none;
				}
			}
		}
		.list{
			display: flex;
			flex-flow: row wrap;
			margin-top: 8px;
		}
		.item{
			display: block;
			padding: 27.5px 1em;
			height: 100px;
			background-color: #fff;
		}
		.c-title{
			font-size: 30px;
			color: rgba(80, 80, 80, .7);
		}
		.f-bottom{
			border-top: solid 1px #d6d6d6;
			background-color: #f0f0f0;
		}

		.tips {
			line-height: 50px;
			b{
				font-weight: normal;
				font-size: 50px;
			}
		}
		
	}
</style>