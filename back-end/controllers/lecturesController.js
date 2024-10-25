const Lectures = require('../models/lectures');
const qrCode = require('qrcode');
const User = require('../models/users');
const { Admin } = require('mongodb');
exports.creatLectures = async(req, res) => {
  try{
    const {group_id, description, title, article, resources } = req.body;
    if(req.user.role !== 'admin'){
      return res.status(403).json({ message: 'Aess denied'});
    }
    const lectures = new Lectures({
      group_id,
      description,
      title,
      article,
      resources,
  });
  await lectures.save();
  const qrCodeData = {
    lectureId: lectures._id,
    groupId:group_id,
    title: title
  };
  const qr_code = await qrCode.toDataURL(JSON.stringify(qrCodeData)); // Convert data to QR Code
  lectures.qr_code = qr_code; // Update lecture by qrcode
  await lectures.save();
  res.status(201).json(lectures);
} catch(error){
    console.error(error);
    res.status(500).json({message: 'Server error'});
}
};

// Register attendance when scanning the QR Code
exports.attendLecture = async (req, res) => {
  try {
      console.log('User object:', req.user);
      if (!req.user) {
          return res.status(401).json({ error: 'User not authenticated.' });
      }
      
      const userId = req.user._id; 
      const lectureId = req.body.lectureId; 

      // Check for both userId and lectureId
      if (!lectureId) {
          return res.status(400).json({ error: 'Lecture ID is required.' });
      }

      // Find the lecture
      const lecture = await Lectures.findById(lectureId);
      if (!lecture) {
          return res.status(404).json({ error: 'Lecture not found.' });
      }

      // Check if the user has already attended the lecture
      if (lecture.attendees.includes(userId)) {
        return res.status(400).json({ error: 'You have already registered for this lecture.' });
    }

      // Add user to the attendees
      lecture.attendees.push(userId);
      lecture.attendanceCount += 1;
      await lecture.save();

      return res.status(200).json({ message: 'Successfully attended the lecture.' });
  } catch (error) {
      console.error('Error in attendLecture:', error);
      return res.status(500).json({ error: 'An error occurred while attending the lecture.' });
  }
};
exports.getUserAttendanceCount = async (req, res) => {
  try {
      console.log('User object:', req.user); 
      if (!req.user) {
          return res.status(401).json({ error: 'User not authenticated.' });
      }

      const userId = req.user._id;

      const lectures = await Lectures.find({ attendees: userId });

      const attendanceCounts = lectures.map(lecture => ({
          lectureId: lecture._id,
          title: lecture.title,
          attendanceCount: lecture.attendanceCount
      }));

      const totalAttendanceCount = attendanceCounts.reduce((total, lecture) => total + lecture.attendanceCount, 0);

      return res.status(200).json({
          attendanceCounts,
          totalAttendanceCount 
      });
  } catch (error) {
      console.error('Error in getUserAttendanceCount:', error);
      return res.status(500).json({ error: 'An error occurred while fetching attendance count.' });
  }
};

// get all lecture 
exports.getAllLectures = async(req, res) => {
  try{
    const lecture = await Lectures.find();
    res.status(200).json(lecture);
  } catch(error) {
    res.status(500).json({message: 'Server error'});
  }
};

// get lecture by id
exports.getLecturesById = async(req, res) => {
  try{
    const lecture = await Lectures.findById(req.params.id);
    if(!lecture){
      return res.status(404).json({message: 'Lecture not found'});
    }
    res.status(200).json(lecture);
  } catch(error){
    console.error('Error fetching lecture');
    res.status(500).json({message: 'server error', error: error.message});
  }
};

// Update lecture by id
exports.updateLecturesById = async(req, res) => {
  try{
    const { id } = req.params;
    const {title, description, article, resources, qr_code } = req.body;
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

    const updateLecture = await Lectures.findByIdAndUpdate(id, updateLecturesData,  { new: true, runValidators: true });
    if(!updateLecture){
      return res.status(400).json({ message: 'Lectures not found'});
    }
    res.status(200).json(updateLecture);
  } catch(error){
    console.error(error);
    res.status(500).json({ message: 'server error'});
  }
};

// delet lecture by id
exports.deleteLecturesById = async(req, res) => {
  try{
    const { id } = req.params;
    if(req.user.role !== 'admin'){
      return res.status(403).json({ message: 'Access denied'});
    }
    const deletedLecture = await Lectures.findByIdAndDelete(id);
    if(!deletedLecture){
      return res.status(404).json({ message : 'courses not found'});
    }
    res.status(200).json({ message: 'lecture delet successfully'});
  } catch(error){
      console.error(error);
      res.status(500).json({ message : 'server error'});
  }
};

// creat task by admin
exports.createTask = async(req, res) => {
  try {
    const { lectureId } = req.params;
    const { adminLink, deadline } = req.body;
    if(req.user.role !== 'admin'){
      return res.status(403).json({message: 'Acess denied'});
    }
    const lecture = await Lectures.findById(lectureId);
    if(!lecture){
      return res.status(404).json({ message: 'Lecture not found'});
    }
    lecture.tasks.push({
      adminLink,
      deadline
    });
    await lecture.save();
    res.status(201).json({ message: 'Task added successfully'});
  } catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error'});
  }
};

// // get task by id
// exports.getTaskById = async(req, res) => {
//   try{
//     const task = await Task.findById(req.params.id);
//         if (!task) {
//       return res.status(404).json({ message : 'Task not found'});
//     }
//     res.status(200).json(task);
//   } catch(error) {
//     console.error('Error fetching Task');
//   }
// }


// get all tasks


// Submit a Task


// Score a Task


