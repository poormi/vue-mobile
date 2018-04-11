<template>
	<transition name="bounceDown">
		<div class="datepicker" @click.stop @touchstart="closeWrap" @touchmove.prevent>
			<div class="tc">
				<div class="date-tabs radius" :class="{'r': type == (dates.length&&dates[dates.length-1].type)}">
				<span class="date-item" v-for="d in dates" :class="{'on': d.type == type, 'disabled': d.disabled}" @touchstart="!d.disabled?type = d.type: 0">{{d.title}}: {{d.date|formatDate('YYYY年MM月DD日')}}</span>
				</div>
			</div>
			<div class="date-block" @touchstart.stop="closeWrap" @touchstart="showYearWrap=true;showMonthWrap=false"><span class="l">{{getYear}}</span> 年</div>
			<div ref="monthPicker" class="date-block" @touchstart.stop="closeWrap" @touchstart="showMonthWrap=true;showYearWrap=false"><span class="l">{{month||getMonth}}</span> 月</div>
			<div class="day-wrap tc ovh">
				<ul class="title">
					<li v-for="day in days">
						{{day}}
					</li>
				</ul>
				<ul class="dates-wrap shadow">
					<li v-for="empty in firstDay" class="date-item">&nbsp;
					</li>
					<li class="date-item" v-for="date in getDaysInMonth" :class="{'on': date==getDate, 'disabled': isValid(date)}" @touchstart="chooseDate(date)">{{date}}</li>
					<li v-for="empty in (42 - firstDay - getDaysInMonth)" class="date-item">&nbsp;
					</li>
				</ul>
				<a href="javascript:;" class="button-normal gray fl" @click="$parent.showDatePicker=false">取消</a>
				<button class="button-normal fr" @click="close">确定</button>
			</div>
			<transition name="right">
			<div v-if="showMonthWrap" class="right-wrap">
				<ul>
					<li class="right-item" :class="{'on': m==(month||getMonth), 'disabled': validMonth(m)}" v-for="m in months" @touchstart.stop @click="chooseMonth(m)">
						<h1 class="inline">{{m}}</h1> 月
					</li>
				</ul>
			</div>
		</transition>
		<transition name="right">
			<div v-if="showYearWrap" class="right-wrap">
				<ul>
					<li v-if="y>=2016" class="right-item" :class="{'on': y==(year||getYear)}" v-for="y in years" @touchstart="chooseYear(y)">
						<h1 class="inline">{{y}}</h1> 年
					</li>
				</ul>
			</div>
		</transition>
			<Tips v-if="showTips" :msg="msg" />
		</div>
	</transition>
</template>

<script>
import {Tips} from '../common'
import moment from 'moment'
	export default {
		data(){
			return {
				days:['日','一','二','三','四','五','六'],
				months: 12,
				years: moment().year(),
				showMonthWrap: false,
				showYearWrap: false,
				month: 0,
				year: 0,
				type: 0,
				date: '',
				msg: '',
				showTips: false
			}
		},
		props: {
			dates: {
				type: Array,
				default: []
			}
		},
		computed: {
			getYear(){
				const date = this.date || this.dates[this.type].date, 
					y = moment(date).year()
				this.year = y
				return y
			},
			getMonth() {
				const date = this.date || this.dates[this.type].date, 
					m = moment(date).month() + 1
				this.month = m
				return m
			},
			getDaysInMonth(){
				const date = this.date || this.dates[this.type].date
				return moment(date).daysInMonth()
			},
			getDate(){
				const date = this.date || this.dates[this.type].date
				return moment(date).date()
			},
			getDay(){
				const date = this.date || this.dates[this.type].date
				return moment(date).day()
			},
			firstDay(){
				const date = this.date || this.dates[this.type].date
				return moment(date).startOf('month').weekday()
			},
			maxDate(){
				return this.dates[this.type].max || moment(new Date())
			}
		},
		methods: {
			close(){
				this.$parent.setDate(this.dates)
			},
			closeWrap(){
				if(this.$refs.monthPicker == event.currentTarget){
					return
				}
				this.showMonthWrap = false
				this.showYearWrap = false
			},
			chooseYear(y){
				const m = (this.month || this.getMonth) - 1,
					_date = moment([y, m, this.getDate]),
					valid = _date.isValid()
				this.year = y
				if(valid){
					if(this.maxDate.isBefore(_date)){
						const n_m = moment().month() + 1
						this.month = n_m
						this.date = this.maxDate
					} else{
						this.date = _date.format()
					}
				}else {					
					this.date = moment([y, 0, this.getDate]).month(m).format()
				}
			},
			chooseMonth(i){
				if(this.validMonth(i)) return
				const _date = moment([this.getYear, i - 1, this.getDate]), 
					valid = _date.isValid()
				this.month = i
				if(valid){
					this.date = _date.format()
				}else{
					this.date = moment([this.getYear, 0, this.getDate]).month(i - 1).format()
				}
				this.closeWrap()	
			},
			chooseDate(d){
				if(this.isValid(d)) return
				const dates = this.dates, i = this.type,
				newDate = moment([this.getYear, (this.month || this.getMonth) - 1, d]).format()
				this.date = newDate
			},
			isValid(date){
				return this.maxDate.isBefore([this.getYear, (this.month || this.getMonth) - 1, date])
			},
			validMonth(month){
				return this.maxDate.isBefore([this.getYear, month - 1, this.getDate])
			}
		},
		watch: {
			type(val){
				this.date = this.dates[val].date
			},
			dates(arr, def){
				if(!def.length){
					this.date = arr[this.type].date
				}
			},
			date(d){
				this.$set(this.dates, this.type, {
					...this.dates[this.type],
					date: d
				})
			}
		},
		created(){
			const _this = this
			this.dates.every(d => {
				if(!d.disabled){
					_this.type = d.type
					return false
				}
				return true
			})
		},
		components: {
			Tips
		}
	}
</script>

<style lang="scss">
$len: 7;
$month-len: 12;
$blue: #53d3ff;
$gray: #ededed;
.datepicker{
	padding: 0 20px 20px;
	background-color: #fff;
	color: #505050;
	font-size: 30px;
	z-index: 9;
	.date-tabs{
		display: inline-block;
		position: relative;
		margin: 24px 0 4px;
		width: 90%;
		height: 54px;
		font-size: 24px;
		text-align: center;
		border: solid 1px $gray;
		border-left-color: transparent;
		z-index: 0;
		.date-item{
			display: inline-block;
			width: 50%;
			height: 54px;
			line-height: 54px;
			&.on{
				color: #fff;
			}
			&.disabled{
				color: rgba(80,80,80,.3);
			}
		}
		&:after{
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 50%;
			height: 100%;
			border-radius: 3px;
			background-color: $blue;
			z-index: -1;
			transition: all 300ms 100ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
		}
		&.r{
			border-left-color: $gray;
			border-right-color: transparent;
			&:after{
			left: 50%;
			}
		}
	}
	.date-block{
		position: relative;
		margin: 20px 0;
		padding: 5px 0 5px 50px;
		height: 95px;
		box-shadow: 1px 2px 5px 1px rgba(0,0,0,0.2);
		&:last-child{
			margin-top: 20px;
		}
		.l{
			font-size: 50px;
		}
		&:after{
			position: absolute;
			right: 36px;
			top: 50%;
			width: 28px;
			height: 28px;
			margin-top: -21px;
			content:'';
			border-top: solid 2px #53d3ff;/*no*/
			border-right: solid 2px #53d3ff;/*no*/
			transform: rotate(45deg);
		}
	}
	.dates-wrap{
		display: flex;
		flex-flow: row wrap;
		border-radius: 3px;/*no*/
		
		.date-item{
			padding-top: 20px;
			width: 100% / $len;
			height: 114px;
			border-right: solid 1px $gray;/*no*/
			border-bottom: solid 1px $gray;/*no*/
			&.on{
				background-color: $blue;
				box-shadow: 0 0 5px 0 $blue;/*no*/
				border-color: transparent;
				color:#fff;
			}
			&.disabled{
				background-color: transparent;
			    box-shadow: none;
			    border-color: #ededed;
				color: rgba(80,80,80,.3);
			}
		}
	}
	.button-normal{
		margin-top: 36px;
		&.fl{
			margin-left: 16px;
		}
		&.fr{
			margin-right: 16px;
		}
	}
	.title{
		margin-bottom: 5px;
		li{
			display: inline-block;
			width: 100% / $len;
			color: rgba(80, 80, 80, 0.3);
		}
	}
	.right-wrap{
		position: absolute;
		top: 0;
		right: 0;
		width: 375px;
		height: 100%;
		background-color: #fff;
		box-shadow: -1px 0 15px 5px rgba(0,0,0,.2);/*no*/
		//transition: all 500ms ease;
		.right-item{
			padding-left: 72px;
			height: 100% / $month-len;
			border-bottom: solid 1px $gray;/*no*/
			&.on{
				background-color: $blue;
				color: #fff;
			}
			&.disabled{
				background-color: transparent;
    			color: rgba(80,80,80,.3);
			}
		}
		.inline{
			display: inline-block;
		}
		&.show{
			right: 0;
		}
	}
}

.bounceDown-enter-active {
    animation: bounce-in-down  .5s linear;
}

.bounceDown-leave-active {
    animation: bounce-in-down .5s linear reverse;
}

.right-enter-active{
	animation: right .5s linear reverse;
}
.right-leave-active{
	animation: right .5s linear;
}

@keyframes bounce-in-down {
    0%{
    	opacity: 0;
    	transform: translateY(-1000px);
    }
    50% {
        opacity: 1;
        transform: translateY(-500px);
    }
    99%{
    	transform: translateY(0px);
    }
    to {
        transform: none
    }
}

@keyframes right {
	0%{
		right: 0;
	}
	50%{
		right: -375px/2;
	}
	100%{
		right: -375px;
	}
}
</style>