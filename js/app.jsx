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

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
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

		destroy: function (todo) {
			this.props.model.destroyTodo(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		render: function () {
			var main;
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
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			if (todos.length) {
				main = (

				 			 {todoItems}

				);
			}

			return (

					<header className="header">

						{main}

						<div className="ingredient-item  pure-g">
								<div class="pure-u-1-2">
									<input
										className="new-todo"
										placeholder="Add new ingredient"
										value={this.state.newTodo}
										onKeyDown={this.handleNewTodoKeyDown}
										onChange={this.handleChange}
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
