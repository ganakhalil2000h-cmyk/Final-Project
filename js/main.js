class Student {
  constructor(name, grades, attendance) {
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }

  calculateAverage() {
    const sum = this.grades.reduce((total, grade) => total + grade, 0);
    return sum / this.grades.length;
  }

  getGrade(avg) {
    if (avg >= 90) return "A";
    else if (avg >= 80) return "B";
    else if (avg >= 70) return "C";
    else if (avg >= 60) return "D";
    else if (avg >= 50) return "E";
    else return "F";
  }

  getFinalResult(avg) {
    return (avg >= 50 && this.attendance >= 75) ? "ناجح" : "يحتاج مراجعة";
  }
}

let studentsList = [];

const addBtn = document.getElementById("addBtn");
const committeeBtn = document.getElementById("committeeBtn");
const errorBox = document.getElementById("errorBox");
const studentsListBox = document.getElementById("studentsListBox");
const reportBox = document.getElementById("reportBox");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("d-none");
}

function hideError() {
  errorBox.classList.add("d-none");
  errorBox.textContent = "";
}

function renderStudents() {
  if (studentsList.length === 0) {
    studentsListBox.innerHTML = '<p class="text-muted">لا يوجد طلاب بعد</p>';
    return;
  }

  studentsListBox.innerHTML = studentsList.map((student, index) => {
    const avg = student.calculateAverage();
    return `
      <div class="border rounded p-3 mb-2">
        <strong>${index + 1}. ${student.name}</strong><br>
        المتوسط: ${avg.toFixed(2)} | التقدير: ${student.getGrade(avg)} | النتيجة: ${student.getFinalResult(avg)} | الحضور: ${student.attendance}%
      </div>
    `;
  }).join("");
}

addBtn.addEventListener("click", () => {
  hideError();

  const name = document.getElementById("studentName").value.trim();
  const grade1 = parseFloat(document.getElementById("grade1").value);
  const grade2 = parseFloat(document.getElementById("grade2").value);
  const grade3 = parseFloat(document.getElementById("grade3").value);
  const attendance = parseFloat(document.getElementById("attendance").value);

  if (!name) {
    showError("من فضلك اكتب اسم الطالب");
    return;
  }

  if ([grade1, grade2, grade3, attendance].some(g => isNaN(g))) {
    showError("من فضلك املأ كل الدرجات ونسبة الحضور");
    return;
  }

  if ([grade1, grade2, grade3].some(g => g < 0 || g > 100)) {
    showError("الدرجات لازم تكون من 0 لـ 100");
    return;
  }

  if (attendance < 0 || attendance > 100) {
    showError("نسبة الحضور لازم تكون من 0 لـ 100");
    return;
  }

  const student = new Student(name, [grade1, grade2, grade3], attendance);
  studentsList.push(student);
  renderStudents();

  document.getElementById("studentName").value = "";
  document.getElementById("grade1").value = "";
  document.getElementById("grade2").value = "";
  document.getElementById("grade3").value = "";
  document.getElementById("attendance").value = "";
});

committeeBtn.addEventListener("click", () => {
  hideError();

  if (studentsList.length === 0) {
    showError("لسه مفيش طلاب، ضيف طالب الأول");
    return;
  }

  const strugglingStudents = studentsList.filter(student => {
    const avg = student.calculateAverage();
    return avg >= 40 && avg <= 49;
  });

  const afterMercy = strugglingStudents.map(student => {
    const oldAvg = student.calculateAverage();
    const newAvg = oldAvg + 5;
    return {
      name: student.name,
      oldAverage: oldAvg.toFixed(2),
      newAverage: newAvg.toFixed(2),
      grade: student.getGrade(newAvg),
      result: student.getFinalResult(newAvg)
    };
  });

  const totalNewAverages = afterMercy.reduce((sum, s) => sum + parseFloat(s.newAverage), 0);
  const mercyAverage = afterMercy.length === 0 ? 0 : totalNewAverages / afterMercy.length;

  if (afterMercy.length === 0) {
    reportBox.innerHTML = '<p class="text-muted">لا يوجد طلاب متعثرين (40 - 49) لتطبيق الرأفة</p>';
    return;
  }

  reportBox.innerHTML = `
    <p><strong>عدد الطلاب المتعثرين:</strong> ${afterMercy.length}</p>
    <p><strong>متوسط درجاتهم بعد الرأفة:</strong> ${mercyAverage.toFixed(2)}</p>
    <hr>
    ${afterMercy.map(s => `
      <div class="border rounded p-3 mb-2">
        <strong>${s.name}</strong><br>
        قبل الرأفة: ${s.oldAverage} | بعد الرأفة: ${s.newAverage} | التقدير: ${s.grade} | النتيجة: ${s.result}
      </div>
    `).join("")}
  `;
});
