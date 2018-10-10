import React from 'react';
import PropTypes from 'prop-types';

export default function ConfirmDeleteTodo({ closeModal, deleteTodo }) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="content has-text-centered">Are you sure you wanted to delete this item?</div>
			</div>
			<footer className="card-footer">
				<div className="card-footer-item" role="button" tabIndex={0} onClick={closeModal} onKeyPress={closeModal}>Cancel</div>
				<div className="card-footer-item" role="button" tabIndex={-1} onClick={deleteTodo} onKeyPress={deleteTodo}>Delete</div>
			</footer>
		</div>
	);
}

ConfirmDeleteTodo.propTypes = {
	closeModal: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
};
