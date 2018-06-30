var store = {
	save(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	fetch(key) {
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var myTask = store.fetch("todoTask");
var myList = store.fetch("todoList");

var filter = {
	all: function (myTask) {
		return myTask
	},
	finished: function (myTask) {
		return myTask.filter(function (task) {
			return task.isChecked;
		});
	},
	unfinished: function (myTask) {
		return myTask.filter(function (task) {
			return !task.isChecked;
		});
	}
}
var vm = new Vue({
	el: "#app",
	data: {
		showMyDay: true,
		showToDo: false,
		showSearch: false,
		showOther: false,
		time: new Date(),
		list_index: 1,
		myList: myList,
		//任务
		myTask: myTask,
		textlist: '',
		thing: '',
		priority: '',
		editList: '',
		editTask: '',
		beforeTitle: '',
		beforeLabel: '',
		visibility: "all",
		searchData: '',
		curPage: 1,
		pageSize: 4
	},
	//任务
	watch: {
		myTask: {
			handler: function () {
				store.save("todoTask", this.myTask)
			},
			deep: true
		},
		myList: {
			handler: function () {
				store.save('todoList', this.myList)
			},
			deep: true
		}
	},
	created: function () {
		this.pageCount = Math.ceil(this.myTask.length / this.pageSize);
	},
	//任务
	computed: {
		filteredTask() {
			return filter[this.visibility] ? filter[this.visibility](this.myTask) : myTask
		},
		Newitems() {
			var _this = this;
			var Newitems = [];
			_this.myTask.map(function (task) {
				if (
					task.title.search(_this.searchData) !== -1 
					// ||
					// task.isChecked.search(_this.searchData) !== -1
				) {
					Newitems.push(task);
				}
			});
			return Newitems;
		},
		prioritySortup() {
			var _this = this;
			var prioritySortup = [];
			function compare(property) {
				return function (a, b) {
					return a[property] - b[property];
				}
			};
			return _this.myTask.sort(compare('prior'));
		},
		prioritySortdown() {
			var _this = this;
			var prioritySortup = [];
			function compare(property) {
				return function (a, b) {
					return b[property] - a[property];
				}
			};
			return _this.myTask.sort(compare('prior'));
		}
	},
	methods: {
		tab1: function (showMyDay) {
			this.showMyDay = true;
			this.showToDo = false;
			this.showSearch = false;
			this.showOther = false;
		},
		tab2: function (showToDo) {
			this.showMyDay = false;
			this.showToDo = true;
			this.showSearch = false;
			this.showOther = false;
		},
		tab3: function (showSearch) {
			this.showSearch = true;
			this.showMyDay = false;
			this.showToDo = false;
			this.showOther = false;
		},
		tab4: function(showOther){
			this.showOther = true;
			this.showSearch = false;
			this.showMyDay = false;
			this.showToDo = false;
		},
		prePage: function () {
			if (this.curPage > 1) {
				this.curPage = this.curPage - 1;
			}
		},
		nextPage: function () {
			if (this.curPage !== this.pageCount) {
				this.curPage = this.curPage + 1;
			}
		},
		numPage: function (page) {
			if (page === this.curPage) {
				return;
			}
			this.curPage = page;
		},
		//清单
		addmyList: function (ev) {
			if (this.textlist !== '') {
				var list = {
					label: this.textlist,
					isChecked: false,
					id: myList.length + 1 //一旦删除,可能会出现重复值
				}
				this.myList.push(list);
			}
			this.textlist = ''
		},
		deletemyList: function (list) {
			var index = this.myList.indexOf(list);
			this.myList.splice(index, 1);
		},
		editmyList: function (list) {
			this.beforeLabel = list.label;
			this.editList = list;
		},
		editedList: function (list) {
			this.editList = '';
		},
		cancelList: function (list) {
			list.label = this.beforeLabel;
			this.editList = "";
			this.beforeLabel = "";
		},
		setList: function (index) {
			this.list_index = index;
		},
		clear: function () {
			this.myList = [];
			this.myTask = [];
		},
		//任务
		addmyTask: function (ev) {
			if (this.thing !== "") {
				var task = {
					title: this.thing,
					isChecked: false,
					tid: this.list_index,
					createdAt: this.time,
					prior: this.priority
				};
				this.myTask.push(task);
			}
			this.thing = '';
			this.time = '';
			this.priority = 0;
		},
		deletemyTask: function (task) {
			var index = this.myTask.indexOf(task);
			this.myTask.splice(index, 1);
		},
		editmyTask: function (task) {
			this.beforeTitle = task.title;
			this.editTask = task;
		},
		editedTask: function (task) {
			this.editTask = "";
		},
		cancelTask: function (task) {
			task.title = this.beforeTitle;
			this.editTask = "";
			this.beforeTitle = "";
		},
		sortupPrior: function () {
			return this.prioritySortup;
		},
		sortdownPrior: function () {
			return this.prioritySortdown;
		}
	},
	directives: {
		"focus": {
			update(el, binding) {
				if (binding.value) {
					el.focus()
				}

			}
		}
	}
});

function watchHashChange() {
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
};

watchHashChange();

window.addEventListener("hashchange", watchHashChange);