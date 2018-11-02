const express = require('express');
const { requireAuth } = require('./middleware');
const { Project } = require('../models');

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, (req, res) => {
	Project.find({ user: req.user.id }, { __v: 0, user: 0 }, (err, projects) => {
		if (err) {
			res.status(400).send({ message: 'Get users failed', err });
		} else {
			res.send({ message: 'Projects retrieved successfully', projects });
		}
	});
});

router.post('/', requireAuth, (req, res) => {
	req.body.user = req.user.id;

	const newProject = Project(req.body);


	newProject.save((err, savedProject) => {
		if (err) {
			res.status(400).send({ message: 'Create project failed', err });
		} else {
			res.send({ message: 'Project created successfully', project: savedProject.hide() });
		}
	});
});

router.put('/complete', requireAuth, (req, res) => {
	Project.findOne({ project_id: req.body.project_id }, { __v: 0, user: 0 }, (err, project) => {
		if (err) {
			res.status(400).send({ message: 'Toggle project failed', err });
		} else {
			project.completed = !project.completed;
			project.save((err2, savedProject) => {
				if (err2) {
					res.status(400).send({ message: 'Toggle project failed', err });
				} else {
					res.send({ message: 'Toggled complete project successfully', project: savedProject.hide() });
				}
			});
		}
	});
});

router.put('/', requireAuth, (req, res) => {
	Project.findById(req.body.id, { __v: 0, user: 0 }, (err, project) => {
		if (err) {
			res.status(400).send({ message: 'Update project failed', err });
		} else {
			project.text = req.body.text;
			project.updated_at = Date.now();
			project.save((err2, savedProject) => {
				if (err2) {
					res.status(400).send({ message: 'Update project failed', err });
				} else {
					res.send({ message: 'Updated project successfully', project: savedProject.hide() });
				}
			});
		}
	});
});

router.delete('/', requireAuth, (req, res) => {
	Project.findByIdAndRemove(req.body.id, (err) => {
		if (err) {
			res.status(400).send({ message: 'Delete project failed', err });
		} else {
			res.send({ message: 'Project successfully delete' });
		}
	});
});