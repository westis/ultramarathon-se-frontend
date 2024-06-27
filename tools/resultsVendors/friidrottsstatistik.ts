// file path: /tools/resultsVendors/friidrottsstatistik.ts

export const friidrottsstatistikRequirements = {
  requiredHeaders: [
    "type",
    "race_name",
    "city",
    "date",
    "organizer",
    "distance",
    "gender",

    "placing",
    "agegroup",

    "extra",
    "firstname",
    "lastname",
    "country",
    "club",
    "birthdate",
    "yb",
    "result",
  ],
  optionalHeaders: [
    "course_measurer",
    "date_of_measurement",
    "agegroupplacing",
    "smplacing",
    "vsmagegroupplacing",
  ],
  mandatoryContentColumns: [
    "type",
    "race_name",
    "city",
    "date",
    "organizer",
    "distance",
    "gender",
    "placing",
    "firstname",
    "lastname",
    "country",
    "birthdate",
    "result",
  ],
  formatRequirements: {
    // Define any specific format requirements for columns here
    // Example: date: 'YYYY-MM-DD'
  },
};
