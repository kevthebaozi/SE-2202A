/**
 * Define the Course and Assignment concepts using the constructor functions
 */

function Assignment(title, dueDate){
    this.title = title;
    this.dueDate = dueDate;

    this.printAssignment = function () {
        console.log(' Title: ' + this.title + ' | Due Date: ' + this.dueDate);
    };
}

function Course(courseName, instructor, creditHours, assignments)
{
    this.courseName = courseName;
    this.instructor = instructor;
    this.creditHours = creditHours;
    this.assignments = assignments;

    this.courseInfo = function () {
        console.log("Course: " + this.courseName + " | Instructor: " + this.instructor + " | Credit hours: " + this.creditHours);
        console.log("Assignments >>>");
        
        for (let a of this.assignments) {
            a.printAssignment();
        }   
    };
}

// create the objects using the constructor functions

let c1 = new Course('Software Engineering', 'Dr. Pepper', 3,[new Assignment('Project Proposal', 'Jan 15'), new Assignment('Midterm Report', 'Feb 20')]);
let c2 = new Course('Data Science', 'Dr. Evil', 6, [new Assignment('Final Report', 'Mar  30'), new Assignment('Presentation', 'Apr 10')]);

c1.courseInfo();
c2.courseInfo();

/*
Course: Software Engineering | Instructor: Dr. Pepper | Credit Hours: 3
Assignments >>>
   Title: Project Proposal | Due Date: Jan 15
   Title: Midterm Report | Due Date: Feb 20
Course: Data Science | Instructor: Dr. Evil | Credit Hours: 6
Assignments >>>
   Title: Final Report | Due Date: Mar 30
   Title: Presentation | Due Date: Apr 10
*/