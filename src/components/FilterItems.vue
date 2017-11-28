<template>
	<div class="filters">
		<h3 class="f-title">{{title}}</h3>
		<ul class="filter-ul" :class="'len-'+ data.length">
			<li v-if="expanded  true : index <= 7" class="filter-item" v-for="(item,index) in data" :class="cssClass(item, index)" @click="selectItem(item,index)">
				<label class="shadow check item" v-if="multiSelect" :for="'chk_'+item.key">
					<input :id="'chk_'+item.key" type="checkbox" :value="item" v-model="value">
					{{item[name]}}
				</label>
				<span class="shadow item" :class="{'more': index == 7 && !expanded}" v-else-if="index == 7 && !expanded">...</span>
				<span class="shadow item" v-else>{{item[name]}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			let v = this.data.length && this.data[0]
			if(this.multiSelect){
				v = []
			}
			return {
				value: v,
				expanded: false
			}
		},
		props:{
			title: String,
			data: {
				type: Array,
				default: () => []
			},
			name: {
				type: String,
				default: 'name'
			},
			code: {
				type: String,
				default: 'code'
			},
			multiSelect: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			selectedText(){
				const name = this.name
				if(Array.isArray(this.value)){
					return this.value.map(v => v[name].substr(0, 4))
				}else {
					if(this.value){
						return this.value[name]
					}else if(this.data.length){
						return this.data[0][name]
					}
				}
			}
		},
		methods: {
			selectItem(item, index){
				if(!this.multiSelect){
					if(!this.expanded && index===7){
						this.expanded = true
					}else
						this.value = item
				}
			},
			cssClass(item, index){
				const {
					code,
					name
				} = this
				let selected = index == 0
				if(this.value){
					if(this.multiSelect){
						selected = this.value.includes(item)
					}else{
						selected = this.value[code] == item[code]
					}
				}
				return {
					on: selected,
					'multi': this.multiSelect
				}
			},
			reset(){
				this.value = this.multiSelect ? [] : this.data.length && this.data[0]
			},
			setSelected({value, key}){
				let selectedIndex = 0
				const code  = this.code, name = this.name,
				item = this.data.filter((d, i) => {
					if(d.hasOwnProperty('key')){ // this filter item is exclude 
						return key.indexOf(d.key) !== -1
					}else {
						const isSelected = d[code] == value
						selectedIndex = isSelected && i // index for expanded the list
						return isSelected
					}
				})
				this.expanded = selectedIndex >= 7
				if(item.length)  {
					this.value = this.multiSelect ? item : item[0]
				}
				return this.selectedText
			}
		},
		watch: {
			data(newValue, oldValue){
				if(newValue.length && !oldValue.length){
					this.value = newValue[0]
				}
			}
		}
	}
</script>

<style scope lang="scss">
	.filters{
		padding: 30px 18px;
		color: #505050;
	}
	.f-title{
		margin: 12px 0;
		font-size: 24px;
		font-weight: normal;
	}
	.filter-ul{
		display: flex;
		flex-flow: row wrap;
	}
	.filter-item{
		margin: 5px 0;
		width: 25%;
		font-size: 24px;
		text-align: center;
		.item{
			display: inline-block;
			padding: 20px 0;
			border-radius: 3px;/*no*/
			width: 170px;
			&.check{
				width: 266px;
			}
			&.more{
				width: 80%;
				height: 73px;
				line-height: 0;
				font-size: 60px;
			}
		}
		&.multi{
			margin-right: 10px;
			width: auto;
		}
		&:first-child{
			margin-left: 0;
		}
		&.on .shadow{
			background-color: #53d3ff;
			color: #fff;
			box-shadow: none;
		}
		input[type=checkbox]{
			display: none;
		}
	}
</style>