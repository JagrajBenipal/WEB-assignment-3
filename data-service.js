const fs = require("fs");
const Path = require("path");
const studentsFilePath = Path.join(__dirname, "./data/students.json");

let students = [];
let programs = [];
let images = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/students.json", "utf8", (err, data) => {
      if (err) return reject("unable to read file");

      students = JSON.parse(data);

      fs.readFile("./data/programs.json", "utf8", (err, data) => {
        if (err) return reject("unable to read file");

        programs = JSON.parse(data);
        resolve();
      });
    });
  });
}

function getStudents() {
  return new Promise((resolve, reject) => {
    if (students.length === 0) return reject("no results returned");

    resolve(students);
  });
}

function getInternationalStudents() {
  return new Promise((resolve, reject) => {
    const intlStudents = students.filter(
      (student) => student.isInternationalStudent === true
    );

    if (intlStudents.length === 0) return reject("no results returned");

    resolve(intlStudents);
  });
}

function getPrograms() {
  return new Promise((resolve, reject) => {
    if (programs.length === 0) return reject("no results returned");

    resolve(programs);
  });
}

function addImage(imageUrl) {
  return new Promise((resolve, reject) => {
    images.push(imageUrl);
    resolve(images);
  });
}

function getImages() {
  return new Promise((resolve, reject) => {
    if (images.length > 0) {
      resolve(images);
    } else {
      reject("no results returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    // If the isInternationalStudent property is undefined, set it to false
    if (studentData.isInternationalStudent === undefined) {
      studentData.isInternationalStudent = false;
    } else {
      studentData.isInternationalStudent = true;
    }

    const students = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));
    const maxId = Math.max(
      ...students.map((student) => Number(student.studentID))
    );
    studentData.studentID = (maxId + 1).toString();

    students.push(studentData);
    fs.writeFile(studentsFilePath, JSON.stringify(students), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getStudentsByStatus(status) {
  return new Promise((resolve, reject) => {
    data
      .getStudents()
      .then((students) => {
        const matchingStudents = students.filter((student) => {
          return student.status === status;
        });
        if (matchingStudents.length === 0) {
          reject(`No students with status "${status}" found`);
        } else {
          resolve(matchingStudents);
        }
      })
      .catch((err) => {
        reject(`Unable to get students: ${err}`);
      });
  });
}

function getStudentsByProgramCode(programCode) {
  return new Promise((resolve, reject) => {
    const matchingStudents = students.filter(
      (student) => student.program === programCode
    );
    if (matchingStudents.length === 0) {
      reject("no results returned");
    } else {
      resolve(matchingStudents);
    }
  });
}
function getStudentsByExpectedCredential(credential) {
  return new Promise((resolve, reject) => {
    const studentsWithCredential = students.filter(
      (student) => student.expectedCredential === credential
    );
    if (studentsWithCredential.length === 0) {
      reject("no results returned");
    } else {
      resolve(studentsWithCredential);
    }
  });
}

function getStudentById(sid) {
  return new Promise((resolve, reject) => {
    let ms = students.find((student) => student.studentID === sid);
    if (ms) {
      resolve(ms);
    } else {
      reject("no result found for student");
    }
  });
}

module.exports = {
  initialize,
  getStudents,
  getInternationalStudents,
  getPrograms,
  addImage,
  getImages,
  addStudent,
  getStudentById,
  getStudentsByStatus,
  getStudentsByProgramCode,
  getStudentsByExpectedCredential,
};
