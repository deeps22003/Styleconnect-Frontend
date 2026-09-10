export const states = [
  { value: 1, label: "Tamil Nadu" },
  { value: 2, label: "Karnataka" }
];

export const districts = [
  { value: 1, label: "Chennai", stateId: 1 },
  { value: 2, label: "Coimbatore", stateId: 1 },
  { value: 3, label: "Bangalore Urban", stateId: 2 },
  { value: 4, label: "Mysore", stateId: 2 }
];

export const cities = [
  { value: 1, label: "Tambaram", districtId: 1 },
  { value: 2, label: "T Nagar", districtId: 1 },
  { value: 3, label: "RS Puram", districtId: 2 }
];

export const areas = [
  { value: 1, label: "Selaiyur", cityId: 1 },
  { value: 2, label: "Camp Road", cityId: 1 },
  { value: 3, label: "Pallavaram", cityId: 2 }
];