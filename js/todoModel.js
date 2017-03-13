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
		this.store = Utils.store(key);
		this.onChanges = [];

		this.store.projects =  this.store.projects || [];
		this.store.lists = this.store.lists || [];
		this.store.todos =  this.store.todos || [];
		
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.store);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addProject = function (title) {
		this.store.projects = this.store.projects.concat({
			id: Utils.uuid(),
			title: title
		});

		this.inform();
	};

	app.TodoModel.prototype.addList = function (title,projectId) {
		this.store.lists = this.store.lists.concat({
			id: Utils.uuid(),
			projectId: [projectId],
			title: title
		});

		this.inform();
	};

	app.TodoModel.prototype.addTodo = function (title,listId,projectId) {
		this.store.todos = this.store.todos.concat({
			id: Utils.uuid(),
			listId: [listId],
			projectId: [projectId],
			title: title,
			completed: false
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyTodo = function (todo) {
		this.store.todos = this.store.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyList = function (list) {
		this.store.lists = this.store.lists.filter(function (candidate) {
			return candidate !== list;
		});

		this.inform();
	};

	app.TodoModel.prototype.destroyProject = function (project) {
		this.store.projects = this.store.projects.filter(function (candidate) {
			return candidate !== project;
		});

		this.inform();
	};

	app.TodoModel.prototype.saveTodo = function (todoToSave, text) {
		this.store.todos = this.store.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.saveList = function (listToSave, text) {
		this.store.lists = this.store.lists.map(function (list) {
			return list !== listToSave ? list : Utils.extend({}, list, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.saveProject = function (projectToSave, text) {
		this.store.projects = this.store.projects.map(function (project) {
			return project !== projectToSave ? project : Utils.extend({}, project, {title: text});
		});

		this.inform();
	};


})();
