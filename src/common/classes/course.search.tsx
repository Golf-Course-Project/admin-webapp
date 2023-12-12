import { ICourseSearch } from 'interfaces/course.interfaces';

export class CourseSearch implements ICourseSearch {
  constructor(state: string) {
    this.state = state;
    this.text = null;
    this.address = null;
    this.city = null;
    this.email = null;
    this.phone = null;
    this.website = null;
    this.type = null;
    this.pageNumber = 1;
  }

  state: string | null;
  text: string | null;
  address: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  type: string | null;
  pageNumber: number;
}