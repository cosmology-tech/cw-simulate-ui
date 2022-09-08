// Return a unique array of object by a given property name
export const uniqueByPropertyName = (array: Array<any>, propertyName: string): Array<any> => {
  return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}
