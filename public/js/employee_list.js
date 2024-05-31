const API_ENDPOINT = 'http://localhost:8080';
const yearDropdownButton = document.getElementById('yearDropdownButton');
const monthDropdownButton = document.getElementById('monthDropdownButton');
const searchButton = document.getElementById('searchButton');
const departmentDropdownButton = document.getElementById('departmentDropdownButton');
const departmentDropdown = document.getElementById('departmentDropdown');

const ITEMS_PER_PAGE = 10;
const MAX_PAGES_IN_GROUP = 5;

let currentPage = 1;
let totalPages = 1;
let selectedDepartmentId = 'd005';
let selectedYearAndMonth = '1993-01-31';

searchButton.addEventListener('click', () => {
    const selectedYear = yearDropdownButton.textContent.slice(0, -1);
    const selectedMonth = monthDropdownButton.textContent.slice(0, -1);
    const formattedMonth = selectedMonth.length === 1 ? `0${selectedMonth}` : selectedMonth;
    const lastDayOfMonth = new Date(selectedYear, formattedMonth, 0).getDate();
    const searchDate = `${selectedYear}-${formattedMonth}-${lastDayOfMonth}`;
    fetchAndDisplayEmployeeList(searchDate);
});

document.addEventListener('DOMContentLoaded', () => {
    populateYears();
    populateMonths();
    setDefaultDropdownButton();
    populateDepartments();
    setUpEventListeners();
    fetchAndDisplayEmployeeList();
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayEmployeeList();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndDisplayEmployeeList();
        }
    });

    document.getElementById('searchButton').addEventListener('click', () => {
        const selectedYear = yearDropdownButton.textContent.slice(0, -1);
        const selectedMonth = monthDropdownButton.textContent.slice(0, -1);
        const formattedMonth = selectedMonth.length === 1 ? `0${selectedMonth}` : selectedMonth;
        const searchDate = `${selectedYear}-${formattedMonth}-31`;
        fetchAndDisplayEmployeeList(searchDate, selectedDepartmentId);
    });
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

function setDefaultDropdownButton() {
    yearDropdownButton.textContent = '1993년';
    monthDropdownButton.textContent = '1월';
    departmentDropdownButton.textContent = 'Development';
}

function populateDepartments() {
    const departments = [
        { id: "d001", name: "Marketing" },
        { id: "d002", name: "Finance" },
        { id: "d003", name: "Human Resources" },
        { id: "d004", name: "Production" },
        { id: "d005", name: "Development" },
        { id: "d006", name: "Quality Management" },
        { id: "d007", name: "Sales" },
        { id: "d008", name: "Research" },
        { id: "d009", name: "Customer Service" }
    ];

    departments.forEach(department => {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.href = '#';
        option.textContent = department.name;
        option.setAttribute('data-department-id', department.id);
        option.addEventListener('click', () => {
            departmentDropdownButton.textContent = department.name;
            selectedDepartmentId = option.getAttribute('data-department-id');
        });
        departmentDropdown.appendChild(option);
    });
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function fetchAndDisplayEmployeeList(searchDate, departmentId) {
    const queryParams = new URLSearchParams({
        page: currentPage,
        dep_no: departmentId || selectedDepartmentId,
        search_date: searchDate || selectedYearAndMonth
    });

    try {
        loadingScreen.classList.remove('d-none');
        loadingScreen.classList.add('d-flex');

        const selectedYear = queryParams.get('search_date').slice(0, 4);
        const selectedMonth = queryParams.get('search_date').slice(5, 7);
        const formattedTitleDate = `${selectedYear}-${selectedMonth}`;
        document.getElementById('selectedYearAndMonth').textContent = formattedTitleDate;
        
        const response = await fetch(`${API_ENDPOINT}/employee/list?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        loadingScreen.classList.remove('d-flex');
        loadingScreen.classList.add('d-none');

        totalPages = data.totalPages;
        updatePaginationButtons();

        const employeeTableBody = document.getElementById('employee-table-body');
        employeeTableBody.innerHTML = '';
        data.data.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-2">${employee.emp_no}</td>
                <td class="p-2">${employee.first_name}</td>
                <td class="p-2">${employee.last_name}</td>
                <td class="p-2">${employee.gender}</td>
                <td class="p-2">${employee.birth_date}</td>
                <td class="p-2">${employee.dept_name}</td>
                <td class="p-2">${employee.title}</td>
                <td class="p-2">${formatNumber(employee.salary)}</td>
                <td class="p-2">${employee.hire_date}</td>
            `;
            employeeTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error retrieving 직원 명단:', error);
        loadingScreen.classList.remove('d-flex');
        loadingScreen.classList.add('d-none');
    }
}

function updatePaginationButtons() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const currentPageGroup = Math.ceil(currentPage / MAX_PAGES_IN_GROUP);

    const startPage = (currentPageGroup - 1) * MAX_PAGES_IN_GROUP + 1;
    const endPage = Math.min(startPage + MAX_PAGES_IN_GROUP - 1, totalPages);

    let li = document.createElement('li');
    li.classList.add('page-item');
    let a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = '<';
    a.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayEmployeeList();
        }
    });
    li.appendChild(a);
    pagination.appendChild(li);

    if (startPage > 1) {
        li = document.createElement('li');
        li.classList.add('page-item');
        a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = '...';
        a.addEventListener('click', () => {
            currentPage = startPage - 1;
            fetchAndDisplayEmployeeList();
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }

    for (let i = startPage; i <= endPage; i++) {
        li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', () => {
            currentPage = i;
            fetchAndDisplayEmployeeList();
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }

    if (endPage < totalPages) {
        li = document.createElement('li');
        li.classList.add('page-item');
        a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = '...';
        a.addEventListener('click', () => {
            currentPage = endPage + 1;
            fetchAndDisplayEmployeeList();
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }

    li = document.createElement('li');
    li.classList.add('page-item');
    a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = '>';
    a.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndDisplayEmployeeList();
        }
    });
    li.appendChild(a);
    pagination.appendChild(li);
}

window.addEventListener('load', () => {
    fetchAndDisplayEmployeeList();
});