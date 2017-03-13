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
	var BACKSPACE_KEY = 8;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.LISTS,
				editing_list_id: null,
				editing_list_name: 'no recipe',
				editing: null,
				newTodo: '',
				newList: '',
				newProject: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/projects': setState.bind(this, { nowShowing: app.PROJECTS }),
				'/lists': setState.bind(this, { nowShowing: app.LISTS })
			});
			router.init('/lists');
		},

		handleTodoChange: function (event) {
			this.setState({ newTodo: event.target.value });
		},

		handleListChange: function (event) {
			this.setState({ newList: event.target.value });
		},

		handleNewListKeyDown: function (event) {
			if (event.keyCode == ENTER_KEY) {

				event.preventDefault();

				var val = this.state.newList.trim();

				if (val) {
					this.props.model.addList(val, '');
					this.setState({ newList: '' });

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
					this.props.model.addTodo(val, this.state.editing_list_id, '');
					this.setState({ newTodo: '' });
				}

			} else if (event.keyCode == BACKSPACE_KEY) {

				var val = this.state.newTodo.trim();

				if (val == '') {
					this.props.model.destroyTodo();
					// TODO
					this.setState({ newTodo: '' });
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
			this.setState({ editing: todo.id });
		},

		save: function (todoToSave, text) {
			this.props.model.saveTodo(todoToSave, text);
			this.setState({ editing: null });
		},

		editList: function (list) {
			this.setState({ editing: list.id });
			this.setState({ editing_list_id: list.id });
			this.setState({ editing_list_name: list.title });
		},

		saveList: function (listToSave, text) {
			this.props.model.saveList(listToSave, text);
			this.setState({ editing: null });
		},

		cancel: function () {
			this.setState({ editing: null });
		},

		render: function () {
			var todosMain;
			var listsMain
			var todos = this.props.model.store.todos;
			var lists = this.props.model.store.lists;
			var projects = this.props.model.store.projects;

			var shownTodos = todos.filter(function (todo) {
				if (todo.listId == this.state.editing_list_id) { return true; }
			}, this);

			var todoItems = shownTodos.map(function (todo) { // was shownTodos before
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
					{ todoItems }
				);
			}

			if (lists.length) {
				listsMain = (
					{ listItems }
				);
			}


			return (


				<div className="header" >
					<div className="calculated-width header-left" style={{ background: '#f2f2f4', position: 'fixed', top: 0, height: 21, padding: 12, width: 240 }} > <form className="pure-form calculated-width" style={{
						float: 'left',
						marginLeft: 0,
						marginTop: '-5px',
						width: '100%',
						height: 0
					}}>

						<input className="new-list" style={{ width: 160,height: 24	}} placeholder="Add new recipe" value={this.state.newList} onKeyDown={this.handleNewListKeyDown} onChange={this.handleListChange} autoFocus={true} />

					</form> < div className="addNew" style={{ float: 'right', marginTop: '-3px', marginRight: 0, fontSize: 20, fontWeight: 300 }} > <a>[ New ]</a> </div>
					</div > <div className="calculated-height calculated-width mydiv" style={{
						overflow: 'auto',
						height: '-webkit-calc(100% - 100px)',
						width: 280
					}}>
						{/* Results */}
						<div id="recipe" style={{
							padding: '20px 0px 20px 20px',
							background: '#fff0fc',
							marginRight: 16
						}}>
							<div id="list" className>
								<div className="ingredient-item-selected pure-g">
									<div className="pure-u-1-2" style={{
										fontSize: 14,
										fontWeight: 'bold'
									}}>	Recipes </div>
									<div className="pure-u-1-2"></div>
								</div>
								
								{listsMain}

							</div>
						</div>

						{/* Results */}

					</div>
					<div className="footer-left calculated-width" style={{ background: '#f0f8f4', position: 'fixed', bottom: 0, height: 21, padding: 12, width: 240 }} > {/* <div  style="float:right; margin-top:-23px; margin-right:10px; font-size:20px;font-weight:300;"><a style="color:green;">[ Add New Plan ]</a></div> */}
						<div style={{ fontSize: 20, fontWeight: 300, marginTop: '-2px' }} > <a href="#">
							[ Plans ]</a> </div>
						<div style={{ fontSize: 20, fontWeight: 300, float: 'left', marginLeft: 80, marginTop: '-23px', height: 0 }}><a href="#"> [ Recipes ] </a> </div> 
					</div>

					<div id="element" style={{ overflow: 'auto', height: '-webkit-calc(100% - 50px)', width: '-webkit-calc(100% - 290px)', minWidth: 600, marginTop: 50, background: '#f202f4' }}>
						
						<div className="preview" style={{ background: '#f2f2f4', fontSize: 20, fontWeight: 300, padding: 12, position: 'fixed', top: '-2px' }}>
							<a href="#"> [ Print ] </a>
						</div>

						<div className="preview p-content" style={{ background: '#f3f7f2', height: 1000, padding: 12, width: '-webkit-calc(100% - 24px)', minWidth: 720 }}>
							
					
							<div id="recipe" className={classNames({ no_display: !this.state.editing_list_id})} style={{ padding: '20px 0px 20px 140px', background: '#fff0fc', marginRight: 16 }}>
								<div id="recipe-info">
									<div id="icon" style={{ width: 80 }}>
										<img className="pure-img" style={{ padding: 4, height: 80, float: 'left', marginLeft: '-110px', marginTop: '-20px', background: '#fff', borderRadius: 60, border: '1px solid #ddd' }} src="./img/spoon-fork.png" alt="html5" /> </div> < h1 > {this.state.editing_list_name} </h1>
									<div id="image">
										<img className="pure-img" style={{ height: 300, float: 'right', marginTop: '-200px', marginRight: 20, marginBottom: 20 }} src="./img/pumpkin-salad.jpeg" alt="html5" /> </div> < div className="label" > Recipe </div>
									<div className="label">Nutrition</div> <div className="label">CO2-value</div> </div>
								<div className="list">
									<div className="ingredient-item ingredient-item-selected pure-g">
										<div className="pure-u-1-2" style={{ fontSize: 14, fontWeight: 'bold' }}>
											Ingredients                 </div> <div className="pure-u-1-2"></div> </div>
									{/* <button class="add-ingridient-button pure-button">Add Ingredient</button> */}
								</div>
								<div id="list">


									{todosMain}

									<div className="ingredient-item  pure-g">
										<div class="pure-u-1-2">
											<input className="new-todo" placeholder="Add new ingredient" value={this.state.newTodo} onKeyDown={this.handleNewTodoKeyDown} onChange={this.handleTodoChange} autoFocus={true} />
										</div>
									</div>

								</div>
								<div className="label" > Preperation </div>
								<div id="preperation">
									<span className="qs">
										<p>1. Preheat the oven to 180 ºC. Clean the pumpkin and remove seeds and skin. Cut into cubes of about 1.5 cm. Note: There are some types of pumpkin you can eat with their skin such as butternut.</p> <p>2. Place the pumpkin cubes onto a baking tray and bake for about 15 minutes. Remove the tray and let the cubes cool down.</p> < p > 3. Chop up the parsley.Toast the sesame seeds in the pan until fragrant.Mix all the remaining ingredients with the pumpkin cubes.Serve and enjoy. </p>
										<p>GOOD TO KNOW: We love it with spelt cous cous and a fried egg sunny side up. That's very delicious healthy fast food for you!</p>
										<span className="popover above">
											<span style={{
												background: 'rgba(253, 246, 227, 0.85)'
											}}>Sesam</span><br />
											Sesamöl<br />
											Retro Sesam (scharz)<br />
											Krisesamoli Topfspflanze<br />
										</span>
									</span>
								</div> </div> </div>

					</div>


				</div>

			);
		}
	});

	var model = new app.TodoModel('eaternity-react-prototype');

	function render() {
		React.render(
			<TodoApp model={model} />,
			document.getElementsByClassName('eaternity-app')[0]
		);
	}

	model.subscribe(render);
	render();
})();
