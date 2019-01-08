// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

class StudentService {
  getStudents(): Promise<Student[]> {
    return axios.get('/students');
  }

  getStudent(id: number): Promise<Student> {
    return axios.get('/students/' + id);
  }

  updateStudent(student: Student): Promise<void> {
    return axios.put('/students', student);
  }
}
export let studentService = new StudentService();
