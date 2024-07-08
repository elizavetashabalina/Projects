const API_URL = 'http://localhost:3000/api/students';

const initialStudentsList = [
  {
    name: 'Иван',
    surname: 'Иванов',
    lastname: 'Иванович', 
    birthday: new Date('1996-08-22').toISOString(), 
    studyStart: 2016, 
    faculty: 'Факультет химии'
  },
  {
    name: 'Джоан',
    surname: 'Роулинг',
    lastname: 'Кэтлинг', 
    birthday: new Date('1965-07-31').toISOString(), 
    studyStart: 2001, 
    faculty: 'Факультет актерского мастерства'
  },
  {
    name: 'Гарри',
    surname: 'Поттер',
    lastname: 'Джеймс', 
    birthday: new Date('1980-07-31').toISOString(), 
    studyStart: 2000, 
    faculty: 'Факультет магии'
  },
  {
    name: 'Джек',
    surname: 'Спэрроу',
    lastname: 'Пол', 
    birthday: new Date('1990-02-24').toISOString(), 
    studyStart: 2010, 
    faculty: 'Факультет океанологии'
  },
  {
    name: 'Бритни',
    surname: 'Спирс',
    lastname: 'Джин', 
    birthday: new Date('1981-12-02').toISOString(), 
    studyStart: 2001, 
    faculty: 'Факультет музыки'
  }
]

async function fetchStudents() {
  const response = await fetch(API_URL);
  if (!response.ok) {
      throw new Error('Ошибка при получении данных');
  }
  return await response.json();
}

async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
  });
  if (!response.ok) {
      throw new Error('Ошибка при удалении студента');
  }
}

async function addStudent(student) {
  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Ошибка при добавлении студента:', errorData);
    throw new Error('Ошибка при добавлении студента');
  }
  return await response.json();
}

document.addEventListener('DOMContentLoaded', async function() {
  try {
    const students = await fetchStudents();
    if (students.length === 0 && !localStorage.getItem('initialDataLoaded')) {
        for (const student of initialStudentsList) {
            await addStudent(student);
        }
        localStorage.setItem('initialDataLoaded', 'true');
      }
        const updatedStudents = await fetchStudents();
        renderStudentsTable(updatedStudents);
  } catch (error) {
    console.error('Ошибка при загрузке страницы:', error);
    alert('Ошибка при получении данных');
  }
});

function getStudentItem(studentObj, index) {
    const tr = document.createElement('tr');
  
    const fullName = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;
    const birthdate = `${new Date(studentObj.birthday).toLocaleDateString()} (${calculateAge(new Date(studentObj.birthday))} лет)`;
    const studyYears = `${studentObj.studyStart}-${parseInt(studentObj.studyStart) + 4} (${getStudyStatus(parseInt(studentObj.studyStart))})`; 
  
    tr.innerHTML = `
      <td>${fullName}</td>
      <td>${studentObj.faculty}</td>
      <td>${birthdate}</td>
      <td>${studyYears}</td>
      <td><button class="btn btn-danger btn-sm delete-btn" data-id="${studentObj.id}">Удалить</button></td>
    `;
    return tr;
}

function calculateAge(birthdate) {
    const diff = Date.now() - birthdate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
function getStudyStatus(startYear) {
    const currentYear = new Date().getFullYear();
    const studyEndYear = startYear + 4;
    if (currentYear > studyEndYear || (currentYear === studyEndYear && new Date().getMonth() >= 8)) {
      return 'закончил';
    }
    return `${currentYear - startYear + 1} курс`;
}

function renderStudentsTable(studentsArray) {
    const tableBody = document.getElementById('students-table-body');
    tableBody.innerHTML = '';
  
    studentsArray.forEach((student, index) => {
      const studentItem = getStudentItem(student, index);
      tableBody.appendChild(studentItem);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async function() {
          const studentId = this.dataset.id;
          try {
              await deleteStudent(studentId);
              const updatedStudents = await fetchStudents();
              renderStudentsTable(updatedStudents);
          } catch (error) {
              console.error('Ошибка при удалении студента:', error);
              alert('Ошибка при удалении студента');
          }
      });
  });
}

async function handleAddStudent(event) {
  event.preventDefault();

  const name = document.getElementById('input-name').value.trim();
  const surname = document.getElementById('input-surname').value.trim();
  const lastname = document.getElementById('input-middlename').value.trim(); 
  const birthday = document.getElementById('input-birthdate').valueAsDate; 
  const studyStart = parseInt(document.getElementById('input-start-year').value.trim()); 
  const faculty = document.getElementById('input-faculty').value.trim();

  const errorMessages = validateStudentData(name, surname, lastname, birthday, studyStart, faculty);
  const errorContainer = document.getElementById('error-messages');
  errorContainer.innerHTML = '';

  if (errorMessages.length > 0) {
      errorMessages.forEach(message => {
          const errorDiv = document.createElement('div');
          errorDiv.textContent = message;
          errorContainer.appendChild(errorDiv);
      });
  } else {
    const newStudent = {
      name,
      surname,
      lastname, 
      birthday: birthday.toISOString(), 
      studyStart,
      faculty
    };
      try {
          await addStudent(newStudent);
          const updatedStudents = await fetchStudents();
          renderStudentsTable(updatedStudents);
          document.getElementById('add-student-form').reset();
      } catch (error) {
          console.error('Ошибка при добавлении студента:', error);
          alert('Ошибка при добавлении студента');
      }
  }
}

document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);

function validateStudentData(name, surname, lastname, birthday, studyStart, faculty) {
    const errors = [];
    const currentDate = new Date();
    const minBirthdate = new Date('1900-01-01');
  
    if (!name) errors.push('Имя обязательно для заполнения.');
    if (!surname) errors.push('Фамилия обязательна для заполнения.');
    if (!lastname) errors.push('Отчество обязательно для заполнения.');
    if (!birthday || birthday < minBirthdate || birthday > currentDate) { 
      errors.push('Дата рождения должна быть в диапазоне от 01.01.1900 до текущей даты.');
    }
    if (isNaN(studyStart) || studyStart < 2000 || studyStart > currentDate.getFullYear()) {
      errors.push('Год начала обучения должен быть в диапазоне от 2000 до текущего года.');
    }
    if (!faculty) errors.push('Факультет обязателен для заполнения.');
  
    return errors;
}

document.getElementById('sort-fio').addEventListener('click', async function () {
  const students = await fetchStudents(); 
  students.sort((a, b) => `${a.surname} ${a.name} ${a.lastname}`.localeCompare(`${b.surname} ${b.name} ${b.lastname}`));
  renderStudentsTable(students);
});
  
  document.getElementById('sort-faculty').addEventListener('click', async function () {
    const students = await fetchStudents();
    students.sort((a, b) => a.faculty.localeCompare(b.faculty));
    renderStudentsTable(students);
});
  
  document.getElementById('sort-birthdate').addEventListener('click', async function () {
    const students = await fetchStudents();
    students.sort((a, b) => new Date(a.birthday) - new Date(b.birthday));
    renderStudentsTable(students);
});
  
  document.getElementById('sort-start-year').addEventListener('click', async function () {
    const students = await fetchStudents();
    students.sort((a, b) => a.studyStart - b.studyStart);
    renderStudentsTable(students);
});

document.getElementById('filter-fio').addEventListener('input', async function (event) {
    const value = event.target.value.trim().toLowerCase();
    const students = await fetchStudents();
    const filteredStudents = students.filter(student => {
      const fullName = `${student.surname} ${student.name} ${student.lastname}`.toLowerCase();
      return fullName.includes(value);
    });
    renderStudentsTable(filteredStudents);
});
  
  document.getElementById('filter-faculty').addEventListener('input', async function (event) {
    const value = event.target.value.trim().toLowerCase();
    const students = await fetchStudents();
    const filteredStudents = students.filter(student => student.faculty.toLowerCase().includes(value));
    renderStudentsTable(filteredStudents);
  });
  
  document.getElementById('filter-start-year').addEventListener('input', async function (event) {
    const value = parseInt(event.target.value.trim());
    const students = await fetchStudents();
    if (!isNaN(value)) {
      const filteredStudents = students.filter(student => parseInt(student.studyStart) === value);
      renderStudentsTable(filteredStudents);
    } else {
      renderStudentsTable(students);
    }
  });
  
  document.getElementById('filter-end-year').addEventListener('input', async function (event) {
    const value = parseInt(event.target.value.trim());
    const students = await fetchStudents();
    if (!isNaN(value)) {
      const filteredStudents = students.filter(student => parseInt(student.studyStart) + 4 === value);
      renderStudentsTable(filteredStudents);
    } else {
      renderStudentsTable(students);
    }
  });