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
            User.hasMany(CourseListing, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            CourseListing.belongsTo(User);
            CourseListing.hasMany(Lessons, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Lessons.belongsTo(CourseListing);
            User.hasOne(PendingTutor, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            PendingTutor.belongsTo(User);
            User.hasMany(ItemListing);
            ItemListing.belongsTo(User);
            User.hasMany(Calendar);
            Calendar.belongsTo(User)
            CourseListing.hasMany(RateReview, { foreignKey: "CourseId" });
            RateReview.belongsTo(CourseListing, { foreignKey: "CourseId" });
            User.hasMany(RateReview, { foreignKey: "TutorId" });
            RateReview.belongsTo(User, { foreignKey: "TutorId" });
            User.hasMany(RateReview, { foreignKey: "UserId" });
            RateReview.belongsTo(User, { foreignKey: "UserId" });

            // institution --------
            User.hasOne(Institution, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Institution.belongsTo(User);
            Institution.hasMany(Banners, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Banners.belongsTo(Institution);
            Institution.hasMany(Descriptions, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Descriptions.belongsTo(Institution);
            Institution.hasMany(Widgets, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            Widgets.belongsTo(Institution);
            Institution.hasMany(SeminarEvents, { foreignKey: { type: Sequelize.UUID, allowNull: false } });
            SeminarEvents.belongsTo(Institution);
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