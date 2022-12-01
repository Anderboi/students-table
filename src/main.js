let studentsArray = [];
let order = false;

const tbody = document.getElementsByTagName("tbody")[0];

const form = document.getElementById("form");
const nameInput = form.children[0].children[1];
const surnameInput = form.children[1].children[1];
const lastnameInput = form.children[2].children[1];
const birthDateInput = form.children[3].children[1];
birthDateInput.min = "1900-01-01";
const studyBeginInput = form.children[3].children[3];
studyBeginInput.min = "2000-01-01";
const facultyInput = form.children[4].children[1];

const tableName = document.getElementById("thName");
const tableFaculty = document.getElementById("thFaculty");
const tableBirthDate = document.getElementById("thBirth");
const tableStudyDate = document.getElementById("thStudy");
tableName.style.cursor = "pointer";

const nameSearch = document.getElementById("nameSearch");
const facultySearch = document.getElementById("facultySearch");
const studyStartYearSearch = document.getElementById("studyStartYearSearch");
const studyFinishYearSearch = document.getElementById("studyFinishYearSearch");

let tr = document.getElementsByTagName("tr");

(function () {
  console.log(studentsArray);
  getStorageData();

  //! Click on Add Student
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
      nameInput.value &&
      surnameInput.value &&
      lastnameInput.value &&
      facultyInput.value &&
      birthDateInput.value &&
      studyBeginInput.value !== null
    ) {
      const name = nameInput.value.trim();
      const surname = surnameInput.value.trim();
      const lastname = lastnameInput.value.trim();
      let faculty = facultyInput.value.trim();
      const birthDate = birthDateInput.value;
      const studyBegin = studyBeginInput.value;

      const studentData = createStudentData(
        name,
        surname,
        lastname,
        faculty,
        birthDate,
        studyBegin
      );

      studentsArray.push(studentData);

      nameInput.value = "";
      surnameInput.value = "";
      lastnameInput.value = "";
      facultyInput.value = "";
      birthDateInput.value = "";
      studyBeginInput.value = "";

      refreshStorage();
    }
  });

  //! Create Student Object
  function createStudentData(
    name,
    surname,
    lastName,
    faculty,
    birthDate,
    studyDate
  ) {
    let studentData = {
      name,
      surname,
      lastName,
      faculty,
      birthDate,
      studyDate,
    };

    // const upperFirstNameLetter = () => {
    //   name.slice(1, 1).toUpperCase() + name.slice(2);
    // };
    // studentData.name = upperFirstNameLetter;

    function getAge() {
      const age =
        new Date(Date.now() - Date.parse(birthDate)).getFullYear() - 1970;
      return age;
    }
    function getCourse() {
      const course =
        new Date(Date.now() - Date.parse(studyDate)).getFullYear() - 1970;
      return course < 4 ? course : "Закончил";
    }

    function getCourseInfo() {
      const startYear = new Date(Date.parse(studyDate)).getFullYear();
      const studyPeriod = `${startYear} - ${startYear + 4}`;
      return studyPeriod;
    }

    const age = getAge();
    studentData.age = age; //? Необходимо передавать в обьект значение, не функцию!!!

    const studyPeriod = getCourseInfo();
    studentData.studyPeriod = studyPeriod;

    const course = getCourse();
    studentData.course = course;

    return studentData;
  }

  //! Get localStorage Data
  function getStorageData() {
    if (studentsArray.length > 0) {
      studentsArray = JSON.parse(localStorage.getItem("key"));

      while (tbody.firstChild) {
        tbody.removeChild(tbody.lastChild);
      }

      for (const student of studentsArray) {
        createTableRow(student);
      }
    }
  }

  function refreshStorage() {
    localStorage.setItem("key", JSON.stringify(studentsArray));
    getStorageData();
  }

  //! Create Table Row
  function createTableRow(student) {
    const tableRow = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.innerText = [student.name, student.surname, student.lastName].join(
      " "
    );
    const tdFaculty = document.createElement("td");
    tdFaculty.innerText = student.faculty;

    const tdBirthDate = document.createElement("td");
    tdBirthDate.innerText = `${student.birthDate} (${student.age})`;

    const tdStudyPeriod = document.createElement("td");
    tdStudyPeriod.innerText = `${student.studyPeriod} (${student.course} курс)`;

    tableRow.append(tdName);
    tableRow.append(tdFaculty);
    tableRow.append(tdBirthDate);
    tableRow.append(tdStudyPeriod);

    tbody.append(tableRow);
  }

  //! SORT CLICKS
  // let order = false;

  tableName.addEventListener("click", () => {
    order = !order;

    order
      ? studentsArray.sort(function (a, b) {
          const first = a.name.toLowerCase();
          const second = b.name.toLowerCase();
          if (first < second) {
            return 1;
          }
          if (first > second) {
            return -1;
          }
          // a должно быть равным b
          return 0;
        })
      : studentsArray
          .sort(function (a, b) {
            const first = a.name.toLowerCase();
            const second = b.name.toLowerCase();

            if (first < second) {
              return 1;
            }
            if (first > second) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          })
          .reverse();
    refreshStorage();
  });
  tableFaculty.addEventListener("click", () => {
    order = !order;
    order
      ? studentsArray.sort(function (a, b) {
          if (a.faculty > b.faculty) {
            return 1;
          }
          if (a.faculty < b.faculty) {
            return -1;
          }
          // a должно быть равным b
          return 0;
        })
      : studentsArray
          .sort(function (a, b) {
            if (a.faculty > b.faculty) {
              return 1;
            }
            if (a.faculty < b.faculty) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          })
          .reverse();
    refreshStorage();
  });
  tableBirthDate.addEventListener("click", () => {
    order = !order;
    const birthdaySort = studentsArray.sort(function (a, b) {
      if (a.birthDate < b.birthDate) {
        return 1;
      }
      if (a.birthDate > b.birthDate) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    });

    order ? birthdaySort : birthdaySort.reverse();
    refreshStorage();
  });
  tableStudyDate.addEventListener("click", () => {
    order = !order;
    const dateSort = studentsArray.sort(function (a, b) {
      if (a.studyDate < b.studyDate) {
        return 1;
      }
      if (a.studyDate > b.studyDate) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    });

    order ? dateSort : dateSort.reverse();
    refreshStorage();
  });

  //! Filter INPUTS
  nameSearch.addEventListener("input", () => {
    // console.log(tr[0].children[0].innerText);
    let nameFilter = nameSearch.value.toLowerCase();
    console.log(nameFilter);

    for (let x = 1; x < tr.length; x++) {
      if (tr[x].children[0].innerText.toLowerCase().indexOf(nameFilter) > -1) {
        tr[x].style.display = "";
      } else {
        tr[x].style.display = "none";
      }
    }
  });

  facultySearch.addEventListener("input", () => {
    let facultyFilter = facultySearch.value.toLowerCase();

    for (let x = 1; x < tr.length; x++) {
      if (
        tr[x].children[1].innerText.toLowerCase().indexOf(facultyFilter) > -1
      ) {
        tr[x].style.display = "";
      } else {
        tr[x].style.display = "none";
      }
    }
  });

  studyStartYearSearch.addEventListener("input", () => {
    let studyStartYearFilter = studyStartYearSearch.value;

    for (let x = 1; x < tr.length; x++) {
      if (
        tr[x].children[3].innerText
          .split(" ")[0]
          .indexOf(studyStartYearFilter) > -1
      ) {
        tr[x].style.display = "";
      } else {
        tr[x].style.display = "none";
      }
    }
  });

  studyFinishYearSearch.addEventListener("input", () => {
    let studyFinishYearFilter = studyFinishYearSearch.value;

    for (let x = 1; x < tr.length; x++) {
      console.log(tr[x].children[3].innerText.split(" ")[2]);
      if (
        tr[x].children[3].innerText
          .split(" ")[2]
          .indexOf(studyFinishYearFilter) > -1
      ) {
        tr[x].style.display = "";
      } else {
        tr[x].style.display = "none";
      }
    }
  });
})();
