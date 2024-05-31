const API_ENDPOINT = 'http://localhost:8080';
const yearDropdownButton = document.getElementById('yearDropdownButton');
const monthDropdownButton = document.getElementById('monthDropdownButton');
const searchButton = document.getElementById('searchButton');
const employeeTableBody = document.getElementById('employee-table-body');
const joinEmployeesButton = document.getElementById('joinEmployeesButton');
const leftEmployeesButton = document.getElementById('leftEmployeesButton');

document.addEventListener('DOMContentLoaded', () => {
    populateYears();
    populateMonths();
    setDefaultYearAndMonth();
    const employeeType = 'joinedEmployees';
    searchJobTurnover(employeeType);
    joinEmployeesButton.classList.add('active');
});

searchButton.addEventListener('click', () => {
    const selectedYear = yearDropdownButton.textContent.slice(0, -1);
    const selectedMonth = monthDropdownButton.textContent.slice(0, -1);
    const formattedMonth = selectedMonth.length === 1 ? `0${selectedMonth}` : selectedMonth;
    const lastDayOfMonth = new Date(selectedYear, formattedMonth, 0).getDate();
    const searchDate = `${selectedYear}-${formattedMonth}-${lastDayOfMonth}`;
    searchJobTurnover(searchDate);
});

let employeeData = null;

populateYears();
populateMonths();
setDefaultYearAndMonth();

searchButton.addEventListener('click', () => {
    const employeeType = joinEmployeesButton.classList.contains('active') ? 'joinedEmployees' : 'leftEmployees';
    searchJobTurnover(employeeType);
});

joinEmployeesButton.addEventListener('click', () => {
    joinEmployeesButton.classList.add('active');
    leftEmployeesButton.classList.remove('active');
    const employeeType = 'joinedEmployees';
    displayEmployeeData(employeeType);
});

leftEmployeesButton.addEventListener('click', () => {
    leftEmployeesButton.classList.add('active');
    joinEmployeesButton.classList.remove('active');
    const employeeType = 'leftEmployees';
    displayEmployeeData(employeeType);
});

function populateYears() {
    const startYear = 2002;
    const endYear = 1985;
    const yearDropdownMenu = document.getElementById('yearDropdownMenu');
    for (let year = startYear; year >= endYear; year--) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.href = '#';
        option.textContent = `${year}년`;
        option.setAttribute('data-year', year);
        option.addEventListener('click', () => {
            yearDropdownButton.textContent = option.textContent;
        });
        yearDropdownMenu.appendChild(option);
    }
}

function populateMonths() {
    const months = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    const monthDropdownMenu = document.getElementById('monthDropdownMenu');
    months.forEach((month, index) => {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.href = '#';
        option.textContent = month;
        option.setAttribute('data-month', index + 1);
        option.addEventListener('click', () => {
            monthDropdownButton.textContent = option.textContent;
        });
        monthDropdownMenu.appendChild(option);
    });
}

function setDefaultYearAndMonth() {
    const defaultYear = 1993;
    const defaultMonthIndex = 1;
    const defaultMonth = defaultMonthIndex < 10 ? `0${defaultMonthIndex}` : defaultMonthIndex.toString();
    yearDropdownButton.textContent = `${defaultYear}년`;
    monthDropdownButton.textContent = `${defaultMonth}월`;
}

function searchJobTurnover(employeeType) {
    const year = yearDropdownButton.textContent.replace('년', '');
    const month = monthDropdownButton.textContent.replace('월', '');
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const searchDate = `${year}-${month}-${lastDayOfMonth}`;

    const selectedYear = searchDate.slice(0, 4);
    const selectedMonth = searchDate.slice(5, 7);
    const formattedTitleDate = `${selectedYear}-${selectedMonth}`;
    document.getElementById('selectedYearAndMonth').textContent = formattedTitleDate;

    fetch(`${API_ENDPOINT}/employee/job-turnover?search_date=${searchDate}`)
        .then(response => response.json())
        .then(data => {
            employeeData = data; // 데이터 저장
            displayEmployeeData(employeeType); // 데이터를 사용하여 작업
        })
        .catch(error => console.error('Error fetching job turnover:', error));
}

function displayEmployeeData(employeeType) {
  if (employeeData && employeeData[employeeType].length > 0) {
      clearTable();
      const hireLeaveHeader = document.getElementById('hireLeaveHeader');
      hireLeaveHeader.textContent = employeeType === 'joinedEmployees' ? '입사일' : '퇴사일';
      employeeData[employeeType].forEach(employee => {
          addEmployeeToTable(employee, employeeType === 'joinedEmployees' ? 'hire' : 'leave');
      });
  } else {
      const hireLeaveHeader = document.getElementById('hireLeaveHeader');
      hireLeaveHeader.textContent = 'No Data Found';
      clearTable();
  }
}

function clearTable() {
    employeeTableBody.innerHTML = '';
}

function addEmployeeToTable(employee, eventType) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="p-2">${employee.emp_no}</td>
        <td class="p-2">${employee.first_name}</td>
        <td class="p-2">${employee.last_name}</td>
        <td class="p-2">${employee.gender}</td>
        <td class="p-2">${employee.birth_date}</td>
        <td class="p-2">${eventType === 'hire' ? employee.hire_date : employee.leave_date}</td>
    `;
    employeeTableBody.appendChild(row);
}