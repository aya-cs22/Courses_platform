const Courses = require('../models/courses');
exports.creatCourse = async(req, res) => {
  try{
    const { title, description, type_course, location } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
    const course = new Courses({
        title, 
        description, 
        type_course, 
        location 
    });
    await course.save();
    res.status(201).json(course);
  } catch(error){
    console.error(error);
    res.status(500).json({message: 'server error' });
  }
};

//Read all courses
exports.getAllCourses = async(req, res) => {
    try{
        const courses = await Courses.find();
        res.status(200).json(courses);
    } catch(error){
        res.status(500).json({message : 'server error', error: error.message});
    }
};

// Read course by id
exports.getCoursebyid = async(req, res) => {
    try{
        const course = await Courses.findById(req.params.id);
        if(!course){
            return res.status(404).json({message: 'Courses not found'});
        }
        res.status(200).json(course);
    } catch(error){
        console.error('Error fetching track');
        res.status(500).json({message: 'server error', error: error.message});
    }
};

// update course by id
exports.updateCourseById = async(req, res) => {
    try{
        const { id } = req.params;
        const { title, description, type_course, location } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
          }
    const updateCoursData = {
        title,
        description,
        type_course,
        location,
        updated_at: Date.now(),
    };
    const updateCours = await Courses.findByIdAndUpdate(id, updateCoursData,  { new: true, runValidators: true });
    if(!updateCours){
        return res.status(400).json({message: 'courses not found'});
    }
    res.status(200).json(updateCours);
} catch(error){
    console.error(error);
    res.status(500).json({message: 'server error'});
}
};
exports.deleteCourseById = async (req, res) => {
    try{
        const { id } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const deletedCourse = await Courses.findByIdAndDelete(id);
      if(!deletedCourse){
        return res.status(404).json({ message: 'Course not found'});
      }
      res.status(200).json({message: 'course delet successfully'})
    } catch(error){
        console.error(error);
        res.status(500).json({message: 'server error'});
    }
};