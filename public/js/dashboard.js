const API_ENDPOINT = 'http://localhost:8080';
const yearDropdownButton = document.getElementById('yearDropdownButton');
const monthDropdownButton = document.getElementById('monthDropdownButton');
const searchButton = document.getElementById('searchButton');
const loadingScreen = document.getElementById('loadingScreen');

searchButton.addEventListener('click', () => {
    const selectedYear = yearDropdownButton.textContent.slice(0, -1);
    const selectedMonth = monthDropdownButton.textContent.slice(0, -1);
    const formattedMonth = selectedMonth.length === 1 ? `0${selectedMonth}` : selectedMonth;
    const lastDayOfMonth = new Date(selectedYear, formattedMonth, 0).getDate();
    const searchDate = `${selectedYear}-${formattedMonth}-${lastDayOfMonth}`;
    fetchDataAndUpdateDashboard(searchDate);
});

populateYears();
populateMonths();
setDefaultYearAndMonth();

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

function removeGraph(graphId) {
    const existingGraph = document.getElementById(graphId);
    if (existingGraph) {
        existingGraph.remove();
    }
}

function drawGenderStatsPieChart(maleCount, femaleCount) {
    const genderStatsData = [maleCount, femaleCount];
    const genderStatsLabels = ['남자', '여자'];

    const genderStatsCanvas = document.createElement('canvas');
    genderStatsCanvas.id = 'genderStatsPieChart';
    document.getElementById('genderStats').appendChild(genderStatsCanvas);

    new Chart(genderStatsCanvas, {
        type: 'pie',
        data: {
            labels: genderStatsLabels,
            datasets: [{
                data: genderStatsData,
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: '성별 통계',
                    font: {
                        size: 17,
                        weight: 'bold'
                    },
                    color: 'black'
                }
            }
        }
    });
}

function drawDepartmentCombinedGraph(salaryByDept, getDepartmentInfo) {
    const labels = salaryByDept.map(dept => dept.dept_name);
    const totalSalaryData = salaryByDept.map(dept => parseInt(dept.total_salary));
    const totalEmployeesData = getDepartmentInfo.map(dept => parseInt(dept.total_employees));
    const departmentGraphCanvas = document.createElement('canvas');
    departmentGraphCanvas.id = 'departmentGraph';
    document.getElementById('combinedGraphContainer').appendChild(departmentGraphCanvas);

    new Chart(departmentGraphCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '총 급여',
                data: totalSalaryData,
                backgroundColor: 'rgba(1, 116, 190, 0.6)',
                borderColor: 'rgba(1, 116, 190, 1)',
                borderWidth: 1,
                yAxisID: 'y'
            }, {
                label: '총 직원 수',
                data: totalEmployeesData,
                backgroundColor: 'rgba(255, 196, 54, 0.6)',
                borderColor: 'rgba(255, 196, 54, 1)',
                borderWidth: 1,
                yAxisID: 'y1'
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '부서별 정보',
                    font: {
                        size: 17,
                        weight: 'bold'
                    },
                    color: 'black'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        drawOnChartArea: false
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1).toLocaleString() + 'M';
                            } else if (value >= 1000) {
                                return (value / 1000).toFixed(1).toLocaleString() + 'K';
                            } else {
                                return value.toLocaleString();
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: '총 급여'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1).toLocaleString() + 'M';
                            } else if (value >= 1000) {
                                return (value / 1000).toFixed(1).toLocaleString() + 'K';
                            } else {
                                return value.toLocaleString();
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: '총 직원 수'
                    }
                }
            }
        }
    });
}

function drawJobTurnoverGraph(jobTurnover) {
    const hireData = jobTurnover[0].map(entry => parseInt(entry.num_hires));
    const retireData = jobTurnover[1].map(entry => parseInt(entry.num_retirements));
    const labels = jobTurnover[0].map(entry => entry.hire_year_month);

    const jobTurnoverGraphCanvas = document.createElement('canvas');
    jobTurnoverGraphCanvas.id = 'jobTurnoverGraph';
    document.getElementById('jobTurnoverGraphContainer').appendChild(jobTurnoverGraphCanvas);

    new Chart(jobTurnoverGraphCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '입사',
                data: hireData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: '퇴사',
                data: retireData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '12개월 직원 입,퇴사자 수',
                    font: {
                        size: 17,
                        weight: 'bold'
                    },
                    color: 'black'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function drawDepartmentInfoTable(getDepartmentInfo) {
    const departmentInfoTable = document.getElementById('departmentInfoTable');
    departmentInfoTable.innerHTML = '';

    departmentInfoTable.innerHTML = `
    <caption class="p-1 text-center font-weight-bold caption-top" style="caption-side: top; font-size: 17px; color: black;">부서 정보</caption>
        <thead>
            <tr>
                <th class="border-right text-center p-1">부서명</th>
                <th class="border-right text-center p-1">부서장</th>
            </tr>
        </thead>
        <tbody>
    `;
    getDepartmentInfo.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-1 border-right text-center">${dept.dept_name}</td>
            <td class="p-1 border-right text-center">${dept.manager_name}</td>
        `;
        departmentInfoTable.appendChild(row);
    });

    departmentInfoTable.innerHTML += `</tbody>`;
}

window.addEventListener('load', async () => {
    try {
        loadingScreen.style.display = 'none';
        await fetchDataAndUpdateDashboard();
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }
});

async function fetchDataAndUpdateDashboard(searchDate) {
    try {
        loadingScreen.classList.remove('d-none');
        loadingScreen.classList.add('d-flex');

        const search_date = searchDate || '1993-01-31';
        const response = await fetch(`${API_ENDPOINT}/employee/department-stats?search_date=${search_date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData = await response.json();

        loadingScreen.classList.remove('d-flex');
        loadingScreen.classList.add('d-none');

        if (!responseData) {
            console.error('No data received');
            return;
        }

        const selectedYear = search_date.slice(0, 4);
        const selectedMonth = search_date.slice(5, 7);
        const formattedTitleDate = `${selectedYear}-${selectedMonth}`;
        document.getElementById('selectedYearAndMonth').textContent = formattedTitleDate;
        
        const totalEmployees = parseInt(responseData.total_employees);
        const totalSalary = parseInt(responseData.totalSalary);
        const maleCount = parseInt(responseData.male_count);
        const femaleCount = parseInt(responseData.female_count);

        document.getElementById('totalEmployees').textContent = totalEmployees.toLocaleString();
        document.getElementById('totalSalary').textContent = '$ ' + totalSalary.toLocaleString();

        removeGraph('genderStatsPieChart');
        removeGraph('departmentGraph');
        removeGraph('jobTurnoverGraph');
        drawGenderStatsPieChart(maleCount, femaleCount);
        drawDepartmentCombinedGraph(responseData.salaryByDept,responseData.getDepartmentInfo);
        drawJobTurnoverGraph(responseData.jobTurnover);
        
        drawDepartmentInfoTable(responseData.getDepartmentInfo);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}