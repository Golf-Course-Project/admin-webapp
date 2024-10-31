import { ICourseSearch } from 'interfaces/course.interfaces';

export class CourseSearch implements ICourseSearch {
  constructor() {
    this.state = null;
    this.name = null;
    this.text = null;   
    this.city = null;
    this.postalCode = null;
    this.tag = null;   
    this.type = null;
    this.tier = null;
    this.pageNumber = 1;
    this.isRanked = null;
  }

  state: string | null;
  name: string | null;
  text: string | null;
  city: string | null;
  postalCode: string | null;  
  type: string | null;
  tag: string | null;
  tier: string | null;
  isRanked: string | null;
  pageNumber: number;
}