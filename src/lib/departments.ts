// Shared list of departments selectable across student and supervisor management forms.
// Keeping this centralized means adding a new department only requires one edit.
export const DEPARTMENTS: string[] = [
  'Department of Information Technology',
  'Department of Computer Science',
  'Department of Software Engineering',
  'Department of Computer Engineering',
  'Department of Business Information Technology',
  'Department of Electrical & Electronic Engineering',
  'Department of Mathematics & Actuarial Science',
  'Department of Business Administration',
  'Department of Procurement & Logistics',
  'Department of Human Resource Management',
  'Attachment Coordination Office',
];

/** Returns the value the dropdown should show as selected: the department itself
 * if it's a known option, otherwise the "Other" sentinel so a custom value can be typed. */
export const resolveDepartmentOption = (department: string): string =>
  DEPARTMENTS.includes(department) ? department : 'Other';
