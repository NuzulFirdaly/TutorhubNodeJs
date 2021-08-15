const CourseListing = require('../models/CoursesListing');
const Sequelize = require('sequelize');
const Lessons = require('../models/Lessons');
const User = require('../models/User');
const mySQLDB = require('./DBConfig');
const PendingTutor = require('../models/PendingTutor');
const ItemListing = require('../models/ItemListing');
const Calendar = require('../models/Calendar');

const RateReview = require('../models/RateReview');

const PendingInstitution = require('../models/PendingInstitution');
const Institution = require('../models/Institution');
const Banners = require('../models/banners');
const Descriptions = require('../models/descriptions');
const Widgets = require('../models/widgets');
const SeminarEvents = require('../models/seminarevents');
const FeaturedInstitutionTutor = require('../models/featuredinstitutiontutor');
const FeaturedInstitutionCourses = require("../models/featuredinstitutioncourses");
const Booking = require("../models/Booking")

const Admin = require('../models/Admin');


// const user = require('../models/User');
// const video = require('../models/Video');

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate().then(() => {
            console.log('tutorhub database connected');
        }).then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            //if user belongs to an institution
            User.belongsTo(Institution)
            Institution.hasMany(User)

            User.hasMany(CourseListing, { foreignKey: { type: Sequelize.UUID, allowNull: false } });

            // Course
            CourseListing.belongsTo(User);
            CourseListing.hasMany(Lessons, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Lessons.belongsTo(CourseListing);
            CourseListing.belongsTo(Institution);
            Institution.hasMany(CourseListing);
            User.hasOne(PendingTutor, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            PendingTutor.belongsTo(User);
            User.hasMany(ItemListing);
            ItemListing.belongsTo(User);
            // Calendar
            User.hasMany(Calendar, { foreignKey: "userUserId" }); //this is the tutorID
            Calendar.belongsTo(User, { foreignKey: "userUserId" })
            User.hasMany(Calendar, { foreignKey: "tuteeId" })
            Calendar.belongsTo(User, { foreignKey: "tuteeId" })
            Booking.hasMany(Calendar, { foreignKey: "booking_id" })
            Calendar.belongsTo(Booking, { foreignKey: "booking_id" })

            //Bookings | CourseID|CalendarID|SessionID|tuteeID|TutorID|totalPrice|startTime|endTime|Paid|HourlyRate|Date|CourseName|
            CourseListing.hasMany(Booking, { foreignKey: "CourseId" })
            Booking.belongsTo(CourseListing, { foreignKey: "CourseId" })
            Lessons.hasMany(Booking, { foreignKey: "SessionId" })
            Booking.belongsTo(Lessons, { foreignKey: "SessionId" })
            User.hasMany(Booking, { foreignKey: "UserId" })
            Booking.belongsTo(Booking, { foreignKey: "UserId" })
            User.hasMany(Booking, { foreignKey: "TutorId" })
            Booking.belongsTo(Booking, { foreignKey: "TutorId" })


            //ratereview
            CourseListing.hasMany(RateReview, { foreignKey: "CourseId" });
            RateReview.belongsTo(CourseListing, { foreignKey: "CourseId" });
            User.hasMany(RateReview, { foreignKey: "TutorId" });
            RateReview.belongsTo(User, { foreignKey: "TutorId" });
            User.hasMany(RateReview, { foreignKey: "UserId" });
            RateReview.belongsTo(User, { foreignKey: "UserId" });

            // institution --------
            //for admin
            User.hasOne(Institution, { foreignKey: "AdminUserID", constraints: false });
            Institution.belongsTo(User, { foreignKey: "AdminUserID", constraints: false });
            Institution.hasMany(Banners, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Banners.belongsTo(Institution);
            Institution.hasMany(Descriptions, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Descriptions.belongsTo(Institution);
            Institution.hasMany(Widgets, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Widgets.belongsTo(Institution);
            Institution.hasMany(SeminarEvents, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            SeminarEvents.belongsTo(Institution);
            Institution.hasMany(FeaturedInstitutionTutor, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            FeaturedInstitutionTutor.belongsTo(Institution);
            Institution.hasMany(FeaturedInstitutionCourses, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            FeaturedInstitutionCourses.belongsTo(Institution);
            // user.hasMany(video);

            User.hasOne(Admin);
            Admin.belongsTo(User, { foreignKey: "userUserId" });

            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };