import { ICourseSearchCriteriaProps } from 'interfaces/course.interfaces';

export class CourseSearch implements ICourseSearchCriteriaProps {
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
    this.isFeatured = null;
    this.isFlagged = null;
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
  isFeatured: string | null;
  isFlagged: string | null;
  pageNumber: number;
}