
CREATE TABLE admins (
    admin_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);


CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(dept_id) ON DELETE SET NULL
);


CREATE TABLE professors (
    professor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE TABLE courses (
    course_code VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT CHECK (credits > 0),
    department_id INT REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE TABLE semesters (
    semester_id SERIAL PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL,
    year INT CHECK (year >= 2000)
);

CREATE TABLE classrooms (
    classroom_id VARCHAR(50) PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(10) NOT NULL
);


CREATE TABLE schedules (
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    professor_id INT REFERENCES professors(professor_id) ON DELETE SET NULL,
    classroom_id VARCHAR(50) REFERENCES classrooms(classroom_id) ON DELETE SET NULL,
    semester_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (course_code, professor_id, semester_id, day_of_week, start_time)
);


CREATE TABLE grades (
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    semester_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
    grade VARCHAR(2) CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'I', 'W')),
    PRIMARY KEY (student_id, course_code, semester_id)
);

CREATE TABLE attendance (
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_code VARCHAR(20) REFERENCES courses(course_code) ON DELETE CASCADE,
    semester_id INT REFERENCES semesters(semester_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Present', 'Absent', 'Late')),
    PRIMARY KEY (student_id, course_code, semester_id, date)
);