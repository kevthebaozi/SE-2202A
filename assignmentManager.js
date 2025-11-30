class Assignment {
  #grade; // private field

  constructor(name, status = "released") {
    this.assignmentName = name;
    this.status = status;  
    this.#grade = null;    

    // keep a non-private "gradeCopy" so Student.getGrade() can compute averages
    this.gradeCopy = null;
  }

  
  setGrade(value) {
    this.#grade = value;
    this.gradeCopy = value;

    if (value > 50) {
      this.status = "pass";
    } else {
      this.status = "fail";
    }
  }
}




class Observer {
  notify(studentName, assignmentName, status) {
    console.log(`Observer → ${studentName}, ${assignmentName} has been ${status}.`);
  }
}

class Student {
  constructor(fullName, email, observer) {
    this.fullName = fullName;
    this.email = email;
    this.observer = observer;

    this.assignmentStatuses = [];
    this.overallGrade = null;

    // Track delayed submission timers
    this.pendingWorkTimers = {}; 
  }

  setFullName(name) {
    this.fullName = name;
  }

  setEmail(email) {
    this.email = email;
  }

  // Find assignment by name
  findAssignment(name) {
    return this.assignmentStatuses.find(a => a.assignmentName === name);
  }

  updateAssignmentStatus(name, grade = undefined) {
    let assignment = this.findAssignment(name);

    // If not found, create assignment and mark as released
    if (!assignment) {
      assignment = new Assignment(name, "released");
      this.assignmentStatuses.push(assignment);

      this.observer.notify(this.fullName, name, "released");
      return;
    }

    if (grade !== undefined) {
      assignment.setGrade(grade);
      this.observer.notify(this.fullName, name, assignment.status);
    }
  }


  getAssignmentStatus(name) {
    const assignment = this.findAssignment(name);

    if (!assignment) {
      this.observer.notify(this.fullName, name, "Hasn't been assigned");
      return "Hasn't been assigned";
    }

    // Notify the actual status
    this.observer.notify(this.fullName, name, assignment.status);
    return assignment.status;
  }

  startWorking(name) {
    let assignment = this.findAssignment(name);

    if (!assignment) {
      assignment = new Assignment(name, "released");
      this.assignmentStatuses.push(assignment);
      this.observer.notify(this.fullName, name, "released");
    }

    assignment.status = "working";
    this.observer.notify(this.fullName, name, "working");

    this.pendingWorkTimers[name] = setTimeout(() => {
      this.submitAssignment(name);
    }, 500);
  }

  submitAssignment(name) {
    const assignment = this.findAssignment(name);
    if (!assignment) return;

    if (this.pendingWorkTimers[name]) {
      clearTimeout(this.pendingWorkTimers[name]);
      delete this.pendingWorkTimers[name];
    }

    assignment.status = "submitted";
    this.observer.notify(this.fullName, name, "submitted");

    setTimeout(() => {
      const randomGrade = Math.floor(Math.random() * 101); // 0–100
      assignment.setGrade(randomGrade);

      // Notify pass/fail
      this.observer.notify(this.fullName, name, assignment.status);
    }, 500);
  }

  getGrade() {
    const graded = this.assignmentStatuses.filter(
      a => a.status === "pass" || a.status === "fail"
    );

    if (graded.length === 0) {
      this.overallGrade = null;
      return null;
    }

    const avg = graded.reduce((sum, a) => sum + a.gradeCopy, 0) / graded.length;

    this.overallGrade = avg;
    return avg;
  }
}

class ClassList {
  constructor(observer) {
    this.students = [];   
    this.observer = observer;
  }

  addStudent(student) {
    this.students.push(student);
    console.log(`${student.fullName} has been added to the classlist.`);
  }

  removeStudent(studentName) {
    this.students = this.students.filter(s => s.fullName !== studentName);
  }

  findStudentByName(name) {
    return this.students.find(s => s.fullName === name);
  }

  findOutstandingAssignments(assignmentName) {
    const result = [];

    for (const student of this.students) {
      const a = student.findAssignment(assignmentName);

      if (!a) {
        result.push(student.fullName);
        continue;
      }

      if (a.status !== "submitted" && a.status !== "pass" && a.status !== "fail") {
        result.push(student.fullName);
      }
    }

    return result;
  }

  releaseAssignmentsParallel(assignmentNames) {
    const promises = [];

    for (const name of assignmentNames) {
      for (const student of this.students) {
        const p = new Promise(resolve => {
          student.updateAssignmentStatus(name);  
          resolve();
        });
        promises.push(p);
      }
    }

    return Promise.all(promises);
  }

  sendReminder(assignmentName) {
    for (const student of this.students) {
      const a = student.findAssignment(assignmentName);

      if (!a || a.status === "submitted" || a.status === "pass" || a.status === "fail") {
        continue;
      }

      a.status = "final reminder";
      this.observer.notify(student.fullName, assignmentName, "given a final reminder");

      student.submitAssignment(assignmentName);
    }
  }
}