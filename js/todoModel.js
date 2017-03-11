/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.projects = Utils.store(key);
		this.lists = [];
		this.todos = [];
		this.onChanges = [];
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.projects);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addProject = function (title) {
		this.projects = this.projects.concat({
			id: Utils.uuid(),
			title: title
		});

		this.inform();
	};

	app.TodoModel.prototype.addList = function (title,projectId) {
		this.lists = this.lists.concat({
			id: Utils.uuid(),
			projectId: projectId,
			title: title
		});

		this.inform();
	};

	app.TodoModel.prototype.addTodo = function (title,listId,projectId) {
		this.todos = this.todos.concat({
			id: Utils.uuid(),
			listId: listId,
			projectId: projectId,
			title: title,
			completed: false
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyTodo = function (todo) {
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyList = function (list) {
		this.lists = this.lists.filter(function (candidate) {
			return candidate !== list;
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyProject = function (project) {
		this.projects = this.projects.filter(function (candidate) {
			return candidate !== project;
		});

		this.inform();
	};

	app.TodoModel.prototype.saveTodo = function (todoToSave, text) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.saveList = function (listToSave, text) {
		this.lists = this.lists.map(function (list) {
			return list !== listToSave ? list : Utils.extend({}, list, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.saveProject = function (projectToSave, text) {
		this.projects = this.projects.map(function (project) {
			return project !== projectToSave ? project : Utils.extend({}, project, {title: text});
		});

		this.inform();
	};


})();
