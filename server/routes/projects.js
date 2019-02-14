const express = require('express');

const { requireAuth } = require('./middleware');
const { Project } = require('../models');
const queries = require('./queries');
const events = require('./events');
const keys = require('./keys');
const alter = require('./alter');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  Project.find({ organization: req.user.id }, { __v: 0, organization: 0 }, (err, projects) => {
    if (err) return res.status(400).send({ message: 'Get organizations failed', err });
    return res.send({ message: 'Projects retrieved successfully', projects });
  });
});

router.post('/', requireAuth, (req, res) => {
  req.body.organization = req.user.id;
  const newProject = Project(req.body);
  newProject.save((err, savedProject) => {
    if (err) return res.status(400).send({ message: 'Create project failed', err });
    return res.send({ message: 'Project created successfully', project: savedProject.hide() });
  });
});

router.post('/project', requireAuth, (req, res) => {
  Project.findOne({ projectId: req.body.projectId }, { __v: 0, organization: 0 }, (err, project) => {
    if (err) return res.status(400).send({ message: 'Toggle project failed', err });
    return res.send({ message: 'Toggled complete project successfully', project: project.hide() });
  });
});

router.put('/', requireAuth, (req, res) => {
  Project.findOneAndUpdate({ projectId: req.body.projectId },
    { ...req.body, updatedAt: Date.now() }, { __v: 0, organization: 0 }, (err, savedProject) => {
      if (err) return res.status(400).send({ message: 'Update project failed', err });
      return res.send({ message: 'Updated project successfully', project: savedProject.hide() });
    });
});

router.delete('/', requireAuth, (req, res) => {
  const { projectId } = req.body;
  Project.deleteOne({ projectId }, (err) => {
    if (err) return res.status(400).send({ message: 'Delete project failed', err });
    return res.send({ message: 'Project successfully deleted' });
  });
});

router.use('/:PROJECT_ID/queries', queries);
router.use('/:PROJECT_ID/events', events);
router.use('/:PROJECT_ID/keys', keys);
router.use('/:PROJECT_ID/alter', alter);

module.exports = router;
