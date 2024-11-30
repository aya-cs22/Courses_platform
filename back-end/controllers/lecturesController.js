const Lectures = require('../models/lectures');
const qrCode = require('qrcode');
const { Admin } = require('mongodb');
const User = require('../models/users');

exports.creatLectures = async (req, res) => {
  try {
    const { group_id, description, title, article, resources } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Aess denied' });
    }
    const lectures = new Lectures({
      group_id,
      title,
      article,
      description,
      resources,
    });
    await lectures.save();
    const qrCodeData = {
      lectureId: lectures._id,
    };
    const qr_code = await qrCode.toDataURL(JSON.stringify(qrCodeData)); // Convert data to QR Code
    lectures.qr_code = qr_code;
    await lectures.save();
    res.status(201).json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.attendLecture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lectureId } = req.body;

    if (!lectureId) {
      return res.status(400).json({ error: 'Lecture ID is required.' });
    }

    const lecture = await Lectures.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const existingAttendance = user.attendance.find(
      (record) => record.lectureId.toString() === lectureId
    );

    if (existingAttendance) {
      return res.status(400).json({ error: 'You have already registered for this lecture.' });
    }

    user.attendance.push({
      lectureId,
      attended: true,
      attendedAt: new Date()
    });

    lecture.attendees.push(userId);
    lecture.attendanceCount += 1;

    await user.save();
    await lecture.save();

    return res.status(200).json({ message: 'Successfully attended the lecture.' });
  } catch (error) {
    console.error('Error in attendLecture:', error);
    return res.status(500).json({ error: 'An error occurred while attending the lecture.' });
  }
};



exports.getLectureAttendees = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can view attendees.' });
    }

    const { lectureId } = req.body;
    if (!lectureId) {
      return res.status(400).json({ error: 'Lecture ID is required.' });
    }

    const lecture = await Lectures.findById(lectureId)
      .populate('attendees', 'name email'); 

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found.' });
    }

    return res.status(200).json({
      message: 'Lecture attendees retrieved successfully.',
      attendees: lecture.attendees
    });
  } catch (error) {
    console.error('Error retrieving lecture attendees:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving attendees.' });
  }
};


// get all lecture 
exports.getAllLectures = async (req, res) => {
  try {
    const lecture = await Lectures.find();
    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get lecture by id
exports.getLecturesById = async (req, res) => {
  try {
    const lecture = await Lectures.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json(lecture);
  } catch (error) {
    console.error('Error fetching lecture');
    res.status(500).json({ message: 'server error', error: error.message });
  }
};

// Update lecture by id
exports.updateLecturesById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, article, resources, qr_code } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updateLecturesData = {
      title,
      description,
      article,
      resources,
      qr_code,
      updated_at: Date.now(),
    }

    const updateLecture = await Lectures.findByIdAndUpdate(id, updateLecturesData, { new: true, runValidators: true });
    if (!updateLecture) {
      return res.status(400).json({ message: 'Lectures not found' });
    }
    res.status(200).json(updateLecture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
  }
};

// delet lecture by id
exports.deleteLecturesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const deletedLecture = await Lectures.findByIdAndDelete(id);
    if (!deletedLecture) {
      return res.status(404).json({ message: 'courses not found' });
    }
    res.status(200).json({ message: 'lecture delet successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'server error' });
  }
};

// creat task by admin
exports.createTask = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { taskLink, description_task, start_date, end_date } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acess denied' });
    }
    const lecture = await Lectures.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    lecture.tasks.push({
      taskLink,
      description_task,
      start_date,
      end_date
    });
    await lecture.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all tasks by lecture id
exports.getTasksByLectureId = async (req, res) => {
  try {
    const { lectureId } = req.params;

    // Find the lecture by its ID and populate the tasks field if necessary
    const lecture = await Lectures.findById(lectureId).populate('tasks');

    // Check if the lecture exists
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Return the tasks associated with the lecture
    res.status(200).json({ tasks: lecture.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Submit a Task
exports.submitTask = async (req, res) => {
  try {
    const { submissionLink } = req.body;
    const { lectureId, taskId } = req.params;
    const userId = req.user.id;  

    if (!submissionLink) {
      return res.status(400).json({ error: 'Submission link is required' });
    }

    const lecture = await Lectures.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    const task = lecture.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.submissions.push({
      userId,
      submissionLink,
      submittedAt: Date.now(),
      submittedOnTime: true,  
    });

    if (!lecture.submittedBy.includes(userId)) {
      lecture.submittedBy.push(userId);
    }

    await lecture.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const taskSubmission = {
      lectureId,
      taskId,
      submissionLink,
      submittedOnTime: true,
      submittedAt: Date.now(),
      score: null, 
    };

    user.tasks.push(taskSubmission);
    await user.save();
    const users = await User.find({ '_id': { $in: lecture.submittedBy } });
    res.status(200).json({
      message: 'Task submitted successfully',
      task,
      users: users.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Error in submitTask:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Evaluate a Task by Admin
exports.evaluateTask = async (req, res) => {
  try {
    const { lectureId, taskId } = req.params;
    const { userId, score } = req.body;

    console.log(`Evaluating task. Lecture ID: ${lectureId}, Task ID: ${taskId}, User ID: ${userId}, Score: ${score}`);
    const updatedLecture = await Lectures.findOneAndUpdate(
      {
        _id: lectureId,
        'tasks._id': taskId,
        'tasks.submissions.userId': userId,
      },
      {
        $set: {
          'tasks.$[task].submissions.$[submission].score': score,
        },
      },
      {
        arrayFilters: [{ 'task._id': taskId }, { 'submission.userId': userId }],
        new: true,
      }
    );

    if (!updatedLecture) {
      console.log(`Lecture or task not found with ID: ${lectureId}`);
      return res.status(404).json({ message: 'Lecture or task not found' });
    }
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        'tasks.taskId': taskId,
        'tasks.lectureId': lectureId,
      },
      {
        $set: {
          'tasks.$.score': score,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`User not found or task not found for User ID: ${userId}`);
      return res.status(404).json({ message: 'User or task not found' });
    }

    console.log(`Updated score for User ID: ${userId}: ${score}`);

    return res.status(200).json({ message: 'Task evaluated successfully', score });
  } catch (error) {
    console.error('Error in evaluateTask:', error);
    return res.status(500).json({ message: 'An error occurred while evaluating the task' });
  }
};


// Display all information related to the lecture and user
exports.getLectureWithTasksAndUsers = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lectures.findById(lectureId)
      .populate('submittedBy', 'name email') 
      .populate('attendees', 'name email');  

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    res.status(200).json({
      title: lecture.title,
      description: lecture.description,
      tasks: lecture.tasks.map(task => ({
        id: task._id,
        taskLink: task.taskLink,
        description: task.description_task,
        start_date: task.start_date,
        end_date: task.end_date,
        submissionLink: task.submissionLink
      })),
      submittedBy: lecture.submittedBy, 
      attendees: lecture.attendees,
      attendanceCount: lecture.attendanceCount
    });

  } catch (error) {
    console.error('Error fetching lecture data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
