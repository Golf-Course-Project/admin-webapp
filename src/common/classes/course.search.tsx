import { ICourseSearch } from 'interfaces/course.interfaces';

export class CourseSearch implements ICourseSearch {
  constructor(state: string) {
    this.state = state;
    this.name = null;
    this.text = null;   
    this.city = null;
    this.postalCode = null;
    this.tag = null;   
    this.type = null;
    this.pageNumber = 1;
    this.ranked = null;
  }

  state: string | null;
  name: string | null;
  text: string | null;
  city: string | null;
  postalCode: string | null;  
  type: string | null;
  tag: string | null;
  ranked: string | null;
  pageNumber: number;
}