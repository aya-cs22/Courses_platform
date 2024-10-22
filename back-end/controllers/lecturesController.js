const Lectures = require('../models/lectures');
const qrCode = require('qrcode');
const User = require('../models/users');
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

      return res.status(200).json(attendanceCounts);
  } catch (error) {
      console.error('Error in getUserAttendanceCount:', error);
      return res.status(500).json({ error: 'An error occurred while fetching attendance count.' });
  }
};
