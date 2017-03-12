/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	/**
	 * This should work like asana.
	 */
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	var BACKSPACE_KEY =	8;
	var SHIFT_KEY =	16;
	var UP_ARROW_KEY = 38;
	var DOWN_ARROW_KEY = 40;
	var COLON_KEY = 186;

	app.ListItem = React.createClass({
		handleSubmit: function (event) {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({editText: val});
			} else {
				this.props.onDestroy();
			}
		},

		handleEdit: function () {
			this.props.onEdit();
			this.setState({editText: this.props.list.title});
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({editText: this.props.list.title});
				this.props.onCancel(event);
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
		},

		handleChange: function (event) {
			if (this.props.editing) {
				this.setState({editText: event.target.value});
			}
		},

		getInitialState: function () {
			return {editText: this.props.list.title};
		},

		/**
		 * This is a completely optional performance enhancement that you can
		 * implement on any React component. If you were to delete this method
		 * the app would still work correctly (and still be very performant!), we
		 * just use it as an example of how little code it takes to get an order
		 * of magnitude performance improvement.
		 */
		shouldComponentUpdate: function (nextProps, nextState) {
			return (
				nextProps.list !== this.props.list ||
				nextProps.editing !== this.props.editing ||
				nextState.editText !== this.state.editText
			);
		},

		/**
		 * Safely manipulate the DOM after updating the state when invoking
		 * `this.props.onEdit()` in the `handleEdit` method above.
		 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
		 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
		 */
		componentDidUpdate: function (prevProps) {
			if (!prevProps.editing && this.props.editing) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function () {
			return (

				<div className={classNames({
					editing: this.props.editing,
				})}>
				<div className="ingredient-item  pure-g" onClick={this.handleEdit}>
					 <div className="pure-u-1-2">


		 					<div className="view">
		 						<label >
		 							{this.props.list.title}
		 						</label>

		 					</div>
		 					<input
		 						ref="editField"
		 						className="edit"
		 						value={this.state.editText}
		 						onBlur={this.handleSubmit}
		 						onChange={this.handleChange}
		 						onKeyDown={this.handleKeyDown}
		 					/>

					 </div>

					 <div className="pure-u-1-2">
					 	list item: {classNames({
							editing: this.props.editing,
						})}


					 </div>
				</div>
</div>

			);
		}
	});
})();
