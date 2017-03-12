/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.LISTS = 'listview';
	app.PROJECTS = 'projectview';
	var TodoItem = app.TodoItem;
	var ListItem = app.ListItem;
	var ProjectItem = app.ProjectItem;

	var ENTER_KEY = 13;
	var BACKSPACE_KEY =	8;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.LISTS,
				editing: null,
				newTodo: '',
				newList: '',
				newProject: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/projects': setState.bind(this, {nowShowing: app.PROJECTS}),
				'/lists': setState.bind(this, {nowShowing: app.LISTS})
			});
			router.init('/lists');
		},

		handleTodoChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleListChange: function (event) {
			this.setState({newList: event.target.value});
		},

		handleNewListKeyDown: function (event) {
			if (event.keyCode == ENTER_KEY) {

				event.preventDefault();

				var val = this.state.newList.trim();

				if (val) {
					this.props.model.addList(val,'');
					this.setState({newList: ''});
				}

			} else {
				return;
			}
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode == ENTER_KEY) {

				event.preventDefault();

				var val = this.state.newTodo.trim();

				if (val) {
					this.props.model.addTodo(val,'','');
					this.setState({newTodo: ''});
				}

			} else if (event.keyCode == BACKSPACE_KEY) {

				event.preventDefault();

				var val = this.state.newTodo.trim();

				if (val == '') {
					this.props.model.destroyTodo();
					// TODO
					this.setState({newTodo: ''});
				}

			} else {
				return;
			}
		},

		destroyTodo: function (todo) {
			this.props.model.destroyTodo(todo);
		},

		destroyList: function (list) {
			this.props.model.destroyList(list);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
			this.setState({editing_what: 'todo'});
		},

		save: function (todoToSave, text) {
			this.props.model.saveTodo(todoToSave, text);
			this.setState({editing: null});
		},

		editList: function (list) {
			this.setState({editing: list.id});
			this.setState({editing_what: 'list'});
		},

		saveList: function (listToSave, text) {
			this.props.model.saveList(listToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		render: function () {
			var todosMain;
			var listsMain
			var todos = this.props.model.todos;
			var lists = this.props.model.lists;
			var projects = this.props.model.projects;

			// var shownTodos = todos.filter(function (todo) {
			// 		if (todo.listId == this.newList) { return true; }
			// 	}
			// }, this);

			var todoItems = todos.map(function (todo) { // was shownTodos before
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onDestroy={this.destroyTodo.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						editing_what={this.state.editing_what === 'todo'}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var listItems = lists.map(function (list) { 
				return (
					<ListItem
						key={list.id}
						list={list}
						onDestroy={this.destroyList.bind(this, list)}
						onEdit={this.editList.bind(this, list)}
						editing={this.state.editing === list.id}
						editing_what={this.state.editing_what === 'list'}
						onSave={this.saveList.bind(this, list)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			if (todos.length) {
				todosMain = (
				 			 {todoItems}
				);
			}

			if (lists.length) {
				listsMain = (
							 {listItems}
				);
			}


			return (



					<header className="header">



						<div className="ingredient-item  pure-g">
								<div class="pure-u-1-2">
									<input
										className="new-list"
										placeholder="Add new list"
										value={this.state.newList}
										onKeyDown={this.handleNewListKeyDown}
										onChange={this.handleListChange}
										autoFocus={true}
									/>
								</div>
						</div>

						{listsMain}

						{todosMain}

						<div className="ingredient-item  pure-g">
								<div class="pure-u-1-2">
									<input
										className="new-todo"
										placeholder="Add new ingredient"
										value={this.state.newTodo}
										onKeyDown={this.handleNewTodoKeyDown}
										onChange={this.handleTodoChange}
										autoFocus={true}
									/>
								</div>


						</div>

					</header>


			);
		}
	});

	var model = new app.TodoModel('eaternity-react');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('eaternity-app')[0]
		);
	}

	model.subscribe(render);
	render();
})();
